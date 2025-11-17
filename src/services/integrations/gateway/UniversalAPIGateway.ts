// Universal API Gateway - Enterprise Integration Hub
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Redis from 'ioredis';

// Types and Interfaces
export interface APIGatewayConfig {
  rateLimit: {
    windowMs: number;
    max: number;
    skipSuccessfulRequests?: boolean;
  };
  auth: {
    jwtSecret: string;
    apiKeyPrefix: string;
    sessionTimeout: number;
  };
  tenancy: {
    multiTenant: boolean;
    tenantHeader: string;
    defaultTenant?: string;
  };
  monitoring: {
    enableMetrics: boolean;
    logRequests: boolean;
    alertThreshold: number;
  };
}

export interface APIKey {
  id: string;
  tenantId: string;
  name: string;
  key: string;
  permissions: string[];
  rateLimit?: number;
  expiresAt?: Date;
  createdAt: Date;
  lastUsedAt?: Date;
  isActive: boolean;
}

export interface TenantConfig {
  id: string;
  name: string;
  subdomain: string;
  features: string[];
  rateLimit: number;
  customConfig: Record<string, any>;
  isActive: boolean;
}

export interface RequestMetrics {
  requestId: string;
  tenantId: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  userAgent: string;
  ipAddress: string;
  timestamp: Date;
}

class UniversalAPIGateway {
  private redis: Redis;
  private config: APIGatewayConfig;
  private metrics: RequestMetrics[] = [];

  constructor(config: APIGatewayConfig) {
    this.config = config;
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true
    });
    
    this.initializeGateway();
  }

  private async initializeGateway(): Promise<void> {
    try {
      await this.redis.connect();
      console.log('✅ Universal API Gateway initialized');
      
      // Set up periodic cleanup
      setInterval(() => this.cleanupMetrics(), 5 * 60 * 1000); // 5 minutes
    } catch (error) {
      console.error('❌ API Gateway initialization failed:', error);
    }
  }

  // Rate Limiting Middleware
  createRateLimiter(customConfig?: Partial<APIGatewayConfig['rateLimit']>) {
    const config = { ...this.config.rateLimit, ...customConfig };
    
    return rateLimit({
      windowMs: config.windowMs,
      max: config.max,
      skipSuccessfulRequests: config.skipSuccessfulRequests,
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: (req: Request) => {
        const tenantId = this.extractTenantId(req);
        const apiKey = this.extractAPIKey(req);
        return `${tenantId}:${apiKey || req.ip}`;
      },
      handler: (req: Request, res: Response) => {
        res.status(429).json({
          error: 'Rate limit exceeded',
          message: 'Too many requests from this API key or IP address',
          retryAfter: Math.ceil(config.windowMs / 1000)
        });
      },
      store: {
        // Custom Redis-based rate limit store
        incr: async (key: string) => {
          const current = await this.redis.incr(`rate_limit:${key}`);
          if (current === 1) {
            await this.redis.expire(`rate_limit:${key}`, Math.ceil(config.windowMs / 1000));
          }
          return current;
        },
        decrement: async (key: string) => {
          return await this.redis.decr(`rate_limit:${key}`);
        },
        resetKey: async (key: string) => {
          await this.redis.del(`rate_limit:${key}`);
        }
      } as any
    });
  }

  // Authentication Middleware
  authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = this.extractToken(req);
      const apiKey = this.extractAPIKey(req);

      if (token) {
        // JWT Token Authentication
        const decoded = jwt.verify(token, this.config.auth.jwtSecret) as any;
        req.user = decoded;
        req.tenantId = decoded.tenantId;
      } else if (apiKey) {
        // API Key Authentication
        const keyData = await this.validateAPIKey(apiKey);
        if (!keyData) {
          res.status(401).json({ error: 'Invalid API key' });
          return;
        }
        req.apiKey = keyData;
        req.tenantId = keyData.tenantId;
        
        // Update last used timestamp
        await this.updateAPIKeyUsage(keyData.id);
      } else {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      // Validate tenant
      const tenant = await this.validateTenant(req.tenantId!);
      if (!tenant) {
        res.status(403).json({ error: 'Invalid tenant' });
        return;
      }

      req.tenant = tenant;
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401).json({ error: 'Authentication failed' });
    }
  };

  // Multi-tenant Routing Middleware
  routeTenant = (req: Request, res: Response, next: NextFunction): void => {
    if (!this.config.tenancy.multiTenant) {
      next();
      return;
    }

    const tenantId = this.extractTenantId(req);
    if (!tenantId && !this.config.tenancy.defaultTenant) {
      res.status(400).json({ error: 'Tenant identification required' });
      return;
    }

    req.tenantId = tenantId || this.config.tenancy.defaultTenant!;
    next();
  };

  // Request/Response Transformation
  transformRequest = (req: Request, res: Response, next: NextFunction): void => {
    // Add request ID for tracking
    req.requestId = crypto.randomUUID();
    
    // Add tenant-specific configuration
    if (req.tenant) {
      req.tenantConfig = req.tenant.customConfig;
    }

    // Log request if enabled
    if (this.config.monitoring.logRequests) {
      console.log(`[${req.requestId}] ${req.method} ${req.path} - Tenant: ${req.tenantId}`);
    }

    // Start response time tracking
    req.startTime = Date.now();
    
    next();
  };

  // Response Metrics Collection
  collectMetrics = (req: Request, res: Response, next: NextFunction): void => {
    const originalSend = res.send;
    
    res.send = function(data: any) {
      // Calculate response time
      const responseTime = Date.now() - req.startTime!;
      
      // Collect metrics
      const metrics: RequestMetrics = {
        requestId: req.requestId!,
        tenantId: req.tenantId!,
        endpoint: req.path,
        method: req.method,
        statusCode: res.statusCode,
        responseTime,
        userAgent: req.get('User-Agent') || '',
        ipAddress: req.ip || req.connection.remoteAddress || '',
        timestamp: new Date()
      };

      // Store metrics (async, don't block response)
      this.storeMetrics(metrics);
      
      // Add response headers
      res.set({
        'X-Request-ID': req.requestId,
        'X-Response-Time': `${responseTime}ms`,
        'X-Tenant-ID': req.tenantId
      });

      return originalSend.call(this, data);
    }.bind(this);

    next();
  };

  // API Key Management
  async generateAPIKey(tenantId: string, name: string, permissions: string[], options: {
    rateLimit?: number;
    expiresIn?: number; // days
  } = {}): Promise<APIKey> {
    const key = `${this.config.auth.apiKeyPrefix}_${crypto.randomBytes(32).toString('hex')}`;
    const id = crypto.randomUUID();
    
    const apiKey: APIKey = {
      id,
      tenantId,
      name,
      key,
      permissions,
      rateLimit: options.rateLimit,
      expiresAt: options.expiresIn ? new Date(Date.now() + options.expiresIn * 24 * 60 * 60 * 1000) : undefined,
      createdAt: new Date(),
      isActive: true
    };

    // Store in Redis with TTL if expires
    const ttl = apiKey.expiresAt ? Math.floor((apiKey.expiresAt.getTime() - Date.now()) / 1000) : undefined;
    await this.redis.setex(`api_key:${key}`, ttl || 86400 * 365, JSON.stringify(apiKey)); // 1 year default
    
    return apiKey;
  }

  async revokeAPIKey(keyId: string): Promise<boolean> {
    const keys = await this.redis.keys('api_key:*');
    
    for (const redisKey of keys) {
      const keyData = await this.redis.get(redisKey);
      if (keyData) {
        const apiKey: APIKey = JSON.parse(keyData);
        if (apiKey.id === keyId) {
          apiKey.isActive = false;
          await this.redis.setex(redisKey, 86400, JSON.stringify(apiKey)); // Keep for 24h for audit
          return true;
        }
      }
    }
    
    return false;
  }

  async rotateAPIKey(keyId: string): Promise<APIKey | null> {
    const keys = await this.redis.keys('api_key:*');
    
    for (const redisKey of keys) {
      const keyData = await this.redis.get(redisKey);
      if (keyData) {
        const oldApiKey: APIKey = JSON.parse(keyData);
        if (oldApiKey.id === keyId && oldApiKey.isActive) {
          // Create new key
          const newKey = await this.generateAPIKey(
            oldApiKey.tenantId,
            oldApiKey.name,
            oldApiKey.permissions,
            {
              rateLimit: oldApiKey.rateLimit,
              expiresIn: oldApiKey.expiresAt ? Math.ceil((oldApiKey.expiresAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000)) : undefined
            }
          );
          
          // Deactivate old key
          oldApiKey.isActive = false;
          await this.redis.setex(redisKey, 3600, JSON.stringify(oldApiKey)); // Keep old key for 1 hour for transition
          
          return newKey;
        }
      }
    }
    
    return null;
  }

  // Tenant Management
  async createTenant(tenantConfig: Omit<TenantConfig, 'id'>): Promise<TenantConfig> {
    const tenant: TenantConfig = {
      id: crypto.randomUUID(),
      ...tenantConfig
    };
    
    await this.redis.setex(`tenant:${tenant.id}`, 86400 * 30, JSON.stringify(tenant)); // 30 days cache
    await this.redis.setex(`tenant_subdomain:${tenant.subdomain}`, 86400 * 30, tenant.id);
    
    return tenant;
  }

  async updateTenantConfig(tenantId: string, updates: Partial<TenantConfig>): Promise<TenantConfig | null> {
    const tenantData = await this.redis.get(`tenant:${tenantId}`);
    if (!tenantData) return null;
    
    const tenant: TenantConfig = { ...JSON.parse(tenantData), ...updates };
    await this.redis.setex(`tenant:${tenantId}`, 86400 * 30, JSON.stringify(tenant));
    
    return tenant;
  }

  // Analytics and Monitoring
  async getAPIMetrics(tenantId: string, timeRange: { start: Date; end: Date }): Promise<{
    totalRequests: number;
    averageResponseTime: number;
    errorRate: number;
    topEndpoints: Array<{ endpoint: string; count: number }>;
    requestsPerHour: Array<{ hour: string; count: number }>;
  }> {
    const metrics = this.metrics.filter(m => 
      m.tenantId === tenantId &&
      m.timestamp >= timeRange.start &&
      m.timestamp <= timeRange.end
    );

    const totalRequests = metrics.length;
    const averageResponseTime = metrics.reduce((sum, m) => sum + m.responseTime, 0) / totalRequests || 0;
    const errorRequests = metrics.filter(m => m.statusCode >= 400).length;
    const errorRate = (errorRequests / totalRequests) * 100 || 0;

    // Top endpoints
    const endpointCounts = metrics.reduce((acc, m) => {
      acc[m.endpoint] = (acc[m.endpoint] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topEndpoints = Object.entries(endpointCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([endpoint, count]) => ({ endpoint, count }));

    // Requests per hour
    const hourCounts = metrics.reduce((acc, m) => {
      const hour = new Date(m.timestamp).toISOString().slice(0, 13) + ':00:00';
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const requestsPerHour = Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => a.hour.localeCompare(b.hour));

    return {
      totalRequests,
      averageResponseTime: Math.round(averageResponseTime),
      errorRate: Math.round(errorRate * 100) / 100,
      topEndpoints,
      requestsPerHour
    };
  }

  async getHealthStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: Record<string, boolean>;
    metrics: {
      uptime: number;
      memoryUsage: NodeJS.MemoryUsage;
      activeConnections: number;
    };
  }> {
    const services = {
      redis: await this.checkRedisHealth(),
      database: true, // Would check actual database
      externalAPIs: true // Would check external service health
    };

    const allHealthy = Object.values(services).every(Boolean);
    const status = allHealthy ? 'healthy' : 'degraded';

    return {
      status,
      services,
      metrics: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        activeConnections: this.metrics.length
      }
    };
  }

  // Private helper methods
  private extractToken(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }
    return null;
  }

  private extractAPIKey(req: Request): string | null {
    return req.headers['x-api-key'] as string || req.query.apiKey as string || null;
  }

  private extractTenantId(req: Request): string | null {
    // Try header first
    const headerTenant = req.headers[this.config.tenancy.tenantHeader.toLowerCase()] as string;
    if (headerTenant) return headerTenant;

    // Try subdomain
    const host = req.headers.host;
    if (host) {
      const subdomain = host.split('.')[0];
      if (subdomain && subdomain !== 'www') {
        return subdomain;
      }
    }

    return null;
  }

  private async validateAPIKey(key: string): Promise<APIKey | null> {
    const keyData = await this.redis.get(`api_key:${key}`);
    if (!keyData) return null;

    const apiKey: APIKey = JSON.parse(keyData);
    
    // Check if key is active and not expired
    if (!apiKey.isActive) return null;
    if (apiKey.expiresAt && new Date() > new Date(apiKey.expiresAt)) {
      return null;
    }

    return apiKey;
  }

  private async updateAPIKeyUsage(keyId: string): Promise<void> {
    const keys = await this.redis.keys('api_key:*');
    
    for (const redisKey of keys) {
      const keyData = await this.redis.get(redisKey);
      if (keyData) {
        const apiKey: APIKey = JSON.parse(keyData);
        if (apiKey.id === keyId) {
          apiKey.lastUsedAt = new Date();
          await this.redis.setex(redisKey, 86400 * 365, JSON.stringify(apiKey));
          break;
        }
      }
    }
  }

  private async validateTenant(tenantId: string): Promise<TenantConfig | null> {
    const tenantData = await this.redis.get(`tenant:${tenantId}`);
    if (!tenantData) return null;

    const tenant: TenantConfig = JSON.parse(tenantData);
    return tenant.isActive ? tenant : null;
  }

  private async storeMetrics(metrics: RequestMetrics): Promise<void> {
    this.metrics.push(metrics);
    
    // Also store in Redis for persistence
    await this.redis.lpush('api_metrics', JSON.stringify(metrics));
    await this.redis.ltrim('api_metrics', 0, 10000); // Keep last 10k metrics
  }

  private cleanupMetrics(): void {
    // Keep only last hour of in-memory metrics
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    this.metrics = this.metrics.filter(m => m.timestamp > oneHourAgo);
  }

  private async checkRedisHealth(): Promise<boolean> {
    try {
      await this.redis.ping();
      return true;
    } catch {
      return false;
    }
  }

  // Webhook Management
  async registerWebhook(tenantId: string, event: string, url: string, secret?: string): Promise<string> {
    const webhookId = crypto.randomUUID();
    const webhook = {
      id: webhookId,
      tenantId,
      event,
      url,
      secret: secret || crypto.randomBytes(32).toString('hex'),
      isActive: true,
      createdAt: new Date()
    };

    await this.redis.setex(`webhook:${webhookId}`, 86400 * 365, JSON.stringify(webhook));
    await this.redis.sadd(`tenant_webhooks:${tenantId}`, webhookId);

    return webhookId;
  }

  async triggerWebhooks(tenantId: string, event: string, payload: any): Promise<void> {
    const webhookIds = await this.redis.smembers(`tenant_webhooks:${tenantId}`);
    
    for (const webhookId of webhookIds) {
      const webhookData = await this.redis.get(`webhook:${webhookId}`);
      if (webhookData) {
        const webhook = JSON.parse(webhookData);
        if (webhook.event === event && webhook.isActive) {
          // Trigger webhook (would be queued in production)
          this.sendWebhook(webhook, payload);
        }
      }
    }
  }

  private async sendWebhook(webhook: any, payload: any): Promise<void> {
    try {
      const signature = crypto
        .createHmac('sha256', webhook.secret)
        .update(JSON.stringify(payload))
        .digest('hex');

      await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature,
          'X-Webhook-Event': webhook.event
        },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error(`Webhook delivery failed for ${webhook.id}:`, error);
    }
  }
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      tenantId?: string;
      tenant?: TenantConfig;
      tenantConfig?: Record<string, any>;
      user?: any;
      apiKey?: APIKey;
      startTime?: number;
    }
  }
}

export default UniversalAPIGateway;

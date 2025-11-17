// Executive Dashboard - AI-Powered HR Intelligence Platform
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  Info,
  Brain,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  RefreshCw,
  Briefcase
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { advancedAnalyticsService, ExecutiveDashboard as DashboardData } from '../../services/advancedAnalyticsService';

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

const ExecutiveDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'insights' | 'predictions'>('overview');

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = await advancedAnalyticsService.generateExecutiveDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sample data for charts
  const hiringTrendData = [
    { month: 'Jan', hires: 12, applications: 145, quality: 85 },
    { month: 'Feb', hires: 18, applications: 189, quality: 82 },
    { month: 'Mar', hires: 15, applications: 167, quality: 88 },
    { month: 'Apr', hires: 22, applications: 201, quality: 90 },
    { month: 'May', hires: 19, applications: 178, quality: 87 },
    { month: 'Jun', hires: 25, applications: 223, quality: 92 }
  ];

  const departmentData = [
    { name: 'Engineering', hires: 35, budget: 85 },
    { name: 'Sales', hires: 28, budget: 72 },
    { name: 'Marketing', hires: 15, budget: 68 },
    { name: 'Operations', hires: 12, budget: 90 },
    { name: 'HR', hires: 8, budget: 95 }
  ];

  const diversityData = [
    { name: 'Gender Balance', value: 48 },
    { name: 'Ethnic Diversity', value: 32 },
    { name: 'Age Diversity', value: 28 },
    { name: 'Experience Levels', value: 35 }
  ];

  const performanceData = [
    { subject: 'Quality of Hire', A: 85, fullMark: 100 },
    { subject: 'Time to Fill', A: 78, fullMark: 100 },
    { subject: 'Cost Efficiency', A: 92, fullMark: 100 },
    { subject: 'Candidate Satisfaction', A: 88, fullMark: 100 },
    { subject: 'Hiring Manager Satisfaction', A: 82, fullMark: 100 },
    { subject: 'Retention Rate', A: 94, fullMark: 100 }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className="w-8 h-8 text-indigo-500" />
        </motion.div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Dashboard</h3>
          <p className="text-gray-600">Please try refreshing the page or contact support.</p>
        </div>
      </div>
    );
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? 
      <TrendingUp className="w-4 h-4 text-green-500" /> : 
      <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Brain className="w-8 h-8 text-purple-400" />
            Executive Intelligence Dashboard
          </h1>
          <p className="text-gray-400 mt-2">AI-powered insights and strategic HR analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadDashboardData}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </motion.button>
        </div>
      </div>

      {/* Alert Banner */}
      {dashboardData.alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-gradient-to-r from-yellow-500/10 to-red-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              {getAlertIcon(dashboardData.alerts[0].type)}
              <div className="flex-1">
                <h4 className="text-white font-medium">{dashboardData.alerts[0].message}</h4>
                <p className="text-gray-400 text-sm mt-1">{dashboardData.alerts[0].action}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
        {[
          { label: 'Total Hires', value: dashboardData.kpis.totalHires, icon: Users, suffix: '', color: 'purple' },
          { label: 'Avg. Time to Hire', value: dashboardData.kpis.averageTimeToHire, icon: Clock, suffix: ' days', color: 'blue' },
          { label: 'Cost per Hire', value: dashboardData.kpis.costPerHire, icon: DollarSign, suffix: '', prefix: '$', color: 'green' },
          { label: 'Quality Score', value: dashboardData.kpis.qualityOfHire, icon: Target, suffix: '%', color: 'yellow' },
          { label: 'Retention Rate', value: dashboardData.kpis.retentionRate, icon: CheckCircle, suffix: '%', color: 'pink' },
          { label: 'Diversity Score', value: dashboardData.kpis.diversityScore, icon: Activity, suffix: '%', color: 'indigo' }
        ].map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <kpi.icon className={`w-5 h-5 text-${kpi.color}-400`} />
              <span className="text-xs text-gray-400">+5.2%</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {kpi.prefix}{kpi.value.toFixed(kpi.suffix === '%' ? 1 : 0)}{kpi.suffix}
              </p>
              <p className="text-sm text-gray-400 mt-1">{kpi.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-8 bg-gray-800/50 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'performance', label: 'Performance', icon: TrendingUp },
          { id: 'insights', label: 'AI Insights', icon: Brain },
          { id: 'predictions', label: 'Predictions', icon: Zap }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-purple-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Hiring Trends Chart */}
              <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Hiring Trends
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={hiringTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Area type="monotone" dataKey="hires" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="applications" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Department Performance */}
              <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                  Department Performance
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="hires" fill="#8b5cf6" />
                    <Bar dataKey="budget" fill="#06b6d4" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Radar */}
              <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-400" />
                  Performance Metrics
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={performanceData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af' }} />
                    <PolarRadiusAxis stroke="#9ca3af" />
                    <Radar
                      name="Performance"
                      dataKey="A"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Diversity Metrics */}
              <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-green-400" />
                  Diversity Metrics
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={diversityData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {diversityData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-6">
              {dashboardData.insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${
                      insight.impact === 'high' ? 'bg-red-500/20 text-red-400' :
                      insight.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      <Brain className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-white">{insight.category}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          insight.impact === 'high' ? 'bg-red-500/20 text-red-400' :
                          insight.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {insight.impact.toUpperCase()} IMPACT
                        </span>
                      </div>
                      <p className="text-gray-300 mb-4">{insight.insight}</p>
                      <div>
                        <h5 className="text-sm font-medium text-gray-400 mb-2">Recommendations:</h5>
                        <ul className="list-disc list-inside text-gray-300 space-y-1">
                          {insight.recommendations.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'predictions' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Hiring Forecast */}
              <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Hiring Forecast
                </h3>
                <div className="space-y-4">
                  {[
                    { period: 'Next Quarter', value: 12, confidence: 89 },
                    { period: 'Next 6 Months', value: 28, confidence: 82 },
                    { period: 'Next Year', value: 65, confidence: 74 }
                  ].map((forecast, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-300">{forecast.period}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-white font-semibold">{forecast.value} hires</span>
                        <div className="flex items-center gap-1">
                          <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-yellow-400 to-green-400 transition-all duration-1000"
                              style={{ width: `${forecast.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400">{forecast.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trend Predictions */}
              <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Trend Predictions
                </h3>
                <div className="space-y-4">
                  {dashboardData.trends.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-300">{trend.metric}</span>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(trend.trend)}
                        <span className={`font-semibold ${
                          trend.change > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {trend.change > 0 ? '+' : ''}{trend.change.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ExecutiveDashboard;

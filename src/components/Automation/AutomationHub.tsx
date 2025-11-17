// Automation Hub - Central control for all integrations and workflows
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  MessageSquare, 
  Calendar, 
  Mail, 
  Webhook, 
  Settings,
  Play,
  Pause,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Users,
  Bot,
  ExternalLink
} from 'lucide-react';
import SlackIntegration from '../Integrations/SlackIntegration';
import { useNotifications } from '../../hooks/useNotifications';
import toast from 'react-hot-toast';

interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  actions: string[];
  enabled: boolean;
  lastRun?: string;
  runsCount: number;
  successRate: number;
}

interface IntegrationStatus {
  id: string;
  name: string;
  type: 'slack' | 'calendar' | 'email' | 'webhook';
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  icon: any;
  description: string;
}

const AutomationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'integrations' | 'workflows' | 'analytics'>('overview');
  const [showSlackModal, setShowSlackModal] = useState(false);
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([]);
  const { notificationStats, isSlackConnected } = useNotifications();

  useEffect(() => {
    initializeData();
  }, [isSlackConnected]);

  const initializeData = () => {
    // Initialize automation workflows
    const mockWorkflows: AutomationWorkflow[] = [
      {
        id: 'auto-notify-new-app',
        name: 'New Application Notifications',
        description: 'Automatically notify hiring team when new candidates apply',
        trigger: 'New candidate application',
        actions: ['Send Slack notification', 'Update pipeline', 'Assign to recruiter'],
        enabled: true,
        lastRun: '2 minutes ago',
        runsCount: 47,
        successRate: 98.5
      },
      {
        id: 'interview-reminders',
        name: 'Interview Reminder System',
        description: 'Send reminders 24h and 1h before scheduled interviews',
        trigger: 'Scheduled interview approaching',
        actions: ['Email reminder to interviewer', 'Slack notification', 'Calendar notification'],
        enabled: true,
        lastRun: '15 minutes ago',
        runsCount: 23,
        successRate: 100
      },
      {
        id: 'status-sync',
        name: 'Status Change Automation',
        description: 'Sync candidate status changes across all platforms',
        trigger: 'Candidate status update',
        actions: ['Update external systems', 'Notify stakeholders', 'Log activity'],
        enabled: false,
        lastRun: '1 hour ago',
        runsCount: 15,
        successRate: 92.3
      },
      {
        id: 'feedback-collection',
        name: 'Automated Feedback Collection',
        description: 'Request feedback from interviewers after completed interviews',
        trigger: 'Interview marked as completed',
        actions: ['Send feedback form', 'Set reminder', 'Track completion'],
        enabled: true,
        lastRun: '30 minutes ago',
        runsCount: 12,
        successRate: 89.7
      }
    ];

    // Initialize integration statuses
    const mockIntegrations: IntegrationStatus[] = [
      {
        id: 'slack',
        name: 'Slack',
        type: 'slack',
        status: isSlackConnected ? 'connected' : 'disconnected',
        lastSync: isSlackConnected ? '2 minutes ago' : undefined,
        icon: MessageSquare,
        description: 'Real-time team notifications and bot commands'
      },
      {
        id: 'calendar',
        name: 'Google Calendar',
        type: 'calendar',
        status: 'disconnected',
        icon: Calendar,
        description: 'Automated interview scheduling and calendar management'
      },
      {
        id: 'email',
        name: 'Email Automation',
        type: 'email',
        status: 'disconnected',
        icon: Mail,
        description: 'Candidate communication and internal notifications'
      },
      {
        id: 'webhooks',
        name: 'External APIs',
        type: 'webhook',
        status: 'error',
        icon: Webhook,
        description: 'Job boards, background checks, and third-party integrations'
      }
    ];

    setWorkflows(mockWorkflows);
    setIntegrations(mockIntegrations);
  };

  const toggleWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.map(workflow => 
      workflow.id === workflowId 
        ? { ...workflow, enabled: !workflow.enabled }
        : workflow
    ));
    
    const workflow = workflows.find(w => w.id === workflowId);
    toast.success(`${workflow?.name} ${workflow?.enabled ? 'disabled' : 'enabled'}`);
  };

  const getStatusColor = (status: IntegrationStatus['status']) => {
    switch (status) {
      case 'connected': return 'text-green-400 bg-green-500/20';
      case 'error': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusIcon = (status: IntegrationStatus['status']) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const totalConnected = integrations.filter(i => i.status === 'connected').length;
  const totalWorkflows = workflows.length;
  const activeWorkflows = workflows.filter(w => w.enabled).length;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Zap className="w-8 h-8 text-yellow-400" />
            Automation Hub
          </h1>
          <p className="text-gray-400 mt-2">Manage integrations, workflows, and automation</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg px-4 py-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-300">{activeWorkflows}/{totalWorkflows} workflows active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400">Active Integrations</h3>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{totalConnected}</span>
            <span className="text-sm text-gray-400">/ {integrations.length}</span>
          </div>
          <p className="text-xs text-green-400 mt-1">
            {Math.round((totalConnected / integrations.length) * 100)}% connected
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400">Notifications Sent</h3>
            <MessageSquare className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{notificationStats.sent}</span>
            <span className="text-sm text-gray-400">today</span>
          </div>
          <p className="text-xs text-blue-400 mt-1">
            {notificationStats.failed} failed
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400">Workflow Runs</h3>
            <Bot className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {workflows.reduce((sum, w) => sum + w.runsCount, 0)}
            </span>
            <span className="text-sm text-gray-400">total</span>
          </div>
          <p className="text-xs text-purple-400 mt-1">
            96.8% success rate
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400">Time Saved</h3>
            <Clock className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">18.5</span>
            <span className="text-sm text-gray-400">hrs/week</span>
          </div>
          <p className="text-xs text-yellow-400 mt-1">
            +15% vs last week
          </p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-gray-800/50 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'integrations', label: 'Integrations', icon: Webhook },
          { id: 'workflows', label: 'Workflows', icon: Zap },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-yellow-500 text-black'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {[
                  { time: '2 min ago', action: 'New application notification sent to #hiring', icon: MessageSquare },
                  { time: '15 min ago', action: 'Interview reminder sent to Sarah Chen', icon: Calendar },
                  { time: '30 min ago', action: 'Candidate status updated: Alice → Interview', icon: Users },
                  { time: '1 hr ago', action: 'Feedback request sent to Marcus Rodriguez', icon: Mail }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                    <activity.icon className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-white text-sm">{activity.action}</p>
                      <p className="text-gray-400 text-xs">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-yellow-400" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowSlackModal(true)}
                  className="p-4 bg-gray-700/50 hover:bg-gray-700/70 rounded-lg transition-colors text-left"
                >
                  <MessageSquare className="w-5 h-5 text-purple-400 mb-2" />
                  <h4 className="text-white text-sm font-medium">Setup Slack</h4>
                  <p className="text-gray-400 text-xs">Configure notifications</p>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 bg-gray-700/50 hover:bg-gray-700/70 rounded-lg transition-colors text-left"
                >
                  <Calendar className="w-5 h-5 text-blue-400 mb-2" />
                  <h4 className="text-white text-sm font-medium">Connect Calendar</h4>
                  <p className="text-gray-400 text-xs">Sync interviews</p>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 bg-gray-700/50 hover:bg-gray-700/70 rounded-lg transition-colors text-left"
                >
                  <Mail className="w-5 h-5 text-green-400 mb-2" />
                  <h4 className="text-white text-sm font-medium">Email Setup</h4>
                  <p className="text-gray-400 text-xs">Automate emails</p>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 bg-gray-700/50 hover:bg-gray-700/70 rounded-lg transition-colors text-left"
                >
                  <Webhook className="w-5 h-5 text-orange-400 mb-2" />
                  <h4 className="text-white text-sm font-medium">Add Webhook</h4>
                  <p className="text-gray-400 text-xs">External APIs</p>
                </motion.button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <integration.icon className="w-6 h-6 text-indigo-400" />
                    <div>
                      <h3 className="font-semibold text-white">{integration.name}</h3>
                      <p className="text-sm text-gray-400">{integration.description}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(integration.status)}`}>
                    {getStatusIcon(integration.status)}
                    <span className="capitalize">{integration.status}</span>
                  </div>
                </div>
                
                {integration.lastSync && (
                  <p className="text-xs text-gray-500 mb-4">Last sync: {integration.lastSync}</p>
                )}
                
                <div className="flex gap-2">
                  {integration.id === 'slack' ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowSlackModal(true)}
                      className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Configure
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Connect
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 border border-gray-600 hover:border-gray-500 text-gray-300 rounded-lg text-sm font-medium transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'workflows' && (
          <div className="space-y-4">
            {workflows.map((workflow, index) => (
              <motion.div
                key={workflow.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{workflow.name}</h3>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                        workflow.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {workflow.enabled ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                        {workflow.enabled ? 'Active' : 'Paused'}
                      </div>
                    </div>
                    <p className="text-gray-400 mb-3">{workflow.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Trigger:</span>
                        <p className="text-white">{workflow.trigger}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Actions:</span>
                        <ul className="text-white">
                          {workflow.actions.slice(0, 2).map((action, i) => (
                            <li key={i}>• {action}</li>
                          ))}
                          {workflow.actions.length > 2 && (
                            <li className="text-gray-400">+{workflow.actions.length - 2} more</li>
                          )}
                        </ul>
                      </div>
                      <div>
                        <span className="text-gray-400">Performance:</span>
                        <p className="text-white">{workflow.runsCount} runs</p>
                        <p className="text-green-400">{workflow.successRate}% success</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleWorkflow(workflow.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        workflow.enabled 
                          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                          : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                      }`}
                    >
                      {workflow.enabled ? 'Pause' : 'Enable'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 border border-gray-600 hover:border-gray-500 text-gray-300 rounded-lg text-sm font-medium transition-colors"
                    >
                      Edit
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Integration Performance</h3>
              <div className="space-y-4">
                {integrations.map(integration => (
                  <div key={integration.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <integration.icon className="w-4 h-4 text-gray-400" />
                      <span className="text-white">{integration.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${
                            integration.status === 'connected' ? 'bg-green-500' : 
                            integration.status === 'error' ? 'bg-red-500' : 'bg-gray-500'
                          }`}
                          style={{ 
                            width: integration.status === 'connected' ? '100%' : 
                                   integration.status === 'error' ? '25%' : '0%'
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-400 w-8">
                        {integration.status === 'connected' ? '100%' : 
                         integration.status === 'error' ? '25%' : '0%'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Workflow Efficiency</h3>
              <div className="space-y-4">
                {workflows.map(workflow => (
                  <div key={workflow.id} className="flex items-center justify-between">
                    <div>
                      <span className="text-white text-sm">{workflow.name}</span>
                      <p className="text-xs text-gray-400">{workflow.runsCount} executions</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-400">
                        {workflow.successRate}%
                      </div>
                      <div className="text-xs text-gray-400">success rate</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Slack Integration Modal */}
      {/* Slack Integration Modal */}
      {showSlackModal && (
        <SlackIntegration onClose={() => setShowSlackModal(false)} />
      )}
    </div>
  );
};

export default AutomationHub;

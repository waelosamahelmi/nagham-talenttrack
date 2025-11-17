// Slack Integration Management Component
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  Send,
  Users,
  Bell,
  Zap,
  ExternalLink,
  Copy,
  Shield,
  Webhook
} from 'lucide-react';
import { slackService, SlackNotification } from '../../services/integrations/slackService';
import { Candidate } from '../../types';
import toast from 'react-hot-toast';

interface SlackIntegrationProps {
  onClose: () => void;
}

const SlackIntegration: React.FC<SlackIntegrationProps> = ({ onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [testChannel, setTestChannel] = useState('#general');
  const [testMessage, setTestMessage] = useState('Hello from TalentTrack! 👋');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [activeTab, setActiveTab] = useState<'setup' | 'notifications' | 'bot'>('setup');
  const [notificationSettings, setNotificationSettings] = useState({
    newApplications: true,
    interviewScheduled: true,
    statusUpdates: true,
    hiringDecisions: true,
    urgentOnly: false
  });

  useEffect(() => {
    checkSlackStatus();
  }, []);

  const checkSlackStatus = () => {
    setIsConfigured(slackService.isConfigured());
    setIsConnected(slackService.isReady());
  };

  const sendTestNotification = async () => {
    setIsSendingTest(true);
    
    try {
      const testNotification: SlackNotification = {
        type: 'candidate_update',
        title: 'TalentTrack Integration Test',
        message: testMessage,
        urgency: 'low'
      };

      const success = await slackService.sendNotification(testNotification, testChannel);
      
      if (success) {
        toast.success('Test notification sent successfully!');
      } else {
        toast.error('Failed to send test notification. Check your Slack configuration.');
      }
    } catch (error) {
      console.error('Test notification error:', error);
      toast.error('Error sending test notification');
    } finally {
      setIsSendingTest(false);
    }
  };

  const mockCandidateNotifications = async () => {
    const mockCandidate: Candidate = {
      id: 'test-123',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '+1 (555) 123-4567',
      position: 'Senior React Developer',
      experience: 5,
      skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
      location: 'San Francisco, CA',
      salary_expectation: 120000,
      status: 'interview',
      applied_date: new Date().toISOString(),
      last_activity: new Date().toISOString(),
      source: 'LinkedIn',
      rating: 4.5,
      notes: [],
      documents: [],
      interviews: []
    };

    // Send different types of notifications
    await slackService.notifyNewApplication(mockCandidate);
    
    setTimeout(() => {
      slackService.notifyInterviewScheduled(mockCandidate, 'Tomorrow at 2:00 PM', 'Sarah Chen');
    }, 2000);

    setTimeout(() => {
      slackService.notifyStatusChange(mockCandidate, 'applied', 'interview');
    }, 4000);

    toast.success('Demo notifications sent! Check your Slack channels.');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const setupSteps = [
    {
      title: 'Create Slack App',
      description: 'Go to api.slack.com/apps and create a new app',
      action: 'https://api.slack.com/apps'
    },
    {
      title: 'Configure Bot Token',
      description: 'Add bot token to your environment variables',
      code: 'VITE_SLACK_BOT_TOKEN=xoxb-your-token-here'
    },
    {
      title: 'Set Signing Secret',
      description: 'Add signing secret for webhook verification',
      code: 'VITE_SLACK_SIGNING_SECRET=your-signing-secret'
    },
    {
      title: 'Configure Channels',
      description: 'Set your preferred notification channels',
      code: `VITE_SLACK_CHANNEL_HIRING=#hiring
VITE_SLACK_CHANNEL_INTERVIEWS=#interviews
VITE_SLACK_CHANNEL_NOTIFICATIONS=#hr-notifications`
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900/95 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-purple-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Slack Integration</h2>
              <p className="text-gray-400">Real-time notifications and team collaboration</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              isConnected 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {isConnected ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-800/50 p-1 rounded-lg">
          {[
            { id: 'setup', label: 'Setup', icon: Settings },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'bot', label: 'Bot Commands', icon: Zap }
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
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {activeTab === 'setup' && (
            <div className="space-y-6">
              {/* Configuration Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border ${
                  isConfigured 
                    ? 'border-green-500/30 bg-green-500/10' 
                    : 'border-yellow-500/30 bg-yellow-500/10'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <Settings className="w-5 h-5 text-yellow-400" />
                    <h3 className="font-semibold text-white">Configuration</h3>
                  </div>
                  <p className={`text-sm ${
                    isConfigured ? 'text-green-300' : 'text-yellow-300'
                  }`}>
                    {isConfigured ? 'Environment variables configured' : 'Setup required'}
                  </p>
                </div>

                <div className={`p-4 rounded-lg border ${
                  isConnected 
                    ? 'border-green-500/30 bg-green-500/10' 
                    : 'border-red-500/30 bg-red-500/10'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <h3 className="font-semibold text-white">Connection</h3>
                  </div>
                  <p className={`text-sm ${
                    isConnected ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {isConnected ? 'Successfully connected to Slack' : 'Connection failed'}
                  </p>
                </div>
              </div>

              {/* Setup Steps */}
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Setup Instructions</h3>
                <div className="space-y-4">
                  {setupSteps.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white mb-1">{step.title}</h4>
                        <p className="text-gray-400 text-sm mb-2">{step.description}</p>
                        
                        {step.action && (
                          <button
                            onClick={() => window.open(step.action, '_blank')}
                            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Open Slack API
                          </button>
                        )}
                        
                        {step.code && (
                          <div className="bg-gray-900/80 rounded-lg p-3 mt-2 relative group">
                            <pre className="text-green-400 text-sm whitespace-pre-wrap">
                              {step.code}
                            </pre>
                            <button
                              onClick={() => copyToClipboard(step.code)}
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Test Connection */}
              {isConfigured && (
                <div className="bg-gray-800/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Test Integration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Test Channel
                      </label>
                      <input
                        type="text"
                        value={testChannel}
                        onChange={(e) => setTestChannel(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="#general"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Test Message
                      </label>
                      <input
                        type="text"
                        value={testMessage}
                        onChange={(e) => setTestMessage(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter test message"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={sendTestNotification}
                      disabled={isSendingTest}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSendingTest ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Test
                        </>
                      )}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={mockCandidateNotifications}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition-colors"
                    >
                      <Users className="w-4 h-4" />
                      Demo Notifications
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              {/* Notification Settings */}
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  {Object.entries(notificationSettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {key === 'newApplications' && 'Notify when candidates apply'}
                          {key === 'interviewScheduled' && 'Notify when interviews are scheduled'}
                          {key === 'statusUpdates' && 'Notify on candidate status changes'}
                          {key === 'hiringDecisions' && 'Notify on hiring decisions'}
                          {key === 'urgentOnly' && 'Only send high priority notifications'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setNotificationSettings(prev => ({
                            ...prev,
                            [key]: e.target.checked
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Channel Configuration */}
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Channel Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Hiring Channel
                    </label>
                    <input
                      type="text"
                      defaultValue="#hiring"
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                      placeholder="#hiring"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Interview Channel
                    </label>
                    <input
                      type="text"
                      defaultValue="#interviews"
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                      placeholder="#interviews"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Notifications Channel
                    </label>
                    <input
                      type="text"
                      defaultValue="#hr-notifications"
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                      placeholder="#hr-notifications"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      General Channel
                    </label>
                    <input
                      type="text"
                      defaultValue="#general"
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                      placeholder="#general"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bot' && (
            <div className="space-y-6">
              {/* Bot Commands */}
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Available Bot Commands</h3>
                <div className="space-y-4">
                  {[
                    {
                      command: '/candidate search [name]',
                      description: 'Search for candidates by name or skills',
                      example: '/candidate search Alice Johnson'
                    },
                    {
                      command: '/pipeline status',
                      description: 'Get current pipeline overview',
                      example: '/pipeline status'
                    },
                    {
                      command: '/interview schedule',
                      description: 'Start interview scheduling workflow',
                      example: '/interview schedule'
                    },
                    {
                      command: '/approve [candidate_id]',
                      description: 'Approve a candidate for next stage',
                      example: '/approve cand_123'
                    }
                  ].map((cmd, index) => (
                    <div key={index} className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Webhook className="w-5 h-5 text-purple-400" />
                        <code className="font-mono text-purple-300 font-medium">
                          {cmd.command}
                        </code>
                      </div>
                      <p className="text-gray-300 mb-2">{cmd.description}</p>
                      <p className="text-sm text-gray-400">
                        <span className="font-medium">Example:</span> <code>{cmd.example}</code>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bot Setup Note */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-white mb-1">Backend Integration Required</h4>
                    <p className="text-yellow-300 text-sm">
                      Bot commands require a backend service to handle Slack events and commands. 
                      These commands will be fully functional once the backend integration is deployed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SlackIntegration;

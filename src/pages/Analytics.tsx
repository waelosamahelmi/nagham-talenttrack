import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import MetricsCard from '../components/Dashboard/MetricsCard';
import { Users, Clock, TrendingUp, Target, Brain, Crown, Activity, BarChart3, PieChart } from 'lucide-react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import PredictiveAnalyticsDashboard from '../components/Analytics/PredictiveAnalyticsDashboard';
import ExecutiveDashboard from '../components/Analytics/ExecutiveDashboard';

const Analytics = () => {
  const [dashboardStats, setDashboardStats] = useState({
    total_candidates: 0,
    active_positions: 0,
    interviews_scheduled: 0,
    status_distribution: {}
  });
  const [pipelineData, setPipelineData] = useState({});
  const [sourceData, setSourceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'overview' | 'predictive' | 'executive'>('overview');

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const [stats, pipeline, sources] = await Promise.all([
        api.analytics.getDashboardStats(),
        api.analytics.getPipelineData(),
        api.analytics.getSourceData()
      ]);
      
      setDashboardStats(stats);
      setPipelineData(pipeline);
      setSourceData(sources);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const timeToHireData = [
    { month: 'Jan', days: 32 },
    { month: 'Feb', days: 29 },
    { month: 'Mar', days: 31 },
    { month: 'Apr', days: 28 },
    { month: 'May', days: 25 },
    { month: 'Jun', days: 28 },
  ];

  const pipelineChartData = Object.entries(pipelineData).map(([status, count]) => ({
    status: status.replace('_', ' '),
    count,
  }));

  const sourceChartData = Object.entries(sourceData).map(([source, count]) => ({
    source: source.replace('_', ' '),
    count,
  }));

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Analytics & Intelligence Hub</h1>
          <p className="text-gray-300">Advanced HR analytics powered by AI and machine learning</p>
        </div>

        {/* View Selector */}
        <div className="flex gap-2 mb-8 bg-gray-800/50 backdrop-blur-lg p-1 rounded-lg border border-gray-700/50">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3, description: 'Traditional analytics and KPIs' },
            { id: 'predictive', label: 'Predictive Analytics', icon: Brain, description: 'AI-powered predictions and insights' },
            { id: 'executive', label: 'Executive Dashboard', icon: Crown, description: 'Strategic intelligence for leadership' }
          ].map(view => (
            <motion.button
              key={view.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveView(view.id as any)}
              className={`flex-1 p-4 rounded-md font-medium transition-all ${
                activeView === view.id
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center justify-center gap-3">
                <view.icon className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">{view.label}</div>
                  <div className="text-xs opacity-75">{view.description}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeView === 'overview' && (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <MetricsCard
                      title="Total Candidates"
                      value={dashboardStats.total_candidates}
                      change="12%"
                      changeType="increase"
                      icon={Users}
                      iconColor="text-blue-400"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <MetricsCard
                      title="Active Positions"
                      value={dashboardStats.active_positions}
                      change="8%"
                      changeType="increase"
                      icon={Target}
                      iconColor="text-green-400"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <MetricsCard
                      title="Scheduled Interviews"
                      value={dashboardStats.interviews_scheduled}
                      change="5%"
                      changeType="increase"
                      icon={Clock}
                      iconColor="text-orange-400"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <MetricsCard
                      title="Total Applications"
                      value={Object.values(dashboardStats.status_distribution).reduce((sum: number, count: any) => sum + count, 0)}
                      change="2%"
                      changeType="increase"
                      icon={TrendingUp}
                      iconColor="text-purple-400"
                    />
                  </motion.div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6"
                  >
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      Time to Hire Trend
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={timeToHireData}>
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
                        <Line type="monotone" dataKey="days" stroke="#8b5cf6" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6"
                  >
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-blue-400" />
                      Pipeline Status Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={pipelineChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="status" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1f2937',
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="count" fill="#06b6d4" />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                </div>

                {/* Additional Analytics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-purple-400" />
                    Candidate Sources
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sourceChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="source" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="count" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Summary Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Performance Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400">
                        {Object.values(dashboardStats.status_distribution).reduce((sum: number, count: any) => sum + count, 0)}
                      </div>
                      <div className="text-sm text-gray-400 mt-2">Total Applications</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400">
                        {(dashboardStats.status_distribution as any)?.hired || 0}
                      </div>
                      <div className="text-sm text-gray-400 mt-2">Successful Hires</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-400">{dashboardStats.total_candidates}</div>
                      <div className="text-sm text-gray-400 mt-2">Active Candidates</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {activeView === 'predictive' && <PredictiveAnalyticsDashboard />}

            {activeView === 'executive' && <ExecutiveDashboard />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Analytics;
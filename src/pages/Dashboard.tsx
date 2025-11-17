import { useState } from 'react';
import { Users, Calendar, Clock, Award, Target, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDashboardStats, usePipelineData, useSourceData } from '../hooks/useReactQuery';
import MetricsCard from '../components/Dashboard/MetricsCard';
import PipelineChart from '../components/Dashboard/PipelineChart';
import SourceChart from '../components/Dashboard/SourceChart';
import { GlassCard } from '../components/UI/Glass/GlassComponents';
import { useAuth } from '../hooks/useAuth';
import AIChatBot from '../components/AI/ChatBot/AIChatBot';
import AIInsightsDashboard from '../components/AI/Insights/AIInsightsDashboard';

const Dashboard = () => {
  const { profile } = useAuth();
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);
  const [isChatBotMinimized, setIsChatBotMinimized] = useState(false);
  
  // Use React Query hooks for data fetching
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: pipelineData, isLoading: pipelineLoading } = usePipelineData();
  const { data: sourceData, isLoading: sourceLoading } = useSourceData();
  
  const isLoading = statsLoading || pipelineLoading || sourceLoading;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 backdrop-blur-sm rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <GlassCard key={i} className="h-32" animated={false}>
                <div className="h-full bg-white/5 rounded-lg animate-shimmer"></div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="p-6">
        <GlassCard className="p-8 text-center">
          <div className="text-red-600 dark:text-red-400">
            <h3 className="text-lg font-semibold mb-2">Failed to load dashboard data</h3>
            <p className="text-sm opacity-75">Please try refreshing the page</p>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <motion.div 
      className="p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, staggerChildren: 0.1 }}
    >
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {profile?.name}!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Here's what's happening with your recruitment pipeline today.
          </p>
        </GlassCard>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <MetricsCard
          title="Total Candidates"
          value={stats?.total_candidates || 0}
          change="12%"
          changeType="increase"
          icon={Users}
          iconColor="text-blue-600"
        />
        <MetricsCard
          title="Active Positions"
          value={stats?.active_positions || 0}
          change="8%"
          changeType="increase"
          icon={Target}
          iconColor="text-green-600"
        />
        <MetricsCard
          title="Interviews This Week"
          value={stats?.interviews_scheduled || 0}
          change="15%"
          changeType="increase"
          icon={Calendar}
          iconColor="text-purple-600"
        />
        <MetricsCard
          title="Avg. Time to Hire"
          value="28 days"
          change="5%"
          changeType="decrease"
          icon={Clock}
          iconColor="text-orange-600"
        />
      </motion.div>

      {/* Charts Section */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <PipelineChart data={pipelineData} />
        <SourceChart data={sourceData} />
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-blue-600" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            <motion.div 
              className="flex items-center space-x-4"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">Ahmed Hassan moved to Interview stage</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
              </div>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-4"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">New candidate Fatima Al-Zahra applied for UX Designer position</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">4 hours ago</p>
              </div>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-4"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">Interview scheduled with Omar Khalil for tomorrow</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">6 hours ago</p>
              </div>
            </motion.div>
          </div>
        </GlassCard>
      </motion.div>

      {/* AI Insights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <AIInsightsDashboard />
      </motion.div>

      {/* AI Chat Bot */}
      <AIChatBot
        isOpen={isChatBotOpen}
        onClose={() => setIsChatBotOpen(false)}
        onMinimize={() => setIsChatBotMinimized(!isChatBotMinimized)}
        isMinimized={isChatBotMinimized}
      />

      {/* AI Chat Bot Trigger */}
      {!isChatBotOpen && (
        <motion.button
          onClick={() => setIsChatBotOpen(true)}
          className="fixed bottom-4 right-4 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow z-40 flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Bot className="w-6 h-6" />
        </motion.button>
      )}
    </motion.div>
  );
};

export default Dashboard;
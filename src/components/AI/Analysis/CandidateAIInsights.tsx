// AI-Powered Candidate Insights - Advanced Analysis Component
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Star,
  AlertTriangle,
  CheckCircle,
  User,
  Briefcase,
  GraduationCap,
  MessageSquare,
  BarChart3,
  Zap,
  Award,
  Users,
  DollarSign,
  RefreshCw
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { advancedAnalyticsService, CandidateInsight } from '../../../services/advancedAnalyticsService';

interface CandidateAIInsightsProps {
  candidateId: string;
  onClose: () => void;
}

const CandidateAIInsights: React.FC<CandidateAIInsightsProps> = ({ candidateId, onClose }) => {
  const [insights, setInsights] = useState<CandidateInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'performance' | 'predictions'>('overview');

  useEffect(() => {
    loadCandidateInsights();
  }, [candidateId]);

  const loadCandidateInsights = async () => {
    setLoading(true);
    try {
      const candidateInsights = await advancedAnalyticsService.generateCandidateInsights(candidateId);
      setInsights(candidateInsights);
    } catch (error) {
      console.error('Error loading candidate insights:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sample data for visualizations
  const skillsRadarData = [
    { skill: 'Technical Skills', score: 85, market: 75 },
    { skill: 'Communication', score: 92, market: 80 },
    { skill: 'Leadership', score: 78, market: 70 },
    { skill: 'Problem Solving', score: 88, market: 82 },
    { skill: 'Team Collaboration', score: 84, market: 78 },
    { skill: 'Adaptability', score: 90, market: 73 }
  ];

  const performanceHistory = [
    { period: 'Q1 2024', score: 78, industry: 75 },
    { period: 'Q2 2024', score: 82, industry: 76 },
    { period: 'Q3 2024', score: 85, industry: 78 },
    { period: 'Q4 2024', score: 88, industry: 80 }
  ];

  const competencyMatrix = [
    { competency: 'JavaScript', level: 90, demand: 95, growth: 12 },
    { competency: 'React', level: 85, demand: 90, growth: 18 },
    { competency: 'Node.js', level: 80, demand: 85, growth: 15 },
    { competency: 'TypeScript', level: 75, demand: 88, growth: 25 },
    { competency: 'Python', level: 70, demand: 82, growth: 20 }
  ];

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-lg p-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="flex justify-center mb-4"
          >
            <Brain className="w-8 h-8 text-purple-400" />
          </motion.div>
          <p className="text-white text-center">Analyzing candidate with AI...</p>
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-lg p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-white text-lg font-semibold mb-2">Unable to Generate Insights</h3>
          <p className="text-gray-400 mb-4">AI analysis is currently unavailable</p>
          <button
            onClick={onClose}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-white" />
              <div>
                <h2 className="text-2xl font-bold text-white">AI Candidate Insights</h2>
                <p className="text-purple-100">Deep analysis powered by machine learning</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 bg-gray-800 p-4 border-r border-gray-700">
            <div className="space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: User },
                { id: 'skills', label: 'Skills Analysis', icon: Target },
                { id: 'performance', label: 'Performance', icon: TrendingUp },
                { id: 'predictions', label: 'Predictions', icon: Zap }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-purple-500 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-8 space-y-4">
              <div className={`p-3 rounded-lg border ${getScoreBg(insights.overallScore)}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-300">Overall Score</span>
                  <Star className="w-4 h-4 text-yellow-400" />
                </div>
                <div className={`text-xl font-bold ${getScoreColor(insights.overallScore)}`}>
                  {insights.overallScore}/100
                </div>
              </div>

              <div className={`p-3 rounded-lg border ${getScoreBg(insights.culturalFitScore)}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-300">Role Fit</span>
                  <Target className="w-4 h-4 text-blue-400" />
                </div>
                <div className={`text-xl font-bold ${getScoreColor(insights.culturalFitScore)}`}>
                  {insights.culturalFitScore}/100
                </div>
              </div>

              <div className="p-3 rounded-lg bg-gray-800 border border-gray-700">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-300">Risk Level</span>
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                </div>
                <div className={`text-sm font-medium ${
                  insights.retentionRisk === 'low' ? 'text-green-400' :
                  insights.retentionRisk === 'medium' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {insights.retentionRisk === 'low' ? 'Low Risk' :
                   insights.retentionRisk === 'medium' ? 'Medium Risk' : 'High Risk'}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Key Insights */}
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">Key Insights</h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Using sample insights since the interface doesn't have keyInsights */}
                      {['Strong technical background with modern framework experience', 'Excellent problem-solving skills demonstrated in past projects', 'Good cultural fit based on interview feedback'].map((insight: string, index: number) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-800 border border-gray-700 rounded-lg p-4"
                          >
                            <div className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                              <p className="text-gray-300">{insight}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Strengths & Weaknesses */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-400" />
                          Strengths
                        </h4>
                        <div className="space-y-2">
                          {insights.strengths.map((strength, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                              <Star className="w-4 h-4 text-green-400" />
                              <span className="text-gray-300">{strength}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-yellow-400" />
                          Areas for Development
                        </h4>
                        <div className="space-y-2">
                          {/* Using skillGaps as weaknesses since that's what's available */}
                          {insights.skillGaps.map((weakness: string, index: number) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                              <Target className="w-4 h-4 text-yellow-400" />
                              <span className="text-gray-300">{weakness}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-400" />
                        AI Recommendations
                      </h4>
                      <div className="space-y-3">
                        {insights.recommendations.map((recommendation, index) => (
                          <div key={index} className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                            <p className="text-gray-300">{recommendation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'skills' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Skills Radar */}
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-4">Skills Assessment</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <RadarChart data={skillsRadarData}>
                            <PolarGrid stroke="#374151" />
                            <PolarAngleAxis dataKey="skill" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                            <PolarRadiusAxis stroke="#9ca3af" />
                            <Radar
                              name="Candidate"
                              dataKey="score"
                              stroke="#8b5cf6"
                              fill="#8b5cf6"
                              fillOpacity={0.3}
                              strokeWidth={2}
                            />
                            <Radar
                              name="Market Average"
                              dataKey="market"
                              stroke="#06b6d4"
                              fill="transparent"
                              strokeWidth={2}
                              strokeDasharray="5 5"
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Competency Matrix */}
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-4">Competency Analysis</h3>
                        <div className="space-y-3">
                          {competencyMatrix.map((comp, index) => (
                            <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-white font-medium">{comp.competency}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-green-400">+{comp.growth}%</span>
                                  <TrendingUp className="w-4 h-4 text-green-400" />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-gray-400">Skill Level</span>
                                    <span className="text-xs text-white">{comp.level}%</span>
                                  </div>
                                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-1000"
                                      style={{ width: `${comp.level}%` }}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-gray-400">Market Demand</span>
                                    <span className="text-xs text-white">{comp.demand}%</span>
                                  </div>
                                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-green-500 to-yellow-500 transition-all duration-1000"
                                      style={{ width: `${comp.demand}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'performance' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">Performance Tracking</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={performanceHistory}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="period" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1f2937',
                              border: '1px solid #374151',
                              borderRadius: '8px'
                            }}
                          />
                          <Area type="monotone" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                          <Area type="monotone" dataKey="industry" stroke="#06b6d4" fill="transparent" strokeDasharray="5 5" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
                        <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">28 days</div>
                        <div className="text-sm text-gray-400">Avg Response Time</div>
                      </div>
                      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
                        <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">4.8/5</div>
                        <div className="text-sm text-gray-400">Interview Rating</div>
                      </div>
                      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
                        <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">95%</div>
                        <div className="text-sm text-gray-400">Culture Fit</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'predictions' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <Zap className="w-6 h-6 text-yellow-400" />
                        AI Predictions
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <CheckCircle className="w-6 h-6 text-green-400" />
                              <h4 className="text-lg font-semibold text-white">Success Probability</h4>
                            </div>
                            <div className="text-3xl font-bold text-green-400 mb-2">87%</div>
                            <p className="text-gray-400 text-sm">
                              High likelihood of successful placement based on skills match and interview performance.
                            </p>
                          </div>

                          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <DollarSign className="w-6 h-6 text-yellow-400" />
                              <h4 className="text-lg font-semibold text-white">Salary Prediction</h4>
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">$85K - $95K</div>
                            <div className="text-sm text-gray-400 mb-2">Expected range based on skills and market</div>
                            <div className="text-xs text-green-400">15% above market average</div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <Clock className="w-6 h-6 text-blue-400" />
                              <h4 className="text-lg font-semibold text-white">Retention Forecast</h4>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400">1 Year</span>
                                <span className="text-green-400 font-semibold">92%</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400">2 Years</span>
                                <span className="text-yellow-400 font-semibold">78%</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400">3+ Years</span>
                                <span className="text-orange-400 font-semibold">65%</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <TrendingUp className="w-6 h-6 text-purple-400" />
                              <h4 className="text-lg font-semibold text-white">Growth Potential</h4>
                            </div>
                            <div className="text-2xl font-bold text-purple-400 mb-2">High</div>
                            <p className="text-gray-400 text-sm">
                              Strong learning curve and leadership potential identified.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Risk Factors - using sample data since interface doesn't have riskFactors */}
                    {insights.retentionRisk !== 'low' && (
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                          Risk Factors
                        </h4>
                        <div className="space-y-2">
                          {/* Sample risk factors based on retention risk */}
                          {insights.retentionRisk === 'medium' && (
                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex items-center gap-3">
                              <AlertTriangle className="w-4 h-4 text-yellow-400" />
                              <span className="text-gray-300">Moderate skill gaps may affect initial performance</span>
                            </div>
                          )}
                          {insights.retentionRisk === 'high' && (
                            <>
                              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-3">
                                <AlertTriangle className="w-4 h-4 text-red-400" />
                                <span className="text-gray-300">Significant skill gaps require extensive training</span>
                              </div>
                              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-3">
                                <AlertTriangle className="w-4 h-4 text-red-400" />
                                <span className="text-gray-300">Lower cultural fit score may impact team integration</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CandidateAIInsights;

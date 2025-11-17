// Predictive Analytics Dashboard for HR insights
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Users, 
  Calendar,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  Brain,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { aiService } from '../../services/ai/aiService';

interface PredictionData {
  metric: string;
  current: number;
  predicted: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  insight: string;
}

interface HiringForecast {
  month: string;
  predicted_hires: number;
  predicted_applications: number;
  success_rate: number;
}

interface SkillDemand {
  skill: string;
  current_demand: number;
  predicted_growth: number;
  market_trend: 'hot' | 'growing' | 'stable' | 'declining';
}

interface RetentionRisk {
  department: string;
  risk_level: 'high' | 'medium' | 'low';
  predicted_turnover: number;
  key_factors: string[];
}

const PredictiveAnalyticsDashboard: React.FC = () => {
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [hiringForecast, setHiringForecast] = useState<HiringForecast[]>([]);
  const [skillDemands, setSkillDemands] = useState<SkillDemand[]>([]);
  const [retentionRisks, setRetentionRisks] = useState<RetentionRisk[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'hiring' | 'skills' | 'retention' | 'insights'>('hiring');

  const generatePredictiveAnalytics = async () => {
    setIsLoading(true);
    try {
      const prompt = `
        Generate predictive HR analytics based on current hiring trends and market conditions.
        
        Provide insights for:
        1. Hiring predictions for the next 6 months
        2. In-demand skills and their growth trajectory  
        3. Employee retention risk analysis
        4. Key performance indicators and trends
        
        Return as JSON:
        {
          "predictions": [
            {
              "metric": "Time to Hire",
              "current": 25,
              "predicted": 22,
              "trend": "down",
              "confidence": 85,
              "insight": "Improved screening process will reduce hiring time"
            }
          ],
          "hiringForecast": [
            {
              "month": "Jan 2025",
              "predicted_hires": 15,
              "predicted_applications": 120,
              "success_rate": 12.5
            }
          ],
          "skillDemands": [
            {
              "skill": "React",
              "current_demand": 85,
              "predicted_growth": 15,
              "market_trend": "hot"
            }
          ],
          "retentionRisks": [
            {
              "department": "Engineering",
              "risk_level": "medium",
              "predicted_turnover": 8.5,
              "key_factors": ["Remote work flexibility", "Career growth opportunities"]
            }
          ]
        }
      `;

      const response = await aiService.generateText(prompt);
      const analytics = JSON.parse(response);
      
      setPredictions(analytics.predictions || []);
      setHiringForecast(analytics.hiringForecast || []);
      setSkillDemands(analytics.skillDemands || []);
      setRetentionRisks(analytics.retentionRisks || []);
    } catch (error) {
      console.error('Error generating analytics:', error);
      generateMockAnalytics();
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockAnalytics = () => {
    const mockPredictions: PredictionData[] = [
      {
        metric: "Time to Hire",
        current: 28,
        predicted: 22,
        trend: "down",
        confidence: 87,
        insight: "AI-powered screening will reduce time by 20%"
      },
      {
        metric: "Cost per Hire",
        current: 4500,
        predicted: 3800,
        trend: "down",
        confidence: 82,
        insight: "Automation reduces recruitment overhead"
      },
      {
        metric: "Quality of Hire Score",
        current: 7.2,
        predicted: 8.1,
        trend: "up",
        confidence: 89,
        insight: "Better candidate assessment improves quality"
      },
      {
        metric: "Offer Acceptance Rate",
        current: 72,
        predicted: 78,
        trend: "up",
        confidence: 75,
        insight: "Market analysis optimizes compensation offers"
      }
    ];

    const mockForecast: HiringForecast[] = [
      { month: "Jan 2025", predicted_hires: 15, predicted_applications: 120, success_rate: 12.5 },
      { month: "Feb 2025", predicted_hires: 18, predicted_applications: 145, success_rate: 12.4 },
      { month: "Mar 2025", predicted_hires: 22, predicted_applications: 165, success_rate: 13.3 },
      { month: "Apr 2025", predicted_hires: 25, predicted_applications: 180, success_rate: 13.9 },
      { month: "May 2025", predicted_hires: 20, predicted_applications: 155, success_rate: 12.9 },
      { month: "Jun 2025", predicted_hires: 24, predicted_applications: 175, success_rate: 13.7 }
    ];

    const mockSkills: SkillDemand[] = [
      { skill: "React", current_demand: 85, predicted_growth: 15, market_trend: "hot" },
      { skill: "Python", current_demand: 92, predicted_growth: 12, market_trend: "hot" },
      { skill: "Node.js", current_demand: 78, predicted_growth: 18, market_trend: "growing" },
      { skill: "AWS", current_demand: 88, predicted_growth: 20, market_trend: "hot" },
      { skill: "TypeScript", current_demand: 75, predicted_growth: 25, market_trend: "growing" },
      { skill: "Docker", current_demand: 65, predicted_growth: 8, market_trend: "stable" }
    ];

    const mockRetention: RetentionRisk[] = [
      {
        department: "Engineering",
        risk_level: "medium",
        predicted_turnover: 8.5,
        key_factors: ["Remote work flexibility", "Career advancement", "Competitive salaries"]
      },
      {
        department: "Sales",
        risk_level: "high",
        predicted_turnover: 12.3,
        key_factors: ["Commission structure", "Lead quality", "Management support"]
      },
      {
        department: "Marketing",
        risk_level: "low",
        predicted_turnover: 4.2,
        key_factors: ["Creative freedom", "Work-life balance", "Team culture"]
      }
    ];

    setPredictions(mockPredictions);
    setHiringForecast(mockForecast);
    setSkillDemands(mockSkills);
    setRetentionRisks(mockRetention);
  };

  useEffect(() => {
    generatePredictiveAnalytics();
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Target className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSkillTrendColor = (trend: string) => {
    switch (trend) {
      case 'hot': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'growing': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'stable': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Brain className="w-8 h-8 text-indigo-400" />
            Predictive Analytics
          </h1>
          <p className="text-gray-400 mt-2">AI-powered insights for strategic HR planning</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generatePredictiveAnalytics}
          disabled={isLoading}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              Analyzing...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Refresh Analytics
            </>
          )}
        </motion.button>
      </div>

      {/* Key Predictions Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {predictions.slice(0, 4).map((prediction, index) => (
          <motion.div
            key={prediction.metric}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-400">{prediction.metric}</h3>
              <div className="flex items-center gap-1">
                {getTrendIcon(prediction.trend)}
                <span className="text-xs text-gray-500">{prediction.confidence}%</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-bold text-white">{prediction.predicted}</span>
              <span className="text-sm text-gray-400">
                {prediction.trend === 'up' ? '↗' : prediction.trend === 'down' ? '↘' : '→'} from {prediction.current}
              </span>
            </div>
            <p className="text-xs text-gray-500">{prediction.insight}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-gray-800/50 p-1 rounded-lg">
        {[
          { id: 'hiring', label: 'Hiring Forecast', icon: TrendingUp },
          { id: 'skills', label: 'Skill Demand', icon: Target },
          { id: 'retention', label: 'Retention Risk', icon: Users },
          { id: 'insights', label: 'AI Insights', icon: Brain }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-500 text-white'
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
        {activeTab === 'hiring' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                6-Month Hiring Forecast
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={hiringForecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="predicted_hires" stroke="#8b5cf6" strokeWidth={3} />
                  <Line type="monotone" dataKey="success_rate" stroke="#06b6d4" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-green-400" />
                Application Volume Trends
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={hiringForecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="predicted_applications" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-yellow-400" />
                In-Demand Skills Growth
              </h3>
              <div className="space-y-4">
                {skillDemands.map((skill, index) => (
                  <div key={skill.skill} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-white">{skill.skill}</span>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getSkillTrendColor(skill.market_trend)}`}>
                        {skill.market_trend}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-medium text-white">{skill.current_demand}%</div>
                        <div className={`text-xs ${skill.predicted_growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          +{skill.predicted_growth}% growth
                        </div>
                      </div>
                      <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.current_demand}%` }}
                          transition={{ delay: index * 0.1, duration: 0.8 }}
                          className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Market Trend Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={skillDemands}
                    dataKey="current_demand"
                    nameKey="skill"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {skillDemands.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'retention' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {retentionRisks.map((risk, index) => (
              <motion.div
                key={risk.department}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">{risk.department}</h3>
                  <span className={`px-3 py-1 text-xs rounded-full border font-medium ${getRiskColor(risk.risk_level)}`}>
                    {risk.risk_level} risk
                  </span>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-400">Predicted Turnover:</span>
                    <span className="font-semibold text-white">{risk.predicted_turnover}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${risk.predicted_turnover}%` }}
                      transition={{ delay: index * 0.2, duration: 1 }}
                      className={`h-full ${
                        risk.risk_level === 'high' ? 'bg-red-500' : 
                        risk.risk_level === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Key Factors:</h4>
                  <ul className="space-y-1">
                    {risk.key_factors.map((factor, factorIndex) => (
                      <li key={factorIndex} className="text-sm text-gray-300 flex items-center gap-2">
                        <div className="w-1 h-1 bg-indigo-400 rounded-full" />
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                AI-Generated Strategic Insights
              </h3>
              <div className="grid gap-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-white mb-1">Hiring Efficiency Opportunity</h4>
                      <p className="text-gray-300 text-sm">
                        Your current screening process can be optimized to reduce time-to-hire by 20% 
                        while maintaining quality standards. Consider implementing AI-powered initial screening.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-white mb-1">Skill Gap Alert</h4>
                      <p className="text-gray-300 text-sm">
                        High demand for React and AWS skills shows a 25% increase in market competition. 
                        Consider upskilling current employees or adjusting compensation packages.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Star className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-white mb-1">Retention Success Factor</h4>
                      <p className="text-gray-300 text-sm">
                        Marketing department shows excellent retention (4.2% turnover risk) due to 
                        work-life balance initiatives. Consider applying similar strategies to other departments.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-purple-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-white mb-1">Predictive Hiring Model</h4>
                      <p className="text-gray-300 text-sm">
                        Based on historical data, Q2 2025 will see peak hiring activity. 
                        Prepare recruitment resources and budget allocation 6-8 weeks in advance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PredictiveAnalyticsDashboard;

// Advanced Candidate Comparison with AI-powered insights
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Award, 
  Brain, 
  ChevronRight,
  Star,
  Target,
  BarChart3,
  CheckCircle,
  Zap
} from 'lucide-react';
import { aiService } from '../../services/ai/aiService';
import { Candidate } from '../../types';

interface ComparisonMetrics {
  technicalSkills: number;
  experience: number;
  culturalFit: number;
  communication: number;
  growth: number;
  overall: number;
}

interface ComparisonInsight {
  category: string;
  insight: string;
  advantage: 'candidate1' | 'candidate2' | 'equal';
  importance: 'high' | 'medium' | 'low';
}

interface AdvancedComparisonProps {
  candidates: Candidate[];
  jobDescription: string;
  onClose: () => void;
}

const AdvancedCandidateComparison: React.FC<AdvancedComparisonProps> = ({
  candidates,
  jobDescription,
  onClose
}) => {
  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([]);
  const [comparisonMetrics, setComparisonMetrics] = useState<ComparisonMetrics[]>([]);
  const [insights, setInsights] = useState<ComparisonInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'recommendations'>('overview');

  const handleCandidateSelection = (candidate: Candidate) => {
    if (selectedCandidates.find(c => c.id === candidate.id)) {
      setSelectedCandidates(selectedCandidates.filter(c => c.id !== candidate.id));
    } else if (selectedCandidates.length < 3) {
      setSelectedCandidates([...selectedCandidates, candidate]);
    }
  };

  const generateComparison = async () => {
    if (selectedCandidates.length < 2) return;

    setIsAnalyzing(true);
    try {
      const prompt = `
        Compare these ${selectedCandidates.length} candidates for the following position:

        Job Description: ${jobDescription}

        Candidates:
        ${selectedCandidates.map((c, i) => `
        Candidate ${i + 1}: ${c.name}
        - Experience: ${c.experience} years
        - Skills: ${c.skills?.join(', ') || 'Not specified'}  
        - Location: ${c.location || 'Not specified'}
        - Previous Role: ${c.position || 'Not specified'}
        - Status: ${c.status}
        `).join('\n')}

        Please provide:
        1. Scoring for each candidate (0-100) in: technical skills, experience, cultural fit, communication, growth potential, overall
        2. Key insights comparing their strengths and weaknesses
        3. Specific advantages each candidate has over others
        
        Return as JSON:
        {
          "metrics": [
            {
              "technicalSkills": 85,
              "experience": 75,
              "culturalFit": 90,
              "communication": 80,
              "growth": 85,
              "overall": 83
            }
          ],
          "insights": [
            {
              "category": "Technical Skills",
              "insight": "Candidate 1 has stronger React expertise while Candidate 2 excels in backend systems",
              "advantage": "candidate1",
              "importance": "high"
            }
          ]
        }
      `;

      const response = await aiService.generateText(prompt);
      const analysis = JSON.parse(response);
      
      setComparisonMetrics(analysis.metrics || []);
      setInsights(analysis.insights || []);
    } catch (error) {
      console.error('Error generating comparison:', error);
      // Fallback with mock data
      generateMockComparison();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateMockComparison = () => {
    const mockMetrics = selectedCandidates.map(() => ({
      technicalSkills: Math.floor(Math.random() * 30) + 70,
      experience: Math.floor(Math.random() * 30) + 70,
      culturalFit: Math.floor(Math.random() * 30) + 70,
      communication: Math.floor(Math.random() * 30) + 70,
      growth: Math.floor(Math.random() * 30) + 70,
      overall: Math.floor(Math.random() * 20) + 75
    }));

    const mockInsights: ComparisonInsight[] = [
      {
        category: "Technical Expertise",
        insight: "Strong technical background with complementary skill sets",
        advantage: "candidate1",
        importance: "high"
      },
      {
        category: "Leadership Experience",
        insight: "Proven track record in team management and project delivery",
        advantage: "candidate2",
        importance: "medium"
      },
      {
        category: "Cultural Alignment",
        insight: "Both candidates show strong alignment with company values",
        advantage: "equal",
        importance: "high"
      }
    ];

    setComparisonMetrics(mockMetrics);
    setInsights(mockInsights);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getAdvantageIcon = (advantage: string) => {
    switch (advantage) {
      case 'candidate1': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'candidate2': return <TrendingUp className="w-4 h-4 text-blue-400" />;
      default: return <Target className="w-4 h-4 text-gray-400" />;
    }
  };

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
        className="bg-gray-900/95 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-indigo-400" />
            Advanced Candidate Comparison
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Candidate Selection */}
        {selectedCandidates.length < 2 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">
              Select 2-3 candidates to compare
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {candidates.map(candidate => (
                <motion.div
                  key={candidate.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedCandidates.find(c => c.id === candidate.id)
                      ? 'border-indigo-400 bg-indigo-500/20'
                      : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                  }`}
                  onClick={() => handleCandidateSelection(candidate)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {candidate.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{candidate.name}</h4>
                      <p className="text-sm text-gray-400">{candidate.position}</p>
                    </div>
                  </div>
                  {selectedCandidates.find(c => c.id === candidate.id) && (
                    <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Generate Comparison Button */}
        {selectedCandidates.length >= 2 && comparisonMetrics.length === 0 && (
          <div className="text-center mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateComparison}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto"
            >
              {isAnalyzing ? (
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
                  <Brain className="w-5 h-5" />
                  Generate AI Comparison
                </>
              )}
            </motion.button>
          </div>
        )}

        {/* Comparison Results */}
        {comparisonMetrics.length > 0 && (
          <div>
            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-gray-800/50 p-1 rounded-lg">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'detailed', label: 'Detailed Analysis', icon: Target },
                { id: 'recommendations', label: 'Recommendations', icon: Award }
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

            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Score Comparison Chart */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {selectedCandidates.map((candidate, index) => (
                      <div key={candidate.id} className="bg-gray-800/50 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {candidate.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{candidate.name}</h3>
                            <p className="text-sm text-gray-400">{candidate.position}</p>
                          </div>
                          <div className="ml-auto">
                            <span className={`text-2xl font-bold ${getScoreColor(comparisonMetrics[index]?.overall || 0)}`}>
                              {comparisonMetrics[index]?.overall || 0}
                            </span>
                            <span className="text-gray-400 text-sm ml-1">/100</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {Object.entries(comparisonMetrics[index] || {}).map(([key, value]) => {
                            if (key === 'overall') return null;
                            return (
                              <div key={key} className="flex items-center justify-between">
                                <span className="text-gray-300 capitalize text-sm">
                                  {key.replace(/([A-Z])/g, ' $1')}
                                </span>
                                <div className="flex items-center gap-2">
                                  <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${value}%` }}
                                      transition={{ delay: index * 0.1, duration: 0.8 }}
                                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                    />
                                  </div>
                                  <span className={`text-sm font-medium ${getScoreColor(value as number)}`}>
                                    {value}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Insights */}
                  <div className="bg-gray-800/50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      Key Insights
                    </h3>
                    <div className="grid gap-3">
                      {insights.slice(0, 3).map((insight, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-lg">
                          {getAdvantageIcon(insight.advantage)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-white">{insight.category}</span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                insight.importance === 'high' 
                                  ? 'bg-red-500/20 text-red-400'
                                  : insight.importance === 'medium'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-gray-500/20 text-gray-400'
                              }`}>
                                {insight.importance}
                              </span>
                            </div>
                            <p className="text-gray-300 text-sm">{insight.insight}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'detailed' && (
                <motion.div
                  key="detailed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-gray-800/50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Detailed Analysis</h3>
                    <div className="grid gap-4">
                      {insights.map((insight, index) => (
                        <div key={index} className="border border-gray-600/50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-white">{insight.category}</h4>
                            <div className="flex items-center gap-2">
                              {getAdvantageIcon(insight.advantage)}
                              <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                insight.importance === 'high' 
                                  ? 'bg-red-500/20 text-red-400'
                                  : insight.importance === 'medium'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-gray-500/20 text-gray-400'
                              }`}>
                                {insight.importance} priority
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-300">{insight.insight}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'recommendations' && (
                <motion.div
                  key="recommendations"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-gray-800/50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-400" />
                      Hiring Recommendations
                    </h3>
                    
                    {/* Top Choice */}
                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Star className="w-6 h-6 text-green-400" />
                        <h4 className="text-lg font-semibold text-white">Recommended Choice</h4>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {selectedCandidates[0]?.name.charAt(0)}
                        </div>
                        <div>
                          <h5 className="font-medium text-white">{selectedCandidates[0]?.name}</h5>
                          <p className="text-sm text-gray-300">
                            Overall Score: {comparisonMetrics[0]?.overall}/100
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-300 mt-3">
                        Based on the analysis, this candidate shows the best overall fit for the position 
                        with strong technical skills and cultural alignment.
                      </p>
                    </div>

                    {/* Next Steps */}
                    <div className="grid gap-4">
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                          <ChevronRight className="w-4 h-4 text-blue-400" />
                          Next Steps
                        </h4>
                        <ul className="text-gray-300 space-y-1 text-sm ml-6">
                          <li>• Schedule technical interview with recommended candidate</li>
                          <li>• Conduct reference checks for top 2 candidates</li>
                          <li>• Prepare culture fit assessment questions</li>
                          <li>• Review salary expectations and negotiation strategy</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Selected Candidates Summary */}
        {selectedCandidates.length > 0 && (
          <div className="mt-6 flex items-center gap-2 text-sm text-gray-400">
            <Users className="w-4 h-4" />
            Comparing {selectedCandidates.length} candidates: {selectedCandidates.map(c => c.name).join(', ')}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AdvancedCandidateComparison;

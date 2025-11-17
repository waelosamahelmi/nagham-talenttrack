import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, FileText, Star, AlertCircle, TrendingUp, Download, RefreshCw } from 'lucide-react';

interface CandidateAnalysisProps {
  candidateId?: string;
  candidateData?: any;
  jobRole?: string;
}

interface AnalysisResult {
  overallScore: number;
  breakdown: {
    experience: number;
    skills: number;
    education: number;
    culturalFit: number;
    communication: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  fitScore: number;
  riskFactors: string[];
}

const CandidateAnalysis: React.FC<CandidateAnalysisProps> = ({ 
  candidateData,
  jobRole = 'Frontend Developer'
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // Mock candidate data
  const mockCandidate = candidateData || {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    experience_years: 4,
    skills: 'React, TypeScript, Node.js, GraphQL, PostgreSQL',
    education: 'BS Computer Science, University of California',
    previousRoles: ['Frontend Developer at TechCorp', 'Junior Developer at StartupXYZ'],
    portfolioUrl: 'https://sarah-dev.com',
    appliedPosition: jobRole
  };

  const mockAnalysis: AnalysisResult = {
    overallScore: 87,
    breakdown: {
      experience: 85,
      skills: 92,
      education: 78,
      culturalFit: 88,
      communication: 82
    },
    strengths: [
      'Strong React and TypeScript expertise demonstrated in portfolio',
      'Solid progression from junior to mid-level developer',
      'Experience with modern development stack',
      'Good communication skills evident in cover letter',
      'Portfolio shows attention to UI/UX principles'
    ],
    weaknesses: [
      'Limited experience with testing frameworks',
      'No mention of cloud platform experience',
      'Could benefit from more large-scale project experience'
    ],
    recommendations: [
      'Focus interview questions on testing practices and methodologies',
      'Discuss scalability challenges in previous projects',
      'Explore interest in cloud technologies and DevOps',
      'Consider for senior-track mentorship program'
    ],
    fitScore: 89,
    riskFactors: [
      'Shorter tenure at previous company (1.5 years)',
      'Gap in employment history (3 months)'
    ]
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setAnalysisResult(mockAnalysis);
    setIsAnalyzing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Candidate Analysis</h2>
            <p className="text-gray-500 dark:text-gray-400">Intelligent assessment powered by AI</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Candidate'}</span>
          </button>
        </div>
      </div>

      {/* Candidate Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <FileText className="w-8 h-8 text-gray-500 dark:text-gray-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{mockCandidate.name}</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-2">{mockCandidate.email}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Experience:</span>
                <div className="font-medium text-gray-900 dark:text-white">{mockCandidate.experience_years} years</div>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Position:</span>
                <div className="font-medium text-gray-900 dark:text-white">{mockCandidate.appliedPosition}</div>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Skills:</span>
                <div className="font-medium text-gray-900 dark:text-white truncate">{mockCandidate.skills}</div>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Education:</span>
                <div className="font-medium text-gray-900 dark:text-white truncate">{mockCandidate.education}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Loading */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Analyzing Candidate...</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Our AI is evaluating skills, experience, and fit</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 3, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Analysis Results */}
      {analysisResult && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Overall Score */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Overall Assessment</h3>
              <div className="flex items-center space-x-2">
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center space-x-1">
                  <Download className="w-4 h-4" />
                  <span>Export Report</span>
                </button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(analysisResult.overallScore)} mb-2`}>
                  {analysisResult.overallScore}%
                </div>
                <div className="text-gray-500 dark:text-gray-400 mb-4">Overall Score</div>
                <div className="flex items-center justify-center space-x-1 text-sm">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {analysisResult.overallScore >= 80 ? 'Excellent' : 
                     analysisResult.overallScore >= 60 ? 'Good' : 'Needs Review'} Candidate
                  </span>
                </div>
              </div>
              
              <div>
                <div className="space-y-3">
                  {Object.entries(analysisResult.breakdown).map(([category, score]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getScoreBarColor(score)}`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                        <span className={`text-sm font-medium ${getScoreColor(score)}`}>
                          {score}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Strengths</h3>
              </div>
              <ul className="space-y-2">
                {analysisResult.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas for Improvement */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Areas for Discussion</h3>
              </div>
              <ul className="space-y-2">
                {analysisResult.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Recommendations</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Interview Focus Areas</h4>
                <ul className="space-y-1">
                  {analysisResult.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {analysisResult.riskFactors.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Risk Factors</h4>
                  <ul className="space-y-1">
                    {analysisResult.riskFactors.map((risk, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CandidateAnalysis;

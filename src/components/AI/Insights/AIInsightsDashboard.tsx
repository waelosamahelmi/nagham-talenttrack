import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Target, Star, AlertTriangle } from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'trend' | 'recommendation' | 'alert' | 'prediction';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionItems?: string[];
  data?: any;
}

interface AIInsightsDashboardProps {
  insights?: AIInsight[];
}

const AIInsightsDashboard: React.FC<AIInsightsDashboardProps> = ({ insights = [] }) => {
  const mockInsights: AIInsight[] = [
    {
      id: '1',
      type: 'trend',
      title: 'Rising Demand for React Developers',
      description: 'Applications for React positions increased by 35% this month. Consider expanding React role postings.',
      impact: 'high',
      actionItems: [
        'Post additional React developer positions',
        'Update job descriptions to highlight React requirements',
        'Consider React bootcamp partnerships'
      ]
    },
    {
      id: '2',
      type: 'recommendation',
      title: 'Optimize Interview Process',
      description: 'Candidates are dropping out during the 3rd interview stage. Average interview duration may be too long.',
      impact: 'medium',
      actionItems: [
        'Review interview stage requirements',
        'Consider combining stages 2 and 3',
        'Gather candidate feedback on process length'
      ]
    },
    {
      id: '3',
      type: 'alert',
      title: 'Low Diversity in Pipeline',
      description: 'Current candidate pipeline shows 15% decrease in underrepresented groups compared to last quarter.',
      impact: 'high',
      actionItems: [
        'Review job posting platforms',
        'Partner with diversity-focused organizations',
        'Audit job description language for bias'
      ]
    },
    {
      id: '4',
      type: 'prediction',
      title: 'Hiring Goal Achievement',
      description: 'Based on current pipeline, you\'re 85% likely to meet Q3 hiring goals. 3 more hires needed.',
      impact: 'medium',
      actionItems: [
        'Accelerate top candidate interviews',
        'Consider expediting offer processes',
        'Review compensation packages for competitiveness'
      ]
    }
  ];

  const displayInsights = insights.length > 0 ? insights : mockInsights;

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return <TrendingUp className="w-5 h-5" />;
      case 'recommendation': return <Target className="w-5 h-5" />;
      case 'alert': return <AlertTriangle className="w-5 h-5" />;
      case 'prediction': return <Star className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  const getInsightColor = (type: string, impact: string) => {
    if (type === 'alert') return 'bg-red-500';
    if (impact === 'high') return 'bg-purple-500';
    if (impact === 'medium') return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getImpactBadge = (impact: 'high' | 'medium' | 'low') => {
    const colors: Record<'high' | 'medium' | 'low', string> = {
      high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[impact]}`}>
        {impact.toUpperCase()} IMPACT
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Insights</h2>
            <p className="text-gray-500 dark:text-gray-400">Intelligent recommendations for your hiring process</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Live Analysis</span>
          </div>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {displayInsights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              {/* Insight Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${getInsightColor(insight.type, insight.impact)} rounded-lg flex items-center justify-center text-white`}>
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {insight.title}
                    </h3>
                    {getImpactBadge(insight.impact)}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                {insight.description}
              </p>

              {/* Action Items */}
              {insight.actionItems && insight.actionItems.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Recommended Actions
                  </h4>
                  <ul className="space-y-2">
                    {insight.actionItems.map((action, actionIndex) => (
                      <li key={actionIndex} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Action Footer */}
            <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 rounded-b-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Generated by AI • Just now
                </span>
                <div className="flex space-x-2">
                  <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                    View Details
                  </button>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {displayInsights.filter(i => i.impact === 'high').length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">High Impact</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {displayInsights.filter(i => i.type === 'recommendation').length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Recommendations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {displayInsights.filter(i => i.type === 'alert').length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Alerts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">85%</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Accuracy Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsDashboard;

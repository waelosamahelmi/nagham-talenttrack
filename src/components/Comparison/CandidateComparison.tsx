import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Award, Brain, Target, X } from 'lucide-react';
import { aiService } from '../../services/ai/aiService';

interface Candidate {
  id: string;
  name: string;
  position: string;
  score: number;
  experience: number;
  skills: string[];
  education: string;
  location: string;
  avatar?: string;
  strengths: string[];
  concerns: string[];
  resume?: string;
}

interface ComparisonMetric {
  category: string;
  candidates: { [candidateId: string]: number };
  weight: number;
}

const CandidateComparison: React.FC = () => {
  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([]);
  const [availableCandidates, setAvailableCandidates] = useState<Candidate[]>([]);
  const [comparisonMetrics, setComparisonMetrics] = useState<ComparisonMetric[]>([]);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = () => {
    // Mock data - replace with actual API
    const mockCandidates: Candidate[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        position: 'Senior React Developer',
        score: 92,
        experience: 5,
        skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
        education: 'BS Computer Science',
        location: 'San Francisco, CA',
        strengths: ['Strong React expertise', 'Leadership experience', 'Open source contributions'],
        concerns: ['Limited backend experience', 'Salary expectations may be high']
      },
      {
        id: '2',
        name: 'Michael Chen',
        position: 'Full Stack Developer',
        score: 88,
        experience: 4,
        skills: ['React', 'Python', 'Django', 'PostgreSQL'],
        education: 'MS Software Engineering',
        location: 'Seattle, WA',
        strengths: ['Full stack capabilities', 'Database expertise', 'Quick learner'],
        concerns: ['Less frontend experience', 'Recent graduate with limited industry exposure']
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        position: 'Frontend Developer',
        score: 85,
        experience: 3,
        skills: ['React', 'Vue.js', 'CSS', 'JavaScript'],
        education: 'BS Web Development',
        location: 'Austin, TX',
        strengths: ['Excellent UI/UX sense', 'Modern framework knowledge', 'Creative problem solver'],
        concerns: ['Junior level experience', 'Limited testing experience']
      },
      {
        id: '4',
        name: 'David Kim',
        position: 'Senior Developer',
        score: 90,
        experience: 7,
        skills: ['React', 'Node.js', 'GraphQL', 'Docker'],
        education: 'BS Computer Engineering',
        location: 'New York, NY',
        strengths: ['Extensive experience', 'Architecture skills', 'Mentoring background'],
        concerns: ['May be overqualified', 'Previous job tenure concerns']
      }
    ];
    setAvailableCandidates(mockCandidates);
  };

  const addCandidateToComparison = (candidate: Candidate) => {
    if (selectedCandidates.length < 4 && !selectedCandidates.find(c => c.id === candidate.id)) {
      setSelectedCandidates([...selectedCandidates, candidate]);
    }
  };

  const removeCandidateFromComparison = (candidateId: string) => {
    setSelectedCandidates(selectedCandidates.filter(c => c.id !== candidateId));
    setAiInsights('');
  };

  const generateComparison = async () => {
    if (selectedCandidates.length < 2) return;

    setLoading(true);
    try {
      // Generate comparison metrics
      const metrics: ComparisonMetric[] = [
        {
          category: 'Technical Skills',
          candidates: selectedCandidates.reduce((acc, candidate) => ({
            ...acc,
            [candidate.id]: Math.min(100, candidate.score + Math.random() * 10 - 5)
          }), {}),
          weight: 0.4
        },
        {
          category: 'Experience Level',
          candidates: selectedCandidates.reduce((acc, candidate) => ({
            ...acc,
            [candidate.id]: Math.min(100, (candidate.experience / 10) * 100)
          }), {}),
          weight: 0.3
        },
        {
          category: 'Cultural Fit',
          candidates: selectedCandidates.reduce((acc, candidate) => ({
            ...acc,
            [candidate.id]: Math.floor(Math.random() * 30) + 70
          }), {}),
          weight: 0.2
        },
        {
          category: 'Growth Potential',
          candidates: selectedCandidates.reduce((acc, candidate) => ({
            ...acc,
            [candidate.id]: Math.floor(Math.random() * 25) + 75
          }), {}),
          weight: 0.1
        }
      ];

      setComparisonMetrics(metrics);

      // Generate AI insights
      const candidateData = selectedCandidates.map(c => ({
        name: c.name,
        score: c.score,
        experience: c.experience,
        skills: c.skills,
        strengths: c.strengths,
        concerns: c.concerns
      }));

      const prompt = `
        Analyze these candidates and provide detailed comparison insights:
        ${JSON.stringify(candidateData, null, 2)}
        
        Provide insights on:
        1. Overall ranking and why
        2. Best fit for different scenarios
        3. Key differentiators between candidates
        4. Recommendations for next steps
        
        Keep the response concise but comprehensive (2-3 paragraphs).
      `;

      const insights = await aiService.generateText(prompt);
      setAiInsights(insights);
    } catch (error) {
      console.error('Error generating comparison:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getBestInCategory = (metric: ComparisonMetric) => {
    return Object.entries(metric.candidates).reduce((best, [candidateId, score]) => {
      return score > best.score ? { candidateId, score } : best;
    }, { candidateId: '', score: -1 });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Candidate Comparison</h1>
        <div className="flex space-x-3">
          <span className="text-sm text-gray-500">
            {selectedCandidates.length}/4 candidates selected
          </span>
          {selectedCandidates.length >= 2 && (
            <button
              onClick={generateComparison}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Generate Comparison'}
            </button>
          )}
        </div>
      </div>

      {/* Available Candidates */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Available Candidates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableCandidates
            .filter(candidate => !selectedCandidates.find(c => c.id === candidate.id))
            .map((candidate) => (
              <div
                key={candidate.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => addCandidateToComparison(candidate)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getScoreColor(candidate.score)}`}>
                    {candidate.score}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{candidate.position}</p>
                <p className="text-xs text-gray-500">{candidate.experience} years • {candidate.location}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {candidate.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {skill}
                    </span>
                  ))}
                  {candidate.skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      +{candidate.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Selected Candidates for Comparison */}
      {selectedCandidates.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Comparison ({selectedCandidates.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {selectedCandidates.map((candidate) => (
              <div key={candidate.id} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                  <button
                    onClick={() => removeCandidateFromComparison(candidate.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${getScoreColor(candidate.score)} mb-2`}>
                  Score: {candidate.score}
                </span>
                <p className="text-sm text-gray-600 mb-1">{candidate.position}</p>
                <p className="text-xs text-gray-500 mb-2">{candidate.experience} years experience</p>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-green-700">Strengths:</p>
                    <ul className="text-xs text-gray-600">
                      {candidate.strengths.slice(0, 2).map((strength, index) => (
                        <li key={index}>• {strength}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium text-orange-700">Concerns:</p>
                    <ul className="text-xs text-gray-600">
                      {candidate.concerns.slice(0, 2).map((concern, index) => (
                        <li key={index}>• {concern}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparison Metrics */}
      {comparisonMetrics.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Comparison Metrics
          </h2>
          <div className="space-y-6">
            {comparisonMetrics.map((metric, index) => {
              const best = getBestInCategory(metric);
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{metric.category}</h3>
                    <span className="text-sm text-gray-500">Weight: {(metric.weight * 100).toFixed(0)}%</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {selectedCandidates.map((candidate) => {
                      const score = metric.candidates[candidate.id];
                      const isBest = candidate.id === best.candidateId;
                      return (
                        <div key={candidate.id} className={`p-3 rounded-lg border ${
                          isBest ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{candidate.name}</span>
                            {isBest && <Award className="w-4 h-4 text-green-600" />}
                          </div>
                          <div className="mt-1">
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold text-gray-900">{score.toFixed(0)}</span>
                              <span className="text-sm text-gray-500">/ 100</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div
                                className={`h-2 rounded-full ${isBest ? 'bg-green-500' : 'bg-blue-500'}`}
                                style={{ width: `${score}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Insights */}
      {aiInsights && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            AI Insights & Recommendations
          </h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-gray-700 whitespace-pre-line">{aiInsights}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateComparison;

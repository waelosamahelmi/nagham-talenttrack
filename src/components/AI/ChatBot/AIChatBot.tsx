import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Minimize2, Maximize2, User } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { aiService } from '../../../services/ai/aiService';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  data?: any;
}

interface AIChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  isMinimized: boolean;
}

const AIChatBot: React.FC<AIChatBotProps> = ({ isOpen, onClose, onMinimize, isMinimized }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hi! I\'m your AI HR assistant. I can help you with candidate analysis, generate reports, search through your database, and provide insights. What would you like to know?',
      timestamp: new Date(),
      suggestions: [
        'Show me top candidates this month',
        'Analyze hiring trends', 
        'Find candidates with React skills',
        'Generate interview questions'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await processAIQuery(content.trim());
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions,
        data: aiResponse.data
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I apologize, but I encountered an error processing your request. Please try again or rephrase your question.',
        timestamp: new Date(),
        suggestions: ['Try a different question', 'Check system status', 'Contact support']
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const processAIQuery = async (query: string): Promise<{
    content: string;
    suggestions?: string[];
    data?: any;
  }> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const intent = detectIntent(query);
    
    switch (intent.type) {
      case 'candidate_search':
        return await handleCandidateSearch(query);
      
      case 'analytics':
        return await handleAnalyticsQuery(query);
      
      case 'interview_questions':
        return await handleInterviewQuestions(query);
      
      case 'candidate_analysis':
        return await handleCandidateAnalysis(query);
      
      case 'general_question':
      default:
        return await handleGeneralQuery(query);
    }
  };

  const detectIntent = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('candidate') && (lowerQuery.includes('find') || lowerQuery.includes('search') || lowerQuery.includes('show'))) {
      return { type: 'candidate_search', params: { query: lowerQuery } };
    }
    
    if (lowerQuery.includes('trend') || lowerQuery.includes('analytics') || lowerQuery.includes('report') || lowerQuery.includes('metric')) {
      return { type: 'analytics', params: { query: lowerQuery } };
    }
    
    if (lowerQuery.includes('interview') && lowerQuery.includes('question')) {
      return { type: 'interview_questions', params: { query: lowerQuery } };
    }
    
    if (lowerQuery.includes('analyze') || lowerQuery.includes('score') || lowerQuery.includes('evaluate')) {
      return { type: 'candidate_analysis', params: { query: lowerQuery } };
    }
    
    return { type: 'general_question', params: { query: lowerQuery } };
  };

  const handleCandidateSearch = async (query: string) => {
    try {
      // Fetch real candidates from database
      let candidateQuery = supabase
        .from('candidates')
        .select(`
          id,
          name,
          email,
          status,
          experience_years,
          skills,
          phone,
          applications(
            id,
            status,
            positions(
              id,
              title,
              department
            )
          )
        `);

      // Extract search criteria from query
      const skillsMatch = query.match(/with\s+(\w+(?:\s+\w+)*)\s+skills?/i);
      const statusMatch = query.match(/status\s+(\w+)/i);
      const experienceMatch = query.match(/(\d+)\+?\s*years?\s*experience/i);

      // Apply filters based on query
      if (statusMatch) {
        const status = statusMatch[1];
        candidateQuery = candidateQuery.eq('status', status);
      }

      if (experienceMatch) {
        const years = parseInt(experienceMatch[1]);
        candidateQuery = candidateQuery.gte('experience_years', years);
      }

      const { data: candidates, error } = await candidateQuery.limit(20);

      if (error) {
        throw error;
      }

      let filteredCandidates = candidates || [];

      // Filter by skills if specified (client-side filtering since skills are arrays)
      if (skillsMatch && filteredCandidates.length > 0) {
        const skills = skillsMatch[1].split(/\s+and\s+|\s*,\s*/);
        filteredCandidates = filteredCandidates.filter(candidate => 
          skills.some(skill => 
            candidate.skills?.some((candidateSkill: string) => 
              candidateSkill.toLowerCase().includes(skill.toLowerCase())
            )
          )
        );
      }

      const resultCount = filteredCandidates.length;
      const topCandidates = filteredCandidates.slice(0, 5);

      let response = '';
      if (resultCount === 0) {
        response = `I couldn't find any candidates matching your criteria. Try adjusting your search terms.`;
      } else {
        response = `I found ${resultCount} candidate(s) matching your criteria. Here are the top ${Math.min(5, resultCount)}:\n\n`;
        
        topCandidates.forEach((candidate, index) => {
          const applications = candidate.applications || [];
          const currentPosition = applications.length > 0 
            ? `Applied to ${applications.length} position(s)`
            : 'No active applications';
          
          response += `${index + 1}. **${candidate.name}**\n`;
          response += `   - Email: ${candidate.email}\n`;
          response += `   - Status: ${candidate.status}\n`;
          response += `   - Experience: ${candidate.experience_years} years\n`;
          response += `   - Skills: ${candidate.skills?.join(', ') || 'Not specified'}\n`;
          response += `   - Applications: ${currentPosition}\n\n`;
        });
      }

      return {
        content: response,
        suggestions: [
          'Analyze these candidates',
          'Show more details',
          'Filter by different criteria',
          'Export candidate list'
        ],
        data: { candidates: filteredCandidates }
      };
    } catch (error) {
      console.error('Error searching candidates:', error);
      return {
        content: 'Sorry, I encountered an error while searching for candidates. Please try again.',
        suggestions: ['Try a simpler search', 'Check your connection', 'Contact support']
      };
    }
  };

  const handleAnalyticsQuery = async (query: string) => {
    try {
      // Fetch real analytics data from database
      const [
        candidatesResult,
        positionsResult,
        applicationsResult,
        interviewsResult
      ] = await Promise.all([
        supabase.from('candidates').select('id, status, created_at'),
        supabase.from('positions').select('id, status, created_at'),
        supabase.from('applications').select('id, status, created_at'),
        supabase.from('interviews').select('id, scheduled_for, status')
      ]);

      const candidates = candidatesResult.data || [];
      const positions = positionsResult.data || [];
      const applications = applicationsResult.data || [];
      const interviews = interviewsResult.data || [];

      // Calculate analytics
      const totalCandidates = candidates.length;
      const activePositions = positions.filter(p => p.status === 'open').length;
      const upcomingInterviews = interviews.filter(i => 
        new Date(i.scheduled_for) > new Date() && i.status !== 'cancelled'
      ).length;

      // Application pipeline breakdown
      const pipelineStatus = applications.reduce((acc: Record<string, number>, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {});

      let response = '📊 **Current HR Analytics:**\n\n';
      response += `• **Total Candidates:** ${totalCandidates}\n`;
      response += `• **Active Positions:** ${activePositions}\n`;
      response += `• **Upcoming Interviews:** ${upcomingInterviews}\n\n`;
      
      response += '**Application Pipeline Status:**\n';
      Object.entries(pipelineStatus).forEach(([status, count]) => {
        response += `• ${status.charAt(0).toUpperCase() + status.slice(1)}: ${count}\n`;
      });

      if (query.includes('trend')) {
        // Calculate monthly trends
        const thisMonth = new Date();
        const lastMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() - 1);
        
        const thisMonthApps = applications.filter(app => 
          new Date(app.created_at) >= lastMonth
        ).length;
        
        const lastMonthApps = applications.filter(app => {
          const appDate = new Date(app.created_at);
          return appDate >= new Date(thisMonth.getFullYear(), thisMonth.getMonth() - 2) && 
                 appDate < lastMonth;
        }).length;

        const growthRate = lastMonthApps > 0 ? ((thisMonthApps - lastMonthApps) / lastMonthApps * 100) : 0;
        
        response += '\n📈 **Trending Insights:**\n';
        response += `• Application volume is ${growthRate >= 0 ? 'up' : 'down'} ${Math.abs(growthRate).toFixed(1)}% this month\n`;
        response += `• Total applications this month: ${thisMonthApps}\n`;
        response += `• Active hiring pipeline shows ${activePositions} open positions\n`;
      }

      return {
        content: response,
        suggestions: [
          'Show hiring trends',
          'Compare with last month',
          'Generate detailed report',
          'Export analytics data'
        ]
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return {
        content: 'Sorry, I encountered an error while fetching analytics data. Please try again.',
        suggestions: ['Try again later', 'Check your connection', 'Contact support']
      };
    }
  };

  const handleInterviewQuestions = async (query: string) => {
    const roleMatch = query.match(/for\s+(?:a\s+)?(\w+(?:\s+\w+)*?)(?:\s+role|\s+position|$)/i);
    const role = roleMatch ? roleMatch[1] : 'General';
    
    const questions = {
      technical: [
        `What specific ${role.toLowerCase()} challenges have you solved recently?`,
        'Walk me through your problem-solving approach for complex issues.',
        'How do you stay updated with industry trends and technologies?'
      ],
      behavioral: [
        'Tell me about a time you had to work with a difficult team member.',
        'Describe a situation where you had to meet a tight deadline.',
        'How do you handle feedback and criticism?'
      ],
      situational: [
        `If you encountered a major ${role.toLowerCase()} challenge on your first week, how would you approach it?`,
        'How would you prioritize multiple urgent tasks?',
        'What would you do if you disagreed with your manager\'s decision?'
      ]
    };
    
    let response = `🎯 **Interview Questions for ${role} Role:**\n\n`;
    
    response += '**Technical Questions:**\n';
    questions.technical.forEach((q, i) => response += `${i + 1}. ${q}\n`);
    
    response += '\n**Behavioral Questions:**\n';
    questions.behavioral.forEach((q, i) => response += `${i + 1}. ${q}\n`);
    
    response += '\n**Situational Questions:**\n';
    questions.situational.forEach((q, i) => response += `${i + 1}. ${q}\n`);
    
    return {
      content: response,
      suggestions: [
        'Generate more questions',
        'Customize for specific candidate',
        'Add follow-up questions',
        'Create interview scorecard'
      ],
      data: { questions, role }
    };
  };

  const handleCandidateAnalysis = async (query?: string) => {
    try {
      // If specific candidate mentioned, try to find them
      const candidateNameMatch = query?.match(/analyze\s+([a-zA-Z\s]+?)(?:\s+for|\s*$)/i);
      
      if (candidateNameMatch) {
        const candidateName = candidateNameMatch[1].trim();
        
        // Search for the candidate
        const { data: candidates, error } = await supabase
          .from('candidates')
          .select(`
            id,
            name,
            email,
            experience_years,
            skills,
            status,
            applications(
              id,
              status,
              created_at,
              positions(
                title,
                department,
                required_skills
              )
            )
          `)
          .ilike('name', `%${candidateName}%`)
          .limit(5);

        if (error) throw error;

        if (candidates && candidates.length > 0) {
          const candidate = candidates[0];
          const skills = candidate.skills || [];
          const applications = candidate.applications || [];
          
          // Calculate analysis scores
          const experienceScore = Math.min(100, (candidate.experience_years || 0) * 15 + 40);
          const skillsScore = Math.min(100, skills.length * 12 + 50);
          const activityScore = applications.length > 0 ? 85 : 60;
          const overallScore = Math.round((experienceScore + skillsScore + activityScore) / 3);
          
          let response = `🔍 **Analysis for ${candidate.name}:**\n\n`;
          response += `**Overall Score:** ${overallScore}/100\n\n`;
          response += `**Details:**\n`;
          response += `• Experience: ${candidate.experience_years || 0} years (Score: ${experienceScore}/100)\n`;
          response += `• Skills: ${skills.length} listed (Score: ${skillsScore}/100)\n`;
          response += `• Activity: ${applications.length} application(s) (Score: ${activityScore}/100)\n`;
          response += `• Status: ${candidate.status}\n\n`;
          
          if (skills.length > 0) {
            response += `**Skills:** ${skills.join(', ')}\n\n`;
          }
          
          if (applications.length > 0) {
            response += `**Applications:**\n`;
            applications.slice(0, 3).forEach((app, index) => {
              const position = Array.isArray(app.positions) ? app.positions[0] : app.positions;
              response += `${index + 1}. ${position?.title || 'Unknown Position'} - Status: ${app.status}\n`;
            });
          }
          
          return {
            content: response,
            suggestions: [
              'Compare with similar candidates',
              'Generate interview questions',
              'View detailed profile',
              'Schedule interview'
            ],
            data: { candidate, analysis: { overallScore, experienceScore, skillsScore, activityScore } }
          };
        }
      }

      // Fallback: general analysis info
      let response = '🔍 **Candidate Analysis:**\n\n';
      response += 'To analyze a specific candidate, please provide:\n';
      response += '• Candidate name or ID\n';
      response += '• Position they\'re applying for\n';
      response += '• Specific analysis type (skills, experience, cultural fit)\n\n';
      response += 'Example: "Analyze John Smith for the Frontend Developer position"';
      
      return {
        content: response,
        suggestions: [
          'Analyze top candidates',
          'Compare candidates',
          'Score candidates by criteria',
          'Generate candidate reports'
        ]
      };
    } catch (error) {
      console.error('Error in candidate analysis:', error);
      return {
        content: 'Sorry, I encountered an error while analyzing the candidate. Please try again.',
        suggestions: ['Try again', 'Use different candidate name', 'Contact support']
      };
    }
  };

  const handleGeneralQuery = async (query?: string) => {
    try {
      // Get the last user message to provide context
      const userMessage = query || messages[messages.length - 1]?.content || 'Hi';
      
      console.log('🤖 AI Service Call - User message:', userMessage);
      
      // Create AI prompt with HR context
      const prompt = `You are an AI HR assistant for TalentTrack, an advanced recruitment platform. 
      
      User message: "${userMessage}"
      
      Respond as a helpful HR assistant. Keep responses concise, professional, and focused on HR/recruitment topics. 
      If asked general questions like "how are you" or casual conversation, politely redirect to HR-related topics while being friendly.
      
      Available capabilities:
      - Candidate search and analysis
      - Interview preparation and questions
      - Hiring analytics and trends
      - Recruitment process guidance
      - Team performance insights`;

      console.log('🤖 Calling AI service with prompt...');
      const aiResponse = await aiService.generateText(prompt);
      console.log('🤖 AI Response received:', aiResponse);
      
      return {
        content: aiResponse,
        suggestions: [
          'Show me candidate statistics',
          'Help with interview questions', 
          'Analyze hiring trends',
          'Find specific candidates'
        ]
      };
    } catch (error) {
      console.error('❌ AI service error:', error);
      
      // Fallback response
      const responses = [
        'I can help you with HR-related questions, candidate management, analytics, and recruitment insights. What specific information are you looking for?',
        'As your AI HR assistant, I\'m here to help with candidate screening, interview preparation, and workforce analytics. How can I assist you today?',
        'I specialize in talent acquisition and management. Feel free to ask about candidates, hiring processes, or team analytics.',
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      return {
        content: `${randomResponse}\n\n⚠️ *Note: AI service temporarily unavailable - using fallback response*`,
        suggestions: [
          'Show me candidate statistics',
          'Help with interview questions',
          'Analyze hiring trends', 
          'Find specific candidates'
        ]
      };
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`fixed bottom-4 right-4 z-50 ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
        }`}
      >
        <div className="h-full flex flex-col overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isLoading ? 'Thinking...' : 'Online'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={onMinimize}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex space-x-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === 'user' 
                          ? 'bg-blue-500' 
                          : 'bg-gradient-to-br from-purple-500 to-blue-600'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="w-3 h-3 text-white" />
                        ) : (
                          <Bot className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className={`rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-700'
                      }`}>
                        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                        
                        {message.suggestions && (
                          <div className="mt-2 space-y-1">
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="block text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="flex space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex space-x-2">
                  <input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSendMessage(inputValue)}
                    placeholder="Ask me anything about HR, candidates, or analytics..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    disabled={isLoading}
                  />
                  <button
                    onClick={() => handleSendMessage(inputValue)}
                    disabled={!inputValue.trim() || isLoading}
                    className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIChatBot;

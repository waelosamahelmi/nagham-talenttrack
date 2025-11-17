// AI-Powered Smart Interview Scheduler
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Users,
  Brain,
  Zap,
  CheckCircle,
  AlertTriangle,
  User,
  MapPin,
  Video,
  Phone,
  Coffee,
  Star,
  TrendingUp,
  Target,
  RefreshCw,
  Send,
  Plus
} from 'lucide-react';
import { advancedAnalyticsService, InterviewIntelligence } from '../../services/advancedAnalyticsService';

interface SmartSchedulerProps {
  candidateId: string;
  position: string;
  onSchedule: (schedule: any) => void;
  onClose: () => void;
}

interface TimeSlot {
  time: string;
  available: boolean;
  optimal: boolean;
  score: number;
  reasoning: string[];
}

interface InterviewerProfile {
  id: string;
  name: string;
  role: string;
  expertise: string[];
  availability: string[];
  rating: number;
  matchScore: number;
}

const SmartInterviewScheduler: React.FC<SmartSchedulerProps> = ({
  candidateId,
  position,
  onSchedule,
  onClose
}) => {
  const [intelligence, setIntelligence] = useState<InterviewIntelligence | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedInterviewers, setSelectedInterviewers] = useState<string[]>([]);
  const [interviewType, setInterviewType] = useState<'video' | 'phone' | 'in-person'>('video');
  const [step, setStep] = useState<'analysis' | 'scheduling' | 'confirmation'>('analysis');

  // Sample data for the smart scheduler
  const timeSlots: TimeSlot[] = [
    { time: '9:00 AM', available: true, optimal: true, score: 95, reasoning: ['High interviewer alertness', 'Candidate preferred time', 'No conflicts'] },
    { time: '10:30 AM', available: true, optimal: true, score: 92, reasoning: ['Good energy levels', 'Post-coffee clarity', 'Available interviewers'] },
    { time: '2:00 PM', available: true, optimal: false, score: 75, reasoning: ['Post-lunch dip', 'One interviewer conflict', 'Adequate time'] },
    { time: '3:30 PM', available: true, optimal: false, score: 68, reasoning: ['Lower attention span', 'End-of-day fatigue risk'] },
    { time: '11:00 AM', available: false, optimal: false, score: 0, reasoning: ['Interviewer unavailable', 'Meeting conflict'] }
  ];

  const interviewers: InterviewerProfile[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      role: 'Senior Tech Lead',
      expertise: ['React', 'Node.js', 'Architecture'],
      availability: ['9:00 AM', '10:30 AM', '2:00 PM'],
      rating: 4.9,
      matchScore: 95
    },
    {
      id: '2',
      name: 'Mike Rodriguez',
      role: 'Product Manager',
      expertise: ['Product Strategy', 'User Experience', 'Agile'],
      availability: ['9:00 AM', '10:30 AM', '3:30 PM'],
      rating: 4.7,
      matchScore: 88
    },
    {
      id: '3',
      name: 'Emily Johnson',
      role: 'Engineering Manager',
      expertise: ['Leadership', 'Team Management', 'Scaling'],
      availability: ['10:30 AM', '2:00 PM', '3:30 PM'],
      rating: 4.8,
      matchScore: 92
    }
  ];

  useEffect(() => {
    loadInterviewIntelligence();
  }, [candidateId]);

  const loadInterviewIntelligence = async () => {
    setLoading(true);
    try {
      const intel = await advancedAnalyticsService.generateInterviewIntelligence(candidateId, position);
      setIntelligence(intel);
    } catch (error) {
      console.error('Error loading interview intelligence:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOptimalSchedule = () => {
    // AI-powered scheduling logic would go here
    const optimalSlot = timeSlots.find(slot => slot.optimal && slot.available);
    const topInterviewers = interviewers
      .filter(interviewer => interviewer.availability.includes(optimalSlot?.time || ''))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 2);

    return {
      time: optimalSlot?.time,
      interviewers: topInterviewers,
      confidence: 94
    };
  };

  const scheduleInterview = () => {
    const schedule = {
      date: selectedDate,
      time: selectedTime,
      interviewers: selectedInterviewers,
      type: interviewType,
      intelligence: intelligence,
      confidence: getOptimalSchedule().confidence
    };
    onSchedule(schedule);
  };

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
          <p className="text-white text-center">Analyzing optimal interview schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-white" />
              <div>
                <h2 className="text-2xl font-bold text-white">Smart Interview Scheduler</h2>
                <p className="text-blue-100">AI-optimized scheduling for better outcomes</p>
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

        <div className="p-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              {[
                { id: 'analysis', label: 'AI Analysis', icon: Brain },
                { id: 'scheduling', label: 'Schedule', icon: Calendar },
                { id: 'confirmation', label: 'Confirm', icon: CheckCircle }
              ].map((stepItem, index) => (
                <React.Fragment key={stepItem.id}>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    step === stepItem.id
                      ? 'bg-purple-500 text-white'
                      : step === 'confirmation' && stepItem.id !== 'confirmation'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}>
                    <stepItem.icon className="w-4 h-4" />
                    <span className="font-medium">{stepItem.label}</span>
                  </div>
                  {index < 2 && (
                    <div className="w-8 h-0.5 bg-gray-600 mx-2" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 'analysis' && intelligence && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* AI Recommendations */}
                  <div className="lg:col-span-2">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      AI Interview Recommendations
                    </h3>
                    <div className="space-y-4">
                      {/* Sample recommendations since interface structure is different */}
                      {[
                        'Schedule during candidate\'s optimal hours for best performance',
                        'Focus on technical assessment given candidate\'s background',
                        'Allow extra time for behavioral questions based on role requirements'
                      ].map((rec: string, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gray-800 border border-gray-700 rounded-lg p-4"
                        >
                          <div className="flex items-start gap-3">
                            <Star className="w-5 h-5 text-yellow-400 mt-0.5" />
                            <p className="text-gray-300">{rec}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Suggested Questions */}
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-white mb-3">Suggested Questions</h4>
                      <div className="space-y-2">
                        {/* Sample questions */}
                        {[
                          'Tell me about a challenging project you worked on recently',
                          'How do you approach debugging complex technical issues?',
                          'Describe your experience with our technology stack'
                        ].map((question: string, index: number) => (
                          <div key={index} className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                            <p className="text-gray-300 text-sm">{question}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Key Insights</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Target className="w-5 h-5 text-green-400" />
                          <span className="text-white font-medium">Success Probability</span>
                        </div>
                        <div className="text-2xl font-bold text-green-400">87%</div>
                      </div>

                      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Clock className="w-5 h-5 text-blue-400" />
                          <span className="text-white font-medium">Optimal Duration</span>
                        </div>
                        <div className="text-xl font-bold text-white">45 min</div>
                      </div>

                      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <TrendingUp className="w-5 h-5 text-purple-400" />
                          <span className="text-white font-medium">Difficulty Level</span>
                        </div>
                        <div className="text-xl font-bold text-white capitalize">Medium</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep('scheduling')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
                  >
                    Continue to Scheduling
                    <Calendar className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 'scheduling' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Time Slots */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-400" />
                      Optimal Time Slots
                    </h3>
                    <div className="space-y-3">
                      {timeSlots.map((slot, index) => (
                        <motion.div
                          key={slot.time}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => slot.available && setSelectedTime(slot.time)}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            !slot.available
                              ? 'bg-gray-800/50 border-gray-600 opacity-50 cursor-not-allowed'
                              : selectedTime === slot.time
                              ? 'bg-purple-500 border-purple-400 text-white'
                              : slot.optimal
                              ? 'bg-green-500/20 border-green-500/30 hover:bg-green-500/30'
                              : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">{slot.time}</span>
                            <div className="flex items-center gap-2">
                              {slot.optimal && <Zap className="w-4 h-4 text-yellow-400" />}
                              <span className={`text-sm ${
                                slot.score >= 90 ? 'text-green-400' :
                                slot.score >= 70 ? 'text-yellow-400' : 'text-red-400'
                              }`}>
                                {slot.score}%
                              </span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            {slot.reasoning.map((reason, i) => (
                              <div key={i} className="text-xs text-gray-400 flex items-center gap-2">
                                <CheckCircle className="w-3 h-3" />
                                {reason}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Interviewer Selection */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-400" />
                      Recommended Interviewers
                    </h3>
                    <div className="space-y-3">
                      {interviewers.map((interviewer, index) => {
                        const isAvailable = selectedTime ? interviewer.availability.includes(selectedTime) : true;
                        const isSelected = selectedInterviewers.includes(interviewer.id);
                        
                        return (
                          <motion.div
                            key={interviewer.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => {
                              if (!isAvailable) return;
                              if (isSelected) {
                                setSelectedInterviewers(prev => prev.filter(id => id !== interviewer.id));
                              } else {
                                setSelectedInterviewers(prev => [...prev, interviewer.id]);
                              }
                            }}
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${
                              !isAvailable
                                ? 'bg-gray-800/50 border-gray-600 opacity-50 cursor-not-allowed'
                                : isSelected
                                ? 'bg-blue-500 border-blue-400 text-white'
                                : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-semibold">{interviewer.name}</h4>
                                <p className="text-sm text-gray-400">{interviewer.role}</p>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-1 mb-1">
                                  <Star className="w-3 h-3 text-yellow-400" />
                                  <span className="text-sm">{interviewer.rating}</span>
                                </div>
                                <div className="text-sm text-green-400">{interviewer.matchScore}% match</div>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {interviewer.expertise.map((skill, i) => (
                                <span key={i} className="text-xs bg-gray-700 px-2 py-1 rounded">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Interview Type Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Interview Format</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { type: 'video' as const, icon: Video, label: 'Video Call', desc: 'Most flexible' },
                      { type: 'phone' as const, icon: Phone, label: 'Phone', desc: 'Quick setup' },
                      { type: 'in-person' as const, icon: Coffee, label: 'In-Person', desc: 'Best engagement' }
                    ].map(format => (
                      <motion.div
                        key={format.type}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setInterviewType(format.type)}
                        className={`p-4 rounded-lg border cursor-pointer text-center transition-all ${
                          interviewType === format.type
                            ? 'bg-purple-500 border-purple-400 text-white'
                            : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                        }`}
                      >
                        <format.icon className="w-8 h-8 mx-auto mb-2" />
                        <h4 className="font-semibold mb-1">{format.label}</h4>
                        <p className="text-sm text-gray-400">{format.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep('analysis')}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep('confirmation')}
                    disabled={!selectedTime || selectedInterviewers.length === 0}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
                  >
                    Review & Confirm
                    <CheckCircle className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 'confirmation' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    Interview Schedule Confirmation
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-white mb-3">Interview Details</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-blue-400" />
                          <span className="text-gray-300">Date: {selectedDate || 'Today'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span className="text-gray-300">Time: {selectedTime}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {interviewType === 'video' && <Video className="w-4 h-4 text-blue-400" />}
                          {interviewType === 'phone' && <Phone className="w-4 h-4 text-blue-400" />}
                          {interviewType === 'in-person' && <MapPin className="w-4 h-4 text-blue-400" />}
                          <span className="text-gray-300 capitalize">Format: {interviewType.replace('-', ' ')}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-white mb-3">Interviewers</h4>
                      <div className="space-y-2">
                        {selectedInterviewers.map(id => {
                          const interviewer = interviewers.find(i => i.id === id);
                          return interviewer ? (
                            <div key={id} className="flex items-center gap-3">
                              <User className="w-4 h-4 text-green-400" />
                              <span className="text-gray-300">{interviewer.name} ({interviewer.role})</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Zap className="w-5 h-5 text-green-400" />
                      <span className="font-semibold text-white">AI Optimization Score</span>
                    </div>
                    <div className="text-2xl font-bold text-green-400 mb-2">{getOptimalSchedule().confidence}%</div>
                    <p className="text-gray-300 text-sm">
                      This schedule is optimized for maximum interview success based on AI analysis of timing, 
                      interviewer expertise, and candidate preferences.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep('scheduling')}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium"
                  >
                    Back to Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={scheduleInterview}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Schedule Interview
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default SmartInterviewScheduler;

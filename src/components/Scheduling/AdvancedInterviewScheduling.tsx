// Advanced Interview Scheduling with AI-powered optimization
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Video, 
  Brain,
  ChevronRight,
  ChevronLeft,
  Star,
  Zap,
  CheckCircle,
  Phone,
  Coffee,
  Building
} from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { aiService } from '../../services/ai/aiService';
import { Candidate } from '../../types';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
  interviewer?: string;
  room?: string;
  type: 'video' | 'in-person' | 'phone';
}

interface InterviewerAvailability {
  id: string;
  name: string;
  role: string;
  expertise: string[];
  availability: {
    [date: string]: TimeSlot[];
  };
  preference: 'morning' | 'afternoon' | 'flexible';
}

interface OptimalSchedule {
  candidateId: string;
  dateTime: string;
  interviewer: string;
  type: 'video' | 'in-person' | 'phone';
  duration: number;
  room?: string;
  reasoning: string;
  score: number;
}

interface AdvancedSchedulingProps {
  candidate: Candidate;
  onClose: () => void;
  onSchedule: (schedule: OptimalSchedule) => void;
}

const AdvancedInterviewScheduling: React.FC<AdvancedSchedulingProps> = ({
  candidate,
  onClose,
  onSchedule
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [interviewers, setInterviewers] = useState<InterviewerAvailability[]>([]);
  const [optimalSchedules, setOptimalSchedules] = useState<OptimalSchedule[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<OptimalSchedule | null>(null);
  const [interviewType, setInterviewType] = useState<'technical' | 'behavioral' | 'cultural' | 'final'>('technical');

  // Mock interviewer data - in real app, this would come from API
  useEffect(() => {
    const mockInterviewers: InterviewerAvailability[] = [
      {
        id: '1',
        name: 'Sarah Chen',
        role: 'Senior Tech Lead',
        expertise: ['React', 'Node.js', 'System Design', 'Team Leadership'],
        availability: generateMockAvailability(),
        preference: 'morning'
      },
      {
        id: '2',
        name: 'Marcus Rodriguez',
        role: 'Engineering Manager',
        expertise: ['Architecture', 'Scalability', 'Mentoring', 'Product Strategy'],
        availability: generateMockAvailability(),
        preference: 'afternoon'
      },
      {
        id: '3',
        name: 'Emily Davis',
        role: 'HR Business Partner',
        expertise: ['Cultural Fit', 'Behavioral Assessment', 'Communication'],
        availability: generateMockAvailability(),
        preference: 'flexible'
      },
      {
        id: '4',
        name: 'David Kumar',
        role: 'CTO',
        expertise: ['Strategic Vision', 'Technical Leadership', 'Final Decisions'],
        availability: generateMockAvailability(),
        preference: 'morning'
      }
    ];

    setInterviewers(mockInterviewers);
  }, []);

  const generateMockAvailability = () => {
    const availability: { [date: string]: TimeSlot[] } = {};
    
    for (let i = 0; i < 14; i++) {
      const date = format(addDays(new Date(), i), 'yyyy-MM-dd');
      availability[date] = [
        {
          id: `${date}-09`,
          startTime: '09:00',
          endTime: '10:00',
          available: Math.random() > 0.3,
          type: 'video',
          room: 'Conference Room A'
        },
        {
          id: `${date}-10`,
          startTime: '10:30',
          endTime: '11:30',
          available: Math.random() > 0.3,
          type: 'in-person',
          room: 'Conference Room B'
        },
        {
          id: `${date}-14`,
          startTime: '14:00',
          endTime: '15:00',
          available: Math.random() > 0.3,
          type: 'video'
        },
        {
          id: `${date}-15`,
          startTime: '15:30',
          endTime: '16:30',
          available: Math.random() > 0.3,
          type: 'in-person',
          room: 'Conference Room C'
        }
      ];
    }
    
    return availability;
  };

  const generateOptimalSchedules = async () => {
    setIsAnalyzing(true);
    
    try {
      const prompt = `
        Generate optimal interview schedules for candidate ${candidate.name} (${candidate.position}).
        
        Interview Type: ${interviewType}
        Candidate Skills: ${candidate.skills?.join(', ') || 'Not specified'}
        Candidate Experience: ${candidate.experience} years
        
        Available Interviewers:
        ${interviewers.map(i => `
        - ${i.name} (${i.role}): Expertise in ${i.expertise.join(', ')}, Prefers ${i.preference} slots
        `).join('\n')}
        
        Consider:
        1. Match interviewer expertise with candidate background
        2. Interview type requirements (${interviewType})
        3. Interviewer preferences and availability
        4. Optimal scheduling for candidate experience
        
        Return top 3 scheduling options as JSON:
        {
          "schedules": [
            {
              "candidateId": "${candidate.id}",
              "dateTime": "2024-01-15 10:00",
              "interviewer": "Sarah Chen",
              "type": "video",
              "duration": 60,
              "room": "Conference Room A",
              "reasoning": "Perfect match between interviewer expertise and candidate skills",
              "score": 95
            }
          ]
        }
      `;

      const response = await aiService.generateText(prompt);
      const analysis = JSON.parse(response);
      
      setOptimalSchedules(analysis.schedules || []);
    } catch (error) {
      console.error('Error generating optimal schedules:', error);
      generateMockSchedules();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateMockSchedules = () => {
    const mockSchedules: OptimalSchedule[] = [
      {
        candidateId: candidate.id,
        dateTime: format(addDays(new Date(), 2), 'yyyy-MM-dd') + ' 10:00',
        interviewer: 'Sarah Chen',
        type: 'video',
        duration: 60,
        room: 'Conference Room A',
        reasoning: 'Perfect expertise match with React and Node.js background. Morning slot aligns with interviewer preference.',
        score: 95
      },
      {
        candidateId: candidate.id,
        dateTime: format(addDays(new Date(), 3), 'yyyy-MM-dd') + ' 14:30',
        interviewer: 'Marcus Rodriguez',
        type: 'in-person',
        duration: 60,
        room: 'Conference Room B',
        reasoning: 'Engineering manager with architectural expertise. Good for senior-level technical discussion.',
        score: 88
      },
      {
        candidateId: candidate.id,
        dateTime: format(addDays(new Date(), 1), 'yyyy-MM-dd') + ' 15:00',
        interviewer: 'Emily Davis',
        type: 'video',
        duration: 45,
        reasoning: 'HR assessment for cultural fit and communication skills. Flexible timing works well.',
        score: 82
      }
    ];

    setOptimalSchedules(mockSchedules);
  };

  const getWeekDays = () => {
    const start = startOfWeek(currentWeek);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const getInterviewTypeColor = (type: string) => {
    switch (type) {
      case 'technical': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'behavioral': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cultural': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'final': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'in-person': return <Building className="w-4 h-4" />;
      default: return <Video className="w-4 h-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-yellow-400';
    return 'text-red-400';
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
        className="bg-gray-900/95 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Calendar className="w-8 h-8 text-indigo-400" />
              Smart Interview Scheduling
            </h2>
            <p className="text-gray-400 mt-1">
              AI-powered optimal scheduling for {candidate.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Interview Type Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Interview Type</h3>
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'technical', label: 'Technical', icon: Brain },
              { id: 'behavioral', label: 'Behavioral', icon: Users },
              { id: 'cultural', label: 'Cultural Fit', icon: Coffee },
              { id: 'final', label: 'Final Round', icon: Star }
            ].map(type => (
              <motion.button
                key={type.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setInterviewType(type.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium transition-all ${
                  interviewType === type.id
                    ? getInterviewTypeColor(type.id)
                    : 'border-gray-600 bg-gray-800/50 text-gray-400 hover:border-gray-500'
                }`}
              >
                <type.icon className="w-4 h-4" />
                {type.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Generate Optimal Schedules */}
        <div className="mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generateOptimalSchedules}
            disabled={isAnalyzing}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Finding Optimal Times...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Generate AI Recommendations
              </>
            )}
          </motion.button>
        </div>

        {/* Optimal Schedule Recommendations */}
        {optimalSchedules.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Recommended Schedule Options
            </h3>
            <div className="grid gap-4">
              {optimalSchedules.map((schedule, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedSchedule?.dateTime === schedule.dateTime
                      ? 'border-indigo-400 bg-indigo-500/20'
                      : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedSchedule(schedule)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-indigo-400" />
                          <span className="font-medium text-white">
                            {format(new Date(schedule.dateTime), 'MMM dd, yyyy')} at{' '}
                            {format(new Date(schedule.dateTime), 'h:mm a')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-green-400" />
                          <span className="text-gray-300">{schedule.interviewer}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getMeetingTypeIcon(schedule.type)}
                          <span className="text-gray-300 capitalize">{schedule.type}</span>
                        </div>
                        {schedule.room && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-400" />
                            <span className="text-gray-300">{schedule.room}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{schedule.reasoning}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-400">{schedule.duration} minutes</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(schedule.score)}`}>
                        {schedule.score}
                      </div>
                      <div className="text-gray-400 text-xs">Match Score</div>
                    </div>
                  </div>

                  {selectedSchedule?.dateTime === schedule.dateTime && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-gray-600/50"
                    >
                      <div className="flex justify-end gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedSchedule(null)}
                          className="px-4 py-2 border border-gray-600 rounded-lg text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onSchedule(schedule)}
                          className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Confirm Interview
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Calendar View (Optional) */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Available Time Slots</h3>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
                className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-400" />
              </motion.button>
              <span className="text-gray-300 min-w-[120px] text-center">
                {format(currentWeek, 'MMM yyyy')}
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
                className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-sm">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-gray-400 font-medium p-2">
                {day}
              </div>
            ))}
            {getWeekDays().map(day => (
              <motion.div
                key={day.toISOString()}
                whileHover={{ scale: 1.05 }}
                className={`p-2 rounded-lg cursor-pointer transition-all ${
                  isSameDay(day, selectedDate)
                    ? 'bg-indigo-500 text-white'
                    : 'hover:bg-gray-700/50 text-gray-300'
                }`}
                onClick={() => setSelectedDate(day)}
              >
                {format(day, 'd')}
                <div className="mt-1 flex justify-center">
                  {Math.random() > 0.6 ? (
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                  ) : Math.random() > 0.3 ? (
                    <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                  ) : (
                    <div className="w-2 h-2 bg-gray-600 rounded-full" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>{interviewers.length} Available Interviewers</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>Average: 60 minutes</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Star className="w-4 h-4 text-yellow-400" />
            <span>AI Optimization: {optimalSchedules.length > 0 ? 'Active' : 'Pending'}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdvancedInterviewScheduling;

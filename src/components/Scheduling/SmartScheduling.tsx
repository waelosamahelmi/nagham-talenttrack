import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, Video, Phone, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { format, addDays, startOfWeek, addWeeks } from 'date-fns';

interface Interview {
  id: string;
  candidateName: string;
  candidateEmail: string;
  position: string;
  type: 'phone' | 'video' | 'in-person';
  date: string;
  time: string;
  duration: number;
  interviewer: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  location?: string;
  meetingLink?: string;
  notes?: string;
  reminder?: boolean;
}

interface TimeSlot {
  time: string;
  available: boolean;
  interview?: Interview;
}

const SmartScheduling: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()));
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInterviews();
    generateTimeSlots();
  }, [selectedDate]);

  const loadInterviews = () => {
    setLoading(true);
    // Mock data - replace with actual API
    setTimeout(() => {
      const mockInterviews: Interview[] = [
        {
          id: '1',
          candidateName: 'Sarah Johnson',
          candidateEmail: 'sarah.johnson@email.com',
          position: 'Senior React Developer',
          type: 'video',
          date: format(new Date(), 'yyyy-MM-dd'),
          time: '10:00',
          duration: 60,
          interviewer: 'John Smith',
          status: 'confirmed',
          meetingLink: 'https://meet.google.com/abc-defg-hij',
          reminder: true
        },
        {
          id: '2',
          candidateName: 'Michael Chen',
          candidateEmail: 'michael.chen@email.com',
          position: 'Full Stack Developer',
          type: 'in-person',
          date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
          time: '14:00',
          duration: 90,
          interviewer: 'Jane Doe',
          status: 'scheduled',
          location: 'Conference Room A',
          reminder: false
        },
        {
          id: '3',
          candidateName: 'Emily Rodriguez',
          candidateEmail: 'emily.rodriguez@email.com',
          position: 'Frontend Developer',
          type: 'phone',
          date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
          time: '11:30',
          duration: 45,
          interviewer: 'Bob Wilson',
          status: 'completed'
        }
      ];
      setInterviews(mockInterviews);
      setLoading(false);
    }, 1000);
  };

  const generateTimeSlots = () => {
    const slots: TimeSlot[] = [];
    const workHours = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', 
                       '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];
    
    workHours.forEach(time => {
      const interview = interviews.find(i => 
        i.date === format(selectedDate, 'yyyy-MM-dd') && i.time === time
      );
      
      slots.push({
        time,
        available: !interview,
        interview
      });
    });
    
    setTimeSlots(slots);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'scheduled':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'rescheduled':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4 text-blue-500" />;
      case 'phone':
        return <Phone className="w-4 h-4 text-green-500" />;
      case 'in-person':
        return <MapPin className="w-4 h-4 text-purple-500" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-400" />;
    }
  };

  const sendReminder = async (interviewId: string) => {
    // Mock API call
    console.log(`Sending reminder for interview ${interviewId}`);
    setInterviews(interviews.map(interview => 
      interview.id === interviewId 
        ? { ...interview, reminder: true }
        : interview
    ));
  };

  const rescheduleInterview = (interviewId: string) => {
    // Mock rescheduling
    setInterviews(interviews.map(interview => 
      interview.id === interviewId 
        ? { ...interview, status: 'rescheduled' as const }
        : interview
    ));
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Smart Interview Scheduling</h1>
        <button
          onClick={() => setShowScheduleModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Schedule Interview
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Calendar className="w-6 h-6 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Today's Interviews</p>
              <p className="text-xl font-semibold">
                {interviews.filter(i => i.date === format(new Date(), 'yyyy-MM-dd')).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Confirmed</p>
              <p className="text-xl font-semibold">
                {interviews.filter(i => i.status === 'confirmed').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Clock className="w-6 h-6 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-xl font-semibold">
                {interviews.filter(i => i.status === 'scheduled').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Users className="w-6 h-6 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-xl font-semibold">
                {interviews.filter(i => {
                  const interviewDate = new Date(i.date);
                  return interviewDate >= currentWeek && interviewDate < addWeeks(currentWeek, 1);
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Weekly Calendar</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentWeek(addWeeks(currentWeek, -1))}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-7 gap-4">
            {weekDays.map((day, index) => {
              const dayInterviews = interviews.filter(i => i.date === format(day, 'yyyy-MM-dd'));
              const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
              
              return (
                <div key={index} className="min-h-[200px]">
                  <div className={`text-center p-2 rounded-t-lg ${
                    isToday ? 'bg-blue-100 text-blue-900' : 'bg-gray-50 text-gray-700'
                  }`}>
                    <div className="font-medium">{format(day, 'EEE')}</div>
                    <div className="text-lg font-semibold">{format(day, 'd')}</div>
                  </div>
                  <div className="border border-t-0 border-gray-200 rounded-b-lg p-2 space-y-1 min-h-[160px]">
                    {dayInterviews.map((interview) => (
                      <div
                        key={interview.id}
                        className="p-2 rounded bg-blue-50 border border-blue-200 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{interview.time}</span>
                          {getTypeIcon(interview.type)}
                        </div>
                        <div className="text-gray-700 mt-1 truncate">
                          {interview.candidateName}
                        </div>
                        <div className="flex items-center mt-1">
                          {getStatusIcon(interview.status)}
                          <span className="ml-1 text-gray-600 capitalize">
                            {interview.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h2>
        <div className="space-y-3">
          {interviews
            .filter(i => i.date === format(selectedDate, 'yyyy-MM-dd'))
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((interview) => (
              <div key={interview.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-semibold text-gray-900">{interview.time}</span>
                    <span className="text-xs text-gray-500">{interview.duration}min</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{interview.candidateName}</h3>
                      {getStatusIcon(interview.status)}
                      {getTypeIcon(interview.type)}
                    </div>
                    <p className="text-sm text-gray-600">{interview.position}</p>
                    <p className="text-sm text-gray-500">Interviewer: {interview.interviewer}</p>
                    {interview.location && (
                      <p className="text-sm text-gray-500 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {interview.location}
                      </p>
                    )}
                    {interview.meetingLink && (
                      <a 
                        href={interview.meetingLink}
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        <Video className="w-3 h-3 mr-1" />
                        Join Meeting
                      </a>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {!interview.reminder && interview.status !== 'completed' && (
                    <button
                      onClick={() => sendReminder(interview.id)}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Send Reminder
                    </button>
                  )}
                  {interview.status === 'scheduled' && (
                    <button
                      onClick={() => rescheduleInterview(interview.id)}
                      className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                    >
                      Reschedule
                    </button>
                  )}
                </div>
              </div>
            ))}
          
          {interviews.filter(i => i.date === format(selectedDate, 'yyyy-MM-dd')).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No interviews scheduled for today
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartScheduling;

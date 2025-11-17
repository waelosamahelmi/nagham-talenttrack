import { Candidate, User, Analytics, Interview, Message, Channel, SystemSettings } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'nagham.alaa@outlook.com',
  role: 'senior_hr_manager',
  department: 'Human Resources',
  avatar: 'https://i.pinimg.com/736x/82/47/0b/82470b4ed44c3edacfcd4201e2297050.jpg',
  permissions: ['view_all_candidates', 'edit_candidates', 'schedule_interviews', 'manage_team', 'view_analytics'],
  preferences: {
    theme: 'light',
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    dashboard: {
      defaultView: 'overview',
      widgets: ['metrics', 'pipeline', 'recent_activity']
    }
  }
};

export const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@email.com',
    phone: '+971-50-123-4567',
    position: 'Senior Frontend Developer',
    experience: 5,
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    location: 'Dubai, UAE',
    salary_expectation: 85000,
    status: 'interview',
    avatar: 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1',
    applied_date: '2024-01-15',
    last_activity: '2024-01-18',
    source: 'LinkedIn',
    rating: 4.5,
    notes: [
      {
        id: '1',
        author: 'Sarah Johnson',
        author_id: '1',
        content: 'Great technical skills, strong React experience. Recommended for technical interview.',
        created_at: '2024-01-16T10:30:00Z',
        mentions: [],
        is_private: false
      }
    ],
    documents: [
      {
        id: '1',
        name: 'Ahmed_Hassan_Resume.pdf',
        type: 'resume',
        url: '/documents/ahmed_resume.pdf',
        uploaded_date: '2024-01-15',
        size: 245760
      }
    ],
    interviews: [
      {
        id: '1',
        candidate_id: '1',
        candidate_name: 'Ahmed Hassan',
        interviewer_id: '1',
        interviewer_name: 'Sarah Johnson',
        title: 'Technical Interview - Frontend Developer',
        date: '2024-01-20',
        time: '14:00',
        duration: 60,
        type: 'video',
        status: 'scheduled',
        meeting_link: 'https://meet.google.com/abc-defg-hij',
        reminders_sent: false
      }
    ]
  },
  {
    id: '2',
    name: 'Fatima Al-Zahra',
    email: 'fatima.alzahra@email.com',
    phone: '+966-50-987-6543',
    position: 'UX Designer',
    experience: 3,
    skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
    location: 'Riyadh, Saudi Arabia',
    salary_expectation: 65000,
    status: 'assessment',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1',
    applied_date: '2024-01-12',
    last_activity: '2024-01-17',
    source: 'Company Website',
    rating: 4.2,
    notes: [],
    documents: [],
    interviews: []
  },
  {
    id: '3',
    name: 'Omar Khalil',
    email: 'omar.khalil@email.com',
    phone: '+971-55-234-5678',
    position: 'Data Analyst',
    experience: 2,
    skills: ['Python', 'SQL', 'Tableau', 'Power BI'],
    location: 'Abu Dhabi, UAE',
    salary_expectation: 55000,
    status: 'not_responding',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1',
    applied_date: '2024-01-10',
    last_activity: '2024-01-15',
    source: 'Indeed',
    rating: 3.8,
    notes: [
      {
        id: '2',
        author: 'Mike Chen',
        author_id: '2',
        content: 'Candidate has not responded to our interview invitation emails. Tried calling twice.',
        created_at: '2024-01-17T09:15:00Z',
        mentions: ['sarah.johnson'],
        is_private: false
      }
    ],
    documents: [],
    interviews: []
  },
  {
    id: '4',
    name: 'Layla Mansour',
    email: 'layla.mansour@email.com',
    phone: '+965-60-345-6789',
    position: 'Product Manager',
    experience: 6,
    skills: ['Product Strategy', 'Agile', 'Stakeholder Management', 'Analytics'],
    location: 'Kuwait City, Kuwait',
    salary_expectation: 95000,
    status: 'offer',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1',
    applied_date: '2024-01-08',
    last_activity: '2024-01-19',
    source: 'Referral',
    rating: 4.8,
    notes: [],
    documents: [],
    interviews: []
  }
];

export const mockInterviews: Interview[] = [
  {
    id: '1',
    candidate_id: '1',
    candidate_name: 'Ahmed Hassan',
    interviewer_id: '1',
    interviewer_name: 'Sarah Johnson',
    title: 'Technical Interview - Frontend Developer',
    date: '2024-01-20',
    time: '14:00',
    duration: 60,
    type: 'video',
    status: 'scheduled',
    meeting_link: 'https://meet.google.com/abc-defg-hij',
    reminders_sent: false
  },
  {
    id: '2',
    candidate_id: '2',
    candidate_name: 'Fatima Al-Zahra',
    interviewer_id: '2',
    interviewer_name: 'Mike Chen',
    title: 'Design Portfolio Review',
    date: '2024-01-21',
    time: '10:30',
    duration: 45,
    type: 'video',
    status: 'scheduled',
    meeting_link: 'https://zoom.us/j/123456789',
    reminders_sent: true
  },
  {
    id: '3',
    candidate_id: '4',
    candidate_name: 'Layla Mansour',
    interviewer_id: '1',
    interviewer_name: 'Sarah Johnson',
    title: 'Final Interview - Product Manager',
    date: '2024-01-19',
    time: '15:00',
    duration: 90,
    type: 'in_person',
    status: 'completed',
    location: 'Conference Room A',
    reminders_sent: true,
    feedback: {
      technical_skills: 4.5,
      communication: 5.0,
      cultural_fit: 4.8,
      overall_rating: 4.7,
      comments: 'Excellent candidate with strong product vision and leadership skills.',
      recommendation: 'hire'
    }
  }
];

export const mockMessages: Message[] = [
  {
    id: '1',
    sender_id: '2',
    sender_name: 'Mike Chen',
    recipient_id: '1',
    recipient_name: 'Sarah Johnson',
    content: 'Hi Sarah, I\'ve completed the initial screening for the UX Designer position. The candidate looks promising.',
    type: 'direct',
    created_at: '2024-01-18T14:30:00Z',
    read: false,
    mentions: []
  },
  {
    id: '2',
    sender_id: '1',
    sender_name: 'Sarah Johnson',
    recipient_id: '2',
    recipient_name: 'Mike Chen',
    content: 'Great! Can you schedule a design portfolio review for next week?',
    type: 'direct',
    created_at: '2024-01-18T14:35:00Z',
    read: true,
    mentions: []
  },
  {
    id: '3',
    sender_id: '3',
    sender_name: 'Emma Rodriguez',
    channel_id: 'general',
    content: 'Team meeting at 3 PM today to discuss Q1 hiring targets.',
    type: 'channel',
    created_at: '2024-01-18T13:00:00Z',
    read: true,
    mentions: []
  }
];

export const mockChannels: Channel[] = [
  {
    id: 'general',
    name: 'General',
    description: 'General team discussions',
    type: 'public',
    members: ['1', '2', '3', '4'],
    created_by: '1',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'hiring-updates',
    name: 'Hiring Updates',
    description: 'Updates on hiring progress and new positions',
    type: 'public',
    members: ['1', '2', '3'],
    created_by: '1',
    created_at: '2024-01-01T00:00:00Z'
  }
];

export const mockSystemSettings: SystemSettings = {
  company_name: 'TechCorp Solutions',
  company_logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1',
  timezone: 'Asia/Dubai',
  date_format: 'DD/MM/YYYY',
  currency: 'AED',
  email_templates: {
    interview_invitation: 'Dear {candidate_name}, We would like to invite you for an interview...',
    rejection: 'Dear {candidate_name}, Thank you for your interest in the position...',
    offer: 'Dear {candidate_name}, We are pleased to offer you the position...'
  },
  integration_settings: {
    calendar: {
      provider: 'google',
      enabled: true
    },
    email: {
      provider: 'smtp',
      smtp_settings: {
        host: 'smtp.company.com',
        port: 587,
        secure: true
      }
    }
  }
};

export const mockAnalytics: Analytics = {
  total_candidates: 247,
  active_positions: 12,
  interviews_scheduled: 18,
  offers_pending: 5,
  time_to_hire: 28,
  pipeline_conversion: {
    applied: 100,
    screening: 65,
    interview: 35,
    assessment: 25,
    offer: 15,
    hired: 10,
    not_responding: 8
  },
  source_effectiveness: {
    'LinkedIn': 35,
    'Company Website': 25,
    'Indeed': 20,
    'Referral': 15,
    'Other': 5
  },
  team_performance: {
    'Sarah Johnson': 85,
    'Mike Chen': 78,
    'Emma Rodriguez': 92,
    'David Kim': 71
  },
  monthly_hires: [
    { month: 'Jan', hires: 12 },
    { month: 'Feb', hires: 15 },
    { month: 'Mar', hires: 18 },
    { month: 'Apr', hires: 14 },
    { month: 'May', hires: 20 },
    { month: 'Jun', hires: 16 }
  ],
  status_distribution: {
    applied: 45,
    screening: 32,
    interview: 28,
    assessment: 15,
    offer: 8,
    hired: 12,
    rejected: 25,
    not_responding: 12
  }
};
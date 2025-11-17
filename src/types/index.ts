export interface User {
  id: string;
  name: string;
  email: string;
  role: 'senior_hr_manager' | 'junior_recruiter' | 'department_head';
  avatar?: string;
  department: string;
  permissions: string[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  dashboard: {
    defaultView: string;
    widgets: string[];
  };
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: number;
  skills: string[];
  location: string;
  salary_expectation: number;
  status: 'applied' | 'screening' | 'interview' | 'assessment' | 'offer' | 'hired' | 'rejected' | 'not_responding';
  avatar?: string;
  resume_url?: string;
  applied_date: string;
  last_activity: string;
  source: string;
  rating: number;
  notes: Note[];
  documents: Document[];
  interviews: Interview[];
}

export interface Document {
  id: string;
  name: string;
  type: 'resume' | 'cover_letter' | 'portfolio' | 'certificate' | 'other';
  url: string;
  uploaded_date: string;
  size: number;
}

export interface Note {
  id: string;
  author: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at?: string;
  mentions: string[];
  is_private: boolean;
}

export interface Interview {
  id: string;
  application_id?: string;
  candidate_id: string;
  position_id: string;
  interviewer_id: string;
  title: string;
  description?: string;
  scheduled_date: string;
  duration_minutes: number;
  type: 'phone' | 'video' | 'in_person';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'no_show';
  location?: string;
  meeting_link?: string;
  notes?: string;
  reminders_sent: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
  // Related data from joins
  candidates?: {
    name: string;
    email: string;
    avatar_url?: string;
  };
  positions?: {
    title: string;
  };
  users?: {
    name: string;
    avatar_url?: string;
  };
  interview_feedback?: InterviewFeedback[];
}

export interface InterviewFeedback {
  id: string;
  interview_id: string;
  interviewer_id: string;
  technical_skills?: number;
  communication?: number;
  cultural_fit?: number;
  problem_solving?: number;
  overall_rating?: number;
  strengths?: string;
  weaknesses?: string;
  comments?: string;
  recommendation?: 'hire' | 'reject' | 'maybe' | 'needs_another_round';
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  recipient_id?: string;
  recipient_name?: string;
  channel_id?: string;
  content: string;
  type: 'direct' | 'channel' | 'system';
  created_at: string;
  read: boolean;
  attachments?: MessageAttachment[];
  mentions: string[];
  thread_id?: string;
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private';
  members: string[];
  created_by: string;
  created_at: string;
}

export interface FilterOptions {
  skills: string[];
  experience: { min: number; max: number };
  location: string[];
  salary: { min: number; max: number };
  status: string[];
  source: string[];
  rating: { min: number; max: number };
  date_range: { start: string; end: string };
}

export interface Analytics {
  total_candidates: number;
  active_positions: number;
  interviews_scheduled: number;
  offers_pending: number;
  time_to_hire: number;
  pipeline_conversion: Record<string, number>;
  source_effectiveness: Record<string, number>;
  team_performance: Record<string, number>;
  monthly_hires: Array<{ month: string; hires: number }>;
  status_distribution: Record<string, number>;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  type: 'interview' | 'meeting' | 'deadline';
  attendees: string[];
  location?: string;
  description?: string;
}

export interface Notification {
  id: string;
  type: 'interview_reminder' | 'status_update' | 'message' | 'system';
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  action_url?: string;
}

export interface SystemSettings {
  company_name: string;
  company_logo?: string;
  timezone: string;
  date_format: string;
  currency: string;
  email_templates: Record<string, string>;
  integration_settings: {
    calendar: {
      provider: 'google' | 'outlook' | 'none';
      enabled: boolean;
    };
    email: {
      provider: string;
      smtp_settings: any;
    };
  };
}
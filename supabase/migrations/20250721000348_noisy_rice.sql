/*
  # HR Talent Tracking System Database Schema

  1. New Tables
    - `users` - System users (HR managers, recruiters, etc.)
    - `candidates` - Job candidates
    - `positions` - Job positions/openings
    - `applications` - Candidate applications to positions
    - `interviews` - Interview records
    - `interview_feedback` - Interview feedback and ratings
    - `notes` - Notes about candidates
    - `documents` - Candidate documents (resumes, etc.)
    - `messages` - Internal messaging system
    - `channels` - Message channels
    - `channel_members` - Channel membership
    - `notifications` - System notifications
    - `activity_logs` - Activity tracking
    - `system_settings` - System configuration

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for authenticated users
    - Implement role-based access control

  3. Functions & Triggers
    - Auto-update timestamps
    - Activity logging
    - Notification triggers
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('senior_hr_manager', 'junior_recruiter', 'department_head', 'admin')),
  department text NOT NULL,
  avatar_url text,
  permissions jsonb DEFAULT '[]',
  preferences jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Positions table
CREATE TABLE IF NOT EXISTS positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  department text NOT NULL,
  description text,
  requirements jsonb DEFAULT '[]',
  skills_required jsonb DEFAULT '[]',
  experience_min integer DEFAULT 0,
  experience_max integer,
  salary_min integer,
  salary_max integer,
  location text NOT NULL,
  employment_type text DEFAULT 'full_time' CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'internship')),
  status text DEFAULT 'open' CHECK (status IN ('open', 'closed', 'on_hold', 'filled')),
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  location text,
  experience_years integer DEFAULT 0,
  skills jsonb DEFAULT '[]',
  salary_expectation integer,
  avatar_url text,
  linkedin_url text,
  portfolio_url text,
  source text DEFAULT 'direct',
  status text DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'qualified', 'not_qualified', 'on_hold')),
  rating numeric(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Applications table (links candidates to positions)
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE,
  position_id uuid REFERENCES positions(id) ON DELETE CASCADE,
  status text DEFAULT 'applied' CHECK (status IN ('applied', 'screening', 'interview', 'assessment', 'offer', 'hired', 'rejected', 'withdrawn', 'not_responding')),
  applied_date timestamptz DEFAULT now(),
  last_activity timestamptz DEFAULT now(),
  cover_letter text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(candidate_id, position_id)
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('resume', 'cover_letter', 'portfolio', 'certificate', 'other')),
  file_url text NOT NULL,
  file_size integer,
  mime_type text,
  uploaded_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Interviews table
CREATE TABLE IF NOT EXISTS interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES applications(id) ON DELETE CASCADE,
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE,
  position_id uuid REFERENCES positions(id) ON DELETE CASCADE,
  interviewer_id uuid REFERENCES users(id),
  title text NOT NULL,
  description text,
  scheduled_date timestamptz NOT NULL,
  duration_minutes integer DEFAULT 60,
  type text NOT NULL CHECK (type IN ('phone', 'video', 'in_person')),
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled', 'no_show')),
  location text,
  meeting_link text,
  notes text,
  reminders_sent boolean DEFAULT false,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Interview feedback table
CREATE TABLE IF NOT EXISTS interview_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id uuid REFERENCES interviews(id) ON DELETE CASCADE,
  interviewer_id uuid REFERENCES users(id),
  technical_skills numeric(2,1) CHECK (technical_skills >= 0 AND technical_skills <= 5),
  communication numeric(2,1) CHECK (communication >= 0 AND communication <= 5),
  cultural_fit numeric(2,1) CHECK (cultural_fit >= 0 AND cultural_fit <= 5),
  problem_solving numeric(2,1) CHECK (problem_solving >= 0 AND problem_solving <= 5),
  overall_rating numeric(2,1) CHECK (overall_rating >= 0 AND overall_rating <= 5),
  strengths text,
  weaknesses text,
  comments text,
  recommendation text CHECK (recommendation IN ('hire', 'reject', 'maybe', 'needs_another_round')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE,
  application_id uuid REFERENCES applications(id) ON DELETE CASCADE,
  author_id uuid REFERENCES users(id),
  content text NOT NULL,
  is_private boolean DEFAULT false,
  mentions jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Channels table for messaging
CREATE TABLE IF NOT EXISTS channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  type text DEFAULT 'public' CHECK (type IN ('public', 'private', 'direct')),
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Channel members table
CREATE TABLE IF NOT EXISTS channel_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid REFERENCES channels(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role text DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at timestamptz DEFAULT now(),
  UNIQUE(channel_id, user_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid REFERENCES channels(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES users(id),
  content text NOT NULL,
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'system')),
  attachments jsonb DEFAULT '[]',
  mentions jsonb DEFAULT '[]',
  thread_id uuid REFERENCES messages(id),
  edited_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('interview_reminder', 'status_update', 'message', 'system', 'application_update')),
  title text NOT NULL,
  message text NOT NULL,
  data jsonb DEFAULT '{}',
  read boolean DEFAULT false,
  action_url text,
  created_at timestamptz DEFAULT now()
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  old_data jsonb,
  new_data jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- System settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  updated_by uuid REFERENCES users(id),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can view all users" ON users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Positions policies
CREATE POLICY "Anyone can view open positions" ON positions FOR SELECT TO authenticated USING (true);
CREATE POLICY "HR can manage positions" ON positions FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('senior_hr_manager', 'admin'))
);

-- Candidates policies
CREATE POLICY "Authenticated users can view candidates" ON candidates FOR SELECT TO authenticated USING (true);
CREATE POLICY "HR can manage candidates" ON candidates FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('senior_hr_manager', 'junior_recruiter', 'admin'))
);

-- Applications policies
CREATE POLICY "Authenticated users can view applications" ON applications FOR SELECT TO authenticated USING (true);
CREATE POLICY "HR can manage applications" ON applications FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('senior_hr_manager', 'junior_recruiter', 'admin'))
);

-- Documents policies
CREATE POLICY "Authenticated users can view documents" ON documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "HR can manage documents" ON documents FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('senior_hr_manager', 'junior_recruiter', 'admin'))
);

-- Interviews policies
CREATE POLICY "Authenticated users can view interviews" ON interviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "HR and interviewers can manage interviews" ON interviews FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('senior_hr_manager', 'junior_recruiter', 'admin'))
  OR interviewer_id = auth.uid()
);

-- Interview feedback policies
CREATE POLICY "Authenticated users can view feedback" ON interview_feedback FOR SELECT TO authenticated USING (true);
CREATE POLICY "Interviewers can manage their feedback" ON interview_feedback FOR ALL TO authenticated USING (
  interviewer_id = auth.uid() OR
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('senior_hr_manager', 'admin'))
);

-- Notes policies
CREATE POLICY "Users can view non-private notes" ON notes FOR SELECT TO authenticated USING (
  NOT is_private OR author_id = auth.uid() OR
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('senior_hr_manager', 'admin'))
);
CREATE POLICY "HR can manage notes" ON notes FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('senior_hr_manager', 'junior_recruiter', 'admin'))
);

-- Channels policies
CREATE POLICY "Users can view public channels and their private channels" ON channels FOR SELECT TO authenticated USING (
  type = 'public' OR 
  EXISTS (SELECT 1 FROM channel_members WHERE channel_id = channels.id AND user_id = auth.uid())
);
CREATE POLICY "Users can create channels" ON channels FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "Channel creators and admins can update channels" ON channels FOR UPDATE TO authenticated USING (
  created_by = auth.uid() OR
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('senior_hr_manager', 'admin'))
);

-- Channel members policies
CREATE POLICY "Users can view channel members for their channels" ON channel_members FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM channel_members cm WHERE cm.channel_id = channel_members.channel_id AND cm.user_id = auth.uid())
);
CREATE POLICY "Users can join/leave channels" ON channel_members FOR ALL TO authenticated USING (user_id = auth.uid());

-- Messages policies
CREATE POLICY "Users can view messages in their channels" ON messages FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM channel_members WHERE channel_id = messages.channel_id AND user_id = auth.uid())
);
CREATE POLICY "Users can send messages to their channels" ON messages FOR INSERT TO authenticated WITH CHECK (
  sender_id = auth.uid() AND
  EXISTS (SELECT 1 FROM channel_members WHERE channel_id = messages.channel_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update their own messages" ON messages FOR UPDATE TO authenticated USING (sender_id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can view their notifications" ON notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can update their notifications" ON notifications FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "System can create notifications" ON notifications FOR INSERT TO authenticated WITH CHECK (true);

-- Activity logs policies
CREATE POLICY "Admins can view all activity logs" ON activity_logs FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "System can create activity logs" ON activity_logs FOR INSERT TO authenticated WITH CHECK (true);

-- System settings policies
CREATE POLICY "Authenticated users can view settings" ON system_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage settings" ON system_settings FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Functions

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to log activity
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO activity_logs (user_id, action, entity_type, entity_id, new_data)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO activity_logs (user_id, action, entity_type, entity_id, old_data, new_data)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO activity_logs (user_id, action, entity_type, entity_id, old_data)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_message text,
  p_data jsonb DEFAULT '{}',
  p_action_url text DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  notification_id uuid;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, data, action_url)
  VALUES (p_user_id, p_type, p_title, p_message, p_data, p_action_url)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ language 'plpgsql';

-- Triggers

-- Updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_positions_updated_at BEFORE UPDATE ON positions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON candidates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interviews_updated_at BEFORE UPDATE ON interviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interview_feedback_updated_at BEFORE UPDATE ON interview_feedback FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_channels_updated_at BEFORE UPDATE ON channels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Activity logging triggers
CREATE TRIGGER log_candidates_activity AFTER INSERT OR UPDATE OR DELETE ON candidates FOR EACH ROW EXECUTE FUNCTION log_activity();
CREATE TRIGGER log_applications_activity AFTER INSERT OR UPDATE OR DELETE ON applications FOR EACH ROW EXECUTE FUNCTION log_activity();
CREATE TRIGGER log_interviews_activity AFTER INSERT OR UPDATE OR DELETE ON interviews FOR EACH ROW EXECUTE FUNCTION log_activity();

-- Notification triggers
CREATE OR REPLACE FUNCTION notify_interview_scheduled()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify candidate (if they have a user account)
  IF EXISTS (SELECT 1 FROM users WHERE email = (SELECT email FROM candidates WHERE id = NEW.candidate_id)) THEN
    PERFORM create_notification(
      (SELECT id FROM users WHERE email = (SELECT email FROM candidates WHERE id = NEW.candidate_id)),
      'interview_reminder',
      'Interview Scheduled',
      'You have an interview scheduled for ' || NEW.title,
      jsonb_build_object('interview_id', NEW.id),
      '/interviews'
    );
  END IF;
  
  -- Notify interviewer
  PERFORM create_notification(
    NEW.interviewer_id,
    'interview_reminder',
    'Interview Scheduled',
    'You have an interview scheduled with ' || (SELECT name FROM candidates WHERE id = NEW.candidate_id),
    jsonb_build_object('interview_id', NEW.id),
    '/interviews'
  );
  
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER notify_interview_scheduled_trigger
  AFTER INSERT ON interviews
  FOR EACH ROW
  EXECUTE FUNCTION notify_interview_scheduled();

-- Application status change notification
CREATE OR REPLACE FUNCTION notify_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    -- Update last_activity
    NEW.last_activity = now();
    
    -- Notify relevant users
    PERFORM create_notification(
      NEW.created_by,
      'application_update',
      'Application Status Updated',
      (SELECT name FROM candidates WHERE id = NEW.candidate_id) || ' status changed to ' || NEW.status,
      jsonb_build_object('application_id', NEW.id, 'old_status', OLD.status, 'new_status', NEW.status),
      '/candidates'
    );
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER notify_application_status_change_trigger
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION notify_application_status_change();

-- Insert sample data
INSERT INTO system_settings (key, value, description) VALUES
('company_name', '"TechCorp Solutions"', 'Company name'),
('timezone', '"Asia/Dubai"', 'Default timezone'),
('date_format', '"DD/MM/YYYY"', 'Date format preference'),
('currency', '"AED"', 'Default currency'),
('email_notifications', 'true', 'Enable email notifications'),
('interview_reminder_hours', '24', 'Hours before interview to send reminder');

-- Create default channels
INSERT INTO channels (id, name, description, type, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'General', 'General team discussions', 'public', NULL),
('00000000-0000-0000-0000-000000000002', 'Hiring Updates', 'Updates on hiring progress and new positions', 'public', NULL);
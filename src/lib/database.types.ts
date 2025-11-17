export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: 'senior_hr_manager' | 'junior_recruiter' | 'department_head' | 'admin'
          department: string
          avatar_url: string | null
          permissions: Json
          preferences: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          role: 'senior_hr_manager' | 'junior_recruiter' | 'department_head' | 'admin'
          department: string
          avatar_url?: string | null
          permissions?: Json
          preferences?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: 'senior_hr_manager' | 'junior_recruiter' | 'department_head' | 'admin'
          department?: string
          avatar_url?: string | null
          permissions?: Json
          preferences?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      positions: {
        Row: {
          id: string
          title: string
          department: string
          description: string | null
          requirements: Json
          skills_required: Json
          experience_min: number
          experience_max: number | null
          salary_min: number | null
          salary_max: number | null
          location: string
          employment_type: 'full_time' | 'part_time' | 'contract' | 'internship'
          status: 'open' | 'closed' | 'on_hold' | 'filled'
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          department: string
          description?: string | null
          requirements?: Json
          skills_required?: Json
          experience_min?: number
          experience_max?: number | null
          salary_min?: number | null
          salary_max?: number | null
          location: string
          employment_type?: 'full_time' | 'part_time' | 'contract' | 'internship'
          status?: 'open' | 'closed' | 'on_hold' | 'filled'
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          department?: string
          description?: string | null
          requirements?: Json
          skills_required?: Json
          experience_min?: number
          experience_max?: number | null
          salary_min?: number | null
          salary_max?: number | null
          location?: string
          employment_type?: 'full_time' | 'part_time' | 'contract' | 'internship'
          status?: 'open' | 'closed' | 'on_hold' | 'filled'
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      candidates: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          location: string | null
          experience_years: number
          skills: Json
          salary_expectation: number | null
          avatar_url: string | null
          linkedin_url: string | null
          portfolio_url: string | null
          source: string
          status: 'new' | 'reviewing' | 'qualified' | 'not_qualified' | 'on_hold'
          rating: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          location?: string | null
          experience_years?: number
          skills?: Json
          salary_expectation?: number | null
          avatar_url?: string | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          source?: string
          status?: 'new' | 'reviewing' | 'qualified' | 'not_qualified' | 'on_hold'
          rating?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          location?: string | null
          experience_years?: number
          skills?: Json
          salary_expectation?: number | null
          avatar_url?: string | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          source?: string
          status?: 'new' | 'reviewing' | 'qualified' | 'not_qualified' | 'on_hold'
          rating?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          candidate_id: string
          position_id: string
          status: 'applied' | 'screening' | 'interview' | 'assessment' | 'offer' | 'hired' | 'rejected' | 'withdrawn' | 'not_responding'
          applied_date: string
          last_activity: string
          cover_letter: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          candidate_id: string
          position_id: string
          status?: 'applied' | 'screening' | 'interview' | 'assessment' | 'offer' | 'hired' | 'rejected' | 'withdrawn' | 'not_responding'
          applied_date?: string
          last_activity?: string
          cover_letter?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          candidate_id?: string
          position_id?: string
          status?: 'applied' | 'screening' | 'interview' | 'assessment' | 'offer' | 'hired' | 'rejected' | 'withdrawn' | 'not_responding'
          applied_date?: string
          last_activity?: string
          cover_letter?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          candidate_id: string
          name: string
          type: 'resume' | 'cover_letter' | 'portfolio' | 'certificate' | 'other'
          file_url: string
          file_size: number | null
          mime_type: string | null
          uploaded_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          candidate_id: string
          name: string
          type: 'resume' | 'cover_letter' | 'portfolio' | 'certificate' | 'other'
          file_url: string
          file_size?: number | null
          mime_type?: string | null
          uploaded_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          candidate_id?: string
          name?: string
          type?: 'resume' | 'cover_letter' | 'portfolio' | 'certificate' | 'other'
          file_url?: string
          file_size?: number | null
          mime_type?: string | null
          uploaded_by?: string | null
          created_at?: string
        }
      }
      interviews: {
        Row: {
          id: string
          application_id: string
          candidate_id: string
          position_id: string
          interviewer_id: string | null
          title: string
          description: string | null
          scheduled_date: string
          duration_minutes: number
          type: 'phone' | 'video' | 'in_person'
          status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'no_show'
          location: string | null
          meeting_link: string | null
          notes: string | null
          reminders_sent: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          application_id: string
          candidate_id: string
          position_id: string
          interviewer_id?: string | null
          title: string
          description?: string | null
          scheduled_date: string
          duration_minutes?: number
          type: 'phone' | 'video' | 'in_person'
          status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'no_show'
          location?: string | null
          meeting_link?: string | null
          notes?: string | null
          reminders_sent?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          application_id?: string
          candidate_id?: string
          position_id?: string
          interviewer_id?: string | null
          title?: string
          description?: string | null
          scheduled_date?: string
          duration_minutes?: number
          type?: 'phone' | 'video' | 'in_person'
          status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'no_show'
          location?: string | null
          meeting_link?: string | null
          notes?: string | null
          reminders_sent?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      interview_feedback: {
        Row: {
          id: string
          interview_id: string
          interviewer_id: string | null
          technical_skills: number | null
          communication: number | null
          cultural_fit: number | null
          problem_solving: number | null
          overall_rating: number | null
          strengths: string | null
          weaknesses: string | null
          comments: string | null
          recommendation: 'hire' | 'reject' | 'maybe' | 'needs_another_round' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          interview_id: string
          interviewer_id?: string | null
          technical_skills?: number | null
          communication?: number | null
          cultural_fit?: number | null
          problem_solving?: number | null
          overall_rating?: number | null
          strengths?: string | null
          weaknesses?: string | null
          comments?: string | null
          recommendation?: 'hire' | 'reject' | 'maybe' | 'needs_another_round' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          interview_id?: string
          interviewer_id?: string | null
          technical_skills?: number | null
          communication?: number | null
          cultural_fit?: number | null
          problem_solving?: number | null
          overall_rating?: number | null
          strengths?: string | null
          weaknesses?: string | null
          comments?: string | null
          recommendation?: 'hire' | 'reject' | 'maybe' | 'needs_another_round' | null
          created_at?: string
          updated_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          candidate_id: string
          application_id: string | null
          author_id: string | null
          content: string
          is_private: boolean
          mentions: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          candidate_id: string
          application_id?: string | null
          author_id?: string | null
          content: string
          is_private?: boolean
          mentions?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          candidate_id?: string
          application_id?: string | null
          author_id?: string | null
          content?: string
          is_private?: boolean
          mentions?: Json
          created_at?: string
          updated_at?: string
        }
      }
      channels: {
        Row: {
          id: string
          name: string
          description: string | null
          type: 'public' | 'private' | 'direct'
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type?: 'public' | 'private' | 'direct'
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type?: 'public' | 'private' | 'direct'
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      channel_members: {
        Row: {
          id: string
          channel_id: string
          user_id: string
          role: 'admin' | 'member'
          joined_at: string
        }
        Insert: {
          id?: string
          channel_id: string
          user_id: string
          role?: 'admin' | 'member'
          joined_at?: string
        }
        Update: {
          id?: string
          channel_id?: string
          user_id?: string
          role?: 'admin' | 'member'
          joined_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          channel_id: string
          sender_id: string | null
          content: string
          message_type: 'text' | 'file' | 'system'
          attachments: Json
          mentions: Json
          thread_id: string | null
          edited_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          channel_id: string
          sender_id?: string | null
          content: string
          message_type?: 'text' | 'file' | 'system'
          attachments?: Json
          mentions?: Json
          thread_id?: string | null
          edited_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          channel_id?: string
          sender_id?: string | null
          content?: string
          message_type?: 'text' | 'file' | 'system'
          attachments?: Json
          mentions?: Json
          thread_id?: string | null
          edited_at?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'interview_reminder' | 'status_update' | 'message' | 'system' | 'application_update'
          title: string
          message: string
          data: Json
          read: boolean
          action_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'interview_reminder' | 'status_update' | 'message' | 'system' | 'application_update'
          title: string
          message: string
          data?: Json
          read?: boolean
          action_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'interview_reminder' | 'status_update' | 'message' | 'system' | 'application_update'
          title?: string
          message?: string
          data?: Json
          read?: boolean
          action_url?: string | null
          created_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          old_data: Json | null
          new_data: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          old_data?: Json | null
          new_data?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          old_data?: Json | null
          new_data?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      system_settings: {
        Row: {
          id: string
          key: string
          value: Json
          description: string | null
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          description?: string | null
          updated_by?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          description?: string | null
          updated_by?: string | null
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_notification: {
        Args: {
          p_user_id: string
          p_type: string
          p_title: string
          p_message: string
          p_data?: Json
          p_action_url?: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
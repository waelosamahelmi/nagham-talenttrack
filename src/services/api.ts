import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import toast from 'react-hot-toast';

type Tables = Database['public']['Tables'];

// Candidates API
export const candidatesApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('candidates')
      .select(`
        *,
        applications (
          id,
          position_id,
          status,
          applied_date,
          positions (
            id,
            title,
            department
          )
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('candidates')
      .select(`
        *,
        applications (
          *,
          positions (*)
        ),
        documents (*),
        notes (
          *,
          users (name, avatar_url)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  create: async (candidate: Tables['candidates']['Insert']) => {
    const { data, error } = await supabase
      .from('candidates')
      .insert([candidate])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: Tables['candidates']['Update']) => {
    const { data, error } = await supabase
      .from('candidates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('candidates')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  search: async (query: string) => {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,skills.cs.["${query}"]`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

// Applications API
export const applicationsApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        candidates (*),
        positions (*)
      `)
      .order('applied_date', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  create: async (application: Tables['applications']['Insert']) => {
    const { data, error } = await supabase
      .from('applications')
      .insert([application])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  updateStatus: async (id: string, status: Tables['applications']['Row']['status']) => {
    const { data, error } = await supabase
      .from('applications')
      .update({ status, last_activity: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  getByCandidate: async (candidateId: string) => {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        positions (*)
      `)
      .eq('candidate_id', candidateId);
    
    if (error) throw error;
    return data;
  }
};

// Positions API
export const positionsApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('positions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  getOpen: async () => {
    const { data, error } = await supabase
      .from('positions')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  create: async (position: Tables['positions']['Insert']) => {
    const { data, error } = await supabase
      .from('positions')
      .insert([position])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: Tables['positions']['Update']) => {
    const { data, error } = await supabase
      .from('positions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Interviews API
export const interviewsApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('interviews')
      .select(`
        *,
        candidates (name, email, avatar_url),
        positions (title),
        users!interviews_interviewer_id_fkey (name, avatar_url),
        interview_feedback (*)
      `)
      .order('scheduled_date', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  create: async (interview: Tables['interviews']['Insert']) => {
    const { data, error } = await supabase
      .from('interviews')
      .insert([interview])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: Tables['interviews']['Update']) => {
    const { data, error } = await supabase
      .from('interviews')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  addFeedback: async (feedback: Tables['interview_feedback']['Insert']) => {
    const { data, error } = await supabase
      .from('interview_feedback')
      .insert([feedback])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  getUpcoming: async () => {
    const { data, error } = await supabase
      .from('interviews')
      .select(`
        *,
        candidates (name, email),
        positions (title),
        users!interviews_interviewer_id_fkey (name)
      `)
      .eq('status', 'scheduled')
      .gte('scheduled_date', new Date().toISOString())
      .order('scheduled_date', { ascending: true });
    
    if (error) throw error;
    return data;
  }
};

// Notes API
export const notesApi = {
  getByCandidate: async (candidateId: string) => {
    const { data, error } = await supabase
      .from('notes')
      .select(`
        *,
        users (name, avatar_url)
      `)
      .eq('candidate_id', candidateId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  create: async (note: Tables['notes']['Insert']) => {
    const { data, error } = await supabase
      .from('notes')
      .insert([note])
      .select(`
        *,
        users (name, avatar_url)
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: Tables['notes']['Update']) => {
    const { data, error } = await supabase
      .from('notes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Documents API
export const documentsApi = {
  getByCandidate: async (candidateId: string) => {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('candidate_id', candidateId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  upload: async (file: File, candidateId: string, type: Tables['documents']['Row']['type']) => {
    // Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${candidateId}/${type}_${Date.now()}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file);
    
    if (uploadError) throw uploadError;
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);
    
    // Create document record
    const { data, error } = await supabase
      .from('documents')
      .insert([{
        candidate_id: candidateId,
        name: file.name,
        type,
        file_url: publicUrl,
        file_size: file.size,
        mime_type: file.type
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  delete: async (id: string) => {
    // Get document info first
    const { data: doc, error: fetchError } = await supabase
      .from('documents')
      .select('file_url')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Extract file path from URL
    const url = new URL(doc.file_url);
    const filePath = url.pathname.split('/').slice(-2).join('/');
    
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([filePath]);
    
    if (storageError) throw storageError;
    
    // Delete record
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Messages API
export const messagesApi = {
  getByChannel: async (channelId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        users (name, avatar_url)
      `)
      .eq('channel_id', channelId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  send: async (message: Tables['messages']['Insert']) => {
    const { data, error } = await supabase
      .from('messages')
      .insert([message])
      .select(`
        *,
        users (name, avatar_url)
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  subscribeToChannel: (channelId: string, callback: (message: any) => void) => {
    return supabase
      .channel(`messages:${channelId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${channelId}`
        },
        callback
      )
      .subscribe();
  }
};

// Channels API
export const channelsApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('channels')
      .select(`
        *,
        channel_members!inner (
          user_id,
          role
        )
      `)
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  getUserChannels: async (userId: string) => {
    const { data, error } = await supabase
      .from('channels')
      .select(`
        *,
        channel_members!inner (
          user_id,
          role
        )
      `)
      .eq('channel_members.user_id', userId)
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  create: async (channel: Tables['channels']['Insert']) => {
    const { data, error } = await supabase
      .from('channels')
      .insert([channel])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  joinChannel: async (channelId: string, userId: string) => {
    const { data, error } = await supabase
      .from('channel_members')
      .insert([{ channel_id: channelId, user_id: userId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Notifications API
export const notificationsApi = {
  getByUser: async (userId: string) => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) throw error;
    return data;
  },

  markAsRead: async (id: string) => {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  markAllAsRead: async (userId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);
    
    if (error) throw error;
  },

  subscribeToUser: (userId: string, callback: (notification: any) => void) => {
    return supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();
  }
};

// Analytics API
export const analyticsApi = {
  getDashboardStats: async () => {
    const [
      candidatesCount,
      positionsCount,
      interviewsCount,
      applicationsStats
    ] = await Promise.all([
      supabase.from('candidates').select('id', { count: 'exact', head: true }),
      supabase.from('positions').select('id', { count: 'exact', head: true }).eq('status', 'open'),
      supabase.from('interviews').select('id', { count: 'exact', head: true }).eq('status', 'scheduled').gte('scheduled_date', new Date().toISOString()),
      supabase.from('applications').select('status')
    ]);

    const statusDistribution = applicationsStats.data?.reduce((acc: any, app: any) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {}) || {};

    return {
      total_candidates: candidatesCount.count || 0,
      active_positions: positionsCount.count || 0,
      interviews_scheduled: interviewsCount.count || 0,
      status_distribution: statusDistribution
    };
  },

  getPipelineData: async () => {
    const { data, error } = await supabase
      .from('applications')
      .select('status');
    
    if (error) throw error;
    
    const pipeline = data.reduce((acc: any, app: any) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});
    
    return pipeline;
  },

  getSourceData: async () => {
    const { data, error } = await supabase
      .from('candidates')
      .select('source');
    
    if (error) throw error;
    
    const sources = data.reduce((acc: any, candidate: any) => {
      acc[candidate.source] = (acc[candidate.source] || 0) + 1;
      return acc;
    }, {});
    
    return sources;
  }
};

// Users API
export const usersApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  updateProfile: async (id: string, updates: Tables['users']['Update']) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Error handling wrapper
export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error: any) {
      console.error('API Error:', error);
      toast.error(error.message || 'An unexpected error occurred');
      throw error;
    }
  };
};

// Export all APIs with error handling
export const api = {
  candidates: Object.fromEntries(
    Object.entries(candidatesApi).map(([key, fn]) => [key, withErrorHandling(fn)])
  ) as typeof candidatesApi,
  applications: Object.fromEntries(
    Object.entries(applicationsApi).map(([key, fn]) => [key, withErrorHandling(fn)])
  ) as typeof applicationsApi,
  positions: Object.fromEntries(
    Object.entries(positionsApi).map(([key, fn]) => [key, withErrorHandling(fn)])
  ) as typeof positionsApi,
  interviews: Object.fromEntries(
    Object.entries(interviewsApi).map(([key, fn]) => [key, withErrorHandling(fn)])
  ) as typeof interviewsApi,
  notes: Object.fromEntries(
    Object.entries(notesApi).map(([key, fn]) => [key, withErrorHandling(fn)])
  ) as typeof notesApi,
  documents: Object.fromEntries(
    Object.entries(documentsApi).map(([key, fn]) => [key, withErrorHandling(fn)])
  ) as typeof documentsApi,
  messages: Object.fromEntries(
    Object.entries(messagesApi).map(([key, fn]) => [key, withErrorHandling(fn)])
  ) as typeof messagesApi,
  channels: Object.fromEntries(
    Object.entries(channelsApi).map(([key, fn]) => [key, withErrorHandling(fn)])
  ) as typeof channelsApi,
  notifications: Object.fromEntries(
    Object.entries(notificationsApi).map(([key, fn]) => [key, withErrorHandling(fn)])
  ) as typeof notificationsApi,
  analytics: Object.fromEntries(
    Object.entries(analyticsApi).map(([key, fn]) => [key, withErrorHandling(fn)])
  ) as typeof analyticsApi,
  users: Object.fromEntries(
    Object.entries(usersApi).map(([key, fn]) => [key, withErrorHandling(fn)])
  ) as typeof usersApi
};
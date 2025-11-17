import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { candidateKeys } from '../api/useCandidates';
import toast from 'react-hot-toast';

export const useRealtimeUpdates = () => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const subscriptionsRef = useRef<any[]>([]);

  useEffect(() => {
    // Subscribe to candidates table changes
    const candidatesSubscription = supabase
      .channel('candidates-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'candidates',
        },
        (payload) => {
          console.log('Candidate change received:', payload);
          
          switch (payload.eventType) {
            case 'INSERT':
              // Invalidate candidates list to include new candidate
              queryClient.invalidateQueries({ queryKey: candidateKeys.lists() });
              toast.success(`New candidate ${payload.new.name} added!`);
              break;
              
            case 'UPDATE':
              // Update specific candidate and list
              queryClient.setQueryData(
                candidateKeys.detail(payload.new.id),
                payload.new
              );
              queryClient.invalidateQueries({ queryKey: candidateKeys.lists() });
              break;
              
            case 'DELETE':
              // Remove candidate from cache
              queryClient.removeQueries({ 
                queryKey: candidateKeys.detail(payload.old.id) 
              });
              queryClient.invalidateQueries({ queryKey: candidateKeys.lists() });
              toast(`Candidate ${payload.old.name} removed`, { icon: 'ℹ️' });
              break;
          }
        }
      )
      .subscribe((status) => {
        console.log('Candidates subscription status:', status);
        setIsConnected(status === 'SUBSCRIBED');
      });

    // Subscribe to interviews table changes
    const interviewsSubscription = supabase
      .channel('interviews-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'interviews',
        },
        (payload) => {
          console.log('Interview change received:', payload);
          
          // Invalidate interview queries
          queryClient.invalidateQueries({ queryKey: ['interviews'] });
          
          switch (payload.eventType) {
            case 'INSERT':
              toast.success('New interview scheduled!');
              break;
            case 'UPDATE':
              if (payload.new.status !== payload.old.status) {
                toast(`Interview status updated to ${payload.new.status}`, { icon: 'ℹ️' });
              }
              break;
          }
        }
      )
      .subscribe();

    // Subscribe to messages for real-time chat
    const messagesSubscription = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          console.log('New message received:', payload);
          
          // Invalidate messages queries
          queryClient.invalidateQueries({ queryKey: ['messages'] });
          
          // Show notification for new messages (optional)
          // toast.info('New message received');
        }
      )
      .subscribe();

    subscriptionsRef.current = [
      candidatesSubscription,
      interviewsSubscription,
      messagesSubscription,
    ];

    // Cleanup function
    return () => {
      subscriptionsRef.current.forEach(subscription => {
        supabase.removeChannel(subscription);
      });
    };
  }, [queryClient]);

  return { isConnected };
};

// Hook for real-time presence (who's online)
export const usePresence = (userId: string) => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase.channel('online-users', {
      config: { presence: { key: userId } },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        const users = Object.keys(presenceState);
        setOnlineUsers(users);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('User joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('User left:', leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: userId,
            online_at: new Date().toISOString(),
          });
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [userId]);

  return { onlineUsers };
};

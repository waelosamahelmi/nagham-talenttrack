// React hook for managing notifications across different channels
import { useCallback, useState, useEffect } from 'react';
import { slackService } from '../services/integrations/slackService';
import { Candidate } from '../types';
import toast from 'react-hot-toast';

export interface NotificationPreferences {
  email: boolean;
  slack: boolean;
  inApp: boolean;
  sms: boolean;
}

export interface NotificationChannel {
  id: string;
  name: string;
  type: 'slack' | 'email' | 'sms' | 'webhook';
  enabled: boolean;
  config: Record<string, any>;
}

export interface UseNotificationsReturn {
  // Notification sending
  sendCandidateNotification: (candidate: Candidate, event: string, details?: any) => Promise<void>;
  sendInterviewNotification: (candidate: Candidate, interviewData: any) => Promise<void>;
  sendHiringDecisionNotification: (candidate: Candidate, decision: 'hired' | 'rejected', reason?: string) => Promise<void>;
  sendCustomNotification: (title: string, message: string, urgency: 'low' | 'medium' | 'high') => Promise<void>;
  
  // Status and preferences
  preferences: NotificationPreferences;
  updatePreferences: (newPreferences: Partial<NotificationPreferences>) => void;
  channels: NotificationChannel[];
  isSlackConnected: boolean;
  
  // Statistics
  notificationStats: {
    sent: number;
    failed: number;
    pending: number;
  };
}

export const useNotifications = (): UseNotificationsReturn => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: true,
    slack: true,
    inApp: true,
    sms: false
  });

  const [channels, setChannels] = useState<NotificationChannel[]>([
    {
      id: 'slack-main',
      name: 'Slack Integration',
      type: 'slack',
      enabled: false,
      config: {}
    }
  ]);

  const [isSlackConnected, setIsSlackConnected] = useState(false);
  const [notificationStats, setNotificationStats] = useState({
    sent: 0,
    failed: 0,
    pending: 0
  });

  // Check Slack connection status
  useEffect(() => {
    const checkSlackStatus = () => {
      const connected = slackService.isReady();
      setIsSlackConnected(connected);
      
      setChannels(prev => prev.map(channel => 
        channel.type === 'slack' 
          ? { ...channel, enabled: connected }
          : channel
      ));
    };

    checkSlackStatus();
    
    // Check periodically
    const interval = setInterval(checkSlackStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Load preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('notification-preferences');
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load notification preferences:', error);
      }
    }
  }, []);

  // Save preferences to localStorage
  const updatePreferences = useCallback((newPreferences: Partial<NotificationPreferences>) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    localStorage.setItem('notification-preferences', JSON.stringify(updated));
  }, [preferences]);

  // Update statistics
  const updateStats = useCallback((type: 'sent' | 'failed' | 'pending', increment: number = 1) => {
    setNotificationStats(prev => ({
      ...prev,
      [type]: prev[type] + increment
    }));
  }, []);

  // Send candidate-related notifications
  const sendCandidateNotification = useCallback(async (
    candidate: Candidate, 
    event: string, 
    details?: any
  ) => {
    updateStats('pending');

    try {
      let success = false;

      // Send Slack notification if enabled
      if (preferences.slack && isSlackConnected) {
        switch (event) {
          case 'application_received':
            success = await slackService.notifyNewApplication(candidate);
            break;
          case 'status_changed':
            success = await slackService.notifyStatusChange(
              candidate, 
              details?.oldStatus || 'unknown', 
              details?.newStatus || candidate.status
            );
            break;
          default:
            success = await slackService.sendNotification({
              type: 'candidate_update',
              title: `Candidate Update: ${event.replace(/_/g, ' ')}`,
              message: `${candidate.name} - ${event.replace(/_/g, ' ')}`,
              candidate,
              urgency: details?.urgency || 'medium'
            });
        }
      }

      // Send in-app notification
      if (preferences.inApp) {
        toast.success(`Candidate notification: ${candidate.name} - ${event.replace(/_/g, ' ')}`);
        success = true;
      }

      if (success) {
        updateStats('sent');
        updateStats('pending', -1);
      } else {
        updateStats('failed');
        updateStats('pending', -1);
      }

    } catch (error) {
      console.error('Failed to send candidate notification:', error);
      updateStats('failed');
      updateStats('pending', -1);
    }
  }, [preferences, isSlackConnected, updateStats]);

  // Send interview notifications
  const sendInterviewNotification = useCallback(async (candidate: Candidate, interviewData: any) => {
    updateStats('pending');

    try {
      let success = false;

      if (preferences.slack && isSlackConnected) {
        success = await slackService.notifyInterviewScheduled(
          candidate,
          interviewData.dateTime,
          interviewData.interviewer
        );
      }

      if (preferences.inApp) {
        toast.success(`Interview scheduled for ${candidate.name} with ${interviewData.interviewer}`);
        success = true;
      }

      if (success) {
        updateStats('sent');
      } else {
        updateStats('failed');
      }
      updateStats('pending', -1);

    } catch (error) {
      console.error('Failed to send interview notification:', error);
      updateStats('failed');
      updateStats('pending', -1);
    }
  }, [preferences, isSlackConnected, updateStats]);

  // Send hiring decision notifications
  const sendHiringDecisionNotification = useCallback(async (
    candidate: Candidate, 
    decision: 'hired' | 'rejected', 
    reason?: string
  ) => {
    updateStats('pending');

    try {
      let success = false;

      if (preferences.slack && isSlackConnected) {
        success = await slackService.notifyHiringDecision(candidate, decision, reason);
      }

      if (preferences.inApp) {
        const message = decision === 'hired' 
          ? `🎉 ${candidate.name} has been hired!`
          : `${candidate.name} was not selected`;
        
        if (decision === 'hired') {
          toast.success(message);
        } else {
          toast(message, { icon: '📝' });
        }
        success = true;
      }

      if (success) {
        updateStats('sent');
      } else {
        updateStats('failed');
      }
      updateStats('pending', -1);

    } catch (error) {
      console.error('Failed to send hiring decision notification:', error);
      updateStats('failed');
      updateStats('pending', -1);
    }
  }, [preferences, isSlackConnected, updateStats]);

  // Send custom notifications
  const sendCustomNotification = useCallback(async (
    title: string, 
    message: string, 
    urgency: 'low' | 'medium' | 'high' = 'medium'
  ) => {
    updateStats('pending');

    try {
      let success = false;

      if (preferences.slack && isSlackConnected) {
        success = await slackService.sendNotification({
          type: 'candidate_update',
          title,
          message,
          urgency
        });
      }

      if (preferences.inApp) {
        switch (urgency) {
          case 'high':
            toast.error(message);
            break;
          case 'low':
            toast(message, { icon: 'ℹ️' });
            break;
          default:
            toast.success(message);
        }
        success = true;
      }

      if (success) {
        updateStats('sent');
      } else {
        updateStats('failed');
      }
      updateStats('pending', -1);

    } catch (error) {
      console.error('Failed to send custom notification:', error);
      updateStats('failed');
      updateStats('pending', -1);
    }
  }, [preferences, isSlackConnected, updateStats]);

  return {
    // Notification functions
    sendCandidateNotification,
    sendInterviewNotification,
    sendHiringDecisionNotification,
    sendCustomNotification,
    
    // State and configuration
    preferences,
    updatePreferences,
    channels,
    isSlackConnected,
    notificationStats
  };
};

export default useNotifications;

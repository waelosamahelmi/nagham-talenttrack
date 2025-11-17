// Slack Integration Service for TalentTrack HR System
import { WebClient } from '@slack/web-api';
import { Candidate } from '../../types';

export interface SlackConfig {
  token: string;
  signingSecret: string;
  channel: {
    general: string;
    hiring: string;
    interviews: string;
    notifications: string;
  };
}

export interface SlackNotification {
  type: 'candidate_update' | 'interview_scheduled' | 'new_application' | 'hiring_decision';
  title: string;
  message: string;
  candidate?: Candidate;
  urgency: 'low' | 'medium' | 'high';
  actionRequired?: boolean;
}

export interface SlackInteractiveCard {
  candidate: Candidate;
  actions: Array<{
    id: string;
    text: string;
    value: string;
    style?: 'primary' | 'danger';
  }>;
}

class SlackService {
  private client: WebClient;
  private config: SlackConfig;
  private isConnected: boolean = false;

  constructor() {
    // Initialize with environment variables
    this.config = {
      token: import.meta.env.VITE_SLACK_BOT_TOKEN || '',
      signingSecret: import.meta.env.VITE_SLACK_SIGNING_SECRET || '',
      channel: {
        general: import.meta.env.VITE_SLACK_CHANNEL_GENERAL || '#general',
        hiring: import.meta.env.VITE_SLACK_CHANNEL_HIRING || '#hiring',
        interviews: import.meta.env.VITE_SLACK_CHANNEL_INTERVIEWS || '#interviews',
        notifications: import.meta.env.VITE_SLACK_CHANNEL_NOTIFICATIONS || '#hr-notifications'
      }
    };

    if (this.config.token) {
      this.client = new WebClient(this.config.token);
      this.initialize();
    }
  }

  private async initialize() {
    try {
      // Test the connection
      const auth = await this.client.auth.test();
      if (auth.ok) {
        this.isConnected = true;
        console.log('✅ Slack integration connected successfully');
        console.log(`Connected as: ${auth.user} in team: ${auth.team}`);
      }
    } catch (error) {
      console.error('❌ Slack connection failed:', error);
      this.isConnected = false;
    }
  }

  // Check if Slack is properly configured and connected
  isConfigured(): boolean {
    return !!this.config.token && !!this.config.signingSecret;
  }

  isReady(): boolean {
    return this.isConnected && this.isConfigured();
  }

  // Send notification to specific channel
  async sendNotification(notification: SlackNotification, channelOverride?: string): Promise<boolean> {
    if (!this.isReady()) {
      console.warn('Slack not configured. Notification skipped:', notification.title);
      return false;
    }

    try {
      const channel = channelOverride || this.getChannelForNotificationType(notification.type);
      
      const blocks = this.buildNotificationBlocks(notification);
      
      const result = await this.client.chat.postMessage({
        channel,
        text: notification.title, // Fallback text for notifications
        blocks,
        username: 'TalentTrack Bot',
        icon_emoji: ':briefcase:'
      });

      return !!result.ok;
    } catch (error) {
      console.error('Failed to send Slack notification:', error);
      return false;
    }
  }

  // Send interactive candidate card for approvals
  async sendInteractiveCard(card: SlackInteractiveCard, channel?: string): Promise<boolean> {
    if (!this.isReady()) {
      console.warn('Slack not configured. Interactive card skipped');
      return false;
    }

    try {
      const targetChannel = channel || this.config.channel.hiring;
      
      const blocks = this.buildCandidateCard(card);
      
      const result = await this.client.chat.postMessage({
        channel: targetChannel,
        text: `New candidate for review: ${card.candidate.name}`,
        blocks,
        username: 'TalentTrack Bot',
        icon_emoji: ':memo:'
      });

      return !!result.ok;
    } catch (error) {
      console.error('Failed to send interactive card:', error);
      return false;
    }
  }

  // Send direct message to user
  async sendDirectMessage(userId: string, message: string): Promise<boolean> {
    if (!this.isReady()) return false;

    try {
      const result = await this.client.chat.postMessage({
        channel: userId,
        text: message,
        username: 'TalentTrack Bot',
        icon_emoji: ':wave:'
      });

      return !!result.ok;
    } catch (error) {
      console.error('Failed to send direct message:', error);
      return false;
    }
  }

  // Get channel members for notifications
  async getChannelMembers(channelName: string): Promise<string[]> {
    if (!this.isReady()) return [];

    try {
      const channel = await this.client.conversations.info({
        channel: channelName
      });

      if (channel.ok && channel.channel?.id) {
        const members = await this.client.conversations.members({
          channel: channel.channel.id
        });
        
        return members.members || [];
      }
      
      return [];
    } catch (error) {
      console.error('Failed to get channel members:', error);
      return [];
    }
  }

  // Utility method to determine appropriate channel
  private getChannelForNotificationType(type: SlackNotification['type']): string {
    switch (type) {
      case 'new_application':
        return this.config.channel.hiring;
      case 'interview_scheduled':
        return this.config.channel.interviews;
      case 'hiring_decision':
        return this.config.channel.hiring;
      case 'candidate_update':
      default:
        return this.config.channel.notifications;
    }
  }

  // Build notification blocks for rich formatting
  private buildNotificationBlocks(notification: SlackNotification) {
    const urgencyEmoji = {
      low: ':information_source:',
      medium: ':warning:',
      high: ':rotating_light:'
    };

    const blocks: any[] = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${urgencyEmoji[notification.urgency]} ${notification.title}`
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: notification.message
        }
      }
    ];

    // Add candidate information if provided
    if (notification.candidate) {
      blocks.push({
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Candidate:*\n${notification.candidate.name}`
          },
          {
            type: 'mrkdwn',
            text: `*Position:*\n${notification.candidate.position}`
          },
          {
            type: 'mrkdwn',
            text: `*Status:*\n${notification.candidate.status}`
          },
          {
            type: 'mrkdwn',
            text: `*Experience:*\n${notification.candidate.experience} years`
          }
        ]
      });
    }

    // Add timestamp
    blocks.push({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `<!date^${Math.floor(Date.now() / 1000)}^{date_short_pretty} at {time}|${new Date().toLocaleString()}>`
        }
      ]
    });

    return blocks;
  }

  // Build interactive candidate card with action buttons
  private buildCandidateCard(card: SlackInteractiveCard) {
    const candidate = card.candidate;
    
    const blocks: any[] = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `📋 Candidate Review: ${candidate.name}`
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Position:* ${candidate.position}\n*Experience:* ${candidate.experience} years\n*Status:* ${candidate.status}`
        },
        accessory: {
          type: 'image',
          image_url: candidate.avatar || 'https://via.placeholder.com/150x150?text=Avatar',
          alt_text: `${candidate.name} avatar`
        }
      }
    ];

    // Add skills section
    if (candidate.skills && candidate.skills.length > 0) {
      blocks.push({
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Skills:*\n${candidate.skills.slice(0, 5).join(', ')}`
          },
          {
            type: 'mrkdwn',
            text: `*Location:*\n${candidate.location}`
          }
        ]
      });
    }

    // Add action buttons
    if (card.actions.length > 0) {
      const actionElements = card.actions.map(action => ({
        type: 'button',
        text: {
          type: 'plain_text',
          text: action.text
        },
        value: action.value,
        action_id: action.id,
        style: action.style
      }));

      blocks.push({
        type: 'actions',
        elements: actionElements
      });
    }

    return blocks;
  }

  // Predefined notification templates
  async notifyNewApplication(candidate: Candidate): Promise<boolean> {
    return this.sendNotification({
      type: 'new_application',
      title: 'New Candidate Application',
      message: `A new candidate has applied for the ${candidate.position} position. Review their profile and schedule an initial screening.`,
      candidate,
      urgency: 'medium',
      actionRequired: true
    });
  }

  async notifyInterviewScheduled(candidate: Candidate, interviewDate: string, interviewer: string): Promise<boolean> {
    return this.sendNotification({
      type: 'interview_scheduled',
      title: 'Interview Scheduled',
      message: `Interview scheduled for ${candidate.name} on ${interviewDate} with ${interviewer}. Calendar invitation will be sent automatically.`,
      candidate,
      urgency: 'medium'
    });
  }

  async notifyStatusChange(candidate: Candidate, oldStatus: string, newStatus: string): Promise<boolean> {
    return this.sendNotification({
      type: 'candidate_update',
      title: 'Candidate Status Update',
      message: `${candidate.name} status changed from "${oldStatus}" to "${newStatus}".`,
      candidate,
      urgency: 'low'
    });
  }

  async notifyHiringDecision(candidate: Candidate, decision: 'hired' | 'rejected', reason?: string): Promise<boolean> {
    const isPositive = decision === 'hired';
    const emoji = isPositive ? '🎉' : '❌';
    const action = isPositive ? 'hired' : 'rejected';
    
    return this.sendNotification({
      type: 'hiring_decision',
      title: `${emoji} Hiring Decision Made`,
      message: `${candidate.name} has been ${action} for the ${candidate.position} position.${reason ? ` Reason: ${reason}` : ''}`,
      candidate,
      urgency: isPositive ? 'high' : 'medium'
    });
  }

  // Bot command handlers (would be implemented with Slack Bolt framework in backend)
  async handleSlashCommand(command: string, args: string[]): Promise<string> {
    // This would be implemented in a backend service
    // For now, return mock responses
    switch (command) {
      case 'candidate':
        return `🔍 Searching for candidates matching: ${args.join(' ')}`;
      case 'pipeline':
        return `📊 Current pipeline status: 15 active candidates, 3 interviews scheduled`;
      case 'interview':
        return `📅 Interview scheduling initiated. Please check TalentTrack for available slots.`;
      default:
        return `❓ Unknown command. Available commands: /candidate, /pipeline, /interview`;
    }
  }
}

// Export singleton instance
export const slackService = new SlackService();
export default slackService;

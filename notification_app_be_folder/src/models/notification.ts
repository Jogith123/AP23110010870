export type NotificationType = 'placement' | 'event' | 'result';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  targetAudience: string[];
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  isRead: boolean;
}

export interface CreateNotificationRequest {
  type: NotificationType;
  title: string;
  message: string;
  targetAudience: string[];
  priority?: 'low' | 'medium' | 'high';
}

export interface NotificationFilter {
  type?: NotificationType;
  isRead?: boolean;
  priority?: 'low' | 'medium' | 'high';
}

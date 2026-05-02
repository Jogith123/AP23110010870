import { Notification, CreateNotificationRequest, NotificationFilter } from '../models/notification';
import { Log } from '../../../logging_middleware/dist/index';

class NotificationService {
  private notifications: Notification[] = [];

  async createNotification(request: CreateNotificationRequest): Promise<Notification> {
    const notification: Notification = {
      id: this.generateId(),
      type: request.type,
      title: request.title,
      message: request.message,
      targetAudience: request.targetAudience,
      priority: request.priority || 'medium',
      createdAt: new Date(),
      isRead: false
    };

    this.notifications.push(notification);
    await Log('backend', 'info', 'service', `Created ${request.type} notification: ${request.title}`);
    return notification;
  }

  async getNotifications(filter?: NotificationFilter): Promise<Notification[]> {
    let filtered = [...this.notifications];

    if (filter?.type) {
      filtered = filtered.filter(n => n.type === filter.type);
    }

    if (filter?.isRead !== undefined) {
      filtered = filtered.filter(n => n.isRead === filter.isRead);
    }

    if (filter?.priority) {
      filtered = filtered.filter(n => n.priority === filter.priority);
    }

    await Log('backend', 'info', 'service', `Retrieved ${filtered.length} notifications`);
    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async markAsRead(notificationId: string): Promise<Notification | null> {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      await Log('backend', 'info', 'service', `Marked notification ${notificationId} as read`);
      return notification;
    }
    await Log('backend', 'warn', 'service', `Notification ${notificationId} not found`);
    return null;
  }

  async deleteNotification(notificationId: string): Promise<boolean> {
    const index = this.notifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      this.notifications.splice(index, 1);
      await Log('backend', 'info', 'service', `Deleted notification ${notificationId}`);
      return true;
    }
    await Log('backend', 'warn', 'service', `Notification ${notificationId} not found for deletion`);
    return false;
  }

  async getNotificationsByType(type: string): Promise<Notification[]> {
    const filtered = this.notifications.filter(n => n.type === type);
    await Log('backend', 'info', 'service', `Retrieved ${filtered.length} ${type} notifications`);
    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default new NotificationService();

import { Request, Response } from 'express';
import notificationService from '../services/notificationService';
import { CreateNotificationRequest, NotificationFilter } from '../models/notification';
import { Log } from '../../../logging_middleware/dist/index';

export async function createNotification(req: Request, res: Response): Promise<void> {
  try {
    const request: CreateNotificationRequest = req.body;
    
    if (!request.type || !request.title || !request.message || !request.targetAudience) {
      await Log('backend', 'warn', 'controller', 'Missing required fields in notification request');
      res.status(400).json({
        success: false,
        error: 'Missing required fields: type, title, message, targetAudience'
      });
      return;
    }

    const notification = await notificationService.createNotification(request);
    
    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    await Log('backend', 'error', 'controller', `Failed to create notification: ${error}`);
    res.status(500).json({
      success: false,
      error: 'Failed to create notification'
    });
  }
}

export async function getNotifications(req: Request, res: Response): Promise<void> {
  try {
    const filter: NotificationFilter = {};
    
    if (req.query.type) filter.type = req.query.type as any;
    if (req.query.isRead !== undefined) filter.isRead = req.query.isRead === 'true';
    if (req.query.priority) filter.priority = req.query.priority as any;

    const notifications = await notificationService.getNotifications(filter);
    
    res.json({
      success: true,
      data: notifications,
      count: notifications.length
    });
  } catch (error) {
    await Log('backend', 'error', 'controller', `Failed to get notifications: ${error}`);
    res.status(500).json({
      success: false,
      error: 'Failed to get notifications'
    });
  }
}

export async function getNotificationsByType(req: Request, res: Response): Promise<void> {
  try {
    const { type } = req.params;
    const notifications = await notificationService.getNotificationsByType(type);
    
    res.json({
      success: true,
      data: notifications,
      count: notifications.length
    });
  } catch (error) {
    await Log('backend', 'error', 'controller', `Failed to get notifications by type: ${error}`);
    res.status(500).json({
      success: false,
      error: 'Failed to get notifications'
    });
  }
}

export async function markAsRead(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const notification = await notificationService.markAsRead(id);
    
    if (!notification) {
      res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
      return;
    }
    
    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    await Log('backend', 'error', 'controller', `Failed to mark notification as read: ${error}`);
    res.status(500).json({
      success: false,
      error: 'Failed to mark notification as read'
    });
  }
}

export async function deleteNotification(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const deleted = await notificationService.deleteNotification(id);
    
    if (!deleted) {
      res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
      return;
    }
    
    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    await Log('backend', 'error', 'controller', `Failed to delete notification: ${error}`);
    res.status(500).json({
      success: false,
      error: 'Failed to delete notification'
    });
  }
}

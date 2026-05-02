import { Router } from 'express';
import {
  createNotification,
  getNotifications,
  getNotificationsByType,
  markAsRead,
  deleteNotification
} from '../controllers/notificationController';

const router = Router();

router.post('/notifications', createNotification);
router.get('/notifications', getNotifications);
router.get('/notifications/type/:type', getNotificationsByType);
router.patch('/notifications/:id/read', markAsRead);
router.delete('/notifications/:id', deleteNotification);

export default router;

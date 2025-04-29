import { Router } from 'express';
import Notification from '../schema/notification/notificationSchema.js';
import asyncHandler from '../utils/asyncHandler.js';
import authVerify from '../middlewares/auth.middlewares.js';

const notificationRouter = Router();

notificationRouter.use(authVerify);

notificationRouter.get('/student', asyncHandler(async (req, res) => {
  try {
    const notifications = await Notification.find({ 
      user: req.user._id 
    })

    .sort('-createdAt')
    .limit(50)
    .lean();

    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
}));
notificationRouter.get('/unread/count', asyncHandler(async (req, res) => {
    try {
      const count = await Notification.countDocuments({
        user: req.user._id,
        isRead: false
      });
  
      res.json({
        success: true,
        count
      });
    } catch (error) {
      console.error('Error fetching unread count:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch unread notifications count'
      });
    }
  }));
  notificationRouter.post('/mark-read', asyncHandler(async (req, res) => {
    try {
      await Notification.updateMany(
        { user: req.user._id, isRead: false },
        { $set: { isRead: true } }
      );
  
      res.json({
        success: true,
        message: 'All notifications marked as read'
      });
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark notifications as read'
      });
    }}));

export default notificationRouter;
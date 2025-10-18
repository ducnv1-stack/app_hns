const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

/**
 * GET /api/notifications
 * Get user notifications (public for testing)
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.user ? req.user.userId : null;
    
    // Mock notifications data for now
    const notifications = [
      {
        id: 1,
        title: 'Chào mừng đến với HNS!',
        message: 'Tài khoản của bạn đã được tạo thành công.',
        type: 'info',
        read: false,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Tour mới có sẵn',
        message: 'Khám phá tour mới nhất đến Nha Trang!',
        type: 'promotion',
        read: false,
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        title: 'Đặt tour thành công',
        message: 'Bạn đã đặt tour "Buôn Mê Thuột - Pleiku 4N3Đ" thành công.',
        type: 'success',
        read: true,
        created_at: new Date().toISOString()
      }
    ];

    res.json({
      success: true,
      data: notifications,
      pagination: {
        page: 1,
        limit: 10,
        total: notifications.length,
        pages: 1
      }
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notifications',
      message: error.message
    });
  }
});

/**
 * PUT /api/notifications/:id/read
 * Mark notification as read
 */
router.put('/:id/read', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Mock update - in real app, update database
    res.json({
      success: true,
      message: 'Notification marked as read',
      data: { id: parseInt(id), read: true }
    });

  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update notification',
      message: error.message
    });
  }
});

/**
 * PUT /api/notifications/read-all
 * Mark all notifications as read
 */
router.put('/read-all', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Mock update - in real app, update database
    res.json({
      success: true,
      message: 'All notifications marked as read',
      data: { updated_count: 3 }
    });

  } catch (error) {
    console.error('Error updating notifications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update notifications',
      message: error.message
    });
  }
});

/**
 * DELETE /api/notifications/:id
 * Delete notification
 */
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Mock delete - in real app, delete from database
    res.json({
      success: true,
      message: 'Notification deleted successfully',
      data: { id: parseInt(id) }
    });

  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete notification',
      message: error.message
    });
  }
});

module.exports = router;

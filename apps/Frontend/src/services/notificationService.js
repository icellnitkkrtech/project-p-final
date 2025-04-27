import axiosInstance from '../config/axios';

export const notificationService = {
  getNotifications: async () => {
    try {
      const response = await axiosInstance.get('/notifications');
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
    }
  },

  markAsRead: async (notificationId) => {
    try {
      const response = await axiosInstance.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw new Error(error.response?.data?.message || 'Failed to mark notification as read');
    }
  }
};
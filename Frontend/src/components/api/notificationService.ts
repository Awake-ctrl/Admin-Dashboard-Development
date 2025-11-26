// src/api/notificationService.ts

export interface Notification {
  id?: number;
  title: string;
  subtitle?: string;
  icon?: string;
  tag: string;
  status: string;
  recipients_count?: number;
  created_at?: string;
  updated_at?: string;
  sent_at?: string;
}

export interface NotificationStats {
  total_notifications: number;
  sent_notifications: number;
  total_recipients: number;
  total_subscribers: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL+"/api";

class NotificationService {
  
  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to fetch notifications: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Notifications fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  async getStats(): Promise<NotificationStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to fetch stats: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Stats fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }

  async createNotification(notification: Omit<Notification, 'id' | 'created_at' | 'updated_at' | 'sent_at' | 'recipients_count'>): Promise<Notification> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to create notification: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Notification created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async updateNotification(id: number, notification: Partial<Notification>): Promise<Notification> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to update notification: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Notification updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Error updating notification:', error);
      throw error;
    }
  }

  async deleteNotification(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to delete notification: ${response.status} ${response.statusText}`);
      }

      console.log('Notification deleted successfully');
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();
import { api } from './api'; // Your existing API service

// Types
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string;
  role: string;
  bio: string;
  timezone: string;
  // language: string;
  avatarUrl?: string;
}

export interface UserProfileUpdate {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  organization?: string;
  role?: string;
  bio?: string;
  timezone?: string;
  // language?: string;
}

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserSubscriptionDetails {
  plan: string;
  status: string;
  billingCycle: string;
  nextBilling: string | null;
  amount: number;
  features: string[];
  paymentMethod: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  weeklyReports: boolean;
  securityAlerts: boolean;
  marketingEmails: boolean;
  courseUpdates: boolean;
  systemMaintenance: boolean;
}

// API functions
export const accountApi = {
  // Profile
  getProfile: (userId: string): Promise<UserProfile> => 
    api.get<UserProfile>(`/api/account/profile/${userId}`),

  updateProfile: (userId: string, data: UserProfileUpdate): Promise<{message: string}> => 
    api.put<{message: string}>(`/api/account/profile/${userId}`, data),

  // Password
  changePassword: (userId: string, data: PasswordChange): Promise<{message: string}> => 
    api.put<{message: string}>(`/api/account/password/${userId}`, data),

  // Subscription
  getSubscription: (userId: string): Promise<UserSubscriptionDetails> => 
    api.get<UserSubscriptionDetails>(`/api/account/subscription/${userId}`),

  // Notifications
  getNotificationSettings: (userId: string): Promise<NotificationSettings> => 
    api.get<NotificationSettings>(`/api/account/notification-settings/${userId}`),

  updateNotificationSettings: (userId: string, settings: NotificationSettings): Promise<{message: string}> => 
    api.put<{message: string}>(`/api/account/notification-settings/${userId}`, settings),

  // Export Data
  exportData: (userId: string): Promise<{data: any, message: string}> => 
    api.post<{data: any, message: string}>(`/api/account/export-data/${userId}`),

  // Avatar - Special handling for FormData
  uploadAvatar: async (userId: string, file: File): Promise<{success: boolean, url: string, message: string}> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('auth_token');
    // localStorage.setItem('user_id', User_id); 

    
    const response = await fetch(`http://localhost:8000/api/account/upload-avatar/${userId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  deleteAvatar: (userId: string): Promise<{message: string}> => 
    api.delete<{message: string}>(`/api/account/avatar/${userId}`),

  // Subscription cancellation
  cancelSubscription: (userId: string): Promise<{message: string}> => 
    api.post<{message: string}>(`/api/account/cancel-subscription/${userId}`),
};
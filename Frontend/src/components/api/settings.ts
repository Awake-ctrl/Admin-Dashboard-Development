import { api } from './api'; // Import your base API utility (assuming it's in a file like './api')

// ------------------------------------
// 1. TYPES
// ------------------------------------

export interface NotificationTypeSettings {
  email: boolean;
  push: boolean;
  inApp: boolean;
}

export interface PlatformSettings {
  id: number;
  // Branding
  site_name: string;
  site_description: string;
  primary_color: string;
  secondary_color: string;
  logo_url: string | null;
  favicon_url: string | null;
  
  // Email Templates
  welcome_subject: string;
  welcome_content: string;
  course_enrollment_subject: string;
  course_enrollment_content: string;
  
  // Feature Toggles
  enable_registration: boolean;
  enable_course_comments: boolean;
  enable_course_ratings: boolean;
  enable_certificates: boolean;
  enable_progress_tracking: boolean;
  enable_notifications: boolean;
  enable_email_notifications: boolean;
  enable_push_notifications: boolean;
  
  // Notifications (Structure matches the backend JSON field)
  notification_types: {
    courseUpdates: NotificationTypeSettings;
    assignments: NotificationTypeSettings;
    announcements: NotificationTypeSettings;
    systemAlerts: NotificationTypeSettings;
  };
}

// ------------------------------------
// 2. API FUNCTIONS
// ------------------------------------

export const settingsApi = {
  /**
   * Fetches the current platform settings.
   */
  getSettings: (): Promise<PlatformSettings> => 
    api.get<PlatformSettings>('/api/settings'),

  /**
   * Updates platform settings. Supports partial updates.
   */
  updateSettings: (data: Partial<PlatformSettings>): Promise<PlatformSettings> => 
    api.put<PlatformSettings>('/api/settings', data),

  /**
   * Uploads a new logo file and returns the new URL.
   */
  uploadLogo: async (file: File): Promise<{message: string, url: string}> => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Use window.fetch for FormData, assuming the base API is only for JSON
    // Note: You must ensure 'api' (or a fetch wrapper) handles the base URL and auth correctly.
    // This is a direct fetch for simplicity in a file upload context.
    const token = localStorage.getItem('auth_token');
    const API_KEY = import.meta.env.VITE_API_BASE_URL;
    
    const response = await fetch(`${API_KEY}/api/settings/upload-logo`, {
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

  /**
   * Uploads a new favicon file and returns the new URL.
   */
  uploadFavicon: async (file: File): Promise<{message: string, url: string}> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('auth_token');
    const API_KEY = import.meta.env.VITE_API_BASE_URL;
    const response = await fetch(`${API_KEY}/api/settings/upload-favicon`, {
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
};
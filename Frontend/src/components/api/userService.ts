// api/userService.ts
const API_BASE_URL = 'http://localhost:8000';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  exam_type: string;
  subscription_status: string;
  subscription_plan: string;
  join_date: string;
  last_active: string;
  total_study_hours: number;
  tests_attempted: number;
  average_score: number;
  current_rank: number | null;
  account_status: string;
  deletion_requested: boolean;
  deletion_request_date?: string;
  deletion_reason?: string;
}

export interface AccountDeletionRequest {
  id: string;
  user_id: string;
  user_name: string;
  email: string;
  request_date: string;
  reason: string;
  data_to_delete: string[];
  data_to_retain: string[];
  status: string;
  estimated_deletion_date?: string;
  reviewed_by?: string;
  approved_date?: string;
}

export interface UserStats {
  total_users: number;
  total_users_change: number;
  active_users: number;
  active_users_change: number;
  deletion_requests: number;
  pending_review_requests: number;
  monthly_churn: number;
  churn_change: number;
  new_users_today?: number;
}

export interface UserDemographics {
  exam_type: string;
  count: number;
  percentage: number;
}

export interface SubscriptionStats {
  status: string;
  count: number;
  percentage: number;
}

// API functions
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// User management
export const userService = {
  // Get all users with optional filtering
  getUsers: async (filters?: { account_status?: string; exam_type?: string }): Promise<User[]> => {
    const params = new URLSearchParams();
    if (filters?.account_status) params.append('account_status', filters.account_status);
    if (filters?.exam_type) params.append('exam_type', filters.exam_type);
    
    const queryString = params.toString();
    const url = `/users/${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(url);
  },

  // Get single user
  getUser: async (userId: string): Promise<User> => {
    return apiRequest(`/users/${userId}`);
  },

  // Create user
  createUser: async (user: Omit<User, 'id'>): Promise<User> => {
    return apiRequest('/users/', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  },

  // Update user
  updateUser: async (userId: string, userData: Partial<User>): Promise<User> => {
    return apiRequest(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
deleteDeletionRequest: async (requestId: string): Promise<void> => {
    return apiRequest(`/account-deletion-requests/${requestId}`, {
        method: 'DELETE',
    });
},
  // Delete user
  deleteUser: async (userId: string): Promise<void> => {
    return apiRequest(`/users/${userId}`, {
      method: 'DELETE',
    });
  },

  // Account deletion requests
  getDeletionRequests: async (status?: string): Promise<AccountDeletionRequest[]> => {
    const url = status ? `/account-deletion-requests/?status=${status}` : '/account-deletion-requests/';
    return apiRequest(url);
  },

  createDeletionRequest: async (request: Omit<AccountDeletionRequest, 'id'>): Promise<AccountDeletionRequest> => {
    return apiRequest('/account-deletion-requests/', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  updateDeletionRequest: async (requestId: string, requestData: Partial<AccountDeletionRequest>): Promise<AccountDeletionRequest> => {
    return apiRequest(`/account-deletion-requests/${requestId}`, {
      method: 'PUT',
      body: JSON.stringify(requestData),
    });
  },

  // Analytics
  getUserStats: async (): Promise<UserStats> => {
    return apiRequest('/analytics/user-stats');
  },

  getUserDemographics: async (): Promise<{ demographics: UserDemographics[] }> => {
    return apiRequest('/analytics/user-demographics');
  },

  getSubscriptionStats: async (): Promise<{ subscription_stats: SubscriptionStats[] }> => {
    return apiRequest('/analytics/subscription-stats');
  },
};
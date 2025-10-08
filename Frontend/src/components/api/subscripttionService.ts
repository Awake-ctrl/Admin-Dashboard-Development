// api/subscriptionService.ts
const API_BASE_URL = 'http://localhost:8000/api';

export interface SubscriptionPlan {
  id: number;
  name: string;
  max_text: number;
  max_image: number;
  max_audio: number;
  max_expand: number;
  max_with_history: number;
  price: number;
  timedelta: number;
  subscribers: number;
  revenue: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: number;
  user_id: string;
  user_name: string;
  plan_name: string;
  type: string;
  amount: number;
  status: string;
  date: string;
  order_id: string;
  payment_gateway_id?: string;
}

export interface RefundRequest {
  id: number;
  user_id: string;
  user_name: string;
  plan_name: string;
  amount: number;
  reason: string;
  status: string;
  request_date: string;
  processed_date?: string;
  processed_by?: string;
}

export interface SubscriptionStats {
  total_revenue: number;
  total_subscribers: number;
  conversion_rate: number;
  churn_rate: number;
  active_plans: number;
  monthly_recurring_revenue: number;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic API request function
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`Subscription API: ${options.method || 'GET'} ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(response.status, `HTTP error! status: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Subscription API call failed:', error);
    throw error;
  }
}

export const subscriptionService = {
  // Subscription Plans
  getSubscriptionPlans: async (): Promise<SubscriptionPlan[]> => {
    return apiRequest<SubscriptionPlan[]>('/subscription-plans');
  },

  getSubscriptionPlan: async (planId: number): Promise<SubscriptionPlan> => {
    return apiRequest<SubscriptionPlan>(`/subscription-plans/${planId}`);
  },

  createSubscriptionPlan: async (plan: Omit<SubscriptionPlan, 'id' | 'created_at' | 'updated_at'>): Promise<SubscriptionPlan> => {
    return apiRequest<SubscriptionPlan>('/subscription-plans', {
      method: 'POST',
      body: JSON.stringify(plan),
    });
  },

  updateSubscriptionPlan: async (planId: number, planData: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> => {
    return apiRequest<SubscriptionPlan>(`/subscription-plans/${planId}`, {
      method: 'PUT',
      body: JSON.stringify(planData),
    });
  },

  deleteSubscriptionPlan: async (planId: number): Promise<void> => {
    return apiRequest<void>(`/subscription-plans/${planId}`, {
      method: 'DELETE',
    });
  },

  // Transactions
  getTransactions: async (status?: string, userId?: string): Promise<Transaction[]> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (userId) params.append('user_id', userId);
    const queryString = params.toString();
    return apiRequest<Transaction[]>(`/transactions${queryString ? `?${queryString}` : ''}`);
  },

  getTransaction: async (transactionId: number): Promise<Transaction> => {
    return apiRequest<Transaction>(`/transactions/${transactionId}`);
  },

  createTransaction: async (transaction: Omit<Transaction, 'id' | 'date'>): Promise<Transaction> => {
    return apiRequest<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  },

  updateTransaction: async (transactionId: number, transactionData: Partial<Transaction>): Promise<Transaction> => {
    return apiRequest<Transaction>(`/transactions/${transactionId}`, {
      method: 'PUT',
      body: JSON.stringify(transactionData),
    });
  },

  // Refund Requests
  getRefundRequests: async (status?: string): Promise<RefundRequest[]> => {
    const url = status ? `/refund-requests?status=${status}` : '/refund-requests';
    return apiRequest<RefundRequest[]>(url);
  },

  getRefundRequest: async (requestId: number): Promise<RefundRequest> => {
    return apiRequest<RefundRequest>(`/refund-requests/${requestId}`);
  },

  createRefundRequest: async (refundRequest: Omit<RefundRequest, 'id' | 'request_date' | 'processed_date' | 'processed_by'>): Promise<RefundRequest> => {
    return apiRequest<RefundRequest>('/refund-requests', {
      method: 'POST',
      body: JSON.stringify(refundRequest),
    });
  },

  updateRefundRequest: async (requestId: number, requestData: Partial<RefundRequest>): Promise<RefundRequest> => {
    return apiRequest<RefundRequest>(`/refund-requests/${requestId}`, {
      method: 'PUT',
      body: JSON.stringify(requestData),
    });
  },

  // Analytics
  getSubscriptionStats: async (): Promise<SubscriptionStats> => {
    return apiRequest<SubscriptionStats>('/analytics/subscription-stats');
  },

  getRevenueAnalytics: async (period: 'daily' | 'weekly' | 'monthly' = 'monthly'): Promise<any> => {
    return apiRequest(`/analytics/revenue?period=${period}`);
  },

  getPlanPerformance: async (): Promise<{ plan_name: string; subscribers: number; revenue: number }[]> => {
    return apiRequest('/analytics/plan-performance');
  },
};

export { ApiError };
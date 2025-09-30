// api/subscriptionService.ts
const API_BASE_URL = 'http://localhost:8000';

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

export const subscriptionService = {
  // Subscription Plans
  getSubscriptionPlans: async (): Promise<SubscriptionPlan[]> => {
    return apiRequest('/subscription-plans/');
  },

  getSubscriptionPlan: async (planId: number): Promise<SubscriptionPlan> => {
    return apiRequest(`/subscription-plans/${planId}`);
  },

  createSubscriptionPlan: async (plan: Omit<SubscriptionPlan, 'id' | 'created_at' | 'updated_at'>): Promise<SubscriptionPlan> => {
    return apiRequest('/subscription-plans/', {
      method: 'POST',
      body: JSON.stringify(plan),
    });
  },

  updateSubscriptionPlan: async (planId: number, planData: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> => {
    return apiRequest(`/subscription-plans/${planId}`, {
      method: 'PUT',
      body: JSON.stringify(planData),
    });
  },

  deleteSubscriptionPlan: async (planId: number): Promise<void> => {
    return apiRequest(`/subscription-plans/${planId}`, {
      method: 'DELETE',
    });
  },

  // Transactions
  getTransactions: async (status?: string): Promise<Transaction[]> => {
    const url = status ? `/transactions/?status=${status}` : '/transactions/';
    return apiRequest(url);
  },

  createTransaction: async (transaction: Omit<Transaction, 'id' | 'date'>): Promise<Transaction> => {
    return apiRequest('/transactions/', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  },

  // Refund Requests
  getRefundRequests: async (status?: string): Promise<RefundRequest[]> => {
    const url = status ? `/refund-requests/?status=${status}` : '/refund-requests/';
    return apiRequest(url);
  },

  createRefundRequest: async (refundRequest: Omit<RefundRequest, 'id' | 'request_date' | 'processed_date' | 'processed_by'>): Promise<RefundRequest> => {
    return apiRequest('/refund-requests/', {
      method: 'POST',
      body: JSON.stringify(refundRequest),
    });
  },

  updateRefundRequest: async (requestId: number, requestData: Partial<RefundRequest>): Promise<RefundRequest> => {
    return apiRequest(`/refund-requests/${requestId}`, {
      method: 'PUT',
      body: JSON.stringify(requestData),
    });
    },
  updateTransaction: async (transactionId: number, transactionData: Partial<Transaction>): Promise<Transaction> => {
    return apiRequest(`/transactions/${transactionId}`, {
        method: 'PUT',
        body: JSON.stringify(transactionData),
    });
},

  // Analytics
  getSubscriptionStats: async (): Promise<SubscriptionStats> => {
    return apiRequest('/analytics/subscription-stats');
  },
};
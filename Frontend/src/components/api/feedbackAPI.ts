// Fixed API URLs to match backend endpoints


export const feedbackApi = {
  // Support Tickets API
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  getTickets: async (filters?: {
    status?: string;
    priority?: string;
    category?: string;
    assigned_to?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters?.priority && filters.priority !== 'all') params.append('priority', filters.priority);
    if (filters?.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters?.assigned_to && filters.assigned_to !== 'all') params.append('assigned_to', filters.assigned_to);
    
    const response = await fetch(`${API_BASE_URL}/support-tickets?${params}`);
    if (!response.ok) throw new Error('Failed to fetch tickets');
    return response.json();
  },

  getTicket: async (ticketId: number) => {
    const response = await fetch(`${API_BASE_URL}/support-tickets/${ticketId}`);
    if (!response.ok) throw new Error('Failed to fetch ticket');
    return response.json();
  },

  createTicket: async (ticketData: any) => {
    const response = await fetch(`${API_BASE_URL}/support-tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketData)
    });
    if (!response.ok) throw new Error('Failed to create ticket');
    return response.json();
  },

  updateTicket: async (ticketId: number, updates: any) => {
    const response = await fetch(`${API_BASE_URL}/support-tickets/${ticketId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update ticket');
    return response.json();
  },

  addTicketResponse: async (ticketId: number, responseData: any) => {
    const response = await fetch(`${API_BASE_URL}/support-tickets/${ticketId}/responses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(responseData)
    });
    if (!response.ok) throw new Error('Failed to add response');
    return response.json();
  },

  deleteTicket: async (ticketId: number) => {
    const response = await fetch(`${API_BASE_URL}/support-tickets/${ticketId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete ticket');
    return response.json();
  },

  // Course Reviews API
  getReviews: async (filters?: {
    rating?: number;
    sentiment?: string;
    status?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.rating && filters.rating !== 0) params.append('rating', filters.rating.toString());
    if (filters?.sentiment && filters.sentiment !== 'all') params.append('sentiment', filters.sentiment);
    if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
    
    const response = await fetch(`${API_BASE_URL}/course-reviews?${params}`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return response.json();
  },

  getReview: async (reviewId: number) => {
    const response = await fetch(`${API_BASE_URL}/course-reviews/${reviewId}`);
    if (!response.ok) throw new Error('Failed to fetch review');
    return response.json();
  },

  createReview: async (reviewData: any) => {
    const response = await fetch(`${API_BASE_URL}/course-reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    if (!response.ok) throw new Error('Failed to create review');
    return response.json();
  },

  updateReview: async (reviewId: number, updates: any) => {
    const response = await fetch(`${API_BASE_URL}/course-reviews/${reviewId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update review');
    return response.json();
  },

  addReviewResponse: async (reviewId: number, responseData: any) => {
    const response = await fetch(`${API_BASE_URL}/course-reviews/${reviewId}/response`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(responseData)
    });
    if (!response.ok) throw new Error('Failed to add response');
    return response.json();
  },

  deleteReview: async (reviewId: number) => {
    const response = await fetch(`${API_BASE_URL}/course-reviews/${reviewId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete review');
    return response.json();
  },

  // Stats API
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/feedback/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  }
};
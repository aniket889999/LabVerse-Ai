import { Lab, Equipment, Project, ApiResponse } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';

async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      credentials: 'include',
      // Next.js cache bypass for dynamic data during development
      next: { revalidate: 0 } 
    });

    if (!res.ok) {
      if (res.status === 404) {
        return { success: false, error: 'Resource not found.' };
      }
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error(`[API Fetch Error] ${endpoint}:`, error.message);
    return { 
      success: false, 
      error: 'Connection error' 
    };
  }
}

export const api = {
  getLabs: () => fetcher<Lab[]>('/labs'),
  getLabById: (id: string) => fetcher<Lab>(`/labs/${id}`),
  
  getEquipment: (labId?: string) => {
    const params = new URLSearchParams();
    if (labId) params.append('labId', labId);
    return fetcher<Equipment[]>(`/equipment?${params.toString()}`);
  },
  getEquipmentById: (id: string) => fetcher<Equipment>(`/equipment/${id}`),

  getProjects: (params?: { labId?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.labId) query.append('labId', params.labId);
    if (params?.search) query.append('search', params.search);
    return fetcher<Project[]>(`/projects?${query.toString()}`);
  },
  getProjectById: (id: string) => fetcher<Project>(`/projects/${id}`),

  createBooking: (data: any) => fetcher<any>('/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),

  trackEvent: (data: any) => fetcher<any>('/analytics/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),

  getAnalyticsSummary: () => fetcher<any>('/analytics/summary'),

  askAiGuide: (data: any) => fetcher<any>('/ai-guide/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),

  // Auth Methods
  login: (data: any) => fetcher<any>('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
  logout: () => fetcher<any>('/auth/logout', { method: 'POST' }),
  getCurrentUser: () => fetcher<any>('/auth/me'),
};

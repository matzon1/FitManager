import api from './client';
import type { Member, MembershipPlan, Payment, AttendanceLog, DashboardStats, LoginResponse } from '../types';

export const authApi = {
  login: (username: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { username, password }).then(r => r.data),
};

export const membersApi = {
  getAll: () => api.get<Member[]>('/members').then(r => r.data),
  getById: (id: number) => api.get<Member>(`/members/${id}`).then(r => r.data),
  create: (data: Omit<Member, 'id' | 'joinDate' | 'status'>) =>
    api.post<Member>('/members', data).then(r => r.data),
  update: (id: number, data: Partial<Member>) =>
    api.put(`/members/${id}`, data),
  delete: (id: number) => api.delete(`/members/${id}`),
};

export const plansApi = {
  getAll: () => api.get<MembershipPlan[]>('/membershipplans').then(r => r.data),
  create: (data: Omit<MembershipPlan, 'id' | 'isActive'>) =>
    api.post<MembershipPlan>('/membershipplans', data).then(r => r.data),
  delete: (id: number) => api.delete(`/membershipplans/${id}`),
};

export const membershipsApi = {
  getAll: () => api.get('/membermemberships').then(r => r.data),
  assign: (memberId: number, planId: number, startDate: string) =>
    api.post('/membermemberships', { memberId, membershipPlanId: planId, startDate }),
};

export const paymentsApi = {
  getAll: () => api.get<Payment[]>('/payments').then(r => r.data),
  create: (data: { memberId: number; amount: number; status: string; notes: string }) =>
    api.post<Payment>('/payments', data).then(r => r.data),
};

export const attendanceApi = {
  getToday: () => api.get<AttendanceLog[]>('/attendance').then(r => r.data),
  checkIn: (memberId: number) => api.post(`/attendance/checkin/${memberId}`),
  checkOut: (logId: number) => api.put(`/attendance/checkout/${logId}`),
};

export const dashboardApi = {
  getStats: () => api.get<DashboardStats>('/dashboard').then(r => r.data),
};

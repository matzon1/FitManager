export type MemberStatus = 'Active' | 'Frozen' | 'Expired' | 'Cancelled';
export type PaymentStatus = 'Paid' | 'Pending' | 'Overdue' | 'Refunded';
export type MembershipStatus = 'Active' | 'Expired' | 'Cancelled';
export type UserRole = 'Admin' | 'Staff';

export interface Member {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  joinDate: string;
  status: MemberStatus;
}

export interface MembershipPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  durationMonths: number;
  isActive: boolean;
}

export interface MemberMembership {
  id: number;
  memberId: number;
  memberName: string;
  planName: string;
  startDate: string;
  endDate: string;
  status: MembershipStatus;
}

export interface Payment {
  id: number;
  memberId: number;
  memberName: string;
  amount: number;
  paymentDate: string;
  status: PaymentStatus;
  notes: string;
}

export interface AttendanceLog {
  id: number;
  memberId: number;
  memberName: string;
  checkInTime: string;
  checkOutTime?: string;
}

export interface DashboardStats {
  totalActiveMembers: number;
  revenueThisMonth: number;
  checkInsToday: number;
  expiringSoon: number;
  recentCheckIns: AttendanceLog[];
}

export interface LoginResponse {
  token: string;
  username: string;
  role: UserRole;
}

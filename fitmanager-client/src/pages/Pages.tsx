import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import { authApi } from '../api/endpoints';
import { useAuthStore } from '../store/authStore';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore(s => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const data = await authApi.login(username, password);
      login(data.token, data.username, data.role);
      navigate('/');
    } catch {
      setError('Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl border border-gray-200 p-8 w-full max-w-sm">
        <div className="flex items-center gap-2 mb-6">
          <Dumbbell className="text-blue-600" size={24} />
          <span className="font-semibold text-xl text-gray-900">FitManager</span>
        </div>
        <h1 className="text-lg font-medium text-gray-800 mb-6">Sign in</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Username</label>
            <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username} onChange={e => setUsername(e.target.value)} placeholder="admin" required />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input type="password" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password} onChange={e => setPassword(e.target.value)} placeholder="admin123" required />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-4">Demo: admin / admin123 or staff / staff123</p>
      </div>
    </div>
  );
}

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/endpoints';
import { Users, DollarSign, CalendarCheck, AlertCircle } from 'lucide-react';

export function DashboardPage() {
  const { data, isLoading } = useQuery({ queryKey: ['dashboard'], queryFn: dashboardApi.getStats });

  if (isLoading) return <div className="text-gray-500">Loading...</div>;

  const stats = [
    { label: 'Active members', value: data?.totalActiveMembers ?? 0, icon: Users, color: 'text-blue-600' },
    { label: 'Revenue this month', value: `$${(data?.revenueThisMonth ?? 0).toFixed(2)}`, icon: DollarSign, color: 'text-green-600' },
    { label: 'Check-ins today', value: data?.checkInsToday ?? 0, icon: CalendarCheck, color: 'text-purple-600' },
    { label: 'Expiring soon', value: data?.expiringSoon ?? 0, icon: AlertCircle, color: 'text-amber-600' },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className={`${color} mb-2`}><Icon size={20} /></div>
            <div className="text-2xl font-semibold text-gray-900">{value}</div>
            <div className="text-sm text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h2 className="font-medium text-gray-800 mb-4">Recent check-ins</h2>
        <div className="space-y-2">
          {data?.recentCheckIns.map(log => (
            <div key={log.id} className="flex justify-between text-sm py-2 border-b border-gray-100 last:border-0">
              <span className="font-medium text-gray-800">{log.memberName}</span>
              <span className="text-gray-500">{new Date(log.checkInTime).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { membersApi } from '../api/endpoints';
import { Plus } from 'lucide-react';
import type { Member } from '../types';
import { useAuthStore as useAuth } from '../store/authStore';

export function MembersPage() {
  const { data: members, isLoading, refetch } = useQuery({ queryKey: ['members'], queryFn: membersApi.getAll });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '' });
  const role = useAuth(s => s.role);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await membersApi.create(form);
    setShowForm(false);
    setForm({ firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '' });
    refetch();
  };

  const statusColor = (s: string) => ({
    Active: 'bg-green-100 text-green-700',
    Frozen: 'bg-blue-100 text-blue-700',
    Expired: 'bg-gray-100 text-gray-600',
    Cancelled: 'bg-red-100 text-red-700',
  }[s] ?? 'bg-gray-100 text-gray-600');

  if (isLoading) return <div className="text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Members</h1>
        {role === 'Admin' && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            <Plus size={16} /> Add member
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h2 className="font-medium text-gray-800 mb-4">New member</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-2 gap-3">
            {(['firstName', 'lastName', 'email', 'phone'] as const).map(f => (
              <input key={f} placeholder={f} required
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })} />
            ))}
            <input type="date" required
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.dateOfBirth} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} />
            <div className="col-span-2 flex gap-2 justify-end">
              <button type="button" onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>{['Name', 'Email', 'Phone', 'Joined', 'Status'].map(h => (
              <th key={h} className="text-left px-4 py-3 font-medium text-gray-600">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members?.map((m: Member) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{m.firstName} {m.lastName}</td>
                <td className="px-4 py-3 text-gray-600">{m.email}</td>
                <td className="px-4 py-3 text-gray-600">{m.phone}</td>
                <td className="px-4 py-3 text-gray-600">{new Date(m.joinDate).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(m.status)}`}>{m.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

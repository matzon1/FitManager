import { useState } from 'react';
import Button from '../components/ui/Button';
import Badge, {type Tone } from '../components/ui/Badge';
import  Card from '../components/ui/Card';
import {Input} from '../components/ui/Field';
import { membersApi } from '../api/endpoints';
import { Plus } from 'lucide-react';
import type { Member } from '../types';
import { useAuthStore as useAuth } from '../store/authStore';
import { parseUtc } from '../utils/dates';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/endpoints';
import { Users, DollarSign, CalendarCheck, AlertCircle } from 'lucide-react';

export function DashboardPage() {
  const { data, isLoading, isError } = useQuery({ queryKey: ['dashboard'], queryFn: dashboardApi.getStats });

  if (isLoading) return <div className="text-gray-500">Loading...</div>;

  if (isError) return <div className="text-red-600">Could not load the dashboard. Please try again later.</div>;
  
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
              <span className="text-gray-500">{parseUtc(log.checkInTime).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

  const statusToneColor: Record<string, Tone> = { 
    Active: 'success',
  Frozen: 'info',
  Expired: 'neutral',
  Cancelled: 'danger',
  };

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




  if (isLoading) return <div className="text-muted">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-x1 font-semibold text-foreground">Members</h1>
        {role === 'Admin' && (
          <Button onClick={() => setShowForm(true)}>
            <Plus size={16} /> Add member
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="p-5 mb-6">
          <h2 className="font-medium mb-4 text-foreground">New member</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-2 gap-3">
            {(['firstName', 'lastName', 'email', 'phone'] as const).map(f => (
              <Input key={f} placeholder={f} required
                value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })} />
            ))}
            <Input type="date" required
              value={form.dateOfBirth} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} />
            <div className="col-span-2 flex gap-2 justify-end">
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" >Save</Button>
            </div>
          </form>
        </Card>
      )}

   <Card className="overflow-hidden">
  <table className="w-full text-sm">
    <thead className="bg-surface-2 border-b border-border">
      <tr>{['Name', 'Email', 'Phone', 'Joined', 'Status'].map(h => (
        <th key={h} className="text-left px-4 py-3 font-medium text-muted">{h}</th>
      ))}</tr>
    </thead>
    <tbody className="divide-y divide-border">
      {members?.map((m: Member) => (
        <tr key={m.id} className="hover:bg-surface-2">
          <td className="px-4 py-3 font-medium text-foreground">{m.firstName} {m.lastName}</td>
          <td className="px-4 py-3 text-muted">{m.email}</td>
          <td className="px-4 py-3 text-muted">{m.phone}</td>
          <td className="px-4 py-3 text-muted">{new Date(m.joinDate).toLocaleDateString()}</td>
          <td className="px-4 py-3">
            <Badge tone={statusToneColor[m.status] ?? 'neutral'}>{m.status}</Badge>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</Card>
    </div>
  );
}

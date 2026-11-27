
import { useQuery } from '@tanstack/react-query';
import { membersApi, membershipsApi, plansApi } from '../api/endpoints';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Plus } from 'lucide-react';
import Button from '../components/ui/Button';





export function MembershipsPage() {
  const { data: memberships, isLoading, refetch } = useQuery({ queryKey: ['memberships'], queryFn: membershipsApi.getAll });   
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ memberId: 0, planId: 0, startDate: '' });
  const role = useAuthStore(s => s.role);
  const { data: members } = useQuery({ queryKey: ['members'], queryFn: membersApi.getAll });
  const { data: plans } = useQuery({ queryKey: ['plans'], queryFn: plansApi.getAll }); 


    const handleCreate = async (e: React.FormEvent) => {
      e.preventDefault();
      if (form.memberId === 0 || form.planId === 0) return;
      await membershipsApi.assign(form.memberId, form.planId, form.startDate);
      setShowForm(false);
      setForm({ memberId: 0, planId: 0, startDate: '' });
      refetch();
    }; 
  
      const statusColor = (s: string) => ({
    Active: 'bg-green-100 text-green-700',
    Expired: 'bg-gray-100 text-gray-600',
    Cancelled: 'bg-red-100 text-red-700',
  }[s] ?? 'bg-gray-100 text-gray-600');
  
  if (isLoading) return <div className="text-gray-500">Loading...</div>;


  return (

    <div>
     <h1 className="text-xl font-semibold text-gray-900">Memberships</h1>
  <table className="w-full text-sm">
    <thead className="bg-gray-50 border-b border-gray-200">
      <tr>{['Member', 'Plan', 'Start Date', 'End', 'Status'].map(h => (<th key={h} className="px-4 py-2 text-left">{h}</th>))}</tr>
    </thead>
    <tbody>
      {memberships?.map(membership => (
        <tr key={membership.id} className="border-b border-gray-200">
          <td className="px-4 py-2">{membership.memberName}</td>
          <td className="px-4 py-2">{membership.planName}</td>
          <td className="px-4 py-2">{new Date(membership.startDate).toLocaleDateString()}</td>
          <td className="px-4 py-2">{new Date(membership.endDate).toLocaleDateString()}</td>
          <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(membership.status)}`}>{membership.status}</span>
                </td> 
        </tr>
      ))}
    </tbody>
  </table>

        <div className="flex items-center justify-between mb-6">
        {role === 'Admin' && (
          <Button onClick={() => setShowForm(true)}>
            <Plus size={16} /> Assign membership
          </Button>
        )}
       {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h2 className="font-medium text-gray-800 mb-4">New membership</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-2 gap-3">

            <select
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.memberId}
            onChange={e => setForm({ ...form, memberId: Number(e.target.value) })}>
            <option value={0}>Select member</option>
            {members?.map(m => (
                <option key={m.id} value={m.id}>
                {m.firstName} {m.lastName}
                </option>
            ))}
            </select>

             <input className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
             value={form.startDate}
             type="date" 
            onChange={e => setForm({ ...form, startDate: (e.target.value) })}/>


            <select
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
             value={form.planId}
            onChange={e => setForm({ ...form, planId: Number(e.target.value) })}>
            <option value={0}>Select plan</option>
            {plans?.filter(p => p.isActive).map(p => (
                <option key={p.id} value={p.id}>
                {p.name} {p.price.toFixed(2)}
                </option>
            ))}
            </select>


            <div className="col-span-2 flex gap-2 justify-end">
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" >Save</Button>
            </div>
          </form>
       </div>
       )}
    </div>




</div>



)}
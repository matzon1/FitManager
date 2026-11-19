import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { paymentsApi } from '../api/endpoints';
import type { Payment } from '../types';        
import { Plus } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { membersApi } from '../api/endpoints';
import { parseUtc } from '../utils/dates';


export function PaymentsPage() {
  const { data: payments, isLoading, refetch } = useQuery({ queryKey: ['payments'], queryFn: paymentsApi.getAll });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ memberId: 0, amount: 0, status: 0, notes: '' });   
  const role = useAuthStore(s => s.role);
  const { data: members } = useQuery({ queryKey: ['members'], queryFn: membersApi.getAll });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await paymentsApi.create(form);
    setShowForm(false);
    setForm({ memberId: 0, amount: 0, status: 0, notes: '' });
    refetch();
  };


if (isLoading) return <div className="text-gray-500">Loading...</div>;

return (
    <div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>{['Member', 'Amount', 'Status', 'Notes', 'Payment Date'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-medium text-gray-600">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payments?.map((p: Payment) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{p.memberName}</td>
                    <td className="px-4 py-3 text-gray-600">{p.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-gray-600">{p.status}</td>
                    <td className="px-4 py-3 text-gray-600">{p.notes}</td>
                    <td className="px-4 py-3 text-gray-600">{parseUtc(p.paymentDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

        <h1 className="text-xl font-semibold text-gray-900">Payments</h1>
      <div className="flex items-center justify-between mb-6">
        {role === 'Admin' && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            <Plus size={16} /> Add payment
          </button>
        )}
       {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h2 className="font-medium text-gray-800 mb-4">New payment</h2>
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
             value={form.amount}
             type="number" step="0.01"
             placeholder="Amount"
            onChange={e => setForm({ ...form, amount: Number(e.target.value) })}/>


            <select
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
             value={form.status}
            onChange={e => setForm({ ...form, status: Number(e.target.value) })}>
            <option value={0}>Paid</option>
            <option value={1}>Pending</option>
            <option value={2}>Overdue</option>
            <option value={3}>Refunded</option>
            </select>

             <input className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
             value={form.notes}
             placeholder="Notes"
            onChange={e => setForm({ ...form, notes: (e.target.value) })}/>

            <div className="col-span-2 flex gap-2 justify-end">
              <button type="button" onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
            </div>
          </form>
       </div>
       )}
    </div>
  </div>
  );
}
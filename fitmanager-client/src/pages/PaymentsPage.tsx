import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { paymentsApi } from '../api/endpoints';
import type { Payment } from '../types';        



export function PaymentsPage() {
  const { data: payments, isLoading, refetch } = useQuery({ queryKey: ['payments'], queryFn: paymentsApi.getAll });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ memberId: 0, amount: 0, status: 0, notes: '' });   


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
                    <td className="px-4 py-3 text-gray-600">{new Date(p.paymentDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
    </div>
  );


}
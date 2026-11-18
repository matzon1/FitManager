
import { useQuery } from '@tanstack/react-query';
import { membershipsApi } from '../api/endpoints';





export function MembershipsPage() {
  const { data: memberships, isLoading } = useQuery({ queryKey: ['memberships'], queryFn: membershipsApi.getAll });
/*   const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ memberId: 0, planId: 0, startDate: '' });
  const role = useAuthStore(s => s.role);
  const { data: members } = useQuery({ queryKey: ['members'], queryFn: membershipsApi.getAll });
  const { data: plans } = useQuery({ queryKey: ['plans'], queryFn: plansApi.getAll });   */


 /*   const handleCreate = async (e: React.FormEvent) => {
      e.preventDefault();
      await paymentsApi.create(form);
      setShowForm(false);
      setForm({ memberId: 0, amount: 0, status: 0, notes: '' });
      refetch();
    }; */
  
      const statusColor = (s: string) => ({
    Active: 'bg-green-100 text-green-700',
    Expired: 'bg-gray-100 text-gray-600',
    Cancelled: 'bg-red-100 text-red-700',
  }[s] ?? 'bg-gray-100 text-gray-600');
  
  if (isLoading) return <div className="text-gray-500">Loading...</div>;


  return (

    <div>
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
</div>
)
}
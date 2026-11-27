import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { paymentsApi, membersApi } from "../api/endpoints";
import type { Payment } from "../types";
import { Plus } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { parseUtc } from "../utils/dates";
import Button from "../components/ui/Button";
import Badge, { type Tone } from "../components/ui/Badge";
import Card from "../components/ui/Card";
import { Input, Select } from "../components/ui/Field";

const statusTone: Record<string, Tone> = {
  Paid: "success",
  Pending: "warning",
  Overdue: "danger",
  Refunded: "neutral",
};

export function PaymentsPage() {
  const {
    data: payments,
    isLoading,
    refetch,
  } = useQuery({ queryKey: ["payments"], queryFn: paymentsApi.getAll });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    memberId: 0,
    amount: 0,
    status: 0,
    notes: "",
  });
  const role = useAuthStore((s) => s.role);
  const { data: members } = useQuery({
    queryKey: ["members"],
    queryFn: membersApi.getAll,
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await paymentsApi.create(form);
    setShowForm(false);
    setForm({ memberId: 0, amount: 0, status: 0, notes: "" });
    refetch();
  };

  if (isLoading) return <div className="text-muted">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-foreground">Payments</h1>
        {role === "Admin" && (
          <Button onClick={() => setShowForm(true)}>
            <Plus size={16} /> Add payment
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="p-5 mb-6 ">
          <h2 className="font-medium mb-4 text-foreground">New payment</h2>
          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <Select
              value={form.memberId}
              onChange={(e) =>
                setForm({ ...form, memberId: Number(e.target.value) })
              }
            >
              <option value={0}>Select member</option>
              {members?.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.firstName} {m.lastName}
                </option>
              ))}
            </Select>

            <Input
              type="number"
              step="0.01"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: Number(e.target.value) })
              }
            />

            <Select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: Number(e.target.value) })
              }
            >
              <option value={0}>Paid</option>
              <option value={1}>Pending</option>
              <option value={2}>Overdue</option>
              <option value={3}>Refunded</option>
            </Select>

            <Input
              placeholder="Notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />

            <div className="sm:col-span-2 flex gap-2 justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 border-b border-border">
            <tr>
              {["Member", "Amount", "Status", "Notes", "Payment Date"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 font-medium text-muted"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {payments?.map((p: Payment) => (
              <tr key={p.id} className="hover:bg-surface-2">
                <td className="px-4 py-3 font-medium text-foreground">
                  {p.memberName}
                </td>
                <td className="px-4 py-3 text-foreground">
                  {p.amount.toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={statusTone[p.status] ?? "neutral"}>
                    {p.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted">{p.notes}</td>
                <td className="px-4 py-3 text-muted">
                  {parseUtc(p.paymentDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

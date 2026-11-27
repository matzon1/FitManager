import { useQuery } from "@tanstack/react-query";
import { membersApi, membershipsApi, plansApi } from "../api/endpoints";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Plus } from "lucide-react";
import Button from "../components/ui/Button";
import Badge, { type Tone } from "../components/ui/Badge";
import Card from "../components/ui/Card";
import { Input, Select } from "../components/ui/Field";

const statusTone: Record<string, Tone> = {
  Active: "success",
  Expired: "neutral",
  Cancelled: "danger",
};

export function MembershipsPage() {
  const {
    data: memberships,
    isLoading,
    refetch,
  } = useQuery({ queryKey: ["memberships"], queryFn: membershipsApi.getAll });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ memberId: 0, planId: 0, startDate: "" });
  const role = useAuthStore((s) => s.role);
  const { data: members } = useQuery({
    queryKey: ["members"],
    queryFn: membersApi.getAll,
  });
  const { data: plans } = useQuery({
    queryKey: ["plans"],
    queryFn: plansApi.getAll,
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.memberId === 0 || form.planId === 0) return;
    await membershipsApi.assign(form.memberId, form.planId, form.startDate);
    setShowForm(false);
    setForm({ memberId: 0, planId: 0, startDate: "" });
    refetch();
  };

  if (isLoading) return <div className="text-muted">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-foreground">Memberships</h1>
        {role === "Admin" && (
          <Button onClick={() => setShowForm(true)}>
            <Plus size={16} /> Assign membership
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="p-5 mb-6">
          <h2 className="font-medium mb-4 text-foreground">New membership</h2>
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
              type="date"
              required
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />

            <Select
              value={form.planId}
              onChange={(e) =>
                setForm({ ...form, planId: Number(e.target.value) })
              }
            >
              <option value={0}>Select plan</option>
              {plans
                ?.filter((p) => p.isActive)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.price.toFixed(2)}
                  </option>
                ))}
            </Select>

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
              {["Member", "Plan", "Start Date", "End", "Status"].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 font-medium text-muted"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {memberships?.map((membership) => (
              <tr key={membership.id} className="hover:bg-surface-2">
                <td className="px-4 py-3 font-medium text-foreground">
                  {membership.memberName}
                </td>
                <td className="px-4 py-3 text-muted">{membership.planName}</td>
                <td className="px-4 py-3 text-muted">
                  {new Date(membership.startDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-muted">
                  {new Date(membership.endDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={statusTone[membership.status] ?? "neutral"}>
                    {membership.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

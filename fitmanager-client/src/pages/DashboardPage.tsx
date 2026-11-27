import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/endpoints";
import { Users, DollarSign, CalendarCheck, AlertCircle } from "lucide-react";
import { parseUtc } from "../utils/dates";
import Card from "../components/ui/Card";

export function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardApi.getStats,
  });

  if (isLoading) return <div className="text-muted">Loading...</div>;

  if (isError)
    return (
      <div className="text-danger">
        Could not load the dashboard. Please try again later.
      </div>
    );

  const stats = [
    {
      label: "Active members",
      value: data?.totalActiveMembers ?? 0,
      icon: Users,
      tone: "bg-primary/20 text-primary-text",
    },
    {
      label: "Revenue this month",
      value: `$${(data?.revenueThisMonth ?? 0).toFixed(2)}`,
      icon: DollarSign,
      tone: "bg-success/20 text-success",
    },
    {
      label: "Check-ins today",
      value: data?.checkInsToday ?? 0,
      icon: CalendarCheck,
      tone: "bg-primary/20 text-primary-text",
    },
    {
      label: "Expiring soon",
      value: data?.expiringSoon ?? 0,
      icon: AlertCircle,
      tone: "bg-warning/20 text-warning",
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold text-foreground mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <Card key={label} className="p-4">
            <div className={`inline-flex p-2 rounded-lg mb-3 ${tone}`}>
              <Icon size={20} />
            </div>
            <div className="text-2xl font-semibold text-foreground">
              {value}
            </div>
            <div className="text-sm text-muted mt-1">{label}</div>
          </Card>
        ))}
      </div>
      <Card className="p-4">
        <h2 className="font-medium text-foreground mb-4">Recent check-ins</h2>
        {data?.recentCheckIns.length === 0 ? (
          <p className="text-muted">No check-ins yet today.</p>
        ) : (
          <div className="divide-y divide-border">
            {data?.recentCheckIns.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between py-2"
              >
                <span className="font-medium text-foreground">
                  {log.memberName}
                </span>
                <span className="text-muted">
                  {parseUtc(log.checkInTime).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

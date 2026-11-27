import { useQuery } from "@tanstack/react-query";
import { attendanceApi, membersApi } from "../api/endpoints";
import { useState } from "react";
import { parseUtc } from "../utils/dates";
import { isAxiosError } from "axios";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { Select } from "../components/ui/Field";

export function AttendancePage() {
  const {
    data: attendanceLogs,
    isLoading,
    refetch,
  } = useQuery({ queryKey: ["attendance"], queryFn: attendanceApi.getToday });
  const [error, setError] = useState("");
  const [memberId, setMemberId] = useState(0);
  const { data: members } = useQuery({
    queryKey: ["members"],
    queryFn: membersApi.getAll,
  });

  if (isLoading) return <div className="text-gray-500">Loading...</div>;

  const handleCheckOut = async (id: number) => {
    try {
      setError("");
      await attendanceApi.checkOut(id);
      refetch();
    } catch {
      setError("Failed to check out. Please try again.");
    }
  };

  const handleCheckIn = async () => {
    setError("");
    if (memberId === 0) {
      setError("Please select a member to check in.");
      return;
    }
    try {
      await attendanceApi.checkIn(memberId);
      setMemberId(0); // Reset the selected member after check-in
      refetch();
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 409) {
        setError("Member is already checked in.");
      } else {
        setError("Failed to check in. Please try again.");
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-foreground">Attendance</h1>
      </div>

      <Card className="p-5 mb-6">
        <h2 className="font-medium mb-4 text-foreground">Check in a member</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select
            value={memberId}
            onChange={(e) => setMemberId(Number(e.target.value))}
          >
            <option value={0}>Select a member</option>
            {members?.map((member) => (
              <option key={member.id} value={member.id}>
                {member.firstName} {member.lastName}
              </option>
            ))}
          </Select>
          <Button
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors "
            onClick={handleCheckIn}
          >
            Check In
          </Button>
        </div>
        {error && (
          <p role="alert" className="text-sm text-danger mt-3">
            {error}
          </p>
        )}
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 border-b border-border">
            <tr>
              {["Member", "Check-in Time", "Check-out Time"].map((h) => (
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
            {attendanceLogs?.map((log) => (
              <tr key={log.id} className="hover:bg-surface-2">
                <td className="px-4 py-3 font-medium text-foreground">
                  {log.memberName}
                </td>
                <td className="px-4 py-3 text-muted">
                  {log.checkInTime
                    ? parseUtc(log.checkInTime).toLocaleString()
                    : "Not checked in"}
                </td>
                <td className="px-4 py-3 text-muted">
                  {log.checkOutTime ? (
                    parseUtc(log.checkInTime).toLocaleString()
                  ) : (
                    <Button
                      variant="link"
                      onClick={() => handleCheckOut(log.id)}
                    >
                      Check Out
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

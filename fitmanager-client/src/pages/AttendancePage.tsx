
import { useQuery } from '@tanstack/react-query';
import { attendanceApi, membersApi } from '../api/endpoints';
import { useState } from 'react';
import {parseUtc}  from '../utils/dates';
import axios, { isAxiosError } from 'axios';



export function AttendancePage() {   

    const { data: attendanceLogs, isLoading, refetch } = useQuery({ queryKey: ['attendance'], queryFn: attendanceApi.getToday });
    const [error, setError] = useState('');
    const [memberId, setMemberId] = useState(0);    
    const { data: members } = useQuery({ queryKey: ['members'], queryFn: membersApi.getAll });

    if (isLoading) return <div className="text-gray-500">Loading...</div>;
    
    const handleCheckOut = async (id: number) => { try {
        setError('');
        await attendanceApi.checkOut(id);
        refetch();
    } catch {
        setError('Failed to check out. Please try again.');
    }
    };

    const handleCheckIn = async () => {
          setError('');
        if (memberId === 0) {
            setError('Please select a member to check in.');
            return;
        }
        try {
            await attendanceApi.checkIn(memberId);
            setMemberId(0); // Reset the selected member after check-in
            refetch();
        } catch (err) {
            if (isAxiosError(err) && err.response?.status === 409) {
                setError('Member is already checked in.');
            } else {
                setError('Failed to check in. Please try again.');
            }
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Attendance</h1>

        <div className="mb-4">
            <select value={memberId} onChange={(e) => setMemberId(Number(e.target.value))} className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value={0}>Select a member</option>
                {members?.map(member => (
                    <option key={member.id} value={member.id}>
                        {member.firstName} {member.lastName}
                    </option>
                ))}
            </select>
            <button onClick={handleCheckIn} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                Check In
            </button>
            </div>
            {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
            <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>{['Member', 'Check-in Time', 'Check-out Time'].map(h => (
                        <th key={h} className="py-2 px-4 text-left">{h}</th>
                    ))}</tr>
                </thead>
                <tbody>
                    {attendanceLogs?.map(log => (
                        <tr key={log.id} className="border-b border-gray-200">
                            <td className="py-2 px-4">{log.memberName}</td>
                            <td className="py-2 px-4">{log.checkInTime ? parseUtc(log.checkInTime).toLocaleTimeString() : 'Not checked in'}</td>
                            <td className="py-2 px-4">{log.checkOutTime ? parseUtc(log.checkOutTime).toLocaleTimeString() : <button onClick={() => handleCheckOut(log.id)} className="text-blue-500 hover:underline">Check Out</button>}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
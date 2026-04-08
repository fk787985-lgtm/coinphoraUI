import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import AdminPage from "../../../components/admin/AdminPage";
import { AdminCard } from "../../../components/admin/AdminCard";
import { EmptyState, ErrorState, LoadingState } from "../../../components/admin/AdminStates";

const baseURL = import.meta.env.VITE_BASE_URL;

const Logs = () => {
  const [expandedEmail, setExpandedEmail] = useState(null);
  const [expandedDate, setExpandedDate] = useState(null);

  // Fetch users and their login logs
  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['getUsers'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${baseURL}/api/getUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });

  // Flatten all login logs with user email attached
  const logData = users.flatMap((user) =>
    (user?.loginLog || []).map((log) => ({
      ...log,
      createdByEmail: user.email,
    }))
  );

  const emails = Array.from(new Set(logData.map((log) => log.createdByEmail)));

  const handleEmailClick = (email) => {
    setExpandedEmail(expandedEmail === email ? null : email);
    setExpandedDate(null); // reset expanded date when switching users
  };

  const handleDateClick = (date) => {
    setExpandedDate(expandedDate === date ? null : date);
  };

  // Group logs by login date
  const groupLogsByDate = (logs) => {
    return logs.reduce((acc, log) => {
      const date = new Date(log?.lastLogin).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(log);
      return acc;
    }, {});
  };

  if (isLoading) {
    return (
      <AdminPage title="User Login Logs" subtitle="Audit sign-ins, devices, and geolocation history.">
        <AdminCard>
          <LoadingState text="Loading logs..." />
        </AdminCard>
      </AdminPage>
    );
  }

  if (isError) {
    return (
      <AdminPage title="User Login Logs" subtitle="Audit sign-ins, devices, and geolocation history.">
        <AdminCard>
          <ErrorState text="Error loading data." />
        </AdminCard>
      </AdminPage>
    );
  }

  return (
    <AdminPage title="User Login Logs" subtitle="Audit sign-ins, devices, and geolocation history.">
      <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <h2 className="mb-4 text-lg font-semibold text-slate-200">Emails</h2>
        <ul className="space-y-2">
          {emails.map((email, index) => (
            <li
              key={index}
              className="cursor-pointer rounded-md px-3 py-2 text-indigo-300 hover:bg-slate-800"
              onClick={() => handleEmailClick(email)}
            >
              {email}
            </li>
          ))}
        </ul>
      </div>

      {expandedEmail && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <h2 className="mb-4 text-lg font-semibold text-slate-200">Logs for {expandedEmail}</h2>
          {Object.entries(
            groupLogsByDate(logData.filter((log) => log.createdByEmail === expandedEmail))
          ).map(([date, logs]) => (
            <div key={date} className="mb-4">
              <h3
                className="cursor-pointer text-base font-semibold text-indigo-300 hover:underline"
                onClick={() => handleDateClick(date)}
              >
                {date}
              </h3>

              {expandedDate === date && (
                <div className="mt-2 rounded-md border border-slate-700 bg-slate-950/80 p-4 shadow-inner">
                  {logs.map((log, index) => (
                    <pre
                      key={index}
                      className="mb-4 overflow-x-auto rounded-md border border-slate-700 bg-black/70 p-4 text-sm text-emerald-300"
                    >{`{
  "createdByEmail": "${log?.createdByEmail}",
  "deviceInfo": {
    "browser": "${log?.deviceInfo?.browser}",
    "os": "${log?.deviceInfo?.os}",
    "device": "${log?.deviceInfo?.device}"
  },
  "lastLogin": "${new Date(log?.lastLogin).toLocaleString()}",
  "latitude": "${log?.latitude}",
  "location": "${log?.location}",
  "longitude": "${log?.longitude}",
  "message": "${log?.message}",
  "userId": "${log?.userId}",
  "_id": "${log?._id}"
}`}</pre>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {!expandedEmail && emails.length === 0 ? (
        <AdminCard>
          <EmptyState text="No login logs available." />
        </AdminCard>
      ) : null}
    </AdminPage>
  );
};

export default Logs;

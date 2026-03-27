import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

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

  console.log('Log Data:', users);
  // Extract unique emails
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

  if (isLoading) return <div className="text-white p-4">Loading...</div>;
  if (isError) return <div className="text-red-400 p-4">Error loading data.</div>;

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">User Login Logs</h1>

      {/* Email list */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Emails</h2>
        <ul className="list-disc pl-6 space-y-1">
          {emails.map((email, index) => (
            <li
              key={index}
              className="cursor-pointer text-blue-400 hover:underline"
              onClick={() => handleEmailClick(email)}
            >
              {email}
            </li>
          ))}
        </ul>
      </div>

      {/* Expanded email logs */}
      {expandedEmail && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Logs for {expandedEmail}</h2>
          {Object.entries(
            groupLogsByDate(logData.filter((log) => log.createdByEmail === expandedEmail))
          ).map(([date, logs]) => (
            <div key={date} className="mb-4">
              <h3
                className="text-lg font-semibold cursor-pointer text-blue-300 hover:underline"
                onClick={() => handleDateClick(date)}
              >
                {date}
              </h3>

              {expandedDate === date && (
                <div className="bg-gray-800 border border-gray-600 rounded-md p-4 shadow-inner mt-2">
                  {logs.map((log, index) => (
                    <pre
                      key={index}
                      className="bg-black text-green-300 p-4 rounded-md text-sm overflow-x-auto mb-4"
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
    </div>
  );
};

export default Logs;

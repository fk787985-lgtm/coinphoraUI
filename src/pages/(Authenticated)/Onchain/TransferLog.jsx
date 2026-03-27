import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const baseURL = import.meta.env.VITE_BASE_URL;

const TransferLog = () => {
  const navigate = useNavigate();

  // Fetch logged-in user
  const { data: userData, isLoading: loadingUser } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const token = localStorage.getItem("uToken");
      const { data } = await axios.get(`${baseURL}/api/getUserById`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });

  // Fetch transfer logs
  const {
    data: apiData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["transferLog"],
    queryFn: async () => {
      const token = localStorage.getItem("uToken");
      const { data } = await axios.get(`${baseURL}/api/getUserTransferLog`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    enabled: !!userData, // wait until userData is ready
    refetchInterval: 10000,
  });

  if (loadingUser || isLoading)
    return (
      <div className="pt-20 text-center text-sm text-gray-400 font-semibold">
        Loading transfer logs...
      </div>
    );

  if (isError)
    return (
      <div className="pt-20 text-center text-red-600 font-bold">
        Error loading transfer logs.
      </div>
    );

  if (!apiData?.length)
    return (
      <div className="pt-20 text-center text-gray-600 font-semibold uppercase">
        No transfer logs found.
      </div>
    );

  return (
    <div className="pt-20 px-4 min-h-screen bg-gradient-to-b from-[#0b0f1a] to-[#131922] text-gray-300 max-w-3xl mx-auto flex flex-col" style={{height: "100vh"}}>
      <h2 className="mb-6 text-xl font-extrabold tracking-wide text-yellow-400">
        Transfer History
      </h2>

      {/* Scrollable container */}
      <div
        className="space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-gray-800"
        style={{ flexGrow: 1, minHeight: 0, overflowX: "hidden" }}
      >
        {apiData.map((transfer) => {
          const loggedPayId = String(userData?.payId);
          const senderId = String(transfer.senderPId);
          const receiverId = String(transfer.receivePId);

          const isSent = senderId === loggedPayId;
          const isReceived = receiverId === loggedPayId;
          const direction = isSent
            ? "Sent"
            : isReceived
            ? "Received"
            : "Unknown";

          const dateObj = new Date(transfer.createdAt);
          const formattedDate = dateObj.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
          const formattedTime = dateObj.toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={transfer._id}
              onClick={() =>
                navigate(`/transfer/log/${transfer._id}`, { state: transfer })
              }
              className={`flex justify-between items-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 cursor-pointer transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg ${
                isSent ? "hover:shadow-red-400/40" : "hover:shadow-green-400/40"
              }`}
            >
              {/* Left Section */}
              <div className="flex flex-col space-y-0.5 max-w-[60%]">
                <span
                  className={`text-xs font-semibold uppercase ${
                    isSent ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {direction}
                </span>
                <span className="text-sm font-bold text-white truncate">
                  {isSent
                    ? `To: ${transfer?.receiverUsername}`
                    : `From: ${transfer?.senderUsername}`}
                </span>
                <span className="text-xs text-gray-400">
                  {formattedDate} · {formattedTime}
                </span>
              </div>

              {/* Right Section */}
              <div className="flex flex-col items-end space-y-1">
                <span className="text-xs uppercase text-gray-500">Amount</span>
                <span className="text-xl font-mono font-extrabold text-white">
                  {isSent ? `-${transfer.amount}` : `+${transfer.amount}`} USDT
                </span>
                <span className="text-xs text-gray-400">{transfer.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransferLog;

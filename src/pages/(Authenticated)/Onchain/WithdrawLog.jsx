import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const baseURL = import.meta.env.VITE_BASE_URL;

const WithdrawLog = () => {
  const navigate = useNavigate();

  const {
    data: apiData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["withdrawLog"],
    queryFn: async () => {
      const token = localStorage.getItem("uToken");
      const { data } = await axios.get(`${baseURL}/api/getUserWithdrawLog`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    refetchInterval: 10000,
  });

  if (isLoading)
    return (
      <div className="pt-20 text-center text-sm text-gray-400 font-sans font-semibold tracking-wide">
        Loading withdraw logs...
      </div>
    );
  if (isError)
    return (
      <div className="pt-20 text-center text-sm text-red-600 font-sans font-bold tracking-wide">
        Error loading withdraw logs. Please try again later.
      </div>
    );
  if (!apiData?.length)
    return (
      <div className="pt-20 text-center text-gray-600 uppercase font-semibold tracking-widest font-sans select-none">
        No withdraw logs found.
      </div>
    );

  return (
    <div className="pt-20 px-4 min-h-screen bg-gradient-to-b from-[#0b0f1a] to-[#131922] font-sans text-gray-300 max-w-3xl mx-auto">
      <h2 className="mb-6 text-xl font-extrabold tracking-wide text-yellow-400 select-none">
        Withdraw History
      </h2>
      <div className="space-y-4">
        {apiData.map((withdraw) => {
          const date = new Date(withdraw.createdAt);
          const formattedDate = date.toLocaleDateString();
          const formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

          const statusColor =
            withdraw.status === "Pending"
              ? "bg-yellow-400 shadow-yellow-400/60"
              : withdraw.status === "Completed"
              ? "bg-green-400 shadow-green-400/60"
              : "bg-red-500 shadow-red-500/70";

          return (
            <div
              key={withdraw._id}
              onClick={() =>
                navigate(`/withdraw/log/${withdraw._id}`, {
                  state: withdraw,
                })
              }
              className="flex justify-between items-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 cursor-pointer transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-yellow-400/40"
            >
              {/* Left Section */}
              <div className="flex flex-col space-y-0.5 max-w-[60%]">
                <span className="text-xs uppercase font-semibold text-yellow-400 tracking-wide select-text">
                  Withdraw via {withdraw.gateway}
                </span>
                <span className="text-base font-bold text-white select-text">
                  {formattedDate}
                </span>
                <span className="text-xs text-gray-400 select-text">{formattedTime}</span>
              </div>

              {/* Right Section */}
              <div className="flex flex-col items-end space-y-1">
                <span className="text-xs uppercase font-semibold text-gray-500 tracking-wider select-text">
                  Amount
                </span>
                <span className="text-xl font-mono font-extrabold text-white select-text">
                  {withdraw.amount} USDT
                </span>
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-3 h-3 rounded-full ${statusColor} animate-pulse shadow-md`}
                    title={withdraw.status}
                  ></span>
                  <span className="uppercase font-semibold text-gray-300 select-text">
                    {withdraw.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WithdrawLog;

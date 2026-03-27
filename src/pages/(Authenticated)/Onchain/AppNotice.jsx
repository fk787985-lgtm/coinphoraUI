import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

const AppNotice = () => {
  const { data: userData, isLoading } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const token = localStorage.getItem("uToken");
      const { data } = await axios.get(`${baseURL}/api/getUserById`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#121821] text-white font-mono">
        Loading notice...
      </div>
    );
  }

  const hasNotice = !!userData?.appNotice?.trim();

  return (
    <div className="bg-[#121821] min-h-screen flex flex-col items-center pt-20 px-4 text-white animate-fade-in font-sans">
      {/* User Greeting */}
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Hello, <span className="text-yellow-400">{userData?.fullName}</span>
      </h1>

      {/* Notice Card */}
      <div
        className={`relative max-w-lg w-full rounded-xl p-6 transition-all 
        ${
          hasNotice
            ? "bg-[#1e2329]/70 border border-yellow-500/30 shadow-yellow-400/20 shadow-md backdrop-blur"
            : "bg-[#1e2329] border border-gray-700/30 text-gray-400"
        }`}
      >
        {/* Glowing Icon (only if there's a notice) */}
        {hasNotice && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#1e2329] p-3 rounded-full shadow-yellow-400/30 shadow-lg border border-yellow-400/40 animate-pulse">
            <span className="text-yellow-400 text-2xl">📢</span>
          </div>
        )}

        <div className={`${hasNotice ? "mt-8" : ""} text-center`}>
          <h2
            className={`text-lg mb-2 ${
              hasNotice
                ? "text-yellow-400 font-bold"
                : "text-gray-500 font-medium"
            }`}
          >
            {hasNotice ? "Important Notice" : "No Current Notices"}
          </h2>

          {hasNotice ? (
            <div className="text-sm leading-relaxed text-[#e0e0e0] space-y-3 text-left whitespace-pre-line">
              {userData.appNotice}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center">
              There are no updates or announcements at this time. Please check
              back later.
            </p>
          )}
        </div>
      </div>

      {/* Last Login Info */}
      <div className="text-xs text-gray-500 mt-6 text-center">
        Last login:{" "}
        {new Date(userData?.lastLoginDate).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </div>
    </div>
  );
};

export default AppNotice;

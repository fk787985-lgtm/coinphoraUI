import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useUpdateUpdateWithdraw } from "../../../hooks/userUpdateUserState";

const baseURL = import.meta.env.VITE_BASE_URL;

const WithdrawLog = () => {
  const [filter, setFilter] = useState("All");

  const {
    mutate,
    isLoading: isMutating,
  } = useUpdateUpdateWithdraw({
    onSuccess: () => {
      toast.success("Withdraw status updated!");
      refetch();
    },
    onError: () => {
      toast.error("Failed to update withdraw status!");
    },
  });

  const {
    data: withdraws,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["withdraws", filter],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${baseURL}/api/getWithdraws`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (filter === "All") return data;
      return data.filter((w) => w.status === filter);
    },
    refetchInterval: 10000,
  });

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    refetch();
  };

  const copyAddress = (address) => {
    navigator.clipboard.writeText(address);
    toast.success("Payment address copied!");
  };

  const handleStatusUpdate = (id, status) => {
    const confirm = window.confirm(`Are you sure to mark this as ${status}?`);
    if (confirm) {
      mutate({ id, status });
    } else {
      toast.error("Action cancelled.");
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-900 min-h-screen text-gray-100">
      <Toaster />
      <h1 className="text-2xl font-semibold mb-4">Withdraw Logs</h1>

      {/* Filter */}
      <div className="mb-4">
        <label className="mr-2">Filter by Status:</label>
        <select
          value={filter}
          onChange={handleFilterChange}
          className="px-4 py-2 border rounded-md bg-gray-800 text-gray-100 border-gray-700"
        >
          <option value="All" className="bg-gray-800 text-gray-100">All</option>
          <option value="Pending" className="bg-gray-800 text-gray-100">Pending</option>
          <option value="Completed" className="bg-gray-800 text-gray-100">Completed</option>
          <option value="Rejected" className="bg-gray-800 text-gray-100">Rejected</option>
        </select>
      </div>

      {/* Withdraw Table or Loading/Error */}
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <svg
            className="animate-spin h-8 w-8 text-blue-400 mr-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <span className="text-blue-400 font-medium">Loading withdraw logs...</span>
        </div>
      ) : isError ? (
        <div className="text-red-500 font-semibold py-10 text-center">
          Error fetching withdraw logs.
        </div>
      ) : (
        <table className="min-w-full border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-800 text-gray-200">
              <th className="border px-4 py-2 border-gray-700">Gateway</th>
              <th className="border px-4 py-2 border-gray-700">User</th>
              <th className="border px-4 py-2 border-gray-700">Amount</th>
              <th className="border px-4 py-2 border-gray-700">Conversion</th>
              <th className="border px-4 py-2 border-gray-700">Payment Address</th>
              <th className="border px-4 py-2 border-gray-700">Status</th>
              <th className="border px-4 py-2 border-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {withdraws?.map((withdraw) => (
              <tr
                key={withdraw._id}
                className="even:bg-gray-800 odd:bg-gray-700 text-gray-100"
              >
                <td className="border px-4 py-2 border-gray-700">{withdraw.gateway}</td>
                <td className="border px-4 py-2 border-gray-700">{withdraw.username}</td>
                <td className="border px-4 py-2 border-gray-700">{withdraw.amount}</td>
                <td className="border px-4 py-2 border-gray-700">
                  {(withdraw.amount / withdraw.coinConversion).toFixed(6)} {withdraw.gateway}
                </td>
                <td className="border px-4 py-2 border-gray-700">
                  {withdraw.paymentAddress}
                  <button
                    onClick={() => copyAddress(withdraw.paymentAddress)}
                    className="ml-2 text-blue-400 text-xs underline"
                  >
                    Copy
                  </button>
                </td>
                <td className="border px-4 py-2 border-gray-700">
                  <span
                    className={`p-1 rounded-full text-white ${
                      withdraw.status === "Completed"
                        ? "bg-green-600"
                        : withdraw.status === "Pending"
                        ? "bg-yellow-500"
                        : "bg-red-600"
                    }`}
                  >
                    {withdraw.status}
                  </span>
                </td>
                <td className="border px-4 py-2 border-gray-700">
                  {withdraw.status === "Pending" ? (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(withdraw._id, "Completed")}
                        className="bg-green-600 text-white px-3 py-1 rounded-md mr-2 disabled:opacity-50"
                        disabled={isMutating}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(withdraw._id, "Rejected")}
                        className="bg-red-600 text-white px-3 py-1 rounded-md disabled:opacity-50"
                        disabled={isMutating}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-400">Closed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WithdrawLog;

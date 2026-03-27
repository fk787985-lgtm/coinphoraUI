import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useUpdateUpdateDeposit } from "../../../hooks/userUpdateUserState";

const baseURL = import.meta.env.VITE_BASE_URL;

const DepositLog = () => {
  const [filter, setFilter] = useState("All");

  const updateMutation = useUpdateUpdateDeposit({
    onSuccess: () => {
      toast.success("Deposit status updated!");
      refetch();
    },
    onError: () => {
      toast.error("Failed to update deposit status!");
    },
  });

  const {
    data: apiData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["deposits", filter],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${baseURL}/api/getDeposits`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return filter === "All" ? data : data.filter((deposit) => deposit.status === filter);
    },
    refetchInterval: 10000,
  });

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    refetch();
  };

  const copyTransactionId = (transactionId) => {
    navigator.clipboard.writeText(transactionId);
    toast.success("Transaction ID copied!");
  };

  const handleStatusUpdate = (id, status) => {
    const confirmed = window.confirm(`Are you sure you want to mark this deposit as ${status}?`);
    if (confirmed) {
      updateMutation.mutate({ id, status });
      toast.success(`Deposit marked as ${status}.`);
    } else {
      toast.error("Action cancelled.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white p-6">
      <Toaster />
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">All Deposit Logs</h1>

      <div className="mb-6">
        <label className="mr-2 text-gray-300">Filter by Status:</label>
        <select
          value={filter}
          onChange={handleFilterChange}
          className="bg-[#1e2738] text-white px-4 py-2 border border-gray-600 rounded-md"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="overflow-auto rounded-md border border-gray-700 bg-[#101827]">
        <table className="min-w-full text-sm">
          <thead className="bg-[#1a2332] text-yellow-300 uppercase">
            <tr>
              <th className="border border-gray-700 px-4 py-2">Gateway</th>
              <th className="border border-gray-700 px-4 py-2">User</th>
              <th className="border border-gray-700 px-4 py-2">Amount</th>
              <th className="border border-gray-700 px-4 py-2">Conversion</th>
              <th className="border border-gray-700 px-4 py-2">Transaction ID</th>
              <th className="border border-gray-700 px-4 py-2">Status</th>
              <th className="border border-gray-700 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-400">
                  Loading deposit logs...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-red-500">
                  Error fetching deposit data.
                </td>
              </tr>
            ) : (
              apiData?.map((deposit) => (
                <tr key={deposit._id} className="text-center border-b border-gray-700">
                  <td className="px-4 py-2 border border-gray-700">{deposit.gateway}</td>
                  <td className="px-4 py-2 border border-gray-700">{deposit.username}</td>
                  <td className="px-4 py-2 border border-gray-700">{deposit.amount}</td>
                  <td className="px-4 py-2 border border-gray-700">
                    {(deposit.amount / deposit.coinConversion).toFixed(6)} {deposit.gateway}
                  </td>
                  <td className="px-4 py-2 border border-gray-700">
                    <div className="flex items-center justify-center gap-2">
                      <span>{deposit.transactionId}</span>
                      <button
                        onClick={() => copyTransactionId(deposit.transactionId)}
                        className="text-blue-400 underline hover:text-blue-300 text-xs"
                      >
                        Copy
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2 border border-gray-700">
                    <span
                      className={`px-2 py-1 text-sm rounded-full ${
                        deposit.status === "Completed"
                          ? "bg-green-500 text-white"
                          : deposit.status === "Pending"
                          ? "bg-yellow-400 text-black"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {deposit.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border border-gray-700">
                    {deposit.status === "Pending" ? (
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleStatusUpdate(deposit._id, "Completed")}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(deposit._id, "Rejected")}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500">Closed</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepositLog;

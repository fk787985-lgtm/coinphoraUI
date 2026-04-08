import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useUpdateUpdateDeposit } from "../../../hooks/userUpdateUserState";
import AdminPage from "../../../components/admin/AdminPage";
import AdminTable from "../../../components/admin/AdminTable";
import AdminStatusBadge from "../../../components/admin/AdminStatusBadge";
import { AdminCard } from "../../../components/admin/AdminCard";
import { EmptyState, ErrorState, LoadingState } from "../../../components/admin/AdminStates";

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
    <AdminPage
      title="Deposit Logs"
      subtitle="Review incoming deposits and approve or reject pending transactions."
      actions={
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-400">Status</label>
          <select value={filter} onChange={handleFilterChange} className="admin-input min-w-[160px]">
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      }
    >
      <Toaster />
      <AdminTable>
          <thead>
            <tr>
              <th>Gateway</th>
              <th>User</th>
              <th>Amount</th>
              <th>Conversion</th>
              <th>Transaction ID</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7}><LoadingState text="Loading deposit logs..." /></td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={7}><ErrorState text="Error fetching deposit data." /></td>
              </tr>
            ) : (
              apiData?.map((deposit) => (
                <tr key={deposit._id}>
                  <td>{deposit.gateway}</td>
                  <td>{deposit.username}</td>
                  <td>{deposit.amount}</td>
                  <td>
                    {(deposit.amount / deposit.coinConversion).toFixed(6)} {deposit.gateway}
                  </td>
                  <td>
                    <div className="flex items-center justify-center gap-2">
                      <span>{deposit.transactionId}</span>
                      <button
                        onClick={() => copyTransactionId(deposit.transactionId)}
                        className="text-xs text-indigo-300 underline hover:text-indigo-200"
                      >
                        Copy
                      </button>
                    </div>
                  </td>
                  <td>
                    <AdminStatusBadge status={deposit.status} />
                  </td>
                  <td>
                    {deposit.status === "Pending" ? (
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleStatusUpdate(deposit._id, "Completed")}
                          className="admin-btn bg-emerald-600 text-white hover:bg-emerald-500"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(deposit._id, "Rejected")}
                          className="admin-btn admin-btn-danger"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-500">Closed</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </AdminTable>
      {apiData?.length === 0 && !isLoading && !isError ? (
        <AdminCard>
          <EmptyState text="No deposit logs found." />
        </AdminCard>
      ) : null}
    </AdminPage>
  );
};

export default DepositLog;

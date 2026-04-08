import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useUpdateUpdateWithdraw } from "../../../hooks/userUpdateUserState";
import AdminPage from "../../../components/admin/AdminPage";
import AdminTable from "../../../components/admin/AdminTable";
import AdminStatusBadge from "../../../components/admin/AdminStatusBadge";
import { AdminCard } from "../../../components/admin/AdminCard";
import { EmptyState, ErrorState, LoadingState } from "../../../components/admin/AdminStates";

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
    <AdminPage
      title="Withdraw Logs"
      subtitle="Review outgoing withdrawals and process pending payout requests."
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
      {isLoading ? (
        <AdminCard><LoadingState text="Loading withdraw logs..." /></AdminCard>
      ) : isError ? (
        <AdminCard><ErrorState text="Error fetching withdraw logs." /></AdminCard>
      ) : (
        <AdminTable>
          <thead>
            <tr>
              <th>Gateway</th>
              <th>User</th>
              <th>Amount</th>
              <th>Conversion</th>
              <th>Payment Address</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {withdraws?.map((withdraw) => (
              <tr key={withdraw._id}>
                <td>{withdraw.gateway}</td>
                <td>{withdraw.username}</td>
                <td>{withdraw.amount}</td>
                <td>
                  {(withdraw.amount / withdraw.coinConversion).toFixed(6)} {withdraw.gateway}
                </td>
                <td>
                  {withdraw.paymentAddress}
                  <button
                    onClick={() => copyAddress(withdraw.paymentAddress)}
                    className="ml-2 text-xs text-indigo-300 underline"
                  >
                    Copy
                  </button>
                </td>
                <td>
                  <AdminStatusBadge status={withdraw.status} />
                </td>
                <td>
                  {withdraw.status === "Pending" ? (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(withdraw._id, "Completed")}
                        className="admin-btn mr-2 bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50"
                        disabled={isMutating}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(withdraw._id, "Rejected")}
                        className="admin-btn admin-btn-danger disabled:opacity-50"
                        disabled={isMutating}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-slate-500">Closed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      )}
      {!isLoading && !isError && withdraws?.length === 0 ? (
        <AdminCard>
          <EmptyState text="No withdraw logs found." />
        </AdminCard>
      ) : null}
    </AdminPage>
  );
};

export default WithdrawLog;

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useUpdateAdminPassword } from "../../../hooks/userUpdateUserState";
import AdminPage from "../../../components/admin/AdminPage";
import { AdminCard, StatCard } from "../../../components/admin/AdminCard";
import AdminModal from "../../../components/admin/AdminModal";

const Dashboard = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updatePasswordMutation = useUpdateAdminPassword();

  const user = {
    name: "Admin Onchain",
    email: "coinphora@gmail.com",
    address: "123 Main St, New York",
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      await updatePasswordMutation.mutateAsync({ password: newPassword });
      toast.success("Password updated successfully!");
      setShowChangePassword(false); // Hide the password change form
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error("Password update failed.");
    }
  };

  const stats = [
    { title: "Total Users", value: "14", meta: "Registered customers" },
    { title: "Total Transactions", value: "111", meta: "All-time records" },
    { title: "Total Deposit", value: "$7,210.00", meta: "Processed amount" },
    { title: "Pending Deposit", value: "$0.00", meta: "Awaiting review" },
    { title: "Total Withdraw", value: "$0.00", meta: "Processed amount" },
    { title: "Pending Withdraw", value: "$0.00", meta: "Awaiting review" },
    { title: "Total Transfer", value: "$0.00", meta: "Internal transfers" },
    { title: "Today Transfer", value: "$0.00", meta: "Today operational flow" },
  ];

  return (
    <AdminPage
      title="Dashboard Overview"
      subtitle="Track platform health, review volume trends, and manage administrative access."
      actions={
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfile(!showProfile)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-lg font-semibold text-white"
          >
            {user.name.charAt(0)}
          </button>

          {showProfile ? (
            <AdminCard className="absolute right-0 mt-2 w-72 space-y-2">
              <p className="text-sm font-semibold text-slate-100">{user.name}</p>
              <p className="text-xs text-slate-400">{user.email}</p>
              <p className="text-xs text-slate-500">{user.address}</p>
              <button
                type="button"
                onClick={() => {
                  setShowChangePassword(true);
                  setShowProfile(false);
                }}
                className="admin-btn admin-btn-secondary w-full"
              >
                Change Password
              </button>
            </AdminCard>
          ) : null}
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.title} label={item.title} value={item.value} meta={item.meta} />
        ))}
      </div>

      {showChangePassword && (
        <AdminModal title="Change Password" onClose={() => setShowChangePassword(false)} className="max-w-md">
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="admin-label">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="admin-input"
                  required
                />
              </div>
              <div>
                <label className="admin-label">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="admin-input"
                  required
                />
              </div>
              <div className="flex justify-between items-center pt-2">
                <button type="submit" className="admin-btn admin-btn-primary">
                  Update
                </button>
                <button
                  onClick={() => setShowChangePassword(false)}
                  type="button"
                  className="admin-btn admin-btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
        </AdminModal>
      )}
    </AdminPage>
  );
};

export default Dashboard;

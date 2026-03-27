import React, { useState } from "react";
import toast from "react-hot-toast";
import { useUpdateAdminPassword } from "../../../hooks/userUpdateUserState";

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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl"
          >
            {user.name.charAt(0)}
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4 z-50">
              <p className="font-bold">{user.name}</p>
              <p className="text-sm text-gray-400">{user.email}</p>
              <p className="text-sm text-gray-400 mb-2">{user.address}</p>
              <button
                onClick={() => {
                  setShowChangePassword(true);
                  setShowProfile(false);
                }}
                className="text-blue-400 hover:underline text-sm"
              >
                Change Password
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[ 
          { title: "Total Users", value: 14, icon: "👥" },
          { title: "Total Transactions", value: 111, icon: "📄" },
          { title: "Total Deposit", value: "$7210.00", icon: "💰" },
          { title: "Pending Deposit", value: "$0.00", icon: "🕒" },
          { title: "Total Withdraw", value: "$0.00", icon: "🏧" },
          { title: "Pending Withdraw", value: "$0.00", icon: "🖐️" },
          { title: "Total Transfer", value: "$0.00", icon: "💸" },
          { title: "Today Transfer", value: "$0.00", icon: "✈️" }
        ].map((item, index) => (
          <div key={index} className="bg-gray-800 rounded-lg shadow p-4 flex justify-between items-center border border-gray-700">
            <div>
              <p className="text-sm text-gray-400">{item.title}</p>
              <p className="text-lg font-bold text-white">{item.value}</p>
            </div>
            <span className="text-3xl">{item.icon}</span>
          </div>
        ))}
      </div>

      {/* Modal (Change Password Form) */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-sm z-50 flex justify-center items-center">
          <div className="max-w-md w-full bg-gray-800 p-6 rounded shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-white">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-gray-700 text-white border border-gray-600 p-2 rounded focus:outline-none focus:ring focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-700 text-white border border-gray-600 p-2 rounded focus:outline-none focus:ring focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-between items-center pt-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Update
                </button>
                <button
                  onClick={() => setShowChangePassword(false)}
                  type="button"
                  className="text-sm text-gray-400 hover:underline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

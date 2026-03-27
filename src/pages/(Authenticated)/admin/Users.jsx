import React, { useState } from "react";
import { useFormik } from "formik";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { Search, X } from "lucide-react"; // Import the X icon
import { useUpdateUserState } from "../../../hooks/userUpdateUserState";
import { useUpdatePassword } from "../../../hooks/userUpdateUserState";
import { verifyAdminPassword } from "../../../helper/helper.jsx";

const baseURL = import.meta.env.VITE_BASE_URL;

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const Users = () => {
  const updateMutation = useUpdateUserState();
  const updatePasswordMutation = useUpdatePassword();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const {
    data: users,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["getUsers"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${baseURL}/api/getUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });
  // console.log(users)
  const formik = useFormik({
    initialValues: {
      id: editingUser?._id || "",
      email: editingUser?.email || "",
      fullName: editingUser?.fullName || "",
      appNotice: editingUser?.appNotice || "",

      username: editingUser?.username || "",
      balance: editingUser?.balance || "",
      totalDeposit: editingUser?.totalDeposit || "",
      totalWithdraw: editingUser?.totalWithdraw || "",

      isWithdrawalAllowed: editingUser?.isWithdrawalAllowed || false,
      isTradeAllowed: editingUser?.isTradeAllowed || false,
      isActive: editingUser?.isActive || false,
      // balanceAdjustment: "", // For adding/subtracting balance
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        // console.log(values);
        await updateMutation.mutateAsync(values);
        toast.success("User updated successfully!");
        setIsDialogOpen(false);
        setEditingUser(null);
        formik.resetForm();
        refetch();
      } catch (err) {
        toast.error("Update failed.");
      }
    },
  });

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const filteredUsers = users?.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.email?.toLowerCase().includes(term) ||
      user.username?.toLowerCase().includes(term) ||
      String(user.payId).includes(term)
    );
  });

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      await updatePasswordMutation.mutateAsync({
        id: editingUser._id,
        newPassword,
      });
      toast.success("Password updated successfully!");
      setIsPasswordChanging(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error("Password update failed.");
    }
  };

  // Function to close the modal
  const closeModal = () => {
    setIsDialogOpen(false);
    setEditingUser(null);
  };

  // Function to handle adding or subtracting the balance
  const handleBalanceChange = (operation) => {
    const adjustmentValue = parseFloat(formik.values.balanceAdjustment);
    if (isNaN(adjustmentValue) || adjustmentValue <= 0) {
      toast.error("Please enter a valid number.");
      return;
    }

    const updatedBalance =
      operation === "add"
        ? parseFloat(formik.values.balance) + adjustmentValue
        : parseFloat(formik.values.balance) - adjustmentValue;

    formik.setFieldValue("balance", updatedBalance.toFixed(2));
    formik.setFieldValue("balanceAdjustment", ""); // Clear the adjustment field after update

    // Now submit the form
    formik.handleSubmit(); // Trigger form submission after balance change

    // Show a success toast after form submission
    toast.success("Balance updated successfully!");
  };
  const handleUserLogin = (id) => {
    let loginPromise = verifyAdminPassword(id); // Call your login verification function with the user ID
    console.log("user id",id)
    toast.promise(loginPromise, {
      loading: "Checking...",
      success: <b>Login Successfully...!</b>,
      error: <b>Couldn't Login!</b>,
    });

    loginPromise
      .then((res) => {
        if (res && res?.data) {
          const { token, role, email } = res.data;
          console.log("login res",res.data)
          // Store token and email in localStorage
          localStorage.setItem("uToken", token);
          localStorage.setItem("currentEmail", email);

          // If role is 'user', navigate to '/' and open it in a new tab
         
            window.open("/", "_blank"); // Opens in a new tab
         
        }
      })
      .catch((res) => {
        toast.error(<b>{res?.error}</b>);
      });
  };
  return (
    <div className="p-6 min-h-screen bg-gray-900 text-gray-100">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">All Users</h2>
          <p className="text-gray-400 text-sm">Manage all users from here</p>
        </div>
        <div className="flex items-center border rounded px-3 py-1 bg-gray-800 shadow-sm">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search by email, username or PayID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="outline-none w-64 text-sm bg-gray-900 text-gray-100 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded shadow border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700 text-sm">
          <thead className="bg-gray-800 text-gray-300 text-left">
            <tr>
              <th className="p-3">Pay ID / Username</th>
              <th className="p-3">Email</th>
              <th className="p-3">Balance</th>
              <th className="p-3">Date Joined</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
              <th className="p-3">Visit User</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-gray-900">
            {filteredUsers?.map((user) => (
              <tr key={user._id} className="hover:bg-gray-800">
                <td className="p-3 font-medium">
                  <span className="text-gray-500 text-xs block">
                    #{user.payId}
                  </span>
                  {user.username}
                </td>
                <td className="p-3">{user.email}</td>
                <td className="p-3 text-green-400 font-semibold">
                  ${parseFloat(user.balance || 0).toFixed(2)}
                </td>
                <td className="p-3">
                  {formatDate(user.dateJoined || user.createdAt)}
                </td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                      user.isActive ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-1 rounded shadow-sm transition"
                  >
                    Edit
                  </button>
                </td>
                <td
                  className="p-3 cursor-pointer"
                  // Replace userId with the actual ID you want to pass
                >
                  <button
                    onClick={() => handleUserLogin(user?._id)}
                    className="text-blue-400 hover:underline"
                  >
                    Login as User
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers?.length === 0 && (
          <div className="p-4 text-center text-gray-500">No users found.</div>
        )}
      </div>

      {/* Full-Screen Edit Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 w-full h-full max-h-screen overflow-y-auto rounded-md grid grid-cols-3 gap-6 relative text-gray-100">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-200 focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Column: Balance Section */}
            <div className="flex flex-col p-4 bg-gray-800 rounded shadow">
              <h3 className="text-xl font-semibold mb-4">
                Balance: ${formik.values.balance}
              </h3>

              <div className="flex items-center mb-4">
                <label className="mr-2">Add/Subtract Balance</label>
              </div>

              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => handleBalanceChange("add")}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Add +
                </button>
                <button
                  onClick={() => handleBalanceChange("subtract")}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Subtract -
                </button>
              </div>
              <input
                name="balanceAdjustment"
                type="number"
                onChange={formik.handleChange}
                value={formik.values.balanceAdjustment}
                placeholder="Enter amount"
                className="w-full border border-gray-700 bg-gray-800 p-2 rounded mb-4 text-gray-100"
              />
            </div>

            {/* Middle Column: User Info Section */}
            <div className="flex flex-col p-4 bg-gray-900 rounded shadow">
              <h3 className="text-xl font-semibold mb-4">User Information</h3>

              {/* Total Deposit and Withdrawal */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-center p-4 bg-gray-800 rounded">
                  <h4 className="text-xl font-bold">Total Deposit</h4>
                  <p className="text-lg">${formik.values.totalDeposit}</p>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded">
                  <h4 className="text-xl font-bold">Total Withdraw</h4>
                  <p className="text-lg">${formik.values.totalWithdraw}</p>
                </div>
              </div>

              {/* User Information Form */}
              <div className="mb-4">
                <label className="block text-sm">Full Name</label>
                <input
                  name="fullName"
                  onChange={formik.handleChange}
                  value={formik.values.fullName}
                  className="w-full border border-gray-700 bg-gray-800 p-2 rounded text-gray-100"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm">Email</label>
                <input
                  name="email"
                  type="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  className="w-full border border-gray-700 bg-gray-800 p-2 rounded text-gray-100"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm">App Notice</label>
                <input
                  name="appNotice"
                  onChange={formik.handleChange}
                  value={formik.values.appNotice}
                  className="w-full border border-gray-700 bg-gray-800 p-2 rounded text-gray-100"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm">Account Status</label>
                <select
                  name="isActive"
                  onChange={(e) => {
                    formik.setFieldValue("isActive", e.target.value === "true");
                  }}
                  value={formik.values.isActive}
                  className="w-full border border-gray-700 bg-gray-800 p-2 rounded text-gray-100"
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>

              {/* Permissions */}
              <div className="flex gap-4 mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isWithdrawalAllowed"
                    checked={formik.values.isWithdrawalAllowed}
                    onChange={formik.handleChange}
                    className="mr-2"
                  />
                  Allow Withdrawal
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isTradeAllowed"
                    checked={formik.values.isTradeAllowed}
                    onChange={formik.handleChange}
                    className="mr-2"
                  />
                  Allow Trading
                </label>
              </div>

              {/* Submit User Info Button */}
              <button
                type="submit"
                onClick={formik.handleSubmit}
                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded"
              >
                Update Information
              </button>
            </div>

            {/* Right Column: Password Section */}
            <div className="flex flex-col p-4 bg-gray-800 rounded shadow">
              <h3 className="text-xl font-semibold mb-4">Change Password</h3>

              <button
                onClick={() => setIsPasswordChanging(!isPasswordChanging)}
                className="bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded mb-4"
              >
                {isPasswordChanging ? "Cancel" : "Change Password"}
              </button>

              {isPasswordChanging && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full border border-gray-700 bg-gray-800 p-2 rounded text-gray-100"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border border-gray-700 bg-gray-800 p-2 rounded text-gray-100"
                    />
                  </div>

                  <button
                    onClick={handlePasswordChange}
                    className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded"
                  >
                    Save New Password
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;

import React, { useState } from "react";
import { useFormik } from "formik";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { Search } from "lucide-react";
import { useUpdateUserState } from "../../../hooks/userUpdateUserState";
import { useUpdatePassword } from "../../../hooks/userUpdateUserState";
import { verifyAdminPassword } from "../../../helper/helper.jsx";
import AdminPage from "../../../components/admin/AdminPage";
import AdminTable from "../../../components/admin/AdminTable";
import AdminStatusBadge from "../../../components/admin/AdminStatusBadge";
import AdminModal from "../../../components/admin/AdminModal";
import { AdminCard, StatCard } from "../../../components/admin/AdminCard";
import { EmptyState, ErrorState, LoadingState } from "../../../components/admin/AdminStates";

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
      balanceAdjustment: "",
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
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

  const closeModal = () => {
    setIsDialogOpen(false);
    setEditingUser(null);
    setIsPasswordChanging(false);
  };

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
    formik.setFieldValue("balanceAdjustment", "");
    formik.handleSubmit();
    toast.success("Balance updated successfully!");
  };

  const handleUserLogin = (id) => {
    const loginPromise = verifyAdminPassword(id);
    toast.promise(loginPromise, {
      loading: "Checking...",
      success: <b>Login Successfully...!</b>,
      error: <b>Couldn't Login!</b>,
    });

    loginPromise
      .then((res) => {
        if (res?.data) {
          const { token, email } = res.data;
          localStorage.setItem("uToken", token);
          localStorage.setItem("currentEmail", email);
          window.open("/", "_blank");
        }
      })
      .catch((res) => {
        toast.error(<b>{res?.error}</b>);
      });
  };

  const totalUsers = users?.length || 0;
  const activeUsers = users?.filter((u) => u.isActive).length || 0;
  const inactiveUsers = totalUsers - activeUsers;
  const totalBalance =
    users?.reduce((sum, current) => sum + parseFloat(current.balance || 0), 0).toFixed(2) || "0.00";

  return (
    <AdminPage
      title="User Management"
      subtitle="Search, review, and maintain user-level controls from a single operational table."
      actions={
        <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by email, username or PayID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
          />
        </div>
      }
    >
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard label="Total users" value={totalUsers} />
        <StatCard label="Active users" value={activeUsers} />
        <StatCard label="Inactive users" value={inactiveUsers} />
        <StatCard label="Total balances" value={`$${totalBalance}`} />
      </div>

      {isLoading ? (
        <AdminCard>
          <LoadingState text="Loading users..." />
        </AdminCard>
      ) : isError ? (
        <AdminCard>
          <ErrorState text="Failed to load users." />
        </AdminCard>
      ) : (
        <AdminTable>
          <thead>
            <tr>
              <th>Pay ID / Username</th>
              <th>Email</th>
              <th>Balance</th>
              <th>Date Joined</th>
              <th>Status</th>
              <th>Action</th>
              <th>Visit User</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers?.map((user) => (
              <tr key={user._id}>
                <td className="font-medium">
                  <span className="block text-xs text-slate-500">#{user.payId}</span>
                  {user.username}
                </td>
                <td>{user.email}</td>
                <td className="font-semibold text-emerald-300">
                  ${parseFloat(user.balance || 0).toFixed(2)}
                </td>
                <td>{formatDate(user.dateJoined || user.createdAt)}</td>
                <td>
                  <AdminStatusBadge status={user.isActive ? "Active" : "Inactive"} />
                </td>
                <td>
                  <button onClick={() => handleEdit(user)} className="admin-btn admin-btn-secondary">
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleUserLogin(user?._id)}
                    className="text-sm text-indigo-300 hover:underline"
                  >
                    Login as User
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      )}

      {!isLoading && !isError && filteredUsers?.length === 0 ? (
        <AdminCard>
          <EmptyState text="No users found for this search." />
        </AdminCard>
      ) : null}

      {isDialogOpen ? (
        <AdminModal title={`Edit ${editingUser?.username || "User"}`} onClose={closeModal}>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <AdminCard>
              <h3 className="mb-4 text-lg font-semibold text-slate-100">
                Balance: ${formik.values.balance}
              </h3>
              <label className="admin-label mb-2">Add/Subtract Balance</label>
              <div className="mb-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => handleBalanceChange("add")}
                  className="admin-btn bg-emerald-600 text-white hover:bg-emerald-500"
                >
                  Add +
                </button>
                <button
                  type="button"
                  onClick={() => handleBalanceChange("subtract")}
                  className="admin-btn admin-btn-danger"
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
                className="admin-input"
              />
            </AdminCard>

            <AdminCard>
              <h3 className="mb-4 text-lg font-semibold text-slate-100">User Information</h3>
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-slate-700 bg-slate-950/60 p-4 text-center">
                  <h4 className="text-sm font-semibold text-slate-300">Total Deposit</h4>
                  <p className="text-lg">${formik.values.totalDeposit}</p>
                </div>
                <div className="rounded-lg border border-slate-700 bg-slate-950/60 p-4 text-center">
                  <h4 className="text-sm font-semibold text-slate-300">Total Withdraw</h4>
                  <p className="text-lg">${formik.values.totalWithdraw}</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="admin-label">Full Name</label>
                <input
                  name="fullName"
                  onChange={formik.handleChange}
                  value={formik.values.fullName}
                  className="admin-input"
                />
              </div>

              <div className="mb-4">
                <label className="admin-label">Email</label>
                <input
                  name="email"
                  type="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  className="admin-input"
                />
              </div>

              <div className="mb-4">
                <label className="admin-label">App Notice</label>
                <input
                  name="appNotice"
                  onChange={formik.handleChange}
                  value={formik.values.appNotice}
                  className="admin-input"
                />
              </div>

              <div className="mb-4">
                <label className="admin-label">Account Status</label>
                <select
                  name="isActive"
                  onChange={(e) => formik.setFieldValue("isActive", e.target.value === "true")}
                  value={formik.values.isActive ? "true" : "false"}
                  className="admin-input"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className="mb-4 flex gap-4">
                <label className="flex items-center text-sm text-slate-300">
                  <input
                    type="checkbox"
                    name="isWithdrawalAllowed"
                    checked={formik.values.isWithdrawalAllowed}
                    onChange={formik.handleChange}
                    className="mr-2"
                  />
                  Allow Withdrawal
                </label>
                <label className="flex items-center text-sm text-slate-300">
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

              <button type="button" onClick={formik.handleSubmit} className="admin-btn admin-btn-primary">
                Update Information
              </button>
            </AdminCard>

            <AdminCard>
              <h3 className="mb-4 text-lg font-semibold text-slate-100">Change Password</h3>
              <button
                type="button"
                onClick={() => setIsPasswordChanging(!isPasswordChanging)}
                className="admin-btn admin-btn-secondary mb-4"
              >
                {isPasswordChanging ? "Cancel" : "Change Password"}
              </button>

              {isPasswordChanging ? (
                <>
                  <div className="mb-4">
                    <label className="admin-label">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="admin-input"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="admin-label">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="admin-input"
                    />
                  </div>
                  <button type="button" onClick={handlePasswordChange} className="admin-btn admin-btn-primary">
                    Save New Password
                  </button>
                </>
              ) : null}
            </AdminCard>
          </div>
        </AdminModal>
      ) : null}
    </AdminPage>
  );
};

export default Users;

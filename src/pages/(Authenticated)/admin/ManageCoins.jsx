import React, { useState } from "react";
import { useCreateCoinState } from "../../../hooks/useCreateCoinState";
import { useUpdateCoinState } from "../../../hooks/useUpdateCoinState";
import { useDeleteCoinState } from "../../../hooks/useDeleteCoinState";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import AdminPage from "../../../components/admin/AdminPage";
import AdminTable from "../../../components/admin/AdminTable";
import AdminStatusBadge from "../../../components/admin/AdminStatusBadge";
import AdminModal, { ConfirmDialog } from "../../../components/admin/AdminModal";
import { AdminCard } from "../../../components/admin/AdminCard";
import { EmptyState, ErrorState, LoadingState } from "../../../components/admin/AdminStates";
const baseURL = import.meta.env.VITE_BASE_URL;

const ManageCoins = () => {
  const createMutation = useCreateCoinState();
  const updateMutation = useUpdateCoinState();
  const deleteMutation = useDeleteCoinState();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // New state for delete confirmation
  const [coinToDelete, setCoinToDelete] = useState(null); // Store the coin to delete

  const {
    data: apiData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["coinList"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${baseURL}/api/getCoins`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoin, setEditingCoin] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const [progresspercent, setProgresspercent] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      coinName: "",
      symbol: "",
      pnl: "",
      status: "active",
      logo: "",
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      const formData = {
        coinName: values.coinName,
        symbol: values.symbol,
        pnl: values.pnl,
        status: values.status,
        logo: values.logo,
      };

      const mutationFn = editingCoin
        ? updateMutation.mutateAsync({ id: editingCoin._id, ...formData })
        : createMutation.mutateAsync(formData);

      toast.promise(mutationFn, {
        loading: editingCoin ? "Updating..." : "Creating...",
        success: editingCoin ? "Coin updated!" : "Coin created!",
        error: "Something went wrong.",
      });

      setIsDialogOpen(false);
      setEditingCoin(null);
    },
  });

  const openAddModal = () => {
    setEditingCoin(null);
    formik.resetForm();
    setImgUrl("");
    setIsDialogOpen(true);
  };

  const openEditModal = (coin) => {
    formik.setValues({
      coinName: coin.coinName,
      symbol: coin.symbol,
      pnl: coin.pnl,
      status: coin.status,
      logo: coin.logo,
    });
    setEditingCoin(coin);
    setImgUrl(coin.logo);
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      setErrorMessage("");
      const formData = new FormData();
      formData.append("file", file);

      try {
        const timestamp = new Date().getTime();
        const uploadRes = await axios.post(
          `${baseURL}/upload?timestamp=${timestamp}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (e) =>
              setProgresspercent(Math.round((e.loaded / e.total) * 100)),
          }
        );

        const { fileUrl } = uploadRes.data;
        if (!fileUrl) return;

        formik.setFieldValue("logo", fileUrl);
        setImgUrl(fileUrl);
      } catch (error) {
        console.error("Upload error:", error);
      }
    };
    img.onerror = () => setErrorMessage("Invalid image file.");
  };

  const handleDelete = (coin) => {
    setCoinToDelete(coin); // Set the coin to delete
    setIsDeleteDialogOpen(true); // Open the delete confirmation dialog
  };
  const confirmDelete = async () => {
    try {
      await deleteMutation.mutateAsync({ id: coinToDelete._id });
      toast.success("Coin deleted successfully");
      setIsDeleteDialogOpen(false); // Close the delete confirmation dialog
      setCoinToDelete(null); // Reset the coin to delete
    } catch (error) {
      toast.error("Error deleting coin");
    }
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false); // Close the delete confirmation dialog without deleting
    setCoinToDelete(null); // Reset the coin to delete
  };
  return (
    <AdminPage
      title="Manage Coins"
      subtitle="Control tradable assets, display logos, P/L indicators, and activation status."
      actions={
        <button onClick={openAddModal} className="admin-btn admin-btn-primary">
          + Add Coin
        </button>
      }
    >
      <Toaster />
      {isLoading && (
        <AdminCard><LoadingState text="Loading coins..." /></AdminCard>
      )}
      {isError && (
        <AdminCard><ErrorState text="Error loading coins." /></AdminCard>
      )}

      {!isLoading && !isError && apiData && (
        <AdminTable>
          <thead>
            <tr>
              <th>#</th>
              <th>Logo & Name</th>
              <th>Symbol</th>
              <th>P/L %</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {apiData.map((coin, idx) => (
              <tr
                key={coin._id || idx}
                className="transition"
              >
                <td>{idx + 1}</td>
                <td className="flex items-center gap-3">
                  <img
                    src={coin.logo}
                    alt="logo"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="font-semibold">{coin.coinName}</span>
                </td>
                <td>{coin.symbol}</td>
                <td>{coin.pnl}</td>
                <td>
                  <AdminStatusBadge status={coin.status} />
                </td>
                <td>
                  <button
                    onClick={() => openEditModal(coin)}
                    className="admin-btn admin-btn-secondary mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(coin)}
                    className="admin-btn admin-btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      )}
      {!isLoading && !isError && apiData?.length === 0 ? (
        <AdminCard>
          <EmptyState text="No coins configured yet." />
        </AdminCard>
      ) : null}

      {isDialogOpen && (
        <AdminModal
          title={editingCoin ? "Edit Coin" : "Add Coin"}
          onClose={() => setIsDialogOpen(false)}
          className="max-w-md"
        >
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-4">
                <label className="admin-label">Coin Name</label>
                <input
                  type="text"
                  placeholder="e.g. Bitcoin"
                  {...formik.getFieldProps("coinName")}
                  className="admin-input"
                />
              </div>
              <div className="mb-4">
                <label className="admin-label">Symbol</label>
                <input
                  type="text"
                  placeholder="e.g. BTC"
                  {...formik.getFieldProps("symbol")}
                  className="admin-input"
                />
              </div>
              <div className="mb-4">
                <label className="admin-label">P/L %</label>
                <input
                  type="text"
                  placeholder="e.g. 5%"
                  {...formik.getFieldProps("pnl")}
                  className="admin-input"
                />
              </div>
              <div className="mb-4">
                <label className="admin-label">Status</label>
                <select
                  {...formik.getFieldProps("status")}
                  className="admin-input"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="admin-label">Upload Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="admin-input"
                />
                {imgUrl && (
                  <img
                    src={imgUrl}
                    alt="logo-preview"
                    className="mt-3 w-16 h-16 rounded object-cover"
                  />
                )}
                {errorMessage && (
                  <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
                )}
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="admin-btn admin-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                >
                  {editingCoin ? "Update" : "Create"}
                </button>
              </div>
            </form>
        </AdminModal>
      )}

      {isDeleteDialogOpen && (
        <ConfirmDialog
          title="Delete Coin"
          description="You are about to delete this coin. This action cannot be undone."
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
          confirmText="Confirm"
        />
      )}
    </AdminPage>
  );
};

export default ManageCoins;

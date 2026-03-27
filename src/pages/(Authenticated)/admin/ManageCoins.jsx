import React, { useState } from "react";
import { useCreateCoinState } from "../../../hooks/useCreateCoinState";
import { useUpdateCoinState } from "../../../hooks/useUpdateCoinState";
import { useDeleteCoinState } from "../../../hooks/useDeleteCoinState";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";
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
    <div className="p-6 bg-gray-900 min-h-screen text-gray-100 transition-colors duration-500">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">Manage Coins</h2>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Coin
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <svg
            className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-400"
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
          <span className="text-blue-400 font-medium">Loading coins...</span>
        </div>
      )}
      {isError && (
        <p className="text-red-500 font-semibold py-10 text-center">
          Error loading coins.
        </p>
      )}

      {!isLoading && !isError && apiData && (
        <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg shadow-md overflow-hidden transition-colors duration-500">
          <thead>
            <tr className="bg-gray-700 text-left">
              <th className="p-3 border border-gray-600">#</th>
              <th className="p-3 border border-gray-600">Logo & Name</th>
              <th className="p-3 border border-gray-600">Symbol</th>
              <th className="p-3 border border-gray-600">P/L %</th>
              <th className="p-3 border border-gray-600">Status</th>
              <th className="p-3 border border-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {apiData.map((coin, idx) => (
              <tr
                key={coin._id || idx}
                className="hover:bg-gray-700 transition"
              >
                <td className="p-3 border border-gray-600">{idx + 1}</td>
                <td className="p-3 border border-gray-600 flex items-center gap-3">
                  <img
                    src={coin.logo}
                    alt="logo"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="font-semibold">{coin.coinName}</span>
                </td>
                <td className="p-3 border border-gray-600">{coin.symbol}</td>
                <td className="p-3 border border-gray-600">{coin.pnl}</td>
                <td className="p-3 border border-gray-600">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      coin.status === "active"
                        ? "bg-green-800 text-green-400"
                        : "bg-red-800 text-red-400"
                    }`}
                  >
                    {coin.status}
                  </span>
                </td>
                <td className="p-3 border border-gray-600">
                  <button
                    onClick={() => openEditModal(coin)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(coin)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 transition-colors duration-500">
          <div className="bg-gray-800 rounded-lg shadow-xl w-[400px] p-6 transition-colors duration-500">
            <h3 className="text-xl font-semibold mb-4 text-gray-100">
              {editingCoin ? "Edit Coin" : "Add Coin"}
            </h3>
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300">
                  Coin Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bitcoin"
                  {...formik.getFieldProps("coinName")}
                  className="w-full p-2 mt-1 border rounded bg-gray-700 text-gray-100 border-gray-600 focus:ring focus:ring-blue-400"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300">
                  Symbol
                </label>
                <input
                  type="text"
                  placeholder="e.g. BTC"
                  {...formik.getFieldProps("symbol")}
                  className="w-full p-2 mt-1 border rounded bg-gray-700 text-gray-100 border-gray-600 focus:ring focus:ring-blue-400"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300">
                  P/L %
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5%"
                  {...formik.getFieldProps("pnl")}
                  className="w-full p-2 mt-1 border rounded bg-gray-700 text-gray-100 border-gray-600 focus:ring focus:ring-blue-400"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300">
                  Status
                </label>
                <select
                  {...formik.getFieldProps("status")}
                  className="w-full p-2 mt-1 border rounded bg-gray-700 text-gray-100 border-gray-600 focus:ring focus:ring-blue-400"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300">
                  Upload Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-2 mt-1 border rounded bg-gray-700 text-gray-100 border-gray-600"
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
                  className="bg-gray-700 text-gray-300 px-4 py-2 rounded hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  {editingCoin ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 transition-colors duration-500">
          <div className="bg-gray-800 rounded-lg shadow-xl w-[300px] p-6 transition-colors duration-500">
            <h3 className="text-lg font-semibold mb-4 text-gray-100">
              Are you sure?
            </h3>
            <p className="text-sm mb-4 text-gray-300">
              You are about to delete this coin. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="bg-gray-700 text-gray-300 px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCoins;

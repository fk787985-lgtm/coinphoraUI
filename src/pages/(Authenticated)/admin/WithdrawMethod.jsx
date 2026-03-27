import React, { useState } from "react";
import { useFormik } from "formik";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useCreateWithdrawMethodState } from "../../../hooks/useCreateDepositMethodState";
import { useUpdateWithdrawMethodState } from "../../../hooks/useUpdateDepositMethodState";
import { useDeleteWithdrawMethodState } from "../../../hooks/useDeleteDepositMethodState";

const baseURL = import.meta.env.VITE_BASE_URL;

const WithdrawMethod = () => {
  const createMutation = useCreateWithdrawMethodState();
  const updateMutation = useUpdateWithdrawMethodState();
  const deleteMutation = useDeleteWithdrawMethodState();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [methodToDelete, setMethodToDelete] = useState(null);

  const {
    data: apiData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["withdrawMethods"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${baseURL}/api/withdrawMethods`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });

  const formik = useFormik({
    initialValues: {
      coinName: "",
      currencyUsdt: "",
      symbol: "",
      minAmount: "",
      maxAmount: "",
      paymentAddressType: "",
      paymentAddress: "",
      conversionPrice: "",
      charge: "",
      status: "active",
      info: "",
      isActive: true,
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      const payload = { ...values };

      const mutationFn = editingMethod
        ? updateMutation.mutateAsync({ id: editingMethod._id, ...payload })
        : createMutation.mutateAsync(payload);

      toast.promise(mutationFn, {
        loading: editingMethod ? "Updating method..." : "Creating method...",
        success: editingMethod ? "Withdraw method updated!" : "Withdraw method created!",
        error: "Something went wrong.",
      });

      setIsDialogOpen(false);
      setEditingMethod(null);
      formik.resetForm();
      refetch();
    },
  });

  const openAddModal = () => {
    setEditingMethod(null);
    formik.resetForm();
    setIsDialogOpen(true);
  };

  const openEditModal = (method) => {
    setEditingMethod(method);
    formik.setValues({ ...method });
    setIsDialogOpen(true);
  };

  const handleDelete = (method) => {
    setMethodToDelete(method);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteMutation.mutateAsync({ id: methodToDelete._id });
      toast.success("Withdraw method deleted successfully");
      setIsDeleteDialogOpen(false);
      setMethodToDelete(null);
      refetch();
    } catch {
      toast.error("Failed to delete method");
    }
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setMethodToDelete(null);
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-gray-200">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">Withdraw Methods</h2>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Withdraw Method
        </button>
      </div>

      {isLoading && <p>Loading methods...</p>}
      {isError && <p>Error loading methods.</p>}

      {!isLoading && apiData?.length > 0 && (
        <table className="min-w-full bg-gray-800 border border-gray-700 rounded shadow">
          <thead className="bg-gray-700 text-left text-gray-300">
            <tr>
              <th className="p-3 border border-gray-600">#</th>
              <th className="p-3 border border-gray-600">Name</th>
              <th className="p-3 border border-gray-600">Currency</th>
              <th className="p-3 border border-gray-600">Symbol</th>
              <th className="p-3 border border-gray-600">Min - Max</th>
              <th className="p-3 border border-gray-600">Status</th>
              <th className="p-3 border border-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {apiData.map((method, index) => (
              <tr
                key={method._id}
                className="hover:bg-gray-700 border border-gray-700"
              >
                <td className="p-3 border border-gray-600">{index + 1}</td>
                <td className="p-3 border border-gray-600">{method.coinName}</td>
                <td className="p-3 border border-gray-600">{method.currencyUsdt}</td>
                <td className="p-3 border border-gray-600">{method.symbol}</td>
                <td className="p-3 border border-gray-600">
                  {method.minAmount} - {method.maxAmount}
                </td>
                <td className="p-3 border border-gray-600">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium 
                      ${
                        method.status === "active"
                          ? "bg-green-700 text-green-300"
                          : "bg-red-700 text-red-300"
                      }
                    `}
                  >
                    {method.status.charAt(0).toUpperCase() + method.status.slice(1)}
                  </span>
                </td>
                <td className="p-3 border border-gray-600">
                  <button
                    onClick={() => openEditModal(method)}
                    className="bg-yellow-500 text-gray-900 px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(method)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for Add/Edit */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
          <div className="bg-gray-900 rounded-lg shadow-lg w-[800px] max-w-[90%] p-8 relative text-gray-200">
            <h3 className="text-xl font-semibold mb-6 border-b border-gray-700 pb-3 text-center">
              {editingMethod ? "Update Withdraw Method" : "Add Withdraw Method"}
            </h3>

            <form onSubmit={formik.handleSubmit} className="grid grid-cols-3 gap-5">
              {[
                { name: "coinName", label: "Method Name", placeholder: "e.g. Binance" },
                { name: "currencyUsdt", label: "Currency", placeholder: "e.g. USDT" },
                { name: "symbol", label: "Symbol", placeholder: "e.g. $" },
                { name: "conversionPrice", label: "Conversion Price", placeholder: "e.g. 10" },
                { name: "minAmount", label: "Min Amount", placeholder: "e.g. 10" },
                { name: "maxAmount", label: "Max Amount", placeholder: "e.g. 100" },
                { name: "paymentAddressType", label: "Address Type", placeholder: "e.g. TRC20" },
                { name: "paymentAddress", label: "Payment Address", placeholder: "e.g. TA...4rA5" },
                { name: "charge", label: "Charge", placeholder: "e.g. 0.5" },
                { name: "info", label: "Info for user", placeholder: "e.g. Some additional info" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    {...formik.getFieldProps(field.name)}
                    placeholder={field.placeholder}
                    className="w-full border border-gray-600 rounded-md p-2 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              ))}

              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <select
                  name="status"
                  value={formik.values.status}
                  onChange={(e) => {
                    const status = e.target.value;
                    formik.setFieldValue("status", status);
                    formik.setFieldValue("isActive", status === "active");
                  }}
                  className="w-full border border-gray-600 rounded-md p-2 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="col-span-3 flex justify-end gap-4 pt-6 border-t border-gray-700 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingMethod(null);
                  }}
                  className="bg-gray-700 text-gray-300 px-4 py-2 rounded hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                >
                  {editingMethod ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-[300px] text-gray-200">
            <h3 className="text-lg font-semibold mb-3 text-center">Confirm Delete</h3>
            <p className="text-sm mb-4 text-center text-gray-400">This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={cancelDelete}
                className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawMethod;

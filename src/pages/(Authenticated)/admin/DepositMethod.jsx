import React, { useState } from "react";
import { useFormik } from "formik";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useCreateDepositMethodState } from "../../../hooks/useCreateDepositMethodState";
import { useUpdateDepositMethodState } from "../../../hooks/useUpdateDepositMethodState";
import { useDeleteDepositMethodState } from "../../../hooks/useDeleteDepositMethodState";

const baseURL = import.meta.env.VITE_BASE_URL;

const DepositMethod = () => {
  const createMutation = useCreateDepositMethodState();
  const updateMutation = useUpdateDepositMethodState();
  const deleteMutation = useDeleteDepositMethodState();

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
    queryKey: ["depositMethods"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${baseURL}/api/depositMethods`, {
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
        success: editingMethod ? "Method updated!" : "Method created!",
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
      toast.success("Method deleted successfully");
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
    <div className="p-6 bg-gray-900 text-gray-200 min-h-screen">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">Deposit Methods</h2>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          + Add Deposit Method
        </button>
      </div>

      {isLoading && <p>Loading methods...</p>}
      {isError && <p>Error loading methods.</p>}

      {!isLoading && apiData?.length > 0 && (
        <table className="min-w-full bg-gray-800 border border-gray-700 rounded shadow text-gray-300">
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
                className="hover:bg-gray-700 transition-colors"
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
                        ? "bg-green-800 text-green-400"
                        : "bg-red-800 text-red-400"
                    }
                  `}
                  >
                    {method.status.charAt(0).toUpperCase() +
                      method.status.slice(1)}
                  </span>
                </td>
                <td className="p-3 border border-gray-600">
                  <button
                    onClick={() => openEditModal(method)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(method)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
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
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-[800px] max-w-[90%] text-gray-200">
            <h3 className="text-xl font-semibold mb-6 border-b border-gray-700 pb-3 text-center">
              {editingMethod ? "Update Deposit Method" : "Add Deposit Method"}
            </h3>

            <form
              onSubmit={formik.handleSubmit}
              className="grid grid-cols-3 gap-5"
            >
              {[
                {
                  name: "coinName",
                  label: "Method Name",
                  placeholder: "e.g. Binance",
                },
                {
                  name: "currencyUsdt",
                  label: "Currency",
                  placeholder: "e.g. USDT",
                },
                { name: "symbol", label: "Symbol", placeholder: "e.g. $" },
                {
                  name: "conversionPrice",
                  label: "Conversion Price",
                  placeholder: "e.g. 10",
                },
                {
                  name: "minAmount",
                  label: "Min Amount",
                  placeholder: "e.g. 10",
                },
                {
                  name: "maxAmount",
                  label: "Max Amount",
                  placeholder: "e.g. 100",
                },
                {
                  name: "paymentAddressType",
                  label: "Address Type",
                  placeholder: "e.g. TRC20",
                },
                {
                  name: "paymentAddress",
                  label: "Payment Address",
                  placeholder: "e.g. TA...4rA5",
                },
                { name: "charge", label: "Charge", placeholder: "e.g. 0.5" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium mb-1">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    {...formik.getFieldProps(field.name)}
                    placeholder={field.placeholder}
                    className="w-full border border-gray-600 rounded-md p-2 bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              ))}

              {/* Status Field spans full width */}
              <div className="col-span-3">
                <label className="block text-sm font-medium mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formik.values.status}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    formik.setFieldValue("status", newStatus);
                    formik.setFieldValue("isActive", newStatus === "active");
                  }}
                  className="w-full border border-gray-600 rounded-md p-2 bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Action buttons */}
              <div className="col-span-3 flex justify-end gap-4 pt-6 border-t border-gray-700 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingMethod(null);
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
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
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-[300px] text-gray-200">
            <h3 className="text-lg font-semibold mb-3">Confirm Delete</h3>
            <p className="text-sm mb-4">This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
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

export default DepositMethod;

import React, { useState } from "react";
import { useFormik } from "formik";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useCreateDepositMethodState } from "../../../hooks/useCreateDepositMethodState";
import { useUpdateDepositMethodState } from "../../../hooks/useUpdateDepositMethodState";
import { useDeleteDepositMethodState } from "../../../hooks/useDeleteDepositMethodState";
import AdminPage from "../../../components/admin/AdminPage";
import AdminTable from "../../../components/admin/AdminTable";
import AdminStatusBadge from "../../../components/admin/AdminStatusBadge";
import AdminModal, { ConfirmDialog } from "../../../components/admin/AdminModal";
import { AdminCard } from "../../../components/admin/AdminCard";
import { EmptyState, ErrorState, LoadingState } from "../../../components/admin/AdminStates";

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
    <AdminPage
      title="Deposit Methods"
      subtitle="Configure available deposit channels, limits, and activation status."
      actions={
        <button onClick={openAddModal} className="admin-btn admin-btn-primary">
          + Add Deposit Method
        </button>
      }
    >
      <Toaster />
      {isLoading ? (
        <AdminCard>
          <LoadingState text="Loading deposit methods..." />
        </AdminCard>
      ) : null}
      {isError ? (
        <AdminCard>
          <ErrorState text="Error loading deposit methods." />
        </AdminCard>
      ) : null}

      {!isLoading && apiData?.length > 0 ? (
        <AdminTable>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Currency</th>
              <th>Symbol</th>
              <th>Min - Max</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {apiData.map((method, index) => (
              <tr
                key={method._id}
                className="transition-colors"
              >
                <td>{index + 1}</td>
                <td>{method.coinName}</td>
                <td>{method.currencyUsdt}</td>
                <td>{method.symbol}</td>
                <td>
                  {method.minAmount} - {method.maxAmount}
                </td>
                <td>
                  <AdminStatusBadge
                    status={method.status.charAt(0).toUpperCase() + method.status.slice(1)}
                  />
                </td>
                <td>
                  <button
                    onClick={() => openEditModal(method)}
                    className="admin-btn admin-btn-secondary mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(method)}
                    className="admin-btn admin-btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      ) : null}

      {!isLoading && !isError && apiData?.length === 0 ? (
        <AdminCard>
          <EmptyState text="No deposit methods configured yet." />
        </AdminCard>
      ) : null}

      {isDialogOpen && (
        <AdminModal title={editingMethod ? "Update Deposit Method" : "Add Deposit Method"} onClose={() => {
          setIsDialogOpen(false);
          setEditingMethod(null);
        }}>
            <form
              onSubmit={formik.handleSubmit}
              className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
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
                  <label className="admin-label">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    {...formik.getFieldProps(field.name)}
                    placeholder={field.placeholder}
                    className="admin-input"
                  />
                </div>
              ))}

              <div className="col-span-full">
                <label className="admin-label">
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
                  className="admin-input"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="col-span-full mt-4 flex justify-end gap-3 border-t border-slate-700 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingMethod(null);
                  }}
                  className="admin-btn admin-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                >
                  {editingMethod ? "Update" : "Create"}
                </button>
              </div>
            </form>
        </AdminModal>
      )}

      {isDeleteDialogOpen && (
        <ConfirmDialog
          title="Confirm Delete"
          description="This action cannot be undone."
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
          confirmText="Delete"
        />
      )}
    </AdminPage>
  );
};

export default DepositMethod;

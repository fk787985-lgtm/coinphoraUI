import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useUpdateUpdateKyc } from "../../../hooks/userUpdateUserState";
import AdminPage from "../../../components/admin/AdminPage";
import AdminTable from "../../../components/admin/AdminTable";
import AdminStatusBadge from "../../../components/admin/AdminStatusBadge";
import { AdminCard } from "../../../components/admin/AdminCard";
import { EmptyState, ErrorState, LoadingState } from "../../../components/admin/AdminStates";
import AdminModal from "../../../components/admin/AdminModal";

const baseURL = import.meta.env.VITE_BASE_URL;

const PendingKyc = () => {
  const [filter, setFilter] = useState("All");
  const [previewImage, setPreviewImage] = useState(null);

  const updateMutation = useUpdateUpdateKyc({
    onSuccess: () => {
      toast.success("KYC status updated!");
      refetch();
    },
    onError: () => {
      toast.error("Failed to update KYC status!");
    },
  });

  const {
    data: apiData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["kycList", filter],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${baseURL}/api/getKycList`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return filter === "All" ? data : data.filter((item) => item.status === filter);
    },
    refetchInterval: 10000,
  });

  const handleStatusUpdate = (id, status) => {
    if (window.confirm(`Mark this KYC as ${status}, ${id}?`)) {
      updateMutation.mutate({ id, status });
    }
  };

  return (
    <AdminPage
      title="KYC Verification Queue"
      subtitle="Audit identity submissions, preview documents, and approve or reject pending KYC requests."
      actions={
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-400">Status</label>
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              refetch();
            }}
            className="admin-input min-w-[160px]"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      }
    >
      <Toaster />
      <AdminTable className="min-w-[1200px]">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Username</th>
              <th>DOB</th>
              <th>Address</th>
              <th>Employment</th>
              <th>Income</th>
              <th>Document Type</th>
              <th>ID Front</th>
              <th>ID Back</th>
              <th>Selfie</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={12}><LoadingState text="Loading KYC records..." /></td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={12}><ErrorState text="Failed to fetch KYC data." /></td>
              </tr>
            ) : (
              apiData?.map((kyc) => (
                <tr key={kyc._id} className="text-center">
                  <td className="whitespace-nowrap">
                    {kyc.firstName} {kyc.middleName} {kyc.lastName}
                  </td>
                  <td>{kyc.username}</td>
                  <td>
                    {new Date(kyc.dateOfBirth).toLocaleDateString()}
                  </td>
                  <td>
                    {`${kyc.street}, ${kyc.city}, ${kyc.state}, ${kyc.postalCode}, ${kyc.country}`}
                  </td>
                  <td>{kyc.employmentStatus}</td>
                  <td>${kyc.annualIncome}</td>
                  <td>{kyc.documentType}</td>

                  {["idFront", "idBack", "cameraRoll"].map((field) => (
                    <td key={field}>
                      <img
                        src={kyc[field]}
                        alt={field}
                        className="mx-auto h-16 w-16 cursor-pointer rounded object-cover ring-1 ring-slate-700"
                        onClick={() => setPreviewImage(kyc[field])}
                      />
                    </td>
                  ))}

                  <td>
                    <AdminStatusBadge status={kyc.status} />
                  </td>

                  <td>
                    {kyc.status === "Pending" ? (
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleStatusUpdate(kyc._id, "Completed")}
                          className="admin-btn bg-emerald-600 text-white hover:bg-emerald-500"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(kyc._id, "Rejected")}
                          className="admin-btn admin-btn-danger"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-500">Closed</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </AdminTable>
      {apiData?.length === 0 && !isLoading && !isError ? (
        <AdminCard>
          <EmptyState text="No KYC records found." />
        </AdminCard>
      ) : null}

      {previewImage && (
        <AdminModal title="Document Preview" onClose={() => setPreviewImage(null)} className="max-w-3xl">
          <div className="relative max-w-full max-h-full text-center">
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-[90vw] max-h-[80vh] object-contain rounded"
            />
            <div className="flex justify-center mt-4 space-x-4">
              <a
                href={previewImage}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="admin-btn admin-btn-primary"
              >
                Download
              </a>
              <button
                onClick={() => setPreviewImage(null)}
                className="admin-btn admin-btn-danger"
              >
                Close
              </button>
            </div>
          </div>
        </AdminModal>
      )}
    </AdminPage>
  );
};

export default PendingKyc;

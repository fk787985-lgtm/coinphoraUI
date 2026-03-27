import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useUpdateUpdateKyc } from "../../../hooks/userUpdateUserState";

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
    <div className="bg-[#0b0f1a] min-h-screen text-white p-6">
      <Toaster />
      <h1 className="text-2xl font-semibold mb-4 text-yellow-400">All KYC Logs</h1>

      <div className="mb-4">
        <label className="mr-2 text-gray-300">Filter by Status:</label>
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            refetch();
          }}
          className="bg-[#1c2331] text-white px-4 py-2 border border-gray-600 rounded-md"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="overflow-auto bg-[#101827] rounded-lg shadow-md border border-gray-700">
        <table className="min-w-[1200px] border-collapse text-sm w-full">
          <thead className="bg-[#1c2534] text-yellow-400 uppercase">
            <tr>
              <th className="border border-gray-700 px-3 py-2">Full Name</th>
              <th className="border border-gray-700 px-3 py-2">Username</th>
              <th className="border border-gray-700 px-3 py-2">DOB</th>
              <th className="border border-gray-700 px-3 py-2">Address</th>
              <th className="border border-gray-700 px-3 py-2">Employment</th>
              <th className="border border-gray-700 px-3 py-2">Income</th>
              <th className="border border-gray-700 px-3 py-2">Document Type</th>
              <th className="border border-gray-700 px-3 py-2">ID Front</th>
              <th className="border border-gray-700 px-3 py-2">ID Back</th>
              <th className="border border-gray-700 px-3 py-2">Selfie</th>
              <th className="border border-gray-700 px-3 py-2">Status</th>
              <th className="border border-gray-700 px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={12} className="text-center text-gray-400 py-10">
                  Loading KYC records...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={12} className="text-center text-red-500 py-10">
                  Failed to fetch KYC data.
                </td>
              </tr>
            ) : (
              apiData?.map((kyc) => (
                <tr key={kyc._id} className="text-center text-gray-300 border-b border-gray-700">
                  <td className="border border-gray-700 px-3 py-2 whitespace-nowrap">
                    {kyc.firstName} {kyc.middleName} {kyc.lastName}
                  </td>
                  <td className="border border-gray-700 px-3 py-2">{kyc.username}</td>
                  <td className="border border-gray-700 px-3 py-2">
                    {new Date(kyc.dateOfBirth).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-700 px-3 py-2">
                    {`${kyc.street}, ${kyc.city}, ${kyc.state}, ${kyc.postalCode}, ${kyc.country}`}
                  </td>
                  <td className="border border-gray-700 px-3 py-2">{kyc.employmentStatus}</td>
                  <td className="border border-gray-700 px-3 py-2">${kyc.annualIncome}</td>
                  <td className="border border-gray-700 px-3 py-2">{kyc.documentType}</td>

                  {/* Images with preview */}
                  {["idFront", "idBack", "cameraRoll"].map((field) => (
                    <td key={field} className="border border-gray-700 px-3 py-2">
                      <img
                        src={kyc[field]}
                        alt={field}
                        className="w-20 h-20 object-cover rounded mx-auto cursor-pointer"
                        onClick={() => setPreviewImage(kyc[field])}
                      />
                    </td>
                  ))}

                  <td className="border border-gray-700 px-3 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        kyc.status === "Completed"
                          ? "bg-green-500 text-white"
                          : kyc.status === "Pending"
                          ? "bg-yellow-400 text-black"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {kyc.status}
                    </span>
                  </td>

                  <td className="border border-gray-700 px-3 py-2">
                    {kyc.status === "Pending" ? (
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleStatusUpdate(kyc._id, "Completed")}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(kyc._id, "Rejected")}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500">Closed</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Fullscreen Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-full max-h-full">
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
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Download
              </a>
              <button
                onClick={() => setPreviewImage(null)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingKyc;

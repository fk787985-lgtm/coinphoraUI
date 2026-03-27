import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import { CheckCircle, XCircle, Hourglass } from "lucide-react";

const baseURL = import.meta.env.VITE_BASE_URL;

const KycDetail = () => {
  const [kyc, setKyc] = useState(null);

  const {
    data: apiData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["kycDetail"],
    queryFn: async () => {
      const token = localStorage.getItem("uToken");
      const { data } = await axios.get(`${baseURL}/api/getKycDetails`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setKyc(data.kyc);
      return data.kyc;
    },
    refetchInterval: 10000,
  });

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const renderStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle size={30} color="green" />;
      case "Rejected":
        return <XCircle size={30} color="red" />;
      default:
        return <Hourglass size={30} color="#FCD535" />;
    }
  };

  if (isLoading || !kyc) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0d111c] text-white">
        <ClipLoader size={70} color="#FCD535" loading={true} />
        <p className="mt-4 text-lg font-semibold">Loading KYC Details...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0d111c] text-white">
        <p className="text-lg font-semibold text-red-500">
          Error fetching KYC details. Please try again.
        </p>
      </div>
    );
  }

  // ✅ When Completed — show success only
  if (kyc.status === "Completed") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0d111c] text-white px-4">
        <p className="text-lg font-bold mb-4 text-center">
          {`${kyc.firstName} ${kyc.middleName || ""} ${kyc.lastName}`}
        </p>
        <CheckCircle size={100} color="green" className="mb-4" />
        <p className="text-xl font-semibold text-green-400 text-center">
          Your account has been verified successfully!
        </p>
      </div>
    );
  }

  // ✅ When Pending or Rejected — show full details
  // ✅ Show full details only when status is "Pending"
  if (kyc.status === "Pending") {
    return (
      <div className="flex flex-col justify-start items-center pt-14 bg-[#0d111c] text-white min-h-screen px-3">
        <div className="bg-[#1a1f2e] rounded-lg shadow-lg p-2 max-w-2xl w-full">
          <div className="flex flex-col items-center mb-2">
            {renderStatusIcon(kyc.status)}
            <p className="mt-2 text-xl font-bold">KYC Request Pending</p>
            <span className="mt-2 text-sm font-medium px-3 py-1 rounded-full bg-yellow-500 text-black">
              {kyc.status}
            </span>
          </div>

          <div className="border-t border-gray-700 pt-2 space-y-2">
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
              <div>
                <p className="text-gray-400">Full Name</p>
                <p className="font-medium">{`${kyc.firstName} ${
                  kyc.middleName || ""
                } ${kyc.lastName}`}</p>
              </div>
              <div>
                <p className="text-gray-400">DOB</p>
                <p className="font-medium">{formatDate(kyc.dateOfBirth)}</p>
              </div>
              <div>
                <p className="text-gray-400">Address</p>
                <p className="font-medium">
                  {`${kyc.street}, ${kyc.city}, ${kyc.state}, ${kyc.postalCode}, ${kyc.country}`}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Employment</p>
                <p className="font-medium">{kyc.employmentStatus}</p>
              </div>
              <div>
                <p className="text-gray-400">Annual Income</p>
                <p className="font-medium">${kyc.annualIncome}</p>
              </div>
              <div>
                <p className="text-gray-400">Document Type</p>
                <p className="font-medium">{kyc.documentType}</p>
              </div>
            </div>
          </div>

          <div className="mt-2 border-t border-gray-700 pt-2 w-full">
            <p className="text-lg font-semibold mb-4">Uploaded Documents</p>
            <div className="flex flex-row gap-4 w-full">
              <div className="flex-1">
                <p className="text-gray-400 mb-2">ID Front</p>
                <div className="bg-gray-900 rounded-md border border-gray-700 p-2 h-28 flex items-center justify-center">
                  <img
                    src={kyc.idFront}
                    alt="ID Front"
                    className="w-full h-full object-contain rounded"
                  />
                </div>
              </div>

              <div className="flex-1">
                <p className="text-gray-400 mb-2">ID Back</p>
                <div className="bg-gray-900 rounded-md border border-gray-700 p-2 h-28 flex items-center justify-center">
                  <img
                    src={kyc.idBack}
                    alt="ID Back"
                    className="w-full h-full object-contain rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default KycDetail;

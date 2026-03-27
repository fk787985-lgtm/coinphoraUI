import React, { useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import { CheckCircle } from "lucide-react";

const baseURL = import.meta.env.VITE_BASE_URL;

const fetchDepositDetail = async (id) => {
  const token = localStorage.getItem("uToken");
  const response = await axios.get(`${baseURL}/api/getDepositDetails/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const PaymentDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [deposit, setDeposit] = useState(location.state || null);

  const {
    data: apiData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["depositDetail", id],
    queryFn: async () => {
      const token = localStorage.getItem("uToken");
      const { data } = await axios.get(`${baseURL}/api/getDepositDetails/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeposit(data.deposit);
      return data?.deposit;
    },
    refetchInterval: 10000,
  });

  if (isLoading || !deposit) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-[#0a0d14] to-[#131922] text-white font-sans">
        <ClipLoader size={50} color="#FCD535" loading={true} />
        <p className="mt-2 text-sm font-semibold tracking-wide">Request Pending</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-[#0a0d14] to-[#131922] text-white font-sans">
        <p className="mt-2 text-sm font-semibold tracking-wide text-red-500">
          Error fetching deposit details. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between items-center pt-20 bg-gradient-to-b from-[#0a0d14] to-[#131922] min-h-screen px-4 font-sans text-gray-300 max-w-sm mx-auto">
      <div className="w-full flex flex-col items-center">
        {apiData?.status === "Pending" ? (
          <div className="flex flex-col items-center bg-gradient-to-tr from-yellow-600 via-yellow-500 to-yellow-400 rounded-lg p-5 shadow-md text-black w-full select-text">
            <ClipLoader size={50} color="#000" loading={true} />
            <p className="mt-3 text-base font-extrabold tracking-wide">Request Pending</p>
            <span className="text-2xl font-mono font-bold pt-1">
              {Number(deposit.amount || 0).toFixed(2)}{" "}
              <span className="text-xs font-normal text-gray-700">USDT</span>
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center w-full p-5 bg-[#1f2533] rounded-lg shadow-md select-text">
            <CheckCircle
              size={45}
              color={apiData?.status === "Completed" ? "#22c55e" : "#ef4444"}
            />
            <p
              className={`mt-3 text-base font-extrabold tracking-wide ${
                apiData?.status === "Completed" ? "text-green-500" : "text-red-500"
              }`}
            >
              {apiData?.status === "Completed" ? "Request Completed" : "Request Rejected"}
            </p>
            <span className="text-2xl font-mono font-bold pt-1 text-white">
              {Number(deposit.amount || 0).toFixed(2)}{" "}
              <span className="text-xs font-normal text-gray-400">USDT</span>
            </span>
            <span className="text-gray-500 text-[10px] pt-2">
              The recipient can check the balance in the wallet
            </span>
          </div>
        )}

        <div className="bg-[#1E2329] p-4 rounded-lg w-full mt-6 text-xs space-y-3 shadow-sm">
          <DetailRow label="Payment Method" value={deposit.gateway} />
          <DetailRow label="Amount" value={`${Number(deposit.amount || 0).toFixed(2)} USDT`} />
          <DetailRow
            label="Conversion Rate"
            value={`${(deposit.amount / deposit.coinConversion).toFixed(6)} ${deposit.gateway}`}
          />
          <DetailRow label="Status" value={deposit.status} />
          <DetailRow label="Transaction ID" value={deposit.transactionId} />
        </div>
      </div>

      <Link
        to="/deposit/log"
        className="mb-16 mt-8 px-4 py-2 bg-yellow-400 w-full text-center text-black rounded-md text-xs font-semibold tracking-wide hover:bg-yellow-300 transition duration-200 select-none"
      >
        Show Other Transactions
      </Link>
    </div>
  );
};

// Smaller version of DetailRow
const DetailRow = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-gray-400 uppercase tracking-wide font-semibold">{label}</span>
    <span className="text-white font-mono font-semibold select-text break-all max-w-[60%] text-right text-xs">
      {value}
    </span>
  </div>
);

export default PaymentDetail;

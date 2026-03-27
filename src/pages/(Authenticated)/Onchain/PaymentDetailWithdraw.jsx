import React, { useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import { CheckCircle } from "lucide-react";

const baseURL = import.meta.env.VITE_BASE_URL;

const PaymentDetailWithdraw = () => {
  const { id } = useParams();
  const location = useLocation();
  const [withdraw, setWithdraw] = useState(location.state || null);

  const {
    data: apiData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["withdrawDetail", id],
    queryFn: async () => {
      const token = localStorage.getItem("uToken");
      const { data } = await axios.get(
        `${baseURL}/api/getWithdrawDetails/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setWithdraw(data.withdraw);
      return data?.withdraw;
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

  if (isLoading || !withdraw) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-[#0a0d14] to-[#131922] text-white font-sans">
        <ClipLoader size={70} color="#FCD535" loading={true} />
        <p className="mt-4 text-lg font-semibold tracking-wide">Request Pending</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-[#0a0d14] to-[#131922] text-white font-sans">
        <p className="mt-4 text-lg font-semibold tracking-wide text-red-500">
          Error fetching withdraw details. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between items-center pt-28 bg-gradient-to-b from-[#0a0d14] to-[#131922] min-h-screen px-6 font-sans text-gray-300 max-w-md mx-auto">
      <div className="w-full flex flex-col items-center">
        {apiData?.status === "Pending" ? (
          <div className="flex flex-col items-center bg-gradient-to-tr from-yellow-600 via-yellow-500 to-yellow-400 rounded-xl p-8 shadow-lg text-black w-full select-text">
            <ClipLoader size={70} color="#000" loading={true} />
            <p className="mt-4 text-xl font-extrabold tracking-wider">Request Pending</p>
            <span className="text-4xl font-mono font-bold pt-2">
              {Number(withdraw.amount || 0).toFixed(2)}{" "}
              <span className="text-base font-normal text-gray-700">USDT</span>
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center w-full p-8 bg-[#1f2533] rounded-xl shadow-lg select-text">
            <CheckCircle
              size={60}
              color={apiData?.status === "Completed" ? "#22c55e" : "#ef4444"}
            />
            <p
              className={`mt-4 text-xl font-extrabold tracking-wide ${
                apiData?.status === "Completed" ? "text-green-500" : "text-red-500"
              }`}
            >
              {apiData?.status === "Completed" ? "Request Completed" : "Request Rejected"}
            </p>
            <span className="text-4xl font-mono font-bold pt-2 text-white">
              {Number(withdraw.amount || 0).toFixed(2)}{" "}
              <span className="text-base font-normal text-gray-400">USDT</span>
            </span>
            <span className="text-gray-500 text-xs pt-3">
              The recipient will receive the funds to the provided wallet address
            </span>
          </div>
        )}

        <div className="bg-[#1E2329] p-6 rounded-xl w-full mt-8 text-sm space-y-4 shadow-md">
          <DetailRow label="Payment Method" value={withdraw.gateway} />
          <DetailRow label="Amount" value={`${Number(withdraw.amount || 0).toFixed(2)} USDT`} />
          <DetailRow
            label="Conversion Rate"
            value={`${(withdraw.amount / withdraw.coinConversion).toFixed(6)} ${withdraw.gateway}`}
          />
          <DetailRow
            label="Wallet Address"
            value={
              <span className="break-all max-w-[60%] text-right font-mono select-text">
                {withdraw.paymentAddress}
              </span>
            }
          />
          <DetailRow label="Status" value={withdraw.status} />
          <div className="border-t border-gray-600 pt-2 mt-2">
            <DetailRow label="Date & Time" value={formatDate(withdraw.createdAt)} />
          </div>
        </div>
      </div>

      <Link
        to="/withdraw/log"
        className="mb-24 mt-12 px-6 py-3 bg-yellow-400 w-full text-center text-black rounded-lg text-sm font-semibold tracking-wide hover:bg-yellow-300 transition duration-200 select-none"
      >
        Show Other Transactions
      </Link>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-gray-400 uppercase tracking-wider font-semibold">{label}</span>
    <span className="text-white font-mono font-semibold select-text max-w-[60%] text-right">
      {value}
    </span>
  </div>
);

export default PaymentDetailWithdraw;

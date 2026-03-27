import React from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpCircle, ArrowDownCircle, Hash } from "lucide-react";

const baseURL = import.meta.env.VITE_BASE_URL;

const TransferDetail = () => {
  const { id } = useParams();
  const token = localStorage.getItem("uToken");

  const { data: transfer } = useQuery({
    queryKey: ["TransferDetail", id],
    queryFn: async () => {
      const { data } = await axios.get(`${baseURL}/api/getTransferDetails/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.transfer;
    },
  });

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data } = await axios.get(`${baseURL}/api/getUserById`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });

  if (!transfer || !currentUser) return null;

  const isReceiver = currentUser._id === transfer.receiverUserId._id;
  const isSender = currentUser._id === transfer.senderUserId._id;

  const formatDate = (iso) =>
    new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen bg-[#0d111c] text-white px-4 pt-24 max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">Transaction Details</h1>

      <div
        className={`flex items-center justify-center gap-2 py-3 rounded-md ${
          isSender ? "bg-red-950 text-red-300" : "bg-green-950 text-green-300"
        }`}
      >
        {isSender ? <ArrowUpCircle size={24} /> : <ArrowDownCircle size={24} />}
        <span className="font-semibold">
          {isSender ? "You Sent Funds" : "You Received Funds"}
        </span>
      </div>

      <div className="bg-[#1E2329] rounded-xl p-6 text-sm space-y-4 shadow-md">
        <DetailRow
          icon={<ArrowUpCircle size={18} />}
          label="Sender"
          value={`${transfer.senderUsername} (${transfer.senderPId})`}
        />
        <DetailRow
          icon={<ArrowDownCircle size={18} />}
          label="Receiver"
          value={`${transfer.receiverUsername} (${transfer.receivePId})`}
        />

        <DetailRow
          label="Amount"
          value={`${transfer.amount} USDT`}
        />
        <DetailRow
          label="Fee"
          value={`${transfer.chargeAmount} USDT`}
        />
        <DetailRow
          label="Net Received"
          value={`${transfer.needToPay} USDT`}
          highlight={isReceiver}
        />

        <DetailRow label="Date" value={formatDate(transfer.createdAt)} />
        <DetailRow
          icon={<Hash size={18} />}
          label="Txn Hash"
          value={"0x1234…abcd"}
        />

        <DetailRow label="Status" value={"Completed"} />
      </div>

      <div className="text-center space-y-2">
        <Link
          to="/transfer/log"
          className="inline-block bg-yellow-400 text-black py-2 px-4 rounded-md font-semibold hover:bg-yellow-300 transition"
        >
          Back to Transaction History
        </Link>
      </div>
    </div>
  );
};

const DetailRow = ({ icon, label, value, highlight }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      {icon && <span className="text-gray-400">{icon}</span>}
      <span className="text-gray-400">{label}</span>
    </div>
    <span
      className={`font-mono ${highlight ? "text-green-300 font-semibold" : ""}`}
    >
      {value}
    </span>
  </div>
);

export default TransferDetail;

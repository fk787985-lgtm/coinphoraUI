import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { DollarSign, ScanBarcode } from "lucide-react";
import { useFormik } from "formik";
import { useQuery } from "@tanstack/react-query";
import * as Yup from "yup";
import axios from "axios";
import { useUpdateCreateTransfer } from "../../../hooks/userUpdateUserState";

const baseURL = import.meta.env.VITE_BASE_URL;

const Transfer = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingValues, setPendingValues] = useState(null);

  // Call this instead of directly submitting
  const handleTransferClick = () => {
    if (formik.isValid && formik.dirty) {
      setPendingValues({ ...formik.values });
      setShowConfirm(true);
    } else {
      formik.handleSubmit(); // fallback validation
    }
  };

  // If confirmed from the modal
  const handleConfirmSubmit = () => {
    setShowConfirm(false);
    formik.handleSubmit(); // now call actual submission
  };

  const navigate = useNavigate();
  const updateMutation = useUpdateCreateTransfer();

  const { data: userData } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const token = localStorage.getItem("uToken");
      const { data } = await axios.get(`${baseURL}/api/getUserById`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });
  const { data: settingData } = useQuery({
    queryKey: ["getSiteSetting"],
    queryFn: async () => {
      const token = localStorage.getItem("uToken");
      const { data } = await axios.get(`${baseURL}/api/getSiteSetting`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });

  const transferMin = parseFloat(settingData?.transferMin || "0");
  const transferCharge = parseFloat(settingData?.transferCharge || "1");

  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .typeError("Amount must be a number")
      .required("Amount is required")
      .min(transferMin, `Minimum amount is ${transferMin} USDT`),
    receivePId: Yup.string().required("Receiver Pay ID is required"),
  });

  const formik = useFormik({
    initialValues: {
      amount: transferMin.toString(),
      receivePId: "",
      needToPay: "",
      chargeAmount: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      const amount = parseFloat(values.amount);
      const balance = parseFloat(userData?.balance || 0);

      if (amount > balance) {
        toast.error("You cannot transfer more than your balance.");
        return;
      }

      try {
        const response = await updateMutation.mutateAsync(values);
        if (response?.transfer?._id) {
          toast.success("Transfer request submitted!");
          resetForm();
          navigate(`/transfer/log/${response.transfer._id}`, {
            state: response.transfer,
            replace: true, // This prevents back navigation
          });
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (error) {
        console.error("Transfer error:", error);
        toast.error("Failed to submit Transfer. Please try again.");
      }
    },
  });

  useEffect(() => {
    const amount = parseFloat(formik.values.amount);
    if (!amount || isNaN(amount)) {
      formik.setFieldValue("needToPay", "");
      formik.setFieldValue("chargeAmount", "");
      return;
    }

    const charge = (amount * transferCharge) / 100;
    const receiveAmount = amount - charge;
    formik.setFieldValue("needToPay", receiveAmount.toFixed(2));
    formik.setFieldValue("chargeAmount", charge.toFixed(2));
  }, [formik.values.amount, transferCharge]);

  const formatBalance = (val) => parseFloat(val || 0).toFixed(2);
  const { data: userDataByPayId } = useQuery({
    queryKey: ["userDataByPayId"],
    queryFn: async () => {
      const token = localStorage.getItem("uToken");
      const { data } = await axios.get(
        `${baseURL}/api/getUserByPayId/${formik.values.receivePId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return data;
    },
  });
  //   console.log(userDataByPayId);
  return (
    <div className="flex flex-col items-center pt-20 bg-[#0d111c] text-white h-screen relative">
      <div className="flex-1 w-full max-w-sm overflow-y-auto pt-10 px-2 pb-40">
        <div className="bg-[#1E2329] p-4 rounded-md w-full">
          {/* Amount Input */}
          <div className="relative mb-4 mt-2">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="number"
              name="amount"
              value={formik.values.amount}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                const balance = parseFloat(userData?.balance || 0);
                if (val > balance) {
                  toast.error("Amount exceeds your available balance.");
                  formik.setFieldValue("amount", balance.toString());
                } else {
                  formik.handleChange(e);
                }
              }}
              onBlur={formik.handleBlur}
              placeholder="Enter amount"
              className={`w-full pl-9 bg-[#0d111c] p-2 rounded-md text-white text-sm border ${
                formik.touched.amount && formik.errors.amount
                  ? "border-red-500"
                  : "border-gray-600"
              }`}
            />
            {formik.touched.amount && formik.errors.amount && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.amount}
              </p>
            )}
          </div>

          <div className="flex justify-between text-xs text-gray-400 mb-3">
            <span>
              Available:{" "}
              <span className="text-white">
                {formatBalance(userData?.balance)} USDT
              </span>
            </span>
            <span>Min: {transferMin} USDT</span>
          </div>

          {/* Pay ID */}
          <div className="relative mb-4 mt-3">
            <ScanBarcode className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              name="receivePId"
              value={formik.values.receivePId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Receiver Pay ID"
              className={`w-full pl-9 bg-[#0d111c] p-2 rounded-md text-white text-sm border ${
                formik.touched.receivePId && formik.errors.receivePId
                  ? "border-red-500"
                  : "border-gray-600"
              }`}
            />
            {formik.touched.receivePId && formik.errors.receivePId && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.receivePId}
              </p>
            )}
          </div>

          <p className="text-[10px] text-gray-500 mt-4">
            * After filling all the information, click the button below.
          </p>
        </div>
      </div>

      {/* Submit Action */}
      <div className="fixed bottom-16 w-full px-4 max-w-sm flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-400 mb-1">Receive Amount</p>
          <p className="text-white font-semibold">
            {formik.values.needToPay || "0.0000"} USDT
          </p>
          <p className="text-sm text-gray-400 mb-1">
            Processing fee:{" "}
            <span className="text-white">
              {formik.values.chargeAmount || "0.0000"} USDT
            </span>
          </p>
        </div>
        {/* <button
          type="button"
          onClick={formik.handleSubmit}
          className="px-6 py-4 bg-[#FCD535] text-black font-bold rounded-md text-sm"
        >
          Transfer
        </button> */}
        <button
          type="button"
          onClick={handleTransferClick}
          className="px-6 py-4 bg-[#FCD535] text-black font-bold rounded-md text-sm"
        >
          Transfer
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
          <div className="bg-[#1E2329] text-white rounded-xl p-6 w-full max-w-sm space-y-5 shadow-2xl border border-[#2a2f3a]">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold tracking-wide">
                Confirm Transfer
              </h2>
              <p className="text-sm text-gray-400">
                Please verify the details before proceeding
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm text-white font-mono">
              <div className="col-span-2">
                <span className="text-gray-400">Receiver (Pay ID)</span>
                <p className="truncate text-yellow-300">
                  {pendingValues?.receivePId}
                </p>
              </div>

              <div>
                <span className="text-gray-400">Username</span>
                <p>{userDataByPayId?.username || "N/A"}</p>
              </div>
              <div>
                <span className="text-gray-400">Full Name</span>
                <p>{userDataByPayId?.fullName || "N/A"}</p>
              </div>

              <div>
                <span className="text-gray-400">Amount</span>
                <p>{pendingValues?.amount} USDT</p>
              </div>
              <div>
                <span className="text-gray-400">Fee</span>
                <p className="text-red-400">
                  {pendingValues?.chargeAmount} USDT
                </p>
              </div>

              <div className="col-span-2">
                <span className="text-gray-400">Net Amount Sent</span>
                <p className="text-green-400 text-lg font-semibold">
                  {pendingValues?.needToPay} USDT
                </p>
              </div>

              <div className="col-span-2 border-t border-gray-700 pt-3">
                <span className="text-gray-400">Transfer Type</span>
                <p>Internal Wallet Transfer</p>
              </div>

              <div className="col-span-2">
                <span className="text-gray-400">Transfer Speed</span>
                <p>Instant</p>
              </div>

              <div className="col-span-2">
                <span className="text-gray-400">Security Level</span>
                <p>Encrypted & Verified</p>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <button
                onClick={() => setShowConfirm(false)}
                className="text-gray-400 hover:text-white text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-black px-5 py-2 rounded-md text-sm font-semibold shadow-md hover:opacity-90 transition disabled:opacity-50"
                disabled={!userDataByPayId?._id}
              >
                Confirm & Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transfer;

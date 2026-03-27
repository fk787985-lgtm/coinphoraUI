import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import { toast } from "react-hot-toast";
import { Copy, DollarSign, ScanBarcode } from "lucide-react";
import { useFormik } from "formik";
import { useUpdateCreateWithdraw } from "../../../hooks/userUpdateUserState";
import { useQuery } from "@tanstack/react-query";
import * as Yup from "yup";
import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

const WithdrawCheckout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const updateMutation = useUpdateCreateWithdraw();
  const location = useLocation();

  const {
    name,
    label,
    info,
    coinName,
    address,
    minAmount,
    maxAmount,
    conversionRate,
    currencyUsdt,
    charge,
  } = location.state || {};

  const currency = name?.split(" ")[0] || "";

  const { data: userData } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const token = localStorage.getItem("uToken");
      const { data } = await axios.get(`${baseURL}/api/getUserById`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    },
  });

  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .typeError("Amount must be a number")
      .required("Amount is required")
      .min(minAmount, `Minimum amount is ${minAmount} USDT`),
    paymentAddress: Yup.string().required("Wallet address is required"),
  });

  const formik = useFormik({
    initialValues: {
      gatWay: name,
      amount: "",
      coinConversion: conversionRate,
      paymentAddress: "",
      needToPay: "",
      charge: charge,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      const amount = parseFloat(values.amount);
      const userBalance = parseFloat(userData?.balance || 0);

      if (amount > userBalance) {
        toast.error("You cannot withdraw more than your balance.");
        return;
      }

      try {
        const response = await updateMutation.mutateAsync(values);
        if (response?.withdraw?._id) {
          toast.success("Withdraw request submitted!");
          resetForm();
          navigate(`/withdraw/log/${response.withdraw._id}`, {
            state: response.withdraw,
          });
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (error) {
        console.error("Withdraw error:", error);
        toast.error("Failed to submit Withdraw. Please try again.");
      }
    },
  });

  // Dynamic needToPay calculation
  useEffect(() => {
    const amount = parseFloat(formik.values.amount);
    const chargePercent = parseFloat(charge);
    const userBalance = parseFloat(userData?.balance || 0);

    if (!amount || isNaN(amount)) {
      formik.setFieldValue("needToPay", "");
      return;
    }

    if (amount > userBalance) {
      toast.error("Amount exceeds your available balance.");
      formik.setFieldValue("amount", userBalance.toString());
      return;
    }

    const totalWithCharge = amount - (amount * chargePercent) / 100;
    formik.setFieldValue("needToPay", totalWithCharge.toFixed(4));
  }, [formik.values.amount, charge, userData]);

  const handleCopyAddress = () => {
    navigator.clipboard
      .writeText(address)
      .then(() => toast.success("Address copied to clipboard!"))
      .catch(() => toast.error("Failed to copy address."));
  };

  const formatBalance = (balance) => parseFloat(balance).toFixed(4);
  const formatDecimal = (balance) => parseFloat(balance).toFixed(8);

  return (
    <div className="flex flex-col items-center pt-2 bg-[#0d111c] text-white h-screen relative">
      <div className="flex-1 w-full max-w-sm overflow-y-auto pt-10 px-2 pb-40 custom-scroll">
        <div className="bg-[#1E2329] p-4 rounded-md w-full">
          <div className="border border-gray-500 rounded-lg p-2">
            <div className="p-2 rounded-md mb-2">
              <p className="text-sm text-gray-400 mb-1">Currency</p>
              <p className="text-md font-semibold">{coinName}</p>
            </div>
            <div className="p-2 rounded-md mb-2 border-t mt-3 border-gray-500">
              <p className="text-xs text-gray-400 mb-1">Gateway</p>
              <p className="text-sm font-semibold">{currency}</p>
            </div>
          </div>

          <div className="mt-3 flex justify-between">
            <p className="text-xs text-gray-400 mb-1">
              Available{" "}
              <span className="text-white text-md">
                {formatBalance(userData?.balance || 0)}{" "}
              </span>
              USDT
            </p>
            <p className="text-xs text-gray-400 mb-1">
              Minimum{" "}
              <span className="text-white text-md">
                {formatBalance(minAmount)}{" "}
              </span>
              USDT
            </p>
          </div>

          {/* Amount Input */}
          <div className="relative mb-1 mt-3">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="number"
              name="amount"
              value={formik.values.amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={info}
              className={`w-full pl-9 bg-[#0d111c] p-2 rounded-md text-white placeholder-gray-400 text-sm border ${
                formik.touched.amount && formik.errors.amount
                  ? "border-red-500"
                  : "border-gray-600"
              } focus:outline-none`}
            />
            {formik.touched.amount && formik.errors.amount && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.amount}
              </p>
            )}
          </div>

          {/* Payment Address Input */}
          <div className="relative mb-1 mt-3">
            <ScanBarcode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              name="paymentAddress"
              value={formik.values.paymentAddress}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={`Enter Your ${coinName} Address`}
              className={`w-full pl-9 bg-[#0d111c] p-2 rounded-md text-white placeholder-gray-400 text-sm border ${
                formik.touched.paymentAddress && formik.errors.paymentAddress
                  ? "border-red-500"
                  : "border-gray-600"
              } focus:outline-none`}
            />
            {formik.touched.paymentAddress && formik.errors.paymentAddress && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.paymentAddress}
              </p>
            )}
          </div>

          <div className="text-xs text-gray-400 mb-3 space-y-2 mt-4">
            <div className="flex justify-between">
              <span>Minimum limit:</span>
              <span className="font-semibold text-gray-400">
                {formatDecimal(minAmount * conversionRate)} {currencyUsdt}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Maximum limit:</span>
              <span className="font-semibold text-gray-400">
                {formatBalance(userData?.balance * conversionRate)}{" "}
                {currencyUsdt}
              </span>
            </div>
            <div className="flex justify-between">
              <span>1 {name} =</span>
              <span className="font-semibold text-gray-400">
                {formatDecimal(conversionRate)} USDT
              </span>
            </div>
          </div>

          <p className="text-[10px] text-gray-500 leading-tight">
            * After making the deposit and filling all the information, click
            the button below.
          </p>
        </div>
      </div>

      {/* Sticky Submit Button */}
      <div className="fixed bottom-16 w-full px-4 max-w-sm flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-400 mb-1">Receive Amount</p>
          <p>{`${formik.values?.needToPay || "0.0000"}`} USDT</p>
          <p className="text-sm text-gray-400 mb-1">
            Processing fee: <span className="text-white">{`${charge}%`}</span>
          </p>
        </div>
        <div>
          <button
            type="button"
            onClick={formik.handleSubmit}
            className="px-6 py-4 bg-[#FCD535] text-black font-bold rounded-md text-sm"
          >
            withdraw
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawCheckout;

import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import { toast } from "react-hot-toast";
import { Copy, DollarSign, UploadCloud } from "lucide-react";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useUpdateCreateDeposit } from "../../../hooks/userUpdateUserState";
const baseURL = import.meta.env.VITE_BASE_URL;
import axios from "axios";

const DepositCheckout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const updateMutation = useUpdateCreateDeposit();
  const [errorMessage, setErrorMessage] = useState("");
  const [progresspercent, setProgresspercent] = useState(0);
  const [preview, setPreview] = useState("");

  const location = useLocation();
  const {
    name,
    label,
    address,
    minDeposit,
    maxDeposit,
    conversionRate,
    currencyUsdt,
  } = location.state || {};

  const currency = name?.split(" ")[0] || "";

  // const handleCopyAddress = () => {
  //   navigator.clipboard
  //     .writeText(address)
  //     .then(() => toast.success("Address copied!"))
  //     .catch(() => toast.error("Failed to copy address."));
  // };

  const handleCopyAddress = () => {
    if (navigator.clipboard && window.isSecureContext) {
      // Modern Clipboard API
      navigator.clipboard
        .writeText(address)
        .then(() => toast.success("Address copied!"))
        .catch(() => fallbackCopyText(address));
    } else {
      // Fallback for insecure or unsupported contexts
      fallbackCopyText(address);
    }
  };

  // const handleCopyAddress = () => {
  //   // const textToCopy = currencyUsdt === 'SOL' ? 'AcHgYEPUjxx4FxtbMqygZJNUfG15DwjNeiQAt2b3ENV8' : address;
  //   let textToCopy;

  //   if (currencyUsdt === "SOL") {
  //     textToCopy = "FqN7zToQvCNbhFjqknBMWY1FFoEA8HNWE2QrFTgCwqjJ";
  //   } else if (currencyUsdt === "BTC") {
  //     textToCopy = "bc1q4njqc4jz7y609u4rkncllss23z9efp5qgrh3tr";
  //   } else if (currencyUsdt === "ETH") {
  //     textToCopy = "0xB5b25dCc5BbFDc99430A94C2f583AC59E49dCe73";
  //   } else if (currencyUsdt === "USDT") {
  //     textToCopy = "0xB5b25dCc5BbFDc99430A94C2f583AC59E49dCe73";
  //   } else {
  //     textToCopy = address;
  //   }

  //   if (navigator.clipboard && window.isSecureContext) {
  //     // Modern Clipboard API
  //     navigator.clipboard
  //       .writeText(textToCopy)
  //       .then(() => toast.success("Address copied!"))
  //       .catch(() => fallbackCopyText(textToCopy));
  //   } else {
  //     // Fallback for insecure or unsupported contexts
  //     fallbackCopyText(textToCopy);
  //   }
  // };

  const fallbackCopyText = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;

    // Move textarea off-screen
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.setAttribute("readonly", "");

    document.body.appendChild(textarea);
    textarea.select();

    try {
      const successful = document.execCommand("copy");
      if (successful) {
        toast.success("Address copied!");
      } else {
        toast.error("Copy failed. Please copy manually.");
      }
    } catch (err) {
      toast.error("Copy failed.");
    }

    document.body.removeChild(textarea);
  };

  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .required("Amount is required")
      .min(minDeposit, `Minimum is ${minDeposit} ${currencyUsdt}`)
      .max(maxDeposit, `Maximum is ${maxDeposit} ${currencyUsdt}`),
    // transactionId: Yup.string().required("Transaction ID is required"),
    transactionScreenshot: Yup.string().required(
      "Transaction screenshot is required"
    ),
  });

  const formik = useFormik({
    initialValues: {
      gatWay: name,
      amount: "",
      coinConversion: conversionRate,
      // transactionId: "",
      transactionScreenshot: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await updateMutation.mutateAsync(values);
        if (response?.deposit?._id) {
          toast.success("Deposit submitted!");
          resetForm();
          setPreview("");
          setProgresspercent(0);
          setErrorMessage("");
          navigate(`/deposit/log/${response.deposit._id}`, {
            state: response.deposit,
          });
        } else {
          throw new Error("Invalid response");
        }
      } catch {
        toast.error("Failed to submit deposit.");
      }
    },
  });

  const formatBalance = (value) => parseFloat(value).toFixed(2);

  const handleUpload = async (e, fieldName, setPreview) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
      setErrorMessage("");
      const formData = new FormData();
      formData.append("file", file);

      try {
        const timestamp = new Date().getTime();
        const uploadRes = await axios.post(
          `${baseURL}/upload?timestamp=${timestamp}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (e) =>
              setProgresspercent(Math.round((e.loaded / e.total) * 100)),
          }
        );

        const { fileUrl } = uploadRes.data;
        if (!fileUrl) return setErrorMessage("Upload failed: no file URL.");

        formik.setFieldValue(fieldName, fileUrl);
        setPreview(fileUrl);
      } catch (error) {
        setErrorMessage("Upload failed. Please try again.");
        console.error("Upload error:", error);
      }
    };

    img.onerror = () => setErrorMessage("Invalid image file.");
  };

  return (
    <div className="bg-[#0d111c] pt-10 text-white h-screen flex flex-col items-center justify-start relative">
      {/* Scrollable container */}
      <div className="flex-1 overflow-y-auto w-full max-w-[420px] px-2 pt-4 pb-36 custom-scroll">
        <div className="bg-[#1E2329] p-1 rounded-xl border border-[#2a2f36] shadow-md space-y-2">
          {/* QR Code */}
          <div className="flex justify-center">
            <div className="bg-white p-1 rounded-sm">
              <QRCode
                value={address || ""}
                size={100}
                style={{ height: "auto", maxWidth: "100%", width: "100px" }}
              />
            </div>
          </div>
          <p className="text-center text-sm text-gray-400">{label}</p>

          {/* Currency */}
          <div className="bg-[#0f141a] p-3 rounded-md border border-gray-700">
            <p className="text-xs text-gray-400 mb-1">Currency</p>
            <p className="text-sm font-semibold">{currency}</p>
          </div>

          {/* Wallet Address */}
          <div className="bg-[#0f141a] p-3 rounded-md border border-gray-700 flex items-start gap-2">
            <div className="w-full">
              <p className="text-xs text-gray-400 mb-1">{name}</p>
              <p className="text-xs break-all">{address}</p>
            </div>
            <button
              onClick={handleCopyAddress}
              className="p-1 hover:text-yellow-400"
            >
              <Copy size={14} className="text-gray-400" />
            </button>
          </div>

          {/* Amount Input */}
          <div className="relative mb-2">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="number"
              name="amount"
              value={formik.values.amount}
              onChange={formik.handleChange}
              onInput={(e) => {
                if (e.target.value !== "" && +e.target.value > maxDeposit) {
                  e.target.value = maxDeposit;
                  formik.setFieldValue("amount", maxDeposit);
                }
              }}
              placeholder="Deposit Amount"
              className={`w-full pl-9 bg-[#0f141a] p-3 rounded-md text-white placeholder-gray-500 text-sm border ${
                formik.touched.amount && formik.errors.amount
                  ? "border-red-500"
                  : "border-gray-700"
              } focus:outline-none focus:ring-2 focus:ring-yellow-400`}
            />

            {formik.touched.amount && formik.errors.amount && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.amount}
              </p>
            )}
          </div>

          {/* Transaction ID */}
          {/* <div className="relative">
            <input
              type="text"
              name="transactionId"
              value={formik.values.transactionId}
              onChange={formik.handleChange}
              placeholder="Transaction ID"
              className={`w-full pl-3 bg-[#0f141a] p-3 rounded-md text-white placeholder-gray-500 text-sm border ${
                formik.touched.transactionId && formik.errors.transactionId
                  ? "border-red-500"
                  : "border-gray-700"
              } focus:outline-none focus:ring-2 focus:ring-yellow-400`}
            />
            {formik.touched.transactionId && formik.errors.transactionId && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.transactionId}</p>
            )}
          </div> */}

          {/* Upload Screenshot */}
          <div>
            <label className="block mb-1 text-xs text-gray-400 font-semibold">
              Upload Transaction Screenshot
            </label>
            <div className="relative max-h-44 overflow-y-auto">
              <label
                htmlFor="upload-input"
                className="cursor-pointer border-2 border-dashed border-gray-500 bg-[#0f141a] rounded-md p-4 flex flex-col items-center justify-center text-center hover:border-yellow-400 transition"
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Screenshot Preview"
                    className="w-20 h-20 object-cover rounded-md mb-2"
                  />
                ) : (
                  <>
                    <UploadCloud className="w-6 h-6 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-400">
                      Click to upload screenshot
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1">
                      Accepted formats: JPG, PNG
                    </p>
                  </>
                )}
              </label>
              <input
                id="upload-input"
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) =>
                  handleUpload(e, "transactionScreenshot", setPreview)
                }
                className="hidden"
              />
            </div>
            {progresspercent > 0 && progresspercent < 100 && (
              <p className="text-xs text-gray-400 mt-2">
                Uploading: {progresspercent}%
              </p>
            )}
            {formik.touched.transactionScreenshot &&
              formik.errors.transactionScreenshot && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.transactionScreenshot}
                </p>
              )}
            {errorMessage && (
              <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
            )}
          </div>

          {/* Limits */}
          <div className="text-xs text-gray-400 bg-[#0f141a] p-3 rounded-md border border-gray-700 space-y-2">
            <div className="flex justify-between">
              <span>Min:</span>
              <span className="font-medium">
                {formatBalance(minDeposit)} {currencyUsdt}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Max:</span>
              <span className="font-medium">
                {formatBalance(maxDeposit)} {currencyUsdt}
              </span>
            </div>
            <div className="flex justify-between">
              <span>1 {currency} =</span>
              <span className="font-medium">
                {formatBalance(conversionRate)} {currencyUsdt}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-gray-500 leading-tight mt-2">
            * After sending your deposit and entering the transaction ID, tap
            submit to continue.
          </p>
        </div>
      </div>

      {/* Sticky Submit Button */}
      <div className="fixed bottom-4 left-0 right-0 px-4 w-full max-w-[420px] mb-12 mx-auto z-50">
        <button
          onClick={formik.handleSubmit}
          className="w-full bg-[#fcd535] text-black font-bold py-3 rounded-md text-sm shadow-md hover:bg-[#fbe97f] transition-all duration-150"
        >
          Submit Deposit Request
        </button>
      </div>
    </div>
  );
};

export default DepositCheckout;

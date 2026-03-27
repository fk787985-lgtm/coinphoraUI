import React, { useState, useEffect } from "react";
import { UploadCloud, XCircle } from "lucide-react";
import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

const docTypes = {
  ID: { front: "ID Front", back: "ID Back" },
  Passport: { front: "Passport Photo", back: "Passport Back" },
  DL: { front: "Driver's License Front", back: "Driver's License Back" },
};

const IdUploadGrid = ({
  formik,
  idFrontPreview,
  setIdFrontPreview,
  idBackPreview,
  setIdBackPreview,
}) => {
  const [documentType, setDocumentType] = useState(formik.values.documentType || "ID");
  const [errorMessage, setErrorMessage] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    formik.setFieldValue("documentType", documentType);
    setIdFrontPreview(null);
    setIdBackPreview(null);
    formik.setFieldValue("idFront", null);
    formik.setFieldValue("idBack", null);
    setErrorMessage("");
    setProgressPercent(0);
  }, [documentType]);

  const handleUpload = async (e, fieldName, setPreview) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reject very large files (e.g. 10MB+)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("File too large. Please upload an image under 10MB.");
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);

    // Safe fallback in case preview fails
    const safeUpload = async () => {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const timestamp = Date.now();
        const uploadRes = await axios.post(
          `${baseURL}/upload?timestamp=${timestamp}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            timeout: 180000, // 3 minutes timeout
            onUploadProgress: (e) =>
              setProgressPercent(Math.round((e.loaded / e.total) * 100)),
          }
        );

        const { fileUrl } = uploadRes.data;
        if (!fileUrl) return setErrorMessage("Upload failed: no file URL.");

        formik.setFieldValue(fieldName, fileUrl);
        setPreview(fileUrl);
        setProgressPercent(0);
      } catch (error) {
        setErrorMessage("Upload failed. Please try again.");
        setProgressPercent(0);
        console.error("Upload error:", error);
      }
    };

    img.onload = async () => {
      setErrorMessage("");
      await safeUpload();
    };

    img.onerror = () => {
      setErrorMessage("Image preview failed, uploading anyway...");
      safeUpload();
    };
  };

  const clearPreview = (fieldName, setPreview) => {
    formik.setFieldValue(fieldName, null);
    setPreview(null);
    setErrorMessage("");
  };

  return (
    <div className="space-y-6">
      {/* Document Type Select */}
      <div>
        <label
          htmlFor="documentType"
          className="block mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400"
        >
          Select Document Type
        </label>
        <select
          id="documentType"
          name="documentType"
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-[#1a1d24]/80 border border-[#3a3f4b] text-white text-sm shadow-sm
            focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
          aria-invalid={!!formik.errors.documentType}
          aria-describedby="documentType-error"
        >
          <option value="ID">ID Card</option>
          <option value="Passport">Passport</option>
          <option value="DL">Driver's License</option>
        </select>
        {formik.touched.documentType && formik.errors.documentType && (
          <p
            id="documentType-error"
            className="mt-1 text-xs text-red-500 animate-fadeIn"
            role="alert"
          >
            {formik.errors.documentType}
          </p>
        )}
      </div>

      {/* Upload Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[{
          field: "idFront",
          preview: idFrontPreview,
          setPreview: setIdFrontPreview,
          label: docTypes[documentType].front,
        }, {
          field: "idBack",
          preview: idBackPreview,
          setPreview: setIdBackPreview,
          label: docTypes[documentType].back,
        }].map(({ field, preview, setPreview, label }) => (
          <div key={field} className="relative group bg-[#1a1d24]/70 border border-[#3a3f4b] rounded-xl cursor-pointer flex flex-col items-center justify-center p-6 hover:border-cyan-500 transition">
            {/* Preview Image or Upload Placeholder */}
            {preview ? (
              <>
                <img
                  src={preview}
                  alt={`${label} preview`}
                  className="w-full h-36 object-contain rounded-lg shadow-md"
                />
                {/* Clear button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearPreview(field, setPreview);
                  }}
                  className="absolute top-3 right-3 bg-red-600/80 text-white rounded-full p-1.5 hover:bg-red-700 transition"
                  aria-label={`Remove ${label}`}
                >
                  <XCircle size={20} />
                </button>
              </>
            ) : (
              <>
                <UploadCloud className="w-10 h-10 text-gray-500 mb-2 group-hover:text-cyan-400 transition" />
                <span className="text-xs text-gray-400 font-semibold select-none">
                  Upload {label}
                </span>
              </>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleUpload(e, field, setPreview)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-xl"
              aria-label={`Upload ${label}`}
            />

            {/* Validation Error */}
            {formik.touched[field] && formik.errors[field] && (
              <p
                className="absolute bottom-1 left-1 right-1 text-xs text-red-500 font-semibold"
                role="alert"
              >
                {formik.errors[field]}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Upload progress bar */}
      {progressPercent > 0 && (
        <div className="relative w-full bg-[#3a3f4b] rounded-full h-2 overflow-hidden">
          <div
            className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
          <span className="absolute right-2 top-[-1.25rem] text-xs text-cyan-400 font-semibold select-none">
            Uploading: {progressPercent}%
          </span>
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <p
          className="mt-2 text-sm text-red-500 font-semibold animate-shake"
          role="alert"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default IdUploadGrid;
// Note: Ensure you have the necessary permissions and HTTPS setup for file uploads.
// This component handles document type selection, file uploads, previews, and error handling.
import React, { useState } from "react";
import { useFormik } from "formik";
import { Upload } from "lucide-react";
import * as Yup from "yup";
import axios from "axios";
import FaceScanStep from "./FaceScanStep";
import IdUploadGrid from "./IdUploadGrid";
import { useNavigate } from "react-router-dom";

const steps = ["Personal Info", "Address", "Income", "Documents", "Face Scan"];
import toast, { Toaster } from "react-hot-toast";
import { useUpdateCreateKyc } from "../../../hooks/userUpdateUserState";

const validationSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  middleName: Yup.string(),
  lastName: Yup.string().required("Last name is required"),
  dateOfBirth: Yup.date()
    .required("Date of Birth is required")
    .max(new Date(), "Date of Birth cannot be in the future"),
  street: Yup.string().required("Street address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State/Province is required"),
  postalCode: Yup.string().required("Postal Code is required"),
  country: Yup.string().required("Country is required"),
  employmentStatus: Yup.string().required("Employment status is required"),
  annualIncome: Yup.number()
    .typeError("Annual income must be a number")
    .min(0, "Annual income cannot be negative")
    .required("Annual income is required"),
  idFront: Yup.mixed().required("Front ID image is required"),
  idBack: Yup.mixed().required("Back ID image is required"),
  cameraRoll: Yup.string().required("Face scan is required"),
});

const getStepFields = (step) => {
  switch (step) {
    case 0:
      return ["firstName", "middleName", "lastName", "dateOfBirth"];
    case 1:
      return ["street", "city", "state", "postalCode", "country"];
    case 2:
      return ["employmentStatus", "annualIncome"];
    case 3:
      return ["idFront", "idBack"];
    case 4:
      return ["cameraRoll"];
    default:
      return [];
  }
};

const KYCForm = () => {
  const [step, setStep] = useState(0);
  const [idFrontPreview, setIdFrontPreview] = useState(null);
  const [idBackPreview, setIdBackPreview] = useState(null);
  const updateMutation = useUpdateCreateKyc();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      employmentStatus: "",
      annualIncome: "",
      idFront: null,
      idBack: null,
      documentType: "",
      cameraRoll: null,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (!values.cameraRoll) {
        toast.error("Please complete the face scan before submitting.");
        return;
      }

      try {
        const response = await updateMutation.mutateAsync(values);
        if (response?.kyc?._id) {
          toast.success("kyc request submitted!");
          resetForm();
          navigate(`/kyc/log`, {
            state: response.kyc,
          });
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (error) {
        console.error("kyc error:", error);
        toast.error("Failed to submit kyc. Please try again.");
      }
      // console.log("Submitted:", values);
    },
  });

  const nextStep = async () => {
    const stepFields = getStepFields(step);
    const errors = await formik.validateForm();
    const stepErrors = Object.keys(errors).filter((key) =>
      stepFields.includes(key)
    );

    if (stepErrors.length > 0) {
      const touchedFields = {};
      stepFields.forEach((field) => {
        touchedFields[field] = true;
      });
      formik.setTouched({ ...formik.touched, ...touchedFields }, true);
      return;
    }

    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleFileChange = (e, fieldName, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue(fieldName, file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="pt-20 px-4 pb-10 text-white h-[calc(100vh-80px)] overflow-y-auto bg-[#0f1115]">
      <Toaster></Toaster>
      <h2 className="text-xl font-semibold mb-4">{steps[step]}</h2>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {step === 0 && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  First Name
                </label>
                <input
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  className="w-full bg-[#1a1d24] p-4 rounded-lg text-sm border border-[#3a3f4b]"
                  placeholder="John"
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.firstName}
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Middle Name
                </label>
                <input
                  name="middleName"
                  value={formik.values.middleName}
                  onChange={formik.handleChange}
                  className="w-full bg-[#1a1d24] p-4 rounded-lg text-sm border border-[#3a3f4b]"
                  placeholder="Doe"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Last Name
                </label>
                <input
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  className="w-full bg-[#1a1d24] p-4 rounded-lg text-sm border border-[#3a3f4b]"
                  placeholder="Smith"
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.lastName}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                Date of Birth
              </label>
              <input
                name="dateOfBirth"
                value={formik.values.dateOfBirth}
                onChange={formik.handleChange}
                type="date"
                className="w-full bg-[#1a1d24] p-4 rounded-lg text-sm border border-[#3a3f4b]"
              />
              {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.dateOfBirth}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: "street", label: "Street Address" },
              { name: "city", label: "City" },
              { name: "state", label: "State / Province" },
              { name: "postalCode", label: "Postal Code" },
            ].map(({ name, label }) => (
              <div key={name} className="relative">
                <label className="block text-sm text-blue-300 font-medium mb-1 tracking-wide">
                  {label}
                </label>
                <input
                  name={name}
                  value={formik.values[name]}
                  onChange={formik.handleChange}
                  placeholder={label}
                  className="w-full bg-[#1a1d24]/60 backdrop-blur-sm text-white p-3 rounded-lg border border-[#2a2f3c] focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 placeholder:text-gray-500"
                />
                {formik.touched[name] && formik.errors[name] && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors[name]}
                  </p>
                )}
              </div>
            ))}

            <div className="sm:col-span-1">
              <label className="block text-sm text-blue-300 font-medium mb-2 tracking-wide">
                Country
              </label>
              <select
                name="country"
                value={formik.values.country}
                onChange={formik.handleChange}
                className="w-full bg-[#1a1d24]/60 backdrop-blur-sm text-white p-3 rounded-lg border border-[#2a2f3c] focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
              >
                <option value="">🌍 Select Country</option>
                <option value="US">🇺🇸 United States</option>
                <option value="UK">🇬🇧 United Kingdom</option>
                <option value="CA">🇨🇦 Canada</option>
                <option value="DE">🇩🇪 Germany</option>
                <option value="FR">🇫🇷 France</option>
                <option value="CH">🇨🇭 Switzerland</option>
                <option value="NL">🇳🇱 Netherlands</option>
                <option value="SE">🇸🇪 Sweden</option>
                <option value="NO">🇳🇴 Norway</option>
                <option value="FI">🇫🇮 Finland</option>
                <option value="DK">🇩🇰 Denmark</option>
                <option value="AU">🇦🇺 Australia</option>
                <option value="NZ">🇳🇿 New Zealand</option>
                <option value="IE">🇮🇪 Ireland</option>
                <option value="SG">🇸🇬 Singapore</option>
                <option value="JP">🇯🇵 Japan</option>
                <option value="KR">🇰🇷 South Korea</option>
                <option value="LU">🇱🇺 Luxembourg</option>
                <option value="AE">🇦🇪 United Arab Emirates</option>
              </select>

              {formik.touched.country && formik.errors.country && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.country}
                </p>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["employmentStatus", "annualIncome"].map((field) => (
              <div key={field}>
                <input
                  name={field}
                  value={formik.values[field]}
                  onChange={formik.handleChange}
                  placeholder={
                    field === "annualIncome"
                      ? "Annual Income (USD)"
                      : "Employment Status"
                  }
                  className="bg-[#1a1d24] p-3 rounded text-sm w-full"
                />
                {formik.touched[field] && formik.errors[field] && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors[field]}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {step === 3 && (
          <IdUploadGrid
            formik={formik}
            idFrontPreview={idFrontPreview}
            setIdFrontPreview={setIdFrontPreview}
            idBackPreview={idBackPreview}
            setIdBackPreview={setIdBackPreview}
            handleFileChange={handleFileChange}
          />
        )}

        {step === 4 && <FaceScanStep formik={formik} />}

        <div className="flex gap-4 mt-8">
          {step > 0 && (
            <button
              type="button"
              onClick={prevStep}
              className="flex-1 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={step < steps.length - 1 ? nextStep : formik.handleSubmit}
            className="flex-1 py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition"
          >
            {step < steps.length - 1 ? "Next" : "Submit KYC"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default KYCForm;

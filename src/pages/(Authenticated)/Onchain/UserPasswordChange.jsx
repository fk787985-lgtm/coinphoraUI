import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { useUpdateUserByUserState } from "../../../hooks/userUpdateUserState";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const UserChangePassword = () => {
  const updateMutation = useUpdateUserByUserState();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirm = () => setShowConfirm(!showConfirm);
const userLogout = async () => {
    try {
      localStorage.clear();
  
      setTimeout(() => {
        window.location.href = "/signin"; // full hard refresh
      }, 1000); // small delay so the toast appears
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await updateMutation.mutateAsync({
          password: values.password,
        });
        if (response?.data?.user?._id) {
          toast.success("Password updated successfully");
        //   navigate("/settings");
        userLogout();
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (error) {
        console.error("Update error:", error);
        toast.error("Failed to update password. Please try again.");
      }
    },
  });

  return (
    <div className="max-w-2xl mx-auto pt-16 px-4">
      <Toaster />

      <form
        onSubmit={formik.handleSubmit}
        className="space-y-6 p-1 rounded-lg shadow-md"
      >
        {/* Password */}
        <div className="relative">
          <label htmlFor="password" className="block text-md font-medium mb-2">
            New Password
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            {...formik.getFieldProps("password")}
            className="w-full pl-2 bg-[#0d111c] p-2 rounded-md text-white placeholder-gray-400 text-sm border"
            placeholder="Enter new password"
          />
          <span
            className="absolute top-[38px] right-3 text-white cursor-pointer"
            onClick={togglePassword}
          >
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label htmlFor="confirmPassword" className="block text-md font-medium mb-2">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            {...formik.getFieldProps("confirmPassword")}
            className="w-full pl-2 bg-[#0d111c] p-2 rounded-md text-white placeholder-gray-400 text-sm border"
            placeholder="Confirm new password"
          />
          <span
            className="absolute top-[38px] right-3 text-white cursor-pointer"
            onClick={toggleConfirm}
          >
            {showConfirm ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default UserChangePassword;

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { useUpdateUserByUserState } from "../../../hooks/userUpdateUserState";
import { useNavigate } from "react-router-dom";

const baseURL = import.meta.env.VITE_BASE_URL;

const UserProfile = () => {
  const updateMutation = useUpdateUserByUserState();
const navigate = useNavigate();
  // Fetch user data
  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery({
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

  const formik = useFormik({
    // enableReinitialize: true,
    initialValues: {
      fullName: userData?.fullName,
      username: userData?.username,
      email: userData?.email,
      phoneNumber: userData?.phoneNumber,
      id: userData?._id
    },
    onSubmit: async (values) => {
      try {
        const response = await updateMutation.mutateAsync(values);
        // console.log(response.data.user)
        if (response?.data?.user?._id) {
          toast.success("User updated successfully");
          navigate("/settings")
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (error) {
        console.error("user Update error:", error);
        toast.error("Failed to update user. Please try again.");
      }
    },
  });

  if (isLoading) {
    return <div className="text-center mt-20">Loading user data...</div>;
  }

  if (isError || !userData) {
    return (
      <div className="text-center text-red-600 mt-20">
        Failed to load user data.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pt-16 px-4">
      <Toaster />
      
      <form
        onSubmit={formik.handleSubmit}
        className="space-y-6 p-1 rounded-lg shadow-md"
      >
        <div>
          <label
            htmlFor="fullName"
            className="block text-md font-medium mb-2"
          >
            Full Name
          </label>
          
          <input
            id="fullName"
            type="text"
            // {...formik.getFieldProps("fullName")}
            onChange={formik.handleChange}
            value={formik.values.fullName}
            className="w-full pl-2 bg-[#0d111c] p-2 rounded-md text-white placeholder-gray-400 text-sm border"
          />
        </div>

        <div>
          <label
            htmlFor="username"
            className="block text-md font-medium mb-2"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            {...formik.getFieldProps("username")}
            className="w-full pl-2 bg-[#0d111c] p-2 rounded-md text-white placeholder-gray-400 text-sm border"
          disabled
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-md font-medium mb-2"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            {...formik.getFieldProps("email")}
            className="w-full pl-2 bg-[#0d111c] p-2 rounded-md text-white placeholder-gray-400 text-sm border"
          disabled
          />
        </div>

        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-md font-medium mb-2"
          >
            Phone Number
          </label>
          <input
            id="phoneNumber"
            type="tel"
            {...formik.getFieldProps("phoneNumber")}
            className="w-full pl-2 bg-[#0d111c] p-2 rounded-md text-white placeholder-gray-400 text-sm border"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UserProfile;

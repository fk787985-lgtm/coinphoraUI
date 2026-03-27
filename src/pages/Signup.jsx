import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { registerValidation } from "../helper/validate";
import { registerUser } from "../helper/helper";
import { Eye, EyeOff } from "lucide-react"; // 👈 Import Eye icons

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      fullName: "OnchainUser12",
      password: "",
      confirm_password: "",
    },
    validate: (values) => {
      values.email = values?.email?.toLowerCase();
      const errors = registerValidation(values);
      if (values.password !== values.confirm_password) {
        toast.error("Passwords do not match");
      }
      return errors;
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      const registerPromise = registerUser(values);

      toast.promise(registerPromise, {
        loading: "Creating account...",
        success: <b>Registered Successfully!</b>,
        error: <b>Could not Register.</b>,
      });

      registerPromise
        .then(() => {
          navigate("/signin"); // After success navigate to signin page
        })
        .catch((error) => {
          console.error("Registration error:", error);
        });
    },
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (formik.values.password !== formik.values.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }
    formik.handleSubmit();
  };

  return (
    <div className="h-screen bg-gray-900 text-white">
      <div className="flex h-full items-center justify-center p-4">
        <Toaster position="top-center" reverseOrder={false} />
        <main className="w-full max-w-md">
          <div className="bg-gray-800 rounded-xl shadow-lg p-2">
            <div className="text-center mb-2">
              <h1 className="text-xl font-bold">Create your account</h1>
              <p className="mt-2 text-sm text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="text-yellow-500 hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <button
              type="button"
              className="w-full py-3 flex items-center justify-center gap-2 bg-white text-black rounded-lg hover:bg-gray-200 mb-6"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 533.5 544.3"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M533.5 278.4c0-18.6-1.5-37.1-4.7-55H272v104h146.9c-6.4 34.6-25.5 63.9-54.4 83.6v69.4h87.9c51.4-47.4 81.1-117.3 81.1-201z"
                  fill="#4285F4"
                />
                <path
                  d="M272 544.3c73.7 0 135.6-24.4 180.8-66.2l-87.9-69.4c-24.4 16.3-55.6 26-92.9 26-71 0-131-47.9-152.3-112.1h-90v70.7C98.2 475.4 178.1 544.3 272 544.3z"
                  fill="#34A853"
                />
                <path
                  d="M119.7 322.6c-10.3-30.6-10.3-63.5 0-94.1v-70.7h-90c-39 77.8-39 167.1 0 244.9l90-70.1z"
                  fill="#FBBC05"
                />
                <path
                  d="M272 107.7c39.8-.6 78 14.1 107.1 40.8l80.2-80.2C407.6 24.8 340.5 0 272 0c-93.9 0-173.8 68.9-201.9 162.7l90 70.7C141 155.6 201 107.7 272 107.7z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center mb-4">
              <hr className="flex-grow border-gray-700" />
              <span className="px-4 text-gray-500 text-xs uppercase">Or</span>
              <hr className="flex-grow border-gray-700" />
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-2">
              {/* 
              <input
                {...formik.getFieldProps("fullName")}
                type="text"
                 autoComplete="off"
                placeholder="Full Name"
                className="py-3 px-4 border-transparent block w-full rounded-lg text-sm bg-gray-700 text-white outline-none"
                required
              />
              
              */}
              

              {/* Username */}
              <input
                {...formik.getFieldProps("username")}
                type="text"
                placeholder="Username"
                className="py-3 px-4 border-transparent block w-full rounded-lg text-sm bg-gray-700 text-white outline-none"
                required
                 autoComplete="off"
              />

              {/* Email */}
              <input
                {...formik.getFieldProps("email")}
                type="email"
                placeholder="Email Address"
                className="py-3 px-4 border-transparent block w-full rounded-lg text-sm bg-gray-700 text-white outline-none"
                required
                 autoComplete="off"
              />

              {/* Password */}
              <div className="relative">
                <input
                  {...formik.getFieldProps("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="py-3 px-4 border-transparent block w-full rounded-lg text-sm bg-gray-700 text-white outline-none"
                  required
                   autoComplete="off"
                />
                <div
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  {...formik.getFieldProps("confirm_password")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="py-3 px-4 border-transparent block w-full rounded-lg text-sm bg-gray-700 text-white outline-none"
                  required
                />
                <div
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white transition"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3  bg-yellow-400 hover:bg-yellow-500 rounded-lg font-semibold transition"
              >
                Sign Up
              </button>
            </form>

            {/* Terms and Conditions */}
            <p className="text-xs text-gray-400 mt-2  text-center">
              By signing up you accept our{" "}
              <Link
                to="/terms-and-condition"
                className="text-yellow-500 hover:underline"
              >
                Terms and Conditions
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Signup;

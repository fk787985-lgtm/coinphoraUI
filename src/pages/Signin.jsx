import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { passwordValidate } from "../helper/validate";
import { verifyPassword } from "../helper/helper.jsx";
import React from "react";

import Layout from "./Layout";

const Signin = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    // validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      let loginPromise = verifyPassword({
        email: values.email.toLowerCase(),
        password: values.password,
      });

      toast.promise(loginPromise, {
        loading: "Checking...",
        success: <b>Login Successfully...!</b>,
        error: <b>Couldn't Login!</b>,
      });

      loginPromise
        .then((res) => {
          let { token, role, email } = res?.data;
          localStorage.setItem("uToken", token);
          localStorage.setItem("currentEmail", email);
          
          if (role === "user") {
            navigate("/");
          } else if(role === "admin") {
            localStorage.setItem('token', token);
            navigate('/admin/users');
          }
        })
        .catch((res) => {
          toast.error(<b>{res?.error}</b>);
        });
    },
  });

  return (
    // <Layout>
      <div className="h-screen w-screen overflow-hidden bg-gray-900 text-white">
        <div className="flex h-full items-start justify-center px-4 pt-16 sm:px-6 lg:px-8">
          <Toaster position="top-center" reverseOrder={false}></Toaster>
          <main className="w-full max-w-md px-1 py-6">
            <div className="rounded-xl">
              <div className="p-2 sm:p-4">
                <div className="text-center">
                  <h1 className="block text-2xl font-bold">
                    Sign in to your account
                  </h1>
                  <p className="mt-2 text-sm text-gray-400">
                    <Link
                      to={"/signup"}
                      className="text-yellow-400 decoration-2 hover:underline font-medium"
                    >
                      {" "}
                      Create new account
                    </Link>
                  </p>
                </div>

                <div className="mt-5">
                  <form
                    onSubmit={formik.handleSubmit}
                    className="bg-gray-800 rounded-xl p-4 py-6"
                  >
                    <div className="grid gap-y-4">
                      <div>
                        <div className="relative">
                          <input
                            {...formik.getFieldProps("email")}
                            type="email"
                            className="py-3 px-4 border-transparent block w-full rounded-lg text-sm bg-gray-700 text-white outline-none"
                            required
                            placeholder="Email"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="relative">
                          <input
                            {...formik.getFieldProps("password")}
                            className="py-3 px-4 border-transparent block w-full rounded-lg text-sm bg-gray-700 text-white outline-none"
                            required
                            placeholder="Password"
                            type="password"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-yellow-400 text-white hover:bg-yellow-500"
                      >
                        Sign in
                      </button>
                    </div>
                  </form>
                  <div className="ms-3 mt-4 text-center">
                    <label htmlFor="remember-me" className="text-sm text-gray-400">
                     
                      <a
                        className="text-blue-400 decoration-2 hover:underline font-medium"
                        href="/helpline"
                      >
                        Need help?
                      </a>
                    </label>
                  </div>
                  <div className="ms-3 mt-4 text-center">
                    <label htmlFor="remember-me" className="text-sm text-gray-400">
                      By signing in you accept our{" "}
                      <a
                        className="text-yellow-400 decoration-2 hover:underline font-medium"
                        href="#"
                      >
                        Terms and Conditions
                      </a>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    // </Layout>
  );
};

export default Signin;

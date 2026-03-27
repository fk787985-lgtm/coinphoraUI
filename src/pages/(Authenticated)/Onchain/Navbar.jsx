import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  LogOut,
  Settings,
  Copy,
  X,
  CheckCircle,
  Banknote,
  Receipt,
  Repeat,
  Users,
  Home as HomeIcon,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import NavbarHeader from "./NavbarHeader";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const baseURL = import.meta.env.VITE_BASE_URL;

const Navbar = ({ title }) => {
  const navigate = useNavigate();
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

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const closeDrawer = () => setIsDrawerOpen(false);

  // const copyPayId = () => {
  //   navigator.clipboard.writeText(`${userData?.payId}`).then(() => {
  //     toast.success("PayID copied!");
  //   });
  // };
  const handleCopyAddress = () => {
    if (navigator.clipboard && window.isSecureContext) {
      // Modern Clipboard API
      navigator.clipboard
        .writeText(userData?.payId)
        .then(() => toast.success("Pay Id copied!"))
        .catch(() => fallbackCopyText(userData?.payId));
    } else {
      // Fallback for insecure or unsupported contexts
      fallbackCopyText(userData?.payId);
    }
  };

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
        toast.success("PayId copied!");
      } else {
        toast.error("Copy failed. Please copy manually.");
      }
    } catch (err) {
      toast.error("Copy failed.");
    }

    document.body.removeChild(textarea);
  };

  const userLogout = async () => {
    try {
      localStorage.clear();
      toast.success("Logged out successfully!");
      closeDrawer();
      setTimeout(() => {
        window.location.href = "/signin"; // Redirect to sign-in page after logout
      }, 1000);
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
    }
  };

  const navLinks = [
    { to: "/", label: "Home", icon: <HomeIcon className="w-5 h-5" /> },
    {
      to: "/deposit",
      label: "Deposit",
      icon: <Banknote className="w-5 h-5" />,
    },
    {
      to: "/deposit/log",
      label: "Deposit Logs",
      icon: <Receipt className="w-5 h-5" />,
    },
    {
      to: "/withdraw/log",
      label: "Withdraw Logs",
      icon: <Banknote className="w-5 h-5" />,
    },
    {
      to: "/transfer/log",
      label: "Transfer Logs",
      icon: <Repeat className="w-5 h-5" />,
    },
    // { to: "/referral", label: "Referral", icon: <Users className="w-5 h-5" /> },
    {
      to: "/settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <NavbarHeader toggleDrawer={toggleDrawer} title={title} />

      {isDrawerOpen && (
        <div className="fixed inset-0 z-[110]">
          <div
            className="absolute inset-0 bg-black opacity-60 backdrop-blur-sm z-0"
            onClick={closeDrawer}
          ></div>

          <div className="fixed top-0 left-0 w-[80%] max-w-sm h-full bg-gradient-to-br from-[#12151a] to-[#1a1f28] p-5 z-10 shadow-lg border-r border-cyan-800 rounded-r-lg overflow-y-auto">
            {/* Close Button */}
            <div className="flex justify-end mb-2">
              <button
                onClick={closeDrawer}
                className="text-cyan-400 hover:text-cyan-300 transition"
                aria-label="Close drawer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* User Section */}
            <div className="flex items-center space-x-4 mb-4">
              <User className="w-12 h-12 p-2 text-cyan-400 bg-cyan-900  rounded-full shadow-[0_0_10px_rgba(6,182,212,0.4)]" />
              <div className="flex flex-col">
                <div className="flex items-center space-x-2 text-cyan-300 font-mono tracking-wide">
                  <span className="bg-cyan-900 px-2 py-1 rounded shadow-md">
                    PayID: {userData?.payId}
                  </span>
                  <button
                    onClick={handleCopyAddress}
                    className="text-cyan-400 hover:text-cyan-200"
                    title="Copy PayID"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-white mt-1">
                  <span className="text-base font-semibold capitalize">
                    {userData?.username}
                  </span>
                  {userData?.isVerified ? (
                    <div className="flex items-center text-green-400 text-sm">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verified
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        navigate("/kyc/submit-form");
                        closeDrawer();
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded shadow-md"
                    >
                      Verify Now
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-t border-gray-700 my-4" />

            {/* Nav Links */}
            <nav className="space-y-3">
              {navLinks.map(({ to, label, icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={closeDrawer}
                  className="flex items-center space-x-3  text-white hover:text-cyan-200 font-medium transition px-3 py-2 rounded hover:bg-cyan-800/20"
                >
                  {icon}
                  <span>{label}</span>
                </Link>
              ))}
              <button
                onClick={userLogout}
                className="flex items-center w-full space-x-3 text-red-500 hover:text-red-400 font-medium transition px-3 py-2 mt-6 rounded hover:bg-red-800/20"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

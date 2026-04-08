import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  DollarSign,
  Headphones,
  Globe, // Use a globe icon for Translate
} from "lucide-react";
import logo from "../../../assets/logo.png";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { openTawkChat } from "../../../utils/tawkChat";

const baseURL = import.meta.env.VITE_BASE_URL;

const languages = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "zh", label: "Chinese" },
];

const NavbarHeader = ({ toggleDrawer, title }) => {
  const navigate = useNavigate();
  const currentRoute = window.location.pathname;
  const { t, i18n } = useTranslation();

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

  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const isHomePage = ["/", "/markets", "/orders", "/wallet", "/onchain", "/trade"].includes(currentRoute);
  const isTradePage = ["/trade", "/orders", "/order"].includes(currentRoute);

  const handleBack = () => navigate(-1);
  const handleSupport = () => {
    const opened = openTawkChat();
    if (!opened) navigate("/helpline");
  };

  // Toggle language dropdown visibility
  const toggleLangDropdown = () => setShowLangDropdown(!showLangDropdown);

  // Change language handler
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setShowLangDropdown(false);
  };

  // Format balance as money
  const formatMoney = (amount) => {
    return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-gradient-to-r from-[#0d111c] via-[#121825] to-[#0d111c] px-4 py-3 border-b border-gray-800 flex justify-between items-center shadow-md">
      {/* Left Side */}
      {isHomePage ? (
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="Logo"
            className="w-8 h-8 rounded-full cursor-pointer hover:opacity-80 transition"
            onClick={toggleDrawer}
          />
          <h1 className="text-lg font-semibold text-white tracking-wide">
            {t("Coinphora")}
          </h1>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button onClick={handleBack} className="text-white hover:text-yellow-400 transition">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="text-white text-lg font-semibold">{title}</span>
        </div>
      )}

      {/* Right Side */}
      <div className="flex items-center gap-4 relative">
        {!isTradePage && (
          <>
            <button
              onClick={handleSupport}
              title={t("Customer Support")}
              className="text-white hover:text-yellow-400 transition"
            >
              <Headphones className="w-5 h-5" />
            </button>

            {/* Translate / Language Selector */}
            <div className="relative">
              <button
                onClick={toggleLangDropdown}
                title={t("Translate")}
                className="text-white hover:text-yellow-400 transition flex items-center gap-1"
              >
                <Globe className="w-5 h-5" />
                <span className="text-sm">{i18n?.language?.toUpperCase()}</span>
              </button>

              {showLangDropdown && (
                <ul className="absolute right-0 mt-2 w-32 bg-gray-900 border border-gray-700 rounded shadow-lg z-50">
                  {languages.map(({ code, label }) => (
                    <li
                      key={code}
                      className={`cursor-pointer px-3 py-2 hover:bg-yellow-400 hover:text-black ${
                        i18n.language === code ? "font-bold" : ""
                      }`}
                      onClick={() => changeLanguage(code)}
                    >
                      {label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        {isTradePage && (
          <div className="flex items-center gap-1 px-3 py-1.5 bg-[#1e2329] rounded-full text-sm shadow-inner">
            <DollarSign className="w-4 h-4 text-yellow-400" />
            <span className="text-white">
              ${formatMoney(parseFloat(userData?.balance || 0))}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavbarHeader;

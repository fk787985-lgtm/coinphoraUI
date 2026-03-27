import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const baseURL = import.meta.env.VITE_BASE_URL;

const Setting = () => {
  const {
    data: siteSetting,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getSiteSetting"],
    queryFn: async () => {
      const token = localStorage.getItem("uToken");
      const { data } = await axios.get(`${baseURL}/api/getSiteSetting`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });

  const generalLinks = [
    { label: "Profile Setting", path: "/user/profile" },
    { label: "Password Change", path: "/user/password" },
    { label: "KYC Verify", path: "/kyc/submit-form" },
  ];

  const supportLinks = [
    { label: "WhatsApp Support", url: siteSetting?.whatsappLink, external: true },
    { label: "Telegram", url: siteSetting?.telegramLink, external: true },
    { label: "Email", url: siteSetting?.emailLink, external: true },
    { label: "Privacy Portal", path: "#" },
    { label: "About Us", path: "#" },
  ];

  const renderLinkItem = (item, index) => {
    const isExternal = item.external && item.url;
    return isExternal ? (
      <a
        key={index}
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex justify-between items-center px-4 py-3 border-b border-gray-600 text-white bg-[#1f222a] rounded-md mb-2 cursor-pointer hover:bg-[#2a2e39] transition"
      >
        <span className="text-sm">{item.label}</span>
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </a>
    ) : (
      <Link
        key={index}
        to={item.path}
        className="flex justify-between items-center px-4 py-3 border-b border-gray-600 text-white bg-[#1f222a] rounded-md mb-2 cursor-pointer hover:bg-[#2a2e39] transition"
      >
        <span className="text-sm">{item.label}</span>
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </Link>
    );
  };

  return (
    <div className="pt-20 px-4 pb-10 text-white min-h-screen bg-[#0f1115]">
      {/* General */}
      <div className="mb-6">
        <h2 className="text-gray-400 text-sm mb-2">General</h2>
        {generalLinks.map((item, index) => renderLinkItem(item, index))}
      </div>

      {/* Help & Support */}
      <div>
        <h2 className="text-gray-400 text-sm mb-2">Help & Support</h2>
        {supportLinks.map((item, index) => renderLinkItem(item, index))}
      </div>
    </div>
  );
};

export default Setting;

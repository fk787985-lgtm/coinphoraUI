import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  BarChart2,
  TrendingUp,
  ClipboardList,
  Wallet
} from "lucide-react";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = ["Home", "Markets", "Trade", "Orders", "Wallet"];
  const icons = {
    Home: Home,
    Markets: BarChart2,
    Trade: TrendingUp,
    Orders: ClipboardList,
    Wallet: Wallet
  };

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes("/markets")) return "Markets";
    if (path.includes("/trade")) return "Trade";
    if (path.includes("/orders")) return "Orders";
    if (path.includes("/wallet")) return "Wallet";
    return "Home";
  };

  const activeTab = getActiveTab();

  const handleTabChange = (tab) => {
    navigate(tab === "Home" ? "/" : `/${tab.toLowerCase()}`);
  };

  return (
    <nav className="fixed bottom-0 w-full bg-gradient-to-t from-[#0c0f12] to-[#141a22] border-t border-gray-800 flex justify-around py-2 z-50">
      {tabs.map((tab) => {
        const Icon = icons[tab];
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`flex flex-col items-center ${
              isActive
                ? "text-yellow-400"
                : "text-gray-500 hover:text-gray-300"
            } transition-colors duration-200`}
          >
            <Icon
              size={24}
              strokeWidth={isActive ? 2.5 : 1.5}
              className={isActive ? "drop-shadow-[0_0_6px_rgba(252,213,53,0.7)]" : ""}
            />
            <span className="text-[10px] mt-0.5 font-medium">{tab}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;

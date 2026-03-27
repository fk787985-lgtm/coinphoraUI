import React from "react";

const MarketTabs = ({ activeMarketTab, setActiveMarketTab }) => {
  const tabs = ["All Coins", "Gainers", "Losers"];

  return (
    <div className="flex space-x-4 border-b border-gray-700 mb-3 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`pb-1 font-semibold whitespace-nowrap text-sm ${
            activeMarketTab === tab
              ? "text-yellow-400 border-b-2 border-yellow-400"
              : "text-gray-400"
          }`}
          onClick={() => setActiveMarketTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default MarketTabs;

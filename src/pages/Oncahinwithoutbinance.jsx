import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TradingInterface from "./(Authenticated)/Onchain/TradinInterface";
import BottomNav from "./(Authenticated)/Onchain/BottomNav";
import Navbar from "./(Authenticated)/Onchain/Navbar";
import Wallet from "./(Authenticated)/Onchain/Wallet";
import Orders from "./(Authenticated)/Onchain/Orders";
import CoinItem from "./(Authenticated)/Onchain/CoinItem";
import MarketTabs from "./(Authenticated)/Onchain/MarketTabs";
import TopStories from "./(Authenticated)/Onchain/TopStories";
import MarketSection from "./(Authenticated)/Onchain/MarketSection";
import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

const useCoinData = () => {
  const {
    data: apiData,
    isLoading: isCoinListLoading,
  } = useQuery({
    queryKey: ["getCoinList"],
    queryFn: async () => {
      const { data } = await axios.get(`${baseURL}/api/getCoinList`);
      return data;
    },
  });

  return useQuery({
    queryKey: ["coinData", apiData],
    enabled: !!apiData,
    queryFn: async () => {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${apiData}`
      );
      const data = await res.json();

      return data.map((coin) => ({
        name: coin.symbol.toUpperCase(),
        pair: "USDT",
        fullName: coin.name,
        price: parseFloat(coin.current_price).toFixed(4),
        marketPrice: parseFloat(coin.high_24h).toFixed(4),
        change: coin.price_change_percentage_24h,
      }));
    },
    refetchInterval: 30000,
  });
};

const MainContent = ({ activeTab, setActiveTab, selectedSymbol, setSelectedSymbol }) => {
  const [activeMarketTab, setActiveMarketTab] = useState("All Coins");
  const { data: coinData = [], isLoading } = useCoinData();

  const filteredCoins = () => {
    if (activeMarketTab === "Gainers") return coinData.filter((coin) => coin.change > 0);
    if (activeMarketTab === "Losers") return coinData.filter((coin) => coin.change < 0);
    return coinData;
  };

  return (
    <main className="pt-16 h-[calc(100vh-60px)] overflow-y-auto">
      {activeTab === "Home" && (
        <>
          {/* Sticky Balance and Deposit */}
          <div className="mb-4 flex justify-between items-center px-4 sticky top-0 bg-[#0d111c] z-10 pb-2">
            <div>
              <h2 className="text-2xl font-bold">475680.80 USDT</h2>
              <p className="text-gray-400 text-sm">≈ 475680.80$</p>
            </div>
            <button className="bg-yellow-400 text-black px-6 py-1 rounded mt-2 font-semibold">
              Deposit
            </button>
          </div>

          {/* Market Tabs and Coin List */}
          <div className="px-4">
            <MarketTabs
              activeMarketTab={activeMarketTab}
              setActiveMarketTab={setActiveMarketTab}
            />

            <div className="flex justify-between items-center py-2 border-b border-gray-700 mb-2">
              <div className="w-1/3 text-sm text-gray-400">Name</div>
              <div className="w-1/3 text-right text-sm text-gray-400">Last Price</div>
              <div className="w-1/3 text-right text-sm text-gray-400">24h Change</div>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <p className="text-gray-400">Loading...</p>
              ) : (
                filteredCoins()
                  .slice(0, 6)
                  .map((coin, index) => (
                    <CoinItem
                      key={index}
                      {...coin}
                      onCoinClick={(symbol) => {
                        setSelectedSymbol(symbol);
                        setActiveTab("Trade");
                      }}
                    />
                  ))
              )}
            </div>
          </div>

          {/* Top Stories */}
          <div className="w-full px-0 mt-6">
            <TopStories />
          </div>
        </>
      )}

      {activeTab === "Markets" && (
        <MarketSection
          activeMarketTab={activeMarketTab}
          setActiveMarketTab={setActiveMarketTab}
          filteredCoins={filteredCoins}
          isLoading={isLoading}
          selectedSymbol={selectedSymbol}
        />
      )}

      {activeTab === "Trade" && <TradingInterface symbol={selectedSymbol} />}
      {activeTab === "Orders" && <Orders />}
      {activeTab === "Wallet" && <Wallet />}
    </main>
  );
};

const Onchain = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");

  return (
    <div className="bg-[#0d111c] text-white min-h-screen font-sans relative">
      <Navbar />
      <MainContent
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedSymbol={selectedSymbol}
        setSelectedSymbol={setSelectedSymbol}
      />
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default Onchain;

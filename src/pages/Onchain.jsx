import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate, Link } from "react-router-dom";
import MarketTabs from "./(Authenticated)/Onchain/MarketTabs";
import CoinItem from "./(Authenticated)/Onchain/CoinItem";
import TopStories from "./(Authenticated)/Onchain/TopStories";
import MarketSection from "./(Authenticated)/Onchain/MarketSection";
import TradingInterface from "./(Authenticated)/Onchain/TradinInterface";
import BottomNav from "./(Authenticated)/Onchain/BottomNav";
import Navbar from "./(Authenticated)/Onchain/Navbar";
import Wallet from "./(Authenticated)/Onchain/Wallet";
import Orders from "./(Authenticated)/Onchain/Orders";
import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

// const useCoinData = () => {
//   const { data: apiData } = useQuery({
//     queryKey: ["getCoinList"],
//     queryFn: async () => {
//       const { data } = await axios.get(`${baseURL}/api/getCoinList`);
//       return data;
//     },
//   });

//   // return useQuery({
//   //   queryKey: ["coinData", apiData],
//   //   enabled: !!apiData,
//   //   queryFn: async () => {
//   //     const res = await fetch(
//   //       `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${apiData}`
//   //     );
//   //     const data = await res.json();
//   //     return data.map((coin) => ({
//   //       name: coin.symbol.toUpperCase(),
//   //       pair: "USDT",
//   //       fullName: coin.name,
//   //       price: parseFloat(coin.current_price).toFixed(4),
//   //       marketPrice: parseFloat(coin.high_24h).toFixed(4),
//   //       change: coin.price_change_percentage_24h,
//   //     }));
//   //   },
//   //   refetchInterval: 30000,
//   // });

//   //
//   // return useQuery({
//   //   queryKey: ["coinData", apiData],
//   //   enabled: !!apiData,
//   //   refetchInterval: 1000, // Refresh every 30 seconds
//   //   queryFn: async () => {
//   //     const symbols = apiData.map((coin) => `${coin.toUpperCase()}USDT`);
//   //     // console.log("Symbols to fetch:", symbols);

//   //     const { data } = await axios.get(
//   //       `https://api.binance.com/api/v3/ticker/24hr`
//   //     );

//   //     const filtered = data.filter((item) => symbols.includes(item.symbol));

//   //     // console.log("Filtered coins from Binance:", filtered);

//   //     return filtered.map((coin) => ({
//   //       name: coin.symbol.replace("USDT", ""),
//   //       pair: "USDT",
//   //       fullName: coin.symbol, // Binance doesn't have full name here
//   //       price: parseFloat(coin.lastPrice).toFixed(4),
//   //       marketPrice: parseFloat(coin.highPrice).toFixed(4),
//   //       change: parseFloat(coin.priceChangePercent),
//   //     }));
//   //   },
//   // });

//  return useQuery({
//   queryKey: ["coinData", apiData],
//   enabled: !!apiData,
//   refetchInterval: 1000, // Refresh every second
//   queryFn: async () => {
//     const symbols = apiData?.map((coin) => `${coin.toUpperCase()}USDT`);

//     try {
//       // Primary: Binance (may not work in the US)
//       const { data } = await axios.get(
//         `https://api.binance.com/api/v3/ticker/24hr`
//       );
//       const filtered = data?.filter((item) => symbols?.includes(item?.symbol));

//       return filtered?.map((coin) => ({
//         name: coin?.symbol?.replace("USDT", "") || "",
//         pair: "USDT",
//         fullName: coin?.symbol || "",
//         price: parseFloat(coin?.lastPrice || 0)?.toFixed(4),
//         marketPrice: parseFloat(coin?.highPrice || 0)?.toFixed(4),
//         change: parseFloat(coin?.priceChangePercent || 0),
//       })) ?? [];
//     } catch (err) {
//       console.warn(
//         "Binance API failed, switching to CoinGecko fallback:",
//         err.message
//       );

//       try {
//         const ids = apiData?.map((coin) => coin.toLowerCase()).join(",");
//         const { data: geckoData } = await axios.get(
//           `https://api.coingecko.com/api/v3/simple/price`,
//           {
//             params: {
//               ids,
//               vs_currencies: "usd",
//               include_24hr_change: true,
//               include_24hr_high: true,
//             },
//           }
//         );

//         return Object.entries(geckoData || {})?.map(([key, value]) => ({
//           name: key?.toUpperCase() || "",
//           pair: "USDT",
//           fullName: `${key?.toUpperCase() || ""}USDT`,
//           price: parseFloat(value?.usd || 0)?.toFixed(4),
//           marketPrice: parseFloat(value?.usd_24h_high || 0)?.toFixed(4),
//           change: parseFloat(value?.usd_24h_change || 0)
//         })) ?? [];
//       } catch (fallbackError) {
//         console.error("CoinGecko fallback also failed:", fallbackError.message);
//         throw new Error("Unable to fetch coin data from Binance or CoinGecko.");
//       }
//     }
//   },
// });

// };

const useCoinData = () => {
  const [isUSUser, setIsUSUser] = useState(false);

  // 1. Region detection
  useEffect(() => {
    const detectRegion = async () => {
      try {
        const res = await axios.get("https://ipapi.co/json/");
        setIsUSUser(res.data?.country === "US");
      } catch (err) {
        console.warn("Failed to detect region, defaulting to non-US.");
        setIsUSUser(false); // fallback
      }
    };

    detectRegion();
  }, []);

  const binanceBaseURL = isUSUser
    ? "https://api.binance.us"
    : "https://api.binance.com";

  // 2. Get coin list
  const { data: apiData } = useQuery({
    queryKey: ["getCoinList"],
    queryFn: async () => {
      const { data } = await axios.get(`${baseURL}/api/getCoinList`);
      return data;
    },
  });

  // 3. Get price data
  return useQuery({
    queryKey: ["coinData", apiData, isUSUser],
    enabled: !!apiData?.length,
    refetchInterval: 1000,

    queryFn: async () => {
      const upperSymbols = apiData.map((coin) => coin?.toUpperCase());
      const symbols = upperSymbols.map((coin) => `${coin}USDT`);

      try {
        const { data } = await axios.get(
          `${binanceBaseURL}/api/v3/ticker/24hr`
        );
        const filtered = data.filter((item) => symbols.includes(item.symbol));

        return filtered.map((coin) => ({
          name: coin.symbol.replace("USDT", ""),
          pair: "USDT",
          fullName: coin.symbol,
          price: parseFloat(coin.lastPrice),
          marketPrice: parseFloat(coin.highPrice),
          change: parseFloat(coin.priceChangePercent),
        }));
      } catch (error) {
        console.warn("Binance API failed. Falling back to CoinGecko.");

        // Fetch CoinGecko coin list
        const { data: coinList } = await axios.get(
          "https://api.coingecko.com/api/v3/coins/list"
        );

        const symbolToId = {};
        coinList.forEach((coin) => {
          const symbol = coin.symbol.toUpperCase();
          if (!symbolToId[symbol]) {
            symbolToId[symbol] = coin.id;
          }
        });

        const matchedIds = upperSymbols
          .map((symbol) => symbolToId[symbol])
          .filter(Boolean);

        if (!matchedIds.length) return [];

        const idsParam = matchedIds.join(",");

        const { data: prices } = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price`,
          {
            params: {
              ids: idsParam,
              vs_currencies: "usd",
              include_24hr_change: true,
              include_24hr_high: true,
            },
          }
        );

        return upperSymbols
          .map((symbol) => {
            const id = symbolToId[symbol];
            const coin = prices[id];
            if (!coin) return null;

            return {
              name: symbol,
              pair: "USDT",
              fullName: `${symbol}USDT`,
              price: parseFloat(coin.usd) || 0,
              marketPrice: parseFloat(coin.usd_24h_high || coin.usd) || 0,
              change: parseFloat(coin.usd_24h_change) || 0,
            };
          })
          .filter(Boolean);
      }
    },
  });
};
const formatCurrency = (value) => {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const MainContent = ({ selectedSymbol, setSelectedSymbol }) => {
  const [activeMarketTab, setActiveMarketTab] = useState("All Coins");
  const [activeTab, setActiveTab] = useState("Home");
  const { data: coinData = [], isLoading, isError, error } = useCoinData();
  const location = useLocation();
  const navigate = useNavigate();

  const filteredCoins = () => {
    if (activeMarketTab === "Gainers")
      return coinData.filter((coin) => coin.change > 0);
    if (activeMarketTab === "Losers")
      return coinData.filter((coin) => coin.change < 0);
    return coinData;
  };

  const { data: userData } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const token = localStorage.getItem("uToken");
      const { data } = await axios.get(`${baseURL}/api/getUserById`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });

  useEffect(() => {
    if (location.pathname.includes("/")) setActiveTab("Home");
    else if (location.pathname.includes("markets")) setActiveTab("Markets");
    else if (location.pathname.includes("trade")) setActiveTab("Trade");
    else if (location.pathname.includes("orders")) setActiveTab("Orders");
    else if (location.pathname.includes("wallet")) setActiveTab("Wallet");
  }, [location]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    navigate(`/${tabName.toLowerCase()}`);
  };

  return (
    <main className="pt-14 h-[calc(100vh-60px)] bg-[#0d111c] flex flex-col">
      {/* Balance Card */}
      <div className="mb-6 sticky top-14 z-20 bg-[#161b26] rounded-lg shadow-lg px-6 py-4 flex justify-between items-center border border-[#2f3640]">
        <div>
          <div className="text-[#c6cace] font-semibold tracking-wide mb-1">
            Total Balance
          </div>
          <h2 className="text-lg font-mono font-bold text-yellow-400 drop-shadow-[0_0_8px_rgba(252,213,53,0.8)]">
            {formatCurrency(userData?.balance)} USDT
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            ≈ {formatCurrency(userData?.balance)}
          </p>
        </div>
        <Link
          to="/deposit"
          className="bg-yellow-400 hover:bg-yellow-500 transition px-6 py-1 rounded-md font-semibold text-black shadow-md shadow-yellow-400/40"
        >
          Deposit
        </Link>
      </div>

      {/* Scrollable content below */}
      <div className="flex-1 overflow-y-auto px-4">
        {activeTab === "Home" && (
          <>
            <MarketTabs
              activeMarketTab={activeMarketTab}
              setActiveMarketTab={setActiveMarketTab}
              onTabChange={handleTabChange}
            />
            <div className="flex justify-between items-center py-1 border-b border-gray-700">
              <div className="w-1/3 text-sm text-gray-400 font-semibold">
                Name
              </div>
              <div className="w-1/3 text-right text-sm text-gray-400 font-semibold">
                Last Price
              </div>
              <div className="w-1/3 text-right text-sm text-gray-400 font-semibold">
                24h Change
              </div>
            </div>

            <div className="space-y-5 min-h-[420px] flex flex-col justify-center">
              {isLoading ? (
                <p className="text-gray-400">Loading...</p>
              ) : isError ? (
                <p className="text-red-400">Error: {error.message}</p>
              ) : filteredCoins().length === 0 ? (
                <div className="text-center text-gray-400 text-sm py-6">
                  No {activeMarketTab.toLowerCase()} coins at the moment 🚀
                </div>
              ) : (
                filteredCoins()
                  .slice(0, 6)
                  .map((coin, index) => (
                    <CoinItem
                      key={index}
                      {...coin}
                      onCoinClick={(symbol) => {
                        setSelectedSymbol(symbol);
                        navigate("/trade", { state: { symbol } });
                      }}
                    />
                  ))
              )}
            </div>
            {/* Trending Coins Section */}
            <div className="w-full mt-2">
              <h3 className="text-lg font-semibold text-white mb-4 px-1">
                🔥 Trending Coins
              </h3>
              <div className="space-y-3">
                {filteredCoins()
                  .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
                  .slice(0, 3)
                  .map((coin, index) => (
                    <div
                      key={index}
                      className="bg-[#1a1f2e] rounded-lg p-4 flex justify-between items-center shadow-md hover:bg-[#232a3b] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-xl font-mono text-yellow-400">
                          #{index + 1}
                        </div>
                        <div>
                          <div className="text-white font-semibold">
                            {coin.name}/USDT
                          </div>
                          <div className="text-sm text-gray-400">
                            {coin.fullName}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-yellow-400 font-mono font-bold">
                          ${coin.price}
                        </div>
                        <div
                          className={`text-sm ${
                            coin.change >= 0 ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {coin.change.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="w-full mt-10">
              <TopStories />
            </div>
            {/* Featured Projects Section */}
            <div className="w-full mt-10">
              <h3 className="text-lg font-semibold text-white mb-4 px-1">
                🎯 Featured Projects
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  {
                    name: "Chainlink",
                    symbol: "LINK",
                    desc: "A decentralized oracle network powering smart contracts.",
                    logo: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
                  },
                  {
                    name: "Arbitrum",
                    symbol: "ARB",
                    desc: "A fast Layer-2 scaling solution for Ethereum.",
                    logo: "https://assets.coingecko.com/coins/images/16547/large/photo_2023-03-29_21.47.00.jpeg",
                  },
                  {
                    name: "Render",
                    symbol: "RNDR",
                    desc: "GPU-based rendering on the blockchain for artists.",
                    logo: "https://assets.coingecko.com/coins/images/11636/large/rndr.png",
                  },
                ].map((project, i) => (
                  <div
                    key={i}
                    className="bg-[#1a1f2e] hover:bg-[#232a3b] p-4 rounded-xl transition-all shadow-md"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <img
                        src={project.logo}
                        alt={project.name}
                        className="w-10 h-10 rounded-full bg-white p-1 shadow-sm object-contain"
                      />
                      <div>
                        <div className="text-white font-semibold">
                          {project.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          {project.symbol}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300">{project.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "Markets" && <MarketSection />}
        {activeTab === "Trade" && <TradingInterface symbol={selectedSymbol} />}
        {activeTab === "Orders" && <Orders />}
        {activeTab === "Wallet" && <Wallet />}
      </div>
    </main>
  );
};
const Onchain = () => {
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
  const [activeTab, setActiveTab] = useState("Home"); // Add the activeTab state

  return (
    <div className="bg-[#0d111c] text-white min-h-screen font-sans relative">
      <Navbar />
      <MainContent
        selectedSymbol={selectedSymbol}
        setSelectedSymbol={setSelectedSymbol}
        activeTab={activeTab}
        setActiveTab={setActiveTab} // Pass setActiveTab here
      />
      <BottomNav
        selectedSymbol={selectedSymbol}
        setSelectedSymbol={setSelectedSymbol}
        setActiveTab={setActiveTab} // Pass setActiveTab to BottomNav
      />
    </div>
  );
};
export default Onchain;
// Note: Ensure you have the necessary permissions and HTTPS setup for camera access.
// This component handles the main onchain trading interface, including market data, trading, and user wallet management.
// It uses React Query for data fetching and state management, and integrates with a backend API for user data and coin information.

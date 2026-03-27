import React, { useState, useEffect } from "react";
import CoinItem from "./CoinItem";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseURL = import.meta.env.VITE_BASE_URL;

// const useCoinData = () => {
//   const { data: apiData } = useQuery({
//     queryKey: ["getCoinList"],
//     queryFn: async () => {
//       const { data } = await axios.get(`${baseURL}/api/getCoinList`);
//       return data;
//     },
//   });

//   return useQuery({
//     queryKey: ["coinData", apiData],
//     enabled: !!apiData?.length,
//     queryFn: async () => {
//       const symbols = apiData.map((coin) => `${coin.toUpperCase()}USDT`);
//       const { data } = await axios.get(
//         "https://api.binance.com/api/v3/ticker/24hr"
//       );

//       const filtered = data.filter((item) => symbols.includes(item.symbol));

//       return filtered.map((coin) => ({
//         name: coin.symbol.replace("USDT", ""),
//         pair: "USDT",
//         fullName: coin.symbol,
//         price: parseFloat(coin.lastPrice).toFixed(4),
//         marketPrice: parseFloat(coin.highPrice).toFixed(4),
//         change: parseFloat(coin.priceChangePercent),
//       }));
//     },
//   });
// };


// 
// const useCoinData = () => {
//   const { data: apiData } = useQuery({
//     queryKey: ["getCoinList"],
//     queryFn: async () => {
//       const { data } = await axios.get(`${baseURL}/api/getCoinList`);
//       return data;
//     },
//   });

//   return useQuery({
//   queryKey: ["coinData", apiData],
//   enabled: !!apiData?.length,
//   refetchInterval: 1000, // Refresh every second

//   queryFn: async () => {
//     const symbols = apiData.map((coin) => `${coin?.toUpperCase()}USDT`);
//     const upperSymbols = apiData.map((coin) => coin?.toUpperCase());

//     try {
//       // Primary: Binance API
//       const { data } = await axios.get("https://api.binance.com/api/v3/ticker/24hr");
//       const filtered = data.filter((item) => symbols.includes(item.symbol));

//       return filtered.map((coin) => ({
//         name: coin.symbol.replace("USDT", ""),
//         pair: "USDT",
//         fullName: coin.symbol,
//         price: parseFloat(coin.lastPrice),
//         marketPrice: parseFloat(coin.highPrice),
//         change: parseFloat(coin.priceChangePercent),
//       }));
//     } catch (error) {
//       console.warn("Binance API failed. Falling back to CoinGecko.");

//       // 1. Fetch CoinGecko coin list
//       const { data: coinList } = await axios.get("https://api.coingecko.com/api/v3/coins/list");

//       // 2. Match apiData symbols to CoinGecko IDs
//       const symbolToId = {};
//       coinList.forEach((coin) => {
//         const symbol = coin.symbol.toUpperCase();
//         if (!symbolToId[symbol]) {
//           symbolToId[symbol] = coin.id; // Use first match
//         }
//       });

//       // 3. Prepare CoinGecko IDs
//       const matchedIds = upperSymbols
//         .map((symbol) => symbolToId[symbol])
//         .filter(Boolean);

//       if (!matchedIds.length) return [];

//       const idsParam = matchedIds.join(",");

//       // 4. Fetch prices from CoinGecko
//       const { data: prices } = await axios.get(
//         `https://api.coingecko.com/api/v3/simple/price`,
//         {
//           params: {
//             ids: idsParam,
//             vs_currencies: "usd",
//             include_24hr_change: true,
//             include_24hr_high: true,
//           },
//         }
//       );

//       // 5. Build response
//       return upperSymbols
//         .map((symbol) => {
//           const id = symbolToId[symbol];
//           const coin = prices[id];
//           if (!coin) return null;

//           const price = parseFloat(coin.usd) || 0;
//           const high = parseFloat(coin.usd_24h_high) || price;
//           const change = parseFloat(coin.usd_24h_change) || 0;

//           return {
//             name: symbol,
//             pair: "USDT",
//             fullName: `${symbol}USDT`,
//             price,
//             marketPrice: high,
//             change,
//           };
//         })
//         .filter(Boolean); // remove nulls
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
        const { data } = await axios.get(`${binanceBaseURL}/api/v3/ticker/24hr`);
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




const MarketSection = () => {
  const [activeMarketTab, setActiveMarketTab] = useState("All Coins");
  const [showAllHot, setShowAllHot] = useState(false);
  const navigate = useNavigate();

  const { data: coinData = [], isLoading, isError, error } = useCoinData();

  const filteredCoins = () => {
    if (activeMarketTab === "Gainers")
      return coinData.filter((coin) => coin.change > 0);
    if (activeMarketTab === "Losers")
      return coinData.filter((coin) => coin.change < 0);
    return coinData;
  };

  const hotCoins = [...coinData]
    .sort((a, b) => b.change - a.change)
    .slice(0, 5);
  const allHotCoins = [...coinData]
    .sort((a, b) => b.change - a.change)
    .slice(0, 20);

  return (
    <div className="px-4 pt-16 h-screen flex flex-col bg-[#0d111c] text-white">
      {/* Market Tabs */}
      <div className="flex space-x-2 mb-4 mt-2">
        {["All Coins", "Gainers", "Losers"].map((tab) => {
          const isActive = activeMarketTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveMarketTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                isActive
                  ? "bg-yellow-400 text-black shadow-md"
                  : "bg-[#1e2329] text-gray-400 hover:bg-[#2a2f36]"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Hot Coins */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-semibold text-yellow-400 tracking-wide">
            🔥 Hot Coins
          </h2>
          <button
            onClick={() => setShowAllHot(true)}
            className="text-xs text-gray-400 hover:text-white"
          >
            See all →
          </button>
        </div>

        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          {hotCoins.map((coin) => (
            <div
              key={coin.name}
              className="min-w-[110px] bg-[#1a1f2e]/70 border border-gray-700 rounded-xl px-3 py-2 backdrop-blur-sm cursor-pointer snap-start hover:scale-105 transition-transform"
              onClick={() =>
                navigate("/trade", { state: { symbol: `${coin.name}USDT` } })
              }
            >
              <div className="text-sm font-bold">{coin.name}/USDT</div>
              <div className="text-xs text-gray-400">${coin.price}</div>
              <div
                className={`text-xs mt-1 font-medium ${
                  coin.change >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {coin.change.toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center py-2 border-b border-gray-700 mb-2 text-sm text-gray-400 font-medium">
        <div className="w-1/3">Name</div>
        <div className="w-1/3 text-right">Last Price</div>
        <div className="w-1/3 text-right">24h</div>
      </div>

      {/* Coin List */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-4 scrollbar-hide">
        {isLoading ? (
          <p className="text-gray-400 text-center mt-6">
            Fetching market data...
          </p>
        ) : isError ? (
          <p className="text-red-400 text-center mt-6">
            Error: {error.message}
          </p>
        ) : filteredCoins().length === 0 ? (
          <p className="text-gray-500 text-center mt-6">
            No coins match this category.
          </p>
        ) : (
          filteredCoins().map((coin) => (
            <CoinItem
              key={coin.name}
              {...coin}
              onCoinClick={(symbol) =>
                navigate("/trade", { state: { symbol } })
              }
            />
          ))
        )}
      </div>

      {/* Modal for All Hot Coins */}
      {showAllHot && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-[#1a1f2e] rounded-xl p-6 w-11/12 max-h-[80vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-yellow-400 font-semibold text-lg">
                Top 20 Hot Coins
              </h2>
              <button
                onClick={() => setShowAllHot(false)}
                className="text-gray-400 hover:text-white text-sm"
              >
                ✕ Close
              </button>
            </div>

            {allHotCoins.map((coin) => (
              <div
                key={coin.name}
                className="flex justify-between items-center bg-[#232a3b] p-4 rounded-lg cursor-pointer hover:bg-[#2c3446] transition-shadow shadow-sm hover:shadow-lg"
                onClick={() => {
                  navigate("/trade", { state: { symbol: `${coin.name}USDT` } });
                  setShowAllHot(false);
                }}
              >
                <div className="flex flex-col">
                  <div className="font-semibold text-lg text-yellow-400">
                    {coin.name}/USDT
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    ${coin.price}
                  </div>
                </div>
                <div
                  className={`text-lg font-semibold ${
                    coin.change >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {coin.change.toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketSection;

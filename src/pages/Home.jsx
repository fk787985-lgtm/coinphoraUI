import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { CryptoCurrencyMarket } from "react-ts-tradingview-widgets";

const Home = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [hotDerivs, setHotDerivs] = useState([]);
  const [hotCoins, setHotCoins] = useState([]);
  const [topGainers, setTopGainers] = useState([]);
  const [topListings, setTopListings] = useState([]);

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const res = await fetch("https://api.binance.com/api/v3/ticker/24hr");
  //       const data = await res.json();

  //       const usdtPairs = data.filter((d) => d.symbol.endsWith("USDT"));
  //       const derivs = usdtPairs.filter((d) => d.symbol.endsWith("PERP"));
  //       const sorted = usdtPairs.sort(
  //         (a, b) =>
  //           Math.abs(b.priceChangePercent) - Math.abs(a.priceChangePercent)
  //       );

  //       setHotDerivs(derivs.slice(0, 10));
  //       setHotCoins(usdtPairs.slice(0, 10));
  //       setTopGainers(sorted.slice(0, 10));
  //       setTopListings(sorted.slice(-10).reverse());
  //     } catch (err) {
  //       console.error("Failed to load Binance data", err);
  //     }
  //   }
  //   fetchData();
  // }, []);
useEffect(() => {
  async function fetchData() {
    try {
      // Try Binance first
      const res = await fetch("https://api.binance.com/api/v3/ticker/24hr");
      const data = await res.json();

      const usdtPairs = data.filter((d) => d.symbol.endsWith("USDT"));
      const derivs = usdtPairs.filter((d) => d.symbol.endsWith("PERP"));
      const sorted = usdtPairs.sort(
        (a, b) =>
          Math.abs(b.priceChangePercent) - Math.abs(a.priceChangePercent)
      );

      setHotDerivs(derivs.slice(0, 10));
      setHotCoins(usdtPairs.slice(0, 10));
      setTopGainers(sorted.slice(0, 10));
      setTopListings(sorted.slice(-10).reverse());
    } catch (err) {
      console.error("Failed to load Binance data, falling back to CoinGecko", err);

      try {
        // CoinGecko fallback API
        const cgRes = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
        );
        const cgData = await cgRes.json();

        // Map CoinGecko data to Binance-like shape
        const mappedData = cgData.map((coin) => ({
          symbol: (coin.symbol || "").toUpperCase() + "USDT",
          priceChangePercent: coin.price_change_percentage_24h || 0,
          lastPrice: coin.current_price || 0,
          highPrice: coin.high_24h || 0,
        }));

        const usdtPairs = mappedData;
        const derivs = []; // CoinGecko does not provide PERP derivatives
        const sorted = usdtPairs.sort(
          (a, b) =>
            Math.abs(b.priceChangePercent) - Math.abs(a.priceChangePercent)
        );

        setHotDerivs(derivs.slice(0, 10));
        setHotCoins(usdtPairs.slice(0, 10));
        setTopGainers(sorted.slice(0, 10));
        setTopListings(sorted.slice(-10).reverse());
      } catch (cgErr) {
        console.error("Failed to load CoinGecko fallback data", cgErr);
      }
    }
  }
  fetchData();
}, []);

  const renderRows = (items) =>
    items.map((item) => (
      <tr
        key={item.symbol}
        className="border-b border-gray-700 hover:bg-[#1e2534] transition"
      >
        <td className="p-3 font-medium whitespace-nowrap">{item.symbol}</td>
        <td className="p-3 text-right">
          ${parseFloat(item.lastPrice).toFixed(4)}
        </td>
        <td
          className={`p-3 text-right font-semibold ${
            parseFloat(item.priceChangePercent) > 0
              ? "text-green-400"
              : "text-red-500"
          }`}
        >
          {parseFloat(item.priceChangePercent).toFixed(2)}%
        </td>
      </tr>
    ));

  const DataTable = ({ title, items }) => (
    <div className="bg-[#121822] p-4 rounded-xl shadow-lg">
      <h4 className="text-lg font-semibold text-white mb-3">{title}</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-gray-400 border-b border-gray-600">
            <tr>
              <th className="text-left p-2">Pair</th>
              <th className="text-right p-2">Price</th>
              <th className="text-right p-2">24 h Change</th>
            </tr>
          </thead>
          <tbody className="text-white">{renderRows(items)}</tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-[#0d111c] to-[#161b26] text-white font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full bg-[#161b26]/80 backdrop-blur-md z-50 flex justify-between items-center px-6 md:px-12 py-4">
        <div className="flex items-center space-x-3">
          <img
            src="/vite.png"
            alt="XCrypto"
            className="w-9 h-9 rounded-2xl"
          />
          <h1 className="text-yellow-400 text-2xl font-bold">coinphora</h1>
        </div>
        <nav className="hidden md:flex gap-6 items-center">
          <button onClick={() => navigate("/signin")} className="hover:text-yellow-300">
            Sign In
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-yellow-400 hover:bg-yellow-500 px-6 py-2 rounded text-black font-semibold"
          >
            Sign Up
          </button>
        </nav>
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? (
            <X size={28} className="text-yellow-400" />
          ) : (
            <Menu size={28} className="text-yellow-400" />
          )}
        </button>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <nav className="fixed top-16 w-full bg-[#161b26] z-40 flex flex-col items-center py-6 space-y-4 shadow-md">
          <button
            onClick={() => {
              navigate("/signin");
              setMobileOpen(false);
            }}
            className="text-yellow-400 hover:text-yellow-300"
          >
            Sign In
          </button>
          <button
            onClick={() => {
              navigate("/signup");
              setMobileOpen(false);
            }}
            className="bg-yellow-400 hover:bg-yellow-500 px-10 py-2 rounded text-black font-semibold"
          >
            Sign Up
          </button>
        </nav>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-24 px-6 md:px-12 pb-16">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <motion.div
            className="md:w-1/2 text-center md:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-yellow-400 text-sm uppercase mb-2">
              Secure Crypto Exchange
            </h2>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
              Take Control of Your Crypto Future
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              Fast, secure, low-cost — everything you need to trade confidently.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <button
                onClick={() => navigate("/signup")}
                className="bg-yellow-400 hover:bg-yellow-500 px-8 py-3 rounded font-bold text-black shadow-lg"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate("/signin")}
                className="border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-8 py-3 rounded font-semibold"
              >
                Sign In
              </button>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
          >
            <img
              src="https://www.bybit.com/common-static/fhs/bybit-home-new/spotlight/guidedDownload-719a743bafab69372545119a49d84970.png"
              alt="Crypto trading dashboard"
              className="w-full rounded-xl shadow-xl"
            />
          </motion.div>
        </section>

        {/* Data Sections */}
        <section className="mt-20 max-w-7xl mx-auto space-y-12">
          <h3 className="text-yellow-400 text-2xl font-bold text-center">
            Catch Your Next Trading Opportunity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
            <DataTable title="🔥 Hot Coins" items={hotCoins} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <DataTable title="🚀 Top Gainers" items={topGainers} />
            <DataTable title="🔍 Top Listings" items={topListings} />
          </div>

          {/* TradingView Widget */}
          <div className="mt-8 h-80">
            <CryptoCurrencyMarket
              colorTheme="dark"
              autosize
              defaultColumn="performance"
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-24 text-center text-gray-400 text-sm">
          <img
            src="/vite.png"
            alt="XCrypto logo"
            className="w-10 h-10 mx-auto mb-4"
          />
          <p className="mb-3">
            © {new Date().getFullYear()} Coinphora. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 mb-4">
            <a href="#" className="hover:text-yellow-300">
              Terms
            </a>
            <a href="#" className="hover:text-yellow-300">
              Privacy
            </a>
            <a href="#" className="hover:text-yellow-300">
              Contact
            </a>
          </div>
          <p className="text-xs text-gray-500">
            Made for crypto traders who demand speed & security
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Home;

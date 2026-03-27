import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TradingViewWidget from "./TradingViewWidget";
import { ChevronDown, Plus, Minus, X, Timer } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useUpdateCreateTrade } from "../../../hooks/userUpdateUserState";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const baseURL = import.meta.env.VITE_BASE_URL;

export default function TradingInterface() {
  const location = useLocation();
  const symbolFromState = location.state?.symbol || "BTCUSDT";
  const [coinPrice, setCoinPrice] = useState(null);

  useEffect(() => {
    if (!symbolFromState) return;

    const fetchPrice = async () => {
      try {
        const response = await axios.get(
          `https://api.binance.com/api/v3/ticker/price?symbol=${symbolFromState}`
        );
        setCoinPrice(parseFloat(response.data.price));
      } catch {
        // silently fail or handle if needed
      }
    };

    fetchPrice();
  }, [symbolFromState]);
  const updateMutation = useUpdateCreateTrade();
  const [amount, setAmount] = useState(0);
  const [timeOption, setTimeOption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [activeTrade, setActiveTrade] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [duration, setDuration] = useState(0); // for progress calculation
  const [tradeStartTime, setTradeStartTime] = useState("");

  const { data: siteSetting } = useQuery({
    queryKey: ["getSiteSetting"],
    queryFn: async () => {
      const token = localStorage.getItem("uToken");
      const { data } = await axios.get(`${baseURL}/api/getSiteSetting`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });

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

  const effectiveSymbol = symbolFromState?.trim() || "BTCUSDT";

  const handleTimeSelect = (e) => {
    setTimeOption(e.target.value);
  };

  useEffect(() => {
    if (!activeTrade || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, activeTrade]);

  useEffect(() => {
    if (timeLeft === 0 && activeTrade) {
      setTimeout(() => {
        setActiveTrade(null);
      }, 500); // fade-out buffer
    }
  }, [timeLeft, activeTrade]);

  const handleTrade = (type) => {
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    if (!timeOption) {
      toast.error("Please select a time option.");
      return;
    }

    if (parseFloat(userData?.balance) < parseFloat(amount)) {
      toast.error("You don't have enough funds to make the trade.");
      return;
    }

    if (!userData.isTradeAllowed) {
      toast.error("Trading is not allowed for your account.");
      return;
    }

    const selectedSetting = siteSetting?.[timeOption]?.[type];
    if (!selectedSetting) {
      toast.error("Invalid trade configuration.");
      return;
    }

    const valuesToSend = {
      coinType: effectiveSymbol,
      tradeType: type,
      tradeAmount: amount,
      selectedTime: timeOption,
      tradeResult: selectedSetting.tradeResult,
      resultPercent: selectedSetting.resultPercent,
    };

    setIsSubmitting(true);

    updateMutation
      .mutateAsync(valuesToSend)
      .then(() => {
        toast.success("Trade opened!");
        setAmount(0);
        setTimeOption("");

        const durationMap = {
          trade30Second: 30,
          trade60Second: 60,
          trade3Min: 180,
          trade5min: 300,
        };

        const seconds = durationMap[timeOption] || 60;
        setDuration(seconds);
        setTimeLeft(seconds);
        setTradeStartTime(new Date().toLocaleString());
        setActiveTrade(valuesToSend);
      })
      .catch(() => {
        toast.error("Trade submission failed.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="relative flex flex-col h-screen bg-[#0f0f0f] text-white overflow-hidden">
      {/* Chart Area */}
      <div className="flex-1 overflow-y-auto pt-14">
        <TradingViewWidget symbol={`${effectiveSymbol.toUpperCase()}`} />
      </div>

      {/* Control Panel Fixed at Bottom */}
      <div className="bg-[#1e1e2d] p-4 shadow-lg sticky bottom-0 z-10 pb-28">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <select
              className="bg-[#2c2c3a] p-2 py-3 rounded text-white w-full"
              value={timeOption}
              onChange={handleTimeSelect}
              disabled={!userData?.isTradeAllowed}
            >
              <option value="">Choose time</option>
              <option value="trade30Second">30 Seconds</option>
              <option value="trade60Second">1 Minute</option>
              <option value="trade3Min">3 Minutes</option>
              <option value="trade5min">5 Minutes</option>
            </select>

            <div className="flex items-center bg-[#2c2c3a] rounded w-full overflow-hidden">
              <button
                onClick={() => setAmount((prev) => Math.max(0, prev - 1))}
                className="px-3 py-2 text-white hover:bg-[#3a3a4d]"
                disabled={!userData?.isTradeAllowed || isSubmitting}
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-transparent text-center text-white outline-none"
                disabled={!userData?.isTradeAllowed || isSubmitting}
              />
              <button
                onClick={() => setAmount((prev) => prev + 1)}
                className="px-3 py-2 text-white hover:bg-[#3a3a4d]"
                disabled={!userData?.isTradeAllowed || isSubmitting}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Buy / Sell Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleTrade("sell")}
              className="bg-red-600 hover:bg-red-700 w-full py-2 rounded text-sm font-semibold"
              disabled={
                !userData?.isTradeAllowed || amount <= 0 || isSubmitting
              }
            >
              SELL
              <br />
              <span className="text-xs font-normal">BY MARKET</span>
            </button>
            <button
              type="button"
              onClick={() => handleTrade("buy")}
              className="bg-green-600 hover:bg-green-700 w-full py-2 rounded text-sm font-semibold"
              disabled={
                !userData?.isTradeAllowed || amount <= 0 || isSubmitting
              }
            >
              BUY
              <br />
              <span className="text-xs font-normal">BY MARKET</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay UI for Active Trade */}
      {activeTrade && timeLeft > 0 && (
        <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-start justify-center pt-44 z-50">
          <div className="bg-gradient-to-br from-[#1e1e2d] to-[#12121a] p-5 py-7 rounded-xl text-white text-center shadow-2xl max-w-sm w-full m-6 border border-gray-700 relative overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-extrabold tracking-wider text-teal-400">
                {activeTrade.coinType} Contract
              </h2>
              <X
                className="text-red-500 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setActiveTrade(null)}
              />
            </div>

            {/* Trade Meta */}
            <div className="flex justify-between items-center mb-3 text-sm font-mono text-gray-400">
              <p>{new Date().toLocaleString()}</p>
              <p className="flex items-center gap-1 text-blue-400 font-semibold">
                <Timer size={16} /> {timeLeft}s Running
              </p>
            </div>

            {/* Progress Timer */}
            <div className="w-16 h-16 mx-auto mb-5 mt-1 drop-shadow-[0_0_10px_#10b98180]">
              <CircularProgressbarWithChildren
                value={((duration - timeLeft) / duration) * 100}
                styles={buildStyles({
                  pathColor: "#10b981",
                  trailColor: "#2c2c3a",
                })}
              >
                <div className="text-xl font-bold text-white font-mono">
                  {timeLeft}s
                </div>
              </CircularProgressbarWithChildren>
            </div>

            {/* Amount & Type */}
            <div className="flex justify-between items-center mb-3 px-1">
              <p className="text-lg font-semibold text-green-400 font-mono">
                {activeTrade.tradeAmount}{" "}
                <span className="text-sm text-gray-300">USDT</span>
              </p>
              <p className="flex items-center gap-2">
                {activeTrade.tradeType === "buy" ? (
                  <span className="bg-green-600 text-white px-2 py-1 text-xs rounded shadow">
                    Buy
                  </span>
                ) : (
                  <span className="bg-red-600 text-white px-2 py-1 text-xs rounded shadow">
                    Sell
                  </span>
                )}
              </p>
            </div>

            {/* Open/Close */}
            <div className="flex justify-between text-xs text-gray-400 font-mono px-1">
              <p>
                Open: <span className="text-gray-200">{coinPrice}</span>
              </p>
              <p>
                Close: <span className="text-gray-400 font-mono">_ _ _</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

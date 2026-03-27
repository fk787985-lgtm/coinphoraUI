import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const baseURL = import.meta.env.VITE_BASE_URL;

const getCountdownSeconds = (selectedTime) => {
  switch (selectedTime) {
    case "trade30Second":
      return 30;
    case "trade60Second":
      return 60;
    case "trade3Min":
      return 180;
    case "trade5Min":
      return 300;
    default:
      return 0;
  }
};

const Orders = () => {
  const [activeTab, setActiveTab] = useState("All Orders");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;
  const tabs = ["Pending", "Completed", "All Orders"];

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: userData, refetch } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const token = localStorage.getItem("uToken");
      const { data } = await axios.get(`${baseURL}/api/getUserById`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });

  const [timers, setTimers] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) => {
        const updatedTimers = { ...prevTimers };
        Object.keys(updatedTimers).forEach((id) => {
          if (updatedTimers[id] > 0) {
            updatedTimers[id] -= 1;
          } else {
            delete updatedTimers[id];
            refetch();
            queryClient.invalidateQueries(["userData"]);
            queryClient.invalidateQueries(["userOrders"]);
          }
        });
        return updatedTimers;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timers, refetch, queryClient]);

  useEffect(() => {
    if (!userData?.tradeLog) return;
    const now = Date.now();
    const updatedTimers = {};
    userData.tradeLog.forEach((trade) => {
      if (trade.tradeStatus === "Pending") {
        const createdAt = new Date(trade.createdAt).getTime();
        const duration = getCountdownSeconds(trade.selectedTime) * 1000;
        const remaining = Math.floor((createdAt + duration - now) / 1000);
        if (remaining > 0) {
          updatedTimers[trade._id] = remaining;
        }
      }
    });
    setTimers(updatedTimers);
  }, [userData]);

  const filteredOrders =
    userData?.tradeLog?.filter((order) =>
      activeTab === "All Orders" ? true : order.tradeStatus === activeTab
    ) || [];

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsRemaining = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secondsRemaining).padStart(2, "0")}`;
  };

  return (
    <div className="bg-[#121821] text-white h-screen flex flex-col pt-16 font-sans">
      {/* Tabs */}
      <div className="flex justify-center mb-4 space-x-4 border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 text-sm font-semibold transition-all rounded-t-md ${
              activeTab === tab
                ? "border-b-4 border-yellow-400 text-yellow-400"
                : "border-b-4 border-transparent text-gray-500 hover:text-yellow-400 hover:border-yellow-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Scrollable Orders */}
      <div className="flex-grow overflow-y-auto px-2 custom-scroll pb-32">
        {currentOrders.length === 0 ? (
          <div className="text-center text-gray-400 py-12 italic">
            No orders available in this tab.
          </div>
        ) : (
          currentOrders.map((order) => {
            const isWin = order?.tradeResult?.toLowerCase() === "win";
            const isBuy = order?.tradeType?.toLowerCase() === "buy";
            const remainingTime = timers[order._id];

            return (
              <div
                key={order._id}
                onClick={() =>
                  navigate(`/order/${order._id}`, {
                    state: order,
                  })
                }
                className="mb-5 rounded-md cursor-pointer border border-gray-700 shadow-md hover:shadow-yellow-400/50 transition-shadow duration-300 p-4 px-2 flex flex-col bg-gradient-to-br from-[#161d2a] to-[#0d121a]"
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-md font-semibold tracking-wide text-gray-300">
                      <span className="uppercase text-white">
                        {order.coinType.slice(0, 3)}
                      </span>{" "}
                      <span className="uppercase text-gray-400 text-xs font-normal">
                        /{order.coinType.slice(3)}
                      </span>
                    </div>

                    <div
                      className={`text-xs font-semibold mt-1 ${
                        isBuy ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      Market {order.tradeType?.toUpperCase()}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(order.createdAt)?.toLocaleString()}
                  </div>
                </div>

                {/* Details */}
                <div className="flex justify-between mt-4">
                  <div className="space-y-2">
                    <p className="text-xs text-gray-400 flex items-center space-x-1">
                      <DollarSign className="w-3 h-3 text-yellow-400" />
                      <span>Amount (USDT)</span>
                    </p>
                    <p className="text-xs text-gray-400 flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3 text-yellow-400" />
                      <span>Price</span>
                    </p>
                    {order.tradeStatus !== "Pending" && (
                      <p className="text-xs text-gray-400 flex items-center space-x-1">
                        <TrendingDown className="w-3 h-3 text-yellow-400" />
                        <span>Profit & Loss (PNL)</span>
                      </p>
                    )}
                  </div>
                  <div className="text-end space-y-2">
                    <p className="text-sm font-semibold text-gray-200">
                      {order.tradeAmount !== undefined &&
                        new Intl.NumberFormat("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(order.tradeAmount)}
                    </p>
                    <p className="text-sm font-semibold text-gray-200">
                      {order.coinPrice !== undefined &&
                        new Intl.NumberFormat("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(order.coinPrice)}
                    </p>
                    {order.tradeStatus === "Pending" && remainingTime ? (
                      <div className="text-yellow-400 text-xl font-mono font-bold animate-pulse flex items-center space-x-2 justify-end">
                        <Clock className="w-5 h-5" />
                        <span>{formatTime(remainingTime)}</span>
                      </div>
                    ) : order.tradeStatus !== "Pending" ? (
                      <div
                        className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-md space-x-2 ${
                          isWin
                            ? "bg-green-700 text-white shadow-[0_0_10px_#10b981]"
                            : "bg-red-600 text-white shadow-[0_0_10px_#ef4444]"
                        }`}
                      >
                        {isWin ? (
                          <>
                            <TrendingUp className="w-4 h-4" />
                            <span>Gain ≈</span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-4 h-4" />
                            <span>Loss ≈</span>
                          </>
                        )}
                        <span>
                          {/* {order.tradeAfterAmount} */}
                          {order.tradeAfterAmount !== undefined &&
                            new Intl.NumberFormat("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(order.tradeAfterAmount)}{" "}
                          {order.coinType?.includes("USDT") ? "USDT" : "BTC"}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-4 py-4 mb-12 fixed w-full bottom-0 bg-[#121821] z-20">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-2 rounded-full text-sm bg-gray-800 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all flex items-center space-x-1"
            disabled={currentPage === 1}
          >
            <ChevronLeft />
          </button>
          <span className="text-sm text-yellow-400 font-semibold">{`< Page ${currentPage} / ${totalPages} >`}</span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-3 py-2 rounded-full text-sm bg-gray-800 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all flex items-center space-x-1"
            disabled={currentPage === totalPages}
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;

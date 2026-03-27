import React from "react";
import { useLocation } from "react-router-dom";
import {
  Clock,
  Tag,
  Hash,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from "lucide-react";

const moneyFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const OrderDetail = () => {
  const location = useLocation();
  const order = location.state;

  if (!order) {
    return <div className="text-white p-4">No order data found.</div>;
  }

  const {
    _id,
    coinType,
    tradeType,
    tradeAmount,
    coinPrice,
    tradeAfterAmount,
    tradeResult,
    tradeStatus,
    createdAt,
    updatedAt,
    dateTrade,
    coinPriceClose,
  } = order;

  const isCompleted = tradeStatus === "Completed";
  const isBuy = tradeType.toLowerCase() === "buy";
  const isWin = tradeResult.toLowerCase() === "win";

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const datePart = date.toLocaleDateString();
    const timePart = date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return { date: datePart, time: timePart };
  };

  const created = formatDate(createdAt);
  const updated = formatDate(updatedAt);
  const traded = formatDate(createdAt);
  const priceChange = coinPrice * 0.02; // Example price change, adjust as needed

  let computedClosePrice = coinPrice;

  if (isBuy && isWin) {
    computedClosePrice = coinPrice + priceChange;
  } else if (isBuy && !isWin) {
    computedClosePrice = coinPrice - priceChange;
  } else if (!isBuy && isWin) {
    computedClosePrice = coinPrice - priceChange;
  } else if (!isBuy && !isWin) {
    computedClosePrice = coinPrice + priceChange;
  }

  return (
    <div className="min-h-screen overflow-y-auto overflow-x-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 px-3 pt-12 font-sans select-none flex justify-center">
      {/* Glassmorphic container */}
      <div className="w-full max-w-xl mx-auto bg-gray-900 bg-opacity-30 backdrop-blur-md rounded-xl shadow-lg p-3 border border-gray-700">
        {/* Top Status and Coin */}
        <div className="flex justify-between items-center mb-2">
          <span
            className={`text-base font-semibold px-3 py-1 rounded-md transition-colors duration-400 ${
              isCompleted
                ? "bg-gradient-to-r from-green-400 to-green-600 text-green-50 shadow-[0_0_8px_#22c55e]"
                : "bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-50 shadow-[0_0_8px_#eab308]"
            }`}
          >
            {isCompleted ? "FILLED 100%" : "PENDING"}
          </span>
          <span className="uppercase font-semibold text-xl tracking-wide drop-shadow-[0_0_6px_rgba(255,255,255,0.6)] select-text cursor-default">
            {coinType.slice(0, -4)}{" "}
            <span className="text-xs text-gray-400 font-light">
              /{coinType.slice(-4)}
            </span>
          </span>
        </div>

        {/* Order Overview */}
        <div className="space-y-3 border-b border-gray-700 pb-2">
          <Row
            label="Order No"
            icon={<Hash className="inline-block mr-2 w-4 h-4 text-gray-400" />}
          >
            {_id}
          </Row>
          <Row
            label="Type"
            icon={<Tag className="inline-block mr-2 w-4 h-4 text-gray-400" />}
            className={`font-semibold ${
              isBuy ? "text-green-400" : "text-red-400"
            }`}
          >
            Market / {tradeType.toUpperCase()}
          </Row>
          <Row
            label="Filled / Amount"
            icon={
              <DollarSign className="inline-block mr-2 w-4 h-4 text-gray-400" />
            }
          >
            {moneyFormatter.format(tradeAmount)} USDT
          </Row>
          <Row
            label="Avg. / Price"
            icon={
              <DollarSign className="inline-block mr-2 w-4 h-4 text-gray-400" />
            }
          >
            {moneyFormatter.format(coinPrice)} /{" "}
            {coinPrice
              ? moneyFormatter.format(coinPrice)
              : moneyFormatter.format(coinPriceClose)}
          </Row>
          <Row
            label="Create Time"
            icon={<Clock className="inline-block mr-2 w-4 h-4 text-gray-400" />}
            mono
            glow
          >
            {created.date}, {created.time}
          </Row>
          <Row
            label="Update Time"
            icon={<Clock className="inline-block mr-2 w-4 h-4 text-gray-400" />}
            mono
            glow
          >
            {updated.date}, {updated.time}
          </Row>
        </div>

        {/* Trade Details */}
        <div className="pt-2 space-y-2">
          <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2 mb-2 tracking-wide uppercase select-none">
            Trade Details
          </h3>
          <Row
            label="Date"
            icon={
              <Calendar className="inline-block mr-2 w-4 h-4 text-gray-400" />
            }
          >
            {traded.date}
          </Row>
          <Row
            label="Open Price"
            icon={
              <ArrowUpRight className="inline-block mr-2 w-4 h-4 text-gray-400" />
            }
          >
            {moneyFormatter?.format(coinPrice)}
          </Row>
          <Row
            label="Close Price"
            icon={
              <ArrowDownRight className="inline-block mr-2 w-4 h-4 text-gray-400" />
            }
          >
            {coinPrice
              ? moneyFormatter?.format(computedClosePrice)
              : moneyFormatter?.format(coinPriceClose)}
          </Row>

          <Row
            label="Amount"
            icon={
              <DollarSign className="inline-block mr-2 w-4 h-4 text-gray-400" />
            }
          >
            {moneyFormatter.format(tradeAmount)}
          </Row>
          {isCompleted && (
            <>
              <Row
                label="Result"
                icon={
                  isWin ? (
                    <ArrowUpRight className="inline-block mr-2 w-4 h-4 text-green-400" />
                  ) : (
                    <ArrowDownRight className="inline-block mr-2 w-4 h-4 text-red-400" />
                  )
                }
                className={`font-semibold tracking-wide ${
                  isWin
                    ? "text-green-400 bg-green-900 bg-opacity-30 rounded-md px-2 py-1 shadow-[0_0_12px_#22c55e]"
                    : "text-red-400 bg-red-900 bg-opacity-30 rounded-md px-2 py-1 shadow-[0_0_12px_#ef4444]"
                }`}
              >
                {tradeResult}
              </Row>

              <Row
                label="Profit / Loss"
                icon={
                  <DollarSign className="inline-block mr-2 w-4 h-4 text-gray-400" />
                }
                className={`font-semibold tracking-wide ${
                  isWin
                    ? "text-green-400 bg-green-900 bg-opacity-40 rounded-md px-3 py-1 shadow-[0_0_16px_#22c55e]"
                    : "text-red-400 bg-red-900 bg-opacity-40 rounded-md px-3 py-1 shadow-[0_0_16px_#ef4444]"
                }`}
              >
                {moneyFormatter.format(tradeAfterAmount)}
              </Row>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable Row component for label + icon + value
const Row = ({
  label,
  children,
  icon,
  className = "",
  mono = false,
  glow = false,
}) => (
  <div
    className={`flex justify-between items-center text-sm text-gray-300 ${className}`}
  >
    <span className="flex items-center space-x-1 select-none text-gray-400 font-semibold tracking-wide">
      {icon}
      <span>{label}</span>
    </span>
    <span
      className={`ml-2 ${mono ? "font-mono tracking-wider" : ""} ${
        glow ? "text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]" : ""
      } select-text`}
    >
      {children}
    </span>
  </div>
);

export default OrderDetail;

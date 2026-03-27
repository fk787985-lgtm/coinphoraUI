import React from 'react';

const CoinItem = ({ name, pair, fullName, price, marketPrice, change, onCoinClick }) => {
  return (
    <div
      className="flex justify-between items-start border-b border-gray-800 text-white text-sm pb-2 cursor-pointer"
      onClick={() => onCoinClick && onCoinClick(`${name}${pair}`)}
    >
      {/* Name Section */}
      <div className="w-1/3">
        <div className="flex items-center space-x-1">
          <p className="font-bold text-sm">{name}</p>
          <span className="text-yellow-400 text-xs">/{pair}</span>
        </div>
        <p className="text-gray-400 text-xs">{fullName}</p>
      </div>

      {/* Last Price */}
      <div className="w-1/3 text-right">
        <p className="text-base font-medium">{Number(price).toLocaleString()}</p>
        <p className="text-xs text-gray-400">{Number(marketPrice).toLocaleString()}$</p>
      </div>

      {/* 24h Change */}
      <div className="w-1/3 text-right">
        <span
          className={`text-xs font-semibold px-6 py-1 rounded-md inline-block ${
            change < 0 ? 'bg-red-500' : 'bg-green-500'
          } text-white`}
        >
          {change.toFixed(2)}%
        </span>
      </div>
    </div>
  );
};

export default CoinItem;

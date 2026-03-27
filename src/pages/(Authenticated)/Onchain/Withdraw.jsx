import React from 'react';
import { Download, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const baseURL = import.meta.env.VITE_BASE_URL;

const Withdraw = () => {
  const navigate = useNavigate();

  const {
    data: apiData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["withdrawMethods"],
    queryFn: async () => {
      const token = localStorage.getItem("uToken");
      const { data } = await axios.get(`${baseURL}/api/withdrawMethods`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });
//   console.log(apiData)
  const handleCardClick = (card) => {
    navigate(`/withdraw/checkout/${card._id}`, {
      state: {
        name: `${card.paymentAddressType.toUpperCase()}`,
        label: `Withdraw with  ${card.coinName}`,
        address: card.paymentAddress,
        minAmount: card.minAmount,
        maxAmount: card.maxAmount,
        conversionRate: card.conversionPrice,
        coinName: card.coinName,
        currencyUsdt: card.currencyUsdt,
        info: card.info,
        charge: card?.charge,
      },
    });
  };

  if (isLoading) return <div className="text-white p-4">Loading...</div>;
  if (isError) return <div className="text-red-500 p-4">Failed to load Withdraw methods.</div>;

  return (
    <div className="pt-20 p-4 bg-[#0d111c] text-white min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {apiData?.map((card) => (
          <div
            key={card._id}
            onClick={() => handleCardClick(card)}
            className="flex items-center bg-transparent p-3 rounded-md border-2 border-gray-500 hover:bg-[#1E2329] cursor-pointer"
          >
            <div className="rounded-full p-2">
              <Download className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex flex-col ml-3">
              <span className="font-semibold text-sm">
                {/* {card.currencyUsdt.toUpperCase()} */}
                 {card.coinName}
              </span>
              <span className="text-xs text-gray-400">
                Withdraw with currency: {" "} {card.paymentAddressType.toUpperCase()}
              </span>
            </div>
            <ArrowRight className="ml-auto w-5 h-5 text-white" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Withdraw;

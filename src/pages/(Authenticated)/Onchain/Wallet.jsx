import { Bell, Gift, Moon, Shuffle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
const baseURL = import.meta.env.VITE_BASE_URL;
import { toast } from "react-hot-toast";

const Wallet = () => {
  const [showBalance, setShowBalance] = useState(false);
  const toggleBalance = () => setShowBalance((prev) => !prev);

  const { data: apiData } = useQuery({
    queryKey: ["getCoins"],
    queryFn: async () => {
      const { data } = await axios.get(`${baseURL}/api/getCoins`);
      return data;
    },
  });

  const { data: userData } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const token = localStorage?.getItem("uToken");
      const { data } = await axios.get(`${baseURL}/api/getUserById`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    },
  });

  return (
    <div className="bg-[#121821] h-screen flex flex-col text-white text-sm font-sans">
      {/* Balance Header */}
      <Toaster position="top-center" reverseOrder={false} />
      <div className="p-5 pt-16">
        <div className="text-[#c6cace] text-md font-medium mb-1 tracking-wide">
          Total Balance
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xl font-mono font-bold text-yellow-400 drop-shadow-md min-w-[150px]">
            {showBalance ? (
              <>
                {userData &&
                  new Intl.NumberFormat("en-US", {
                    style: "decimal",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(userData.balance)}{" "}
                <span className="text-sm font-light text-white">USDT</span>
              </>
            ) : (
              <>
                ******{" "}
                <span className="text-sm font-light text-white">USDT</span>
              </>
            )}
          </div>
          <button
            onClick={toggleBalance}
            className="hover:scale-105 transition"
          >
            {showBalance ? (
              <EyeOff className="w-5 h-5 text-gray-400" />
            ) : (
              <Eye className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
        <div className="text-[#868E96] text-xs mt-1 font-mono">
          {showBalance
            ? `≈ ${new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(userData?.balance)}`
            : "≈ ******"}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center space-x-2 px-2">
        <Link to="/deposit">
          <button className="bg-[#FCD535] text-black py-2 px-6 rounded-md font-semibold text-sm hover:shadow-yellow-500/40 hover:scale-105 transition-all">
            Deposit
          </button>
        </Link>
        {/* <Link to="/withdraw">
          <button className="bg-[#1E2329] text-white py-2 px-6 rounded-md font-semibold text-sm hover:bg-[#2a2f36] hover:scale-105 transition-all">
            Withdraw
          </button>
        </Link> */}
        {userData?.isWithdrawalAllowed ? (
          <Link to="/withdraw">
            <button className="bg-[#1E2329] text-white py-2 px-6 rounded-md font-semibold text-sm hover:bg-[#2a2f36] hover:scale-105 transition-all">
              Withdraw
            </button>
          </Link>
        ) : (
          <button
            onClick={() =>
              toast.error(
                "Withdrawals are disabled for your account. Please contact support."
              )
            }
            className="bg-[#2a2f36] text-gray-500 py-2 px-6 rounded-md font-semibold text-sm cursor-not-allowed opacity-50 hover:scale-105 transition-all"
          >
            Withdraw
          </button>
        )}

        <Link to="/transfer">
          <button className="bg-[#1E2329] text-white py-2 px-6 rounded-md font-semibold text-sm hover:bg-[#2a2f36] hover:scale-105 transition-all">
            Transfer
          </button>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-evenly mt-4 mb-4 px-4">
        {[
          { icon: <Shuffle className="text-yellow-400" />, label: "AI Trade" },
          {
            icon: <Bell className="text-yellow-400" />,
            label: "Notice",
            link: "/app/notice",
          },
          { icon: <Gift className="text-yellow-400" />, label: "Check In" },
          { icon: <Moon className="text-yellow-400" />, label: "Apps" },
        ].map(({ icon, label, link }, idx) => {
          const content = (
            <div
              key={idx}
              className="flex flex-col items-center space-y-1 hover:scale-110 transition-all"
            >
              <div className="bg-[#1E2329] p-2 rounded-full shadow-inner shadow-yellow-400/10">
                {icon}
              </div>
              <span className="text-xs text-[#E0E0E0]">{label}</span>
            </div>
          );

          return link ? (
            <Link to={link} key={idx}>
              {content}
            </Link>
          ) : (
            <div key={idx}>{content}</div>
          );
        })}
      </div>

      {/* Coin Balances */}
      <div className="flex-1 overflow-y-auto px-3 pb-28">
        <div className="text-[#797f85] text-sm mb-1 pt-2 border-t border-[#343d47]">
          Balances
        </div>

        {apiData
          ?.slice()
          .reverse()
          .map((coin, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-4 border-b border-[#46515f] hover:bg-[#1a1f24] rounded-md px-2 transition-all duration-150"
            >
              <div className="flex items-center gap-3">
                <img
                  src={
                    coin.logo?.startsWith("http://")
                      ? coin.logo.replace("http://", "https://")
                      : coin.logo
                  }
                  alt={coin.coinName}
                  className="h-6 w-6 rounded-full shadow-sm"
                  onError={(e) => {
                    e.target.onerror = null;
                   
                  }}
                />
                <div>
                  <div className="font-semibold text-white">{coin.symbol}</div>
                  <div className="text-[#868E96] text-xs">{coin.coinName}</div>
                </div>
              </div>

              <div className="text-right font-mono">
                <div className="font-semibold text-yellow-400">
                  {showBalance
                    ? !isNaN(Number(coin.coinPrice)) &&
                      coin.coinPrice !== undefined
                      ? coin.coinPrice
                      : "0"
                    : "******"}
                </div>
                <div className="text-[#868E96] text-xs">
                  ≈{" "}
                  {showBalance
                    ? !isNaN(Number(coin.coinPrice)) &&
                      coin.coinPrice !== undefined
                      ? `${coin.coinPrice}$`
                      : "0"
                    : "******"}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Wallet;

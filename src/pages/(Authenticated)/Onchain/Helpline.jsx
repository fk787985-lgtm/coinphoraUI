import React, { useEffect } from "react";
import { openTawkChat } from "../../../components/TawkChatWidget";

const Helpline = () => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      openTawkChat();
    }, 300);

    return () => clearTimeout(timeout);
  }, []);


  return (
    <div className="h-screen bg-[#0d111c] text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-bold mb-2">Need Help?</h1>
      <p className="text-gray-400 mb-6 text-center">
        Our live support team is here to assist you. Start a chat using the floating button.
      </p>
      <button
        type="button"
        onClick={openTawkChat}
        className="px-4 py-2 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition"
      >
        Open Live Chat
      </button>
    </div>
  );
};

export default Helpline;

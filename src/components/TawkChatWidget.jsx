import React, { useEffect, useState } from "react";
import { MessageCircleMore } from "lucide-react";

const isTawkReady = () =>
  typeof window !== "undefined" &&
  window.Tawk_API &&
  typeof window.Tawk_API.maximize === "function";

export const openTawkChat = () => {
  if (!isTawkReady()) return false;
  window.Tawk_API.maximize();
  return true;
};

const TawkChatWidget = () => {
  const [ready, setReady] = useState(isTawkReady());

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const intervalId = setInterval(() => {
      if (isTawkReady()) {
        setReady(true);
        clearInterval(intervalId);
      }
    }, 400);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <button
      type="button"
      onClick={openTawkChat}
      disabled={!ready}
      aria-label="Open customer service chat"
      title="Customer service"
      className="fixed right-4 z-[60] rounded-full bg-[#facc15] text-[#0d111c] shadow-lg hover:bg-[#fde047] transition p-3 md:p-3.5 bottom-[max(5.25rem,env(safe-area-inset-bottom))] md:bottom-6 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      <MessageCircleMore className="w-6 h-6" />
      {!ready && <span className="sr-only">Loading live chat</span>}
    </button>
  );
};

export default TawkChatWidget;

import React, { useEffect, useState } from "react";
import { MessageCircleMore } from "lucide-react";

const TAWK_SCRIPT_ID = "tawk-chat-script";
const TAWK_SRC = "https://embed.tawk.to/69d61b3c0d1c3f1c379982e6/1jlm5kpkn";

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

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const existingScript = document.getElementById(TAWK_SCRIPT_ID);

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = TAWK_SCRIPT_ID;
      script.async = true;
      script.src = TAWK_SRC;
      script.charset = "UTF-8";
      script.setAttribute("crossorigin", "*");
      document.body.appendChild(script);
    }

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

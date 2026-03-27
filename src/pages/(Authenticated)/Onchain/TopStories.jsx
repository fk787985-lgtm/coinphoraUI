import React, { useEffect } from "react";

const TopStories = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      feedMode: "market",
      market: "crypto",
      colorTheme: "dark",
      isTransparent: false,
      displayMode: "regular",
      width: "100%",
      height: 400,
      locale: "en",
    });

    const container = document.getElementById("tradingview_top_stories");
    container.innerHTML = ""; // Clear previous widgets
    container.appendChild(script);
  }, []);

  return (
    <div className="mt-6 bg-[#1c1f2b] rounded-xl overflow-hidden shadow-lg">
      <div id="tradingview_top_stories" />
    </div>
  );
};

export default TopStories;

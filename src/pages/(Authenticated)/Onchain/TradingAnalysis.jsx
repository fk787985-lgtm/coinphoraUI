import React, { useEffect } from "react";

const TradingAnalysis = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      interval: "1h",
      width: "100%",
      isTransparent: false,
      height: "200",
      symbol: "BINANCE:BTCUSDT",  // Change the symbol dynamically if needed
      showIntervalTabs: true,
      locale: "en",
      colorTheme: "dark",
    });

    const container = document.getElementById("tradingview_technical_analysis");
    container.innerHTML = ""; // Clear previous widget
    container.appendChild(script);
  }, []);

  return (
    <div className="mt-6 bg-[#1c1f2b] rounded-xl overflow-hidden shadow-lg">
      <div id="tradingview_technical_analysis" />
    </div>
  );
};

export default TradingAnalysis;

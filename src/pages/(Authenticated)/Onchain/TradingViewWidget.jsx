import React, { useEffect, useRef } from "react";

export default function TradingViewWidget({ symbol }) {
  const container = useRef(null);

  useEffect(() => {
    if (!container.current) return;

    container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      new TradingView.widget({
        autosize: true,
        symbol: `BINANCE:${symbol}`,
        interval: "1",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#1e1e2d",
        enable_publishing: false,
        hide_top_toolbar: false,
        withdateranges: true,
        allow_symbol_change: true,
        container_id: "tv_chart_container",
      });
    };

    container.current.appendChild(script);
  }, [symbol]);

  return (
    <div
      id="tv_chart_container"
      ref={container}
      className="w-full h-[100%]"
    />
  );
}

import React, { useEffect } from "react";

const Helpline = () => {
useEffect(() => {
  let script;

  const addHubspotScript = () => {
    if (!document?.getElementById?.("hs-script-loader")) {
      script = document?.createElement?.("script");
      if (script) {
        script.src = "//js-na2.hs-scripts.com/243224366.js";
        script.async = true;
        script.defer = true;
        script.id = "hs-script-loader";

        script.onload = () => {
          // Safely load HubSpot widget
          window?.HubSpotConversations?.widget?.load?.();
        };

        document?.head?.appendChild?.(script);
      }
    }
  };

  addHubspotScript();

  return () => {
    // Remove iframe container safely
    const iframeContainer = document?.querySelector?.("#hubspot-messages-iframe-container");
    iframeContainer?.remove?.();

    // Remove script tag safely
    const existingScript = document?.getElementById?.("hs-script-loader");
    existingScript?.remove?.();

    // Safely destroy HubSpot widget if the method exists
    window?.HubSpotConversations?.widget?.destroy?.();
  };
}, []);


  return (
    <div className="h-screen bg-[#0d111c] text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-bold mb-2">Need Help?</h1>
      <p className="text-gray-400 mb-6 text-center">
        Our live support team is here to assist you. Start a chat using the button in the corner.
      </p>
      <div className="text-sm text-gray-500 italic">
        Live chat loading...
      </div>
    </div>
  );
};

export default Helpline;

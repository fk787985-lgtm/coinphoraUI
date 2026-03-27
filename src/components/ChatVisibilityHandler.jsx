import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ChatVisibilityHandler = () => {
  const location = useLocation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      // Chat popup window container
      const chatWindow = document.querySelector("#hubspot-messages-iframe-container");

      // Chat bubble button (icon)
      const chatButton = document.querySelector(".hubspot-messages-widget-button");

      if (chatWindow) {
        if (location.pathname === "/helpline") {
          chatWindow.style.display = "block"; // show popup
        } else {
          chatWindow.style.display = "none"; // hide popup
        }
      }

      if (chatButton) {
        if (location.pathname === "/helpline") {
          chatButton.style.display = "block"; // show bubble button
        } else {
          chatButton.style.display = "none"; // hide bubble button
        }
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [location]);

  return null;
};

export default ChatVisibilityHandler;

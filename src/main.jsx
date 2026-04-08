import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/route.jsx";
import "../src/index.css";
import "@fontsource/inter";
import "@fontsource/inter/400.css";
import "@fontsource/inter/index.css";
import "./i18n";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { AuthProvider } from "./context/AuthContext";
import TawkChatWidget from "./components/TawkChatWidget";

// ✅ Import ErrorBoundary
import ErrorBoundary from "./components/ErrorBoundary.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

ReactDOM.createRoot(document.getElementById("root"))?.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        {/* ✅ Wrap main app with ErrorBoundary */}
        <ErrorBoundary>
          <RouterProvider router={routes} />
          <TawkChatWidget />
        </ErrorBoundary>
      </I18nextProvider>

      {/* Optional DevTools */}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  </React.StrictMode>
);

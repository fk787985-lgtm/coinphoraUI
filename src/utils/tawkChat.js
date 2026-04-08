const isTawkReady = () =>
  typeof window !== "undefined" &&
  window.Tawk_API &&
  typeof window.Tawk_API.maximize === "function";

export const openTawkChat = () => {
  if (!isTawkReady()) return false;
  window.Tawk_API.maximize();
  return true;
};

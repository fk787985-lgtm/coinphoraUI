export const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD", // You can change currency as needed
    }).format(amount);
  };
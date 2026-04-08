import React from "react";

export const LoadingState = ({ text = "Loading..." }) => (
  <div className="flex min-h-[180px] items-center justify-center text-sm text-slate-400">{text}</div>
);

export const ErrorState = ({ text = "Failed to load data." }) => (
  <div className="flex min-h-[180px] items-center justify-center text-sm text-rose-300">{text}</div>
);

export const EmptyState = ({ text = "No records found." }) => (
  <div className="flex min-h-[120px] items-center justify-center text-sm text-slate-500">{text}</div>
);

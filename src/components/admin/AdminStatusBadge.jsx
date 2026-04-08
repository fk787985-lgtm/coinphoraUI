import React from "react";
import cn from "../../utils/cn";

const palette = {
  active: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/40",
  completed: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/40",
  pending: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/40",
  inactive: "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/40",
  rejected: "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/40",
  default: "bg-slate-500/15 text-slate-300 ring-1 ring-slate-400/40",
};

const AdminStatusBadge = ({ status = "" }) => {
  const normalized = String(status).toLowerCase();
  const classes = palette[normalized] || palette.default;
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", classes)}>
      {status || "Unknown"}
    </span>
  );
};

export default AdminStatusBadge;

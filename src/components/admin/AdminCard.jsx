import React from "react";
import cn from "../../utils/cn";

export const AdminCard = ({ children, className = "" }) => (
  <div className={cn("admin-card", className)}>{children}</div>
);

export const StatCard = ({ label, value, meta }) => (
  <AdminCard className="space-y-2">
    <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
    <p className="text-2xl font-semibold text-slate-100">{value}</p>
    {meta ? <p className="text-xs text-slate-500">{meta}</p> : null}
  </AdminCard>
);

export default AdminCard;

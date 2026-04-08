import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Gauge,
  Users2,
  KeyRound,
  CoinsIcon,
  BadgeIndianRupee,
  TriangleDashedIcon,
  Settings,
  ListChecks,
  WalletCards,
  X,
  LogOut,
} from "lucide-react";
import cn from "../../../utils/cn";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const navItems = [
  { to: "dashboard", label: "Dashboard", icon: Gauge },
  { to: "users", label: "Users", icon: Users2 },
  { to: "pendingKyc", label: "Pending KYC", icon: KeyRound },
  { to: "coins", label: "Manage Coins", icon: CoinsIcon },
  { to: "depositMethod", label: "Deposit Methods", icon: BadgeIndianRupee },
  { to: "withdrawMethod", label: "Withdraw Methods", icon: WalletCards },
  { to: "deposit/logs", label: "Deposit Logs", icon: ListChecks },
  { to: "withdraw/logs", label: "Withdraw Logs", icon: ListChecks },
  { to: "tradeResult", label: "Trade Result", icon: TriangleDashedIcon },
  { to: "transaction", label: "Transaction", icon: TriangleDashedIcon },
  { to: "settings", label: "Site Settings", icon: Settings },
  { to: "logs", label: "Logs", icon: ListChecks },
];

const AdminSidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();

  const userLogout = () => {
    localStorage.removeItem("token");
    localStorage.clear();
    navigate("/signin");
  };

  return (
    <>
      {isOpen ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[100] w-[260px] border-r border-slate-800 bg-slate-950 px-3 py-4 transition-transform lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-6 flex items-center justify-between px-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-300/80">Coinphora</p>
            <h2 className="text-lg font-semibold text-slate-100">Admin Panel</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-700 p-1 text-slate-300 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={`/admin/${to}`}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-slate-100",
                  isActive && "bg-indigo-600/20 text-indigo-300 ring-1 ring-indigo-500/40"
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="admin-btn admin-btn-danger mt-6 flex w-full items-center justify-center gap-2"
          onClick={userLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </aside>
    </>
  );
};

export default AdminSidebar;

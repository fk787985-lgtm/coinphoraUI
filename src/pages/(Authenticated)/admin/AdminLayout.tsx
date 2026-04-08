import React, { useMemo, useState } from "react";
import SuperSidebar from "./AdminSidebar";
import { Route, Routes } from "react-router-dom";
import Logs from "./Logs";
import Dashboard from "./Dashboard";

import Users from "./Users";
import PendingKyc from "./PendingKyc";
import ManageCoins from "./ManageCoins";
import DepositMethod from "./DepositMethod";
import DepositLog from "./DepositLog";
import WithdrawMethod from "./WithdrawMethod";
import WithdrawLog from "./WithdrawLog";
import SiteSetting from "./SiteSetting";
import TradeResults from "./TradeResult";
import Transaction from "./Transaction";
import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
// import Dashboard from "./Dashboard";
// import Users from "./Users";
// import Settings from "./Settings";
// import UserDetails from "./UserDetails";
// import AllUsers from "./Users/All";
// import ActiveUsers from "./Users/Active";
// import FreeUsers from "./Users/Free";
// import OverdueUsers from "./Users/Overdue";
// import DeactiveUsers from "./Users/Deactive";
// import CompanySettings from "./Settings/CompanySettings";
// import DashBoardSettings from "./Settings/DashboardSettings";
// import PriceSettings from "./Settings/PriceSettings";
// import Logs from "./Logs";
// import AllAdmins from "./Admins/All";
// import ActiveAdmins from "./Admins/Active";
// import DeactiveAdmins from "./Admins/Deactive";
// import Profile from "./Profile";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const pageTitle = useMemo(() => {
    const map = {
      dashboard: "Dashboard",
      users: "Users",
      pendingKyc: "Pending KYC",
      coins: "Manage Coins",
      depositMethod: "Deposit Methods",
      withdrawMethod: "Withdraw Methods",
      settings: "Site Settings",
      tradeResult: "Trade Result",
      transaction: "Transaction",
      logs: "Logs",
    };
    const key = location.pathname.split("/")[2] || "dashboard";
    return map[key] || "Admin";
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100">
      <SuperSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 py-3 backdrop-blur-sm md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-md border border-slate-700 p-2 text-slate-300 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Admin Workspace</p>
              <h1 className="text-lg font-semibold text-slate-100">{pageTitle}</h1>
            </div>
          </div>
          <p className="hidden text-sm text-slate-400 md:block">Operational dashboard</p>
        </header>
        <main className="flex-1 overflow-auto bg-slate-950/80">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="pendingKyc" element={<PendingKyc />} />
          <Route path="coins" element={<ManageCoins />} />
          <Route path="depositMethod" element={<DepositMethod />} />
          <Route path="deposit/logs" element={<DepositLog />} />
          <Route path="withdrawMethod" element={<WithdrawMethod />} />
          <Route path="withdraw/logs" element={<WithdrawLog />} />
          <Route path="settings" element={<SiteSetting />} />
          <Route path="tradeResult" element={<TradeResults />} />

          
          <Route path="transaction" element={<Transaction />} />
          <Route path="logs" element={<Logs />} />
          {/* <Route path="settings/website" element={<DashBoardSettings />} />
          <Route path="settings/company" element={<CompanySettings />} />
          <Route path="settings/price" element={<PriceSettings />} />
          <Route path="settings/profile" element={<Profile />} />


          <Route path="detail" element={<UserDetails />} />
          <Route path="users/all" element={<AllUsers />} />
          <Route path="users/active" element={<ActiveUsers />} />
          <Route path="users/free" element={<FreeUsers />} />
          <Route path="users/overdue" element={<OverdueUsers />} />
          <Route path="users/deactive" element={<DeactiveUsers />} />
          <Route path="admins/all" element={<AllAdmins />} />
          <Route path="admins/active" element={<ActiveAdmins />} />
          <Route path="admins/deactive" element={<DeactiveAdmins />} /> */}
        </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

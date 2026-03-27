import React from "react";
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
  return (
    <div className="flex h-screen   bg-white transition-all ">
      <SuperSidebar />

      <div className="flex-1 h-screen overflow-auto  bg-gray-50/70">
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



          <Route path="logs" element={<Logs />} />

        </Routes>
      </div>
    </div>
  );
};

export default AdminLayout;

import React from "react";
import AdminPage from "../../../components/admin/AdminPage";
import { AdminCard } from "../../../components/admin/AdminCard";

const Settings = () => {
  return (
    <AdminPage
      title="Settings"
      subtitle="This page now follows the admin design system and is prepared for future modules."
    >
      <AdminCard>
        <p className="text-sm text-slate-300">Settings components can be attached here when enabled.</p>
      </AdminCard>
    </AdminPage>
  );
};

export default Settings;
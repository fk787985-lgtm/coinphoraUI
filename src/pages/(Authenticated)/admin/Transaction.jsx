import React from "react";
import AdminPage from "../../../components/admin/AdminPage";
import { AdminCard } from "../../../components/admin/AdminCard";

const Transaction = () => {
  return (
    <AdminPage
      title="Transaction Center"
      subtitle="Advanced transaction analytics and controls will be available in this module."
    >
      <AdminCard>
        <p className="text-sm text-slate-300">
          This section has been redesigned as a dedicated shell and is ready for the transaction
          feed integration.
        </p>
      </AdminCard>
    </AdminPage>
  );
};

export default Transaction;

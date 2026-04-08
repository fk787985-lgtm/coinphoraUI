import React from "react";
import cn from "../../utils/cn";

const AdminTable = ({ children, className = "" }) => (
  <div className="admin-table-wrap">
    <table className={cn("admin-table", className)}>{children}</table>
  </div>
);

export default AdminTable;

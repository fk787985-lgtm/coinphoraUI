import React from "react";
import cn from "../../utils/cn";

const AdminPage = ({ title, subtitle, actions, children, className = "" }) => {
  return (
    <section className={cn("admin-page", className)}>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{title}</h1>
          {subtitle ? <p className="admin-page-subtitle">{subtitle}</p> : null}
        </div>
        {actions ? <div className="admin-page-actions">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
};

export default AdminPage;

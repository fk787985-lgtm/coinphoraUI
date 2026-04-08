import React from "react";
import cn from "../../utils/cn";

const AdminModal = ({ title, onClose, children, className = "" }) => {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#020617]/80 p-4 backdrop-blur-sm">
      <div className={cn("admin-modal", className)}>
        <div className="mb-4 flex items-start justify-between gap-4 border-b border-slate-700 pb-3">
          <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:bg-slate-800"
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export const ConfirmDialog = ({ title, description, onCancel, onConfirm, confirmText = "Confirm" }) => (
  <AdminModal title={title} onClose={onCancel} className="max-w-sm">
    <p className="text-sm text-slate-300">{description}</p>
    <div className="mt-5 flex justify-end gap-3">
      <button type="button" onClick={onCancel} className="admin-btn admin-btn-secondary">
        Cancel
      </button>
      <button type="button" onClick={onConfirm} className="admin-btn admin-btn-danger">
        {confirmText}
      </button>
    </div>
  </AdminModal>
);

export default AdminModal;

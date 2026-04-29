import React from "react";

export default function Modal({ children, onClose, className = "" }) {
  return (
    <div className={`modal-overlay ${className}`} onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

import React from "react";
import "./CustomModal.css";

const CustomModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close  text-black font-bold" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default CustomModal;

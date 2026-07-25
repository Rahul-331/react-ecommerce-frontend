import React, { useEffect, useContext } from "react";
import AppContext from "../Context/Context";

const ToastNotification = () => {
  const { toast, closeToast } = useContext(AppContext);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        closeToast();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toast, closeToast]);

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case "danger":
        return "bi-exclamation-triangle-fill";
      case "info":
        return "bi-info-circle-fill";
      case "success":
      default:
        return "bi-check-circle-fill";
    }
  };

  return (
    <div className={`toast-notification toast-${toast.type || "success"}`}>
      <div className="toast-content">
        <i className={`bi ${getIcon()} toast-icon`}></i>
        <span className="toast-message">{toast.message}</span>
        <button className="toast-close-btn" onClick={closeToast} aria-label="Close notification">
          <i className="bi bi-x-lg"></i>
        </button>
      </div>
      <div className="toast-progress-bar"></div>
    </div>
  );
};

export default ToastNotification;

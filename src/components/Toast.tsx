import { useEffect, useState } from "react";
import { useToast, TOAST_TYPES } from "../context/ToastContext";
import { Toast as ToastType } from "../types";

interface ToastProps {
  toast: ToastType;
}

function Toast({ toast }: ToastProps) {
  const { removeToast } = useToast();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLeaving, setIsLeaving] = useState<boolean>(false);

  // Animation effect - slide in when toast appears
  useEffect(() => {
    // Small delay to trigger the slide-in animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Handle toast removal with animation
  const handleRemove = () => {
    setIsLeaving(true);
    // Wait for animation to complete before removing
    setTimeout(() => {
      removeToast(toast.id);
    }, 300);
  };

  // Auto-remove animation before the toast is actually removed
  useEffect(() => {
    if (toast.duration > 0) {
      const timer = setTimeout(() => {
        setIsLeaving(true);
      }, toast.duration - 300); // Start animation 300ms before removal

      return () => clearTimeout(timer);
    }
  }, [toast.duration]);

  // Get styles based on toast type
  const getToastStyles = () => {
    const baseStyles = "border-l-4";

    switch (toast.type) {
      case TOAST_TYPES.SUCCESS:
        return `${baseStyles} bg-green-50 border-green-400 text-green-800`;
      case TOAST_TYPES.ERROR:
        return `${baseStyles} bg-red-50 border-red-400 text-red-800`;
      case TOAST_TYPES.WARNING:
        return `${baseStyles} bg-yellow-50 border-yellow-400 text-yellow-800`;
      case TOAST_TYPES.INFO:
      default:
        return `${baseStyles} bg-blue-50 border-blue-400 text-blue-800`;
    }
  };

  // Get icon based on toast type
  const getIcon = () => {
    switch (toast.type) {
      case TOAST_TYPES.SUCCESS:
        return "✅";
      case TOAST_TYPES.ERROR:
        return "❌";
      case TOAST_TYPES.WARNING:
        return "⚠️";
      case TOAST_TYPES.INFO:
      default:
        return "ℹ️";
    }
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${
          isVisible && !isLeaving
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        }
        max-w-sm w-full ${getToastStyles()} p-4 rounded-lg shadow-lg mb-4
        flex items-center justify-between
      `}
    >
      <div className="flex items-center">
        <span className="mr-3 text-lg">{getIcon()}</span>
        <p className="text-sm font-medium">{toast.message}</p>
      </div>

      <button
        onClick={handleRemove}
        className="ml-4 text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>
    </div>
  );
}

export default Toast;

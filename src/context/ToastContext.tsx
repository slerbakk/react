import { createContext, useContext, useState, ReactNode } from "react";
import { Toast, ToastType } from "../types";

// Toast context type
interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: number) => void;
  clearToasts: () => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Toast types
export const TOAST_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
  WARNING: "warning",
} as const;

interface ToastProviderProps {
  children: ReactNode;
}

/**
 * Provides toast notification system to all child components.
 * Supports success, error, info, and warning toast types with auto-dismiss.
 * @param {ToastProviderProps} props - Provider props containing children
 */

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Add a new toast
  const addToast = (
    message: string,
    type: ToastType = TOAST_TYPES.INFO,
    duration: number = 3000
  ) => {
    const id = Date.now() + Math.random(); // Simple unique ID
    const newToast = {
      id,
      message,
      type,
      duration,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  // Remove a specific toast
  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Remove all toasts
  const clearToasts = () => {
    setToasts([]);
  };

  /**
   * Displays a success toast notification.
   * @param {string} message - Success message to display
   */
  const showSuccess = (message: string, duration?: number) =>
    addToast(message, TOAST_TYPES.SUCCESS, duration);

  /**
   * Displays an error toast notification.
   * @param {string} message - Error message to display
   */

  const showError = (message: string, duration?: number) =>
    addToast(message, TOAST_TYPES.ERROR, duration);
  const showInfo = (message: string, duration?: number) =>
    addToast(message, TOAST_TYPES.INFO, duration);
  const showWarning = (message: string, duration?: number) =>
    addToast(message, TOAST_TYPES.WARNING, duration);

  const value = {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}

// Custom hook to use toast context
export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export default ToastContext;

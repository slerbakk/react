import { useToast } from "../context/ToastContext";
import Toast from "./Toast";

function ToastContainer() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed z-50 space-y-2 top-4 right-4">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

export default ToastContainer;

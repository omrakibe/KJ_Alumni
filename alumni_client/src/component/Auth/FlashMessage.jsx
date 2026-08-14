import {
  CheckCircle2,
  Info,
  AlertTriangle,
  XCircle,
  X,
} from "lucide-react";

function FlashMessage({
  type = "error",
  title,
  message,
  onClose,
}) {
  const icons = {
    success: <CheckCircle2 size={22} />,
    info: <Info size={22} />,
    warning: <AlertTriangle size={22} />,
    error: <XCircle size={22} />,
  };

  return (
    <div
      className={`flash-message flash-${type}`}
      role="alert"
    >
      <div className="flash-icon">
        {icons[type]}
      </div>

      <div className="flash-content">
        {title && <strong>{title}</strong>}

        <p>{message}</p>
      </div>

      {onClose && (
        <button
          type="button"
          className="flash-close"
          onClick={onClose}
          aria-label="Close message"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}

export default FlashMessage;
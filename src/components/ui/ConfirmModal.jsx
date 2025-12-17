export default function ConfirmModal({
  open,
  title = "Confirmación",
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  danger = false
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        
        <h2 className="text-xl font-bold mb-2 text-gray-800">
          {title}
        </h2>

        <p className="text-gray-600 mb-6">
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-white ${
              danger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  );
}

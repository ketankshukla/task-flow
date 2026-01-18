"use client";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  darkMode: boolean;
  taskTitle: string;
}

export function DeleteConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
  darkMode,
  taskTitle,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <div
        className={`${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        } rounded-2xl p-6 max-w-md w-full shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">⚠️</span>
          <h3 className="text-xl font-bold">Delete Task?</h3>
        </div>

        <p className={`mb-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          Are you sure you want to delete this task?
        </p>

        <div
          className={`p-3 rounded-lg mb-6 ${
            darkMode ? "bg-gray-700" : "bg-gray-100"
          }`}
        >
          <p className="font-medium truncate">{taskTitle}</p>
        </div>

        <p
          className={`text-sm mb-6 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          This action cannot be undone. All subtasks will also be deleted.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors
              ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }
            `}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}

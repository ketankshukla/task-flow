"use client";

interface IncompleteSubtasksModalProps {
  isOpen: boolean;
  todoTitle: string;
  incompleteCount: number;
  totalCount: number;
  onConfirm: () => void;
  onCancel: () => void;
  darkMode: boolean;
}

export function IncompleteSubtasksModal({
  isOpen,
  todoTitle,
  incompleteCount,
  totalCount,
  onConfirm,
  onCancel,
  darkMode,
}: IncompleteSubtasksModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        } rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200`}
      >
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Incomplete Subtasks</h2>
          <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            The task <span className="font-semibold">"{todoTitle}"</span> has{" "}
            <span className="font-bold text-orange-500">
              {incompleteCount} of {totalCount}
            </span>{" "}
            subtasks incomplete.
          </p>
        </div>

        <div
          className={`${
            darkMode ? "bg-gray-700/50" : "bg-gray-100"
          } rounded-xl p-4 mb-6`}
        >
          <p
            className={`text-sm ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            If you mark this task as complete, all incomplete subtasks will be
            automatically marked as complete.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-900"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 rounded-xl font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity"
          >
            Complete All
          </button>
        </div>
      </div>
    </div>
  );
}

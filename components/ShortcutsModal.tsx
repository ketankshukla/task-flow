"use client";

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

export function ShortcutsModal({
  isOpen,
  onClose,
  darkMode,
}: ShortcutsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className={`${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        } rounded-2xl p-6 max-w-md w-full shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">⌨️ Keyboard Shortcuts</h3>
          <button onClick={onClose} className="text-2xl hover:opacity-70">
            ×
          </button>
        </div>
        <div className="space-y-3">
          {[
            { key: "N", desc: "New task" },
            { key: "F", desc: "Focus search" },
            { key: "D", desc: "Toggle dark mode" },
            { key: "R", desc: "Reset all filters" },
            { key: "Esc", desc: "Close modal / Reset filters" },
            { key: "?", desc: "Show shortcuts" },
            { key: "1-4", desc: "Filter by status" },
          ].map((s) => (
            <div key={s.key} className="flex justify-between items-center">
              <span
                className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                {s.desc}
              </span>
              <kbd
                className={`px-3 py-1 rounded-lg font-mono text-sm ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
        <div
          className={`mt-4 pt-4 border-t ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <p
            className={`text-sm font-medium mb-2 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            In Add/Edit Dialog:
          </p>
          <div className="space-y-2">
            {[
              { key: "Alt+1-4", desc: "Set priority" },
              { key: "Alt+P/W/H/F/L/S", desc: "Set category" },
              { key: "Ctrl+Enter", desc: "Save task" },
            ].map((s) => (
              <div key={s.key} className="flex justify-between items-center">
                <span
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {s.desc}
                </span>
                <kbd
                  className={`px-2 py-0.5 rounded font-mono text-xs ${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

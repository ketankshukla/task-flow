"use client";

import { Todo } from "@/lib/types";
import { PRIORITIES, CATEGORIES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleSubtask: (todoId: string, subtaskId: string) => void;
  darkMode: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onOpenEdit: (todo: Todo) => void;
}

export function TodoItem({
  todo,
  onToggle,
  onDelete,
  onToggleSubtask,
  darkMode,
  isSelected,
  onSelect,
  onOpenEdit,
}: TodoItemProps) {
  const isOverdue =
    todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date();
  const isDueToday = todo.dueDate === new Date().toISOString().split("T")[0];
  const subtaskProgress =
    todo.subtasks.length > 0
      ? Math.round(
          (todo.subtasks.filter((s) => s.completed).length /
            todo.subtasks.length) *
            100
        )
      : null;

  return (
    <div
      className={`group rounded-xl border-2 transition-all duration-300 overflow-hidden
        ${
          todo.completed
            ? darkMode
              ? "bg-gray-800/30 border-gray-700"
              : "bg-gray-50 border-gray-200"
            : darkMode
            ? "bg-gray-800/50 border-gray-700 hover:border-purple-500"
            : "bg-white border-gray-200 hover:border-purple-400"
        }
        ${isSelected ? "ring-2 ring-purple-500" : ""}
        ${isOverdue ? "border-red-400" : ""}
      `}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <button
            onClick={() => onToggle(todo.id)}
            className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0
              ${
                todo.completed
                  ? "bg-gradient-to-r from-emerald-400 to-teal-500 border-transparent"
                  : darkMode
                  ? "border-gray-500 hover:border-purple-400"
                  : "border-gray-300 hover:border-purple-400"
              }`}
          >
            {todo.completed && <span className="text-white text-sm">✓</span>}
          </button>

          <div className="flex-1 min-w-0">
            <h3
              className={`font-medium transition-all
                ${todo.completed ? "line-through opacity-50" : ""}
              `}
            >
              {todo.title}
            </h3>

            <div className="flex flex-wrap gap-2 mt-2">
              <span
                className={`px-2 py-0.5 rounded-full text-xs border ${
                  PRIORITIES[todo.priority].color
                }`}
              >
                {PRIORITIES[todo.priority].emoji}{" "}
                {PRIORITIES[todo.priority].label}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs border ${
                  CATEGORIES[todo.category].color
                }`}
              >
                {CATEGORIES[todo.category].emoji}{" "}
                {CATEGORIES[todo.category].label}
              </span>
              {todo.dueDate && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs border
                  ${
                    isOverdue
                      ? "bg-red-100 text-red-700 border-red-300"
                      : isDueToday
                      ? "bg-blue-100 text-blue-700 border-blue-300"
                      : darkMode
                      ? "bg-gray-700 text-gray-300 border-gray-600"
                      : "bg-gray-100 text-gray-600 border-gray-300"
                  }
                `}
                >
                  📅{" "}
                  {isOverdue
                    ? "Overdue"
                    : isDueToday
                    ? "Today"
                    : formatDate(todo.dueDate)}
                </span>
              )}
              {subtaskProgress !== null && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs border ${
                    darkMode
                      ? "bg-gray-700 text-gray-300 border-gray-600"
                      : "bg-gray-100 text-gray-600 border-gray-300"
                  }`}
                >
                  📋 {subtaskProgress}%
                </span>
              )}
            </div>

            {todo.description && (
              <p
                className={`mt-2 text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {todo.description}
              </p>
            )}

            {todo.subtasks.length > 0 && (
              <div className="mt-3 pl-2 space-y-1 border-l-2 border-purple-300">
                {todo.subtasks.map((sub) => (
                  <div key={sub.id} className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        !todo.completed && onToggleSubtask(todo.id, sub.id)
                      }
                      disabled={todo.completed}
                      className={`w-4 h-4 rounded border flex items-center justify-center text-xs transition-all
                        ${
                          sub.completed
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : darkMode
                            ? "border-gray-500"
                            : "border-gray-300"
                        }
                        ${
                          todo.completed
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer hover:border-purple-400"
                        }
                      `}
                    >
                      {sub.completed && "✓"}
                    </button>
                    <span
                      className={`text-sm ${
                        sub.completed ? "line-through opacity-50" : ""
                      }`}
                    >
                      {sub.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onSelect(todo.id)}
              className={`p-2 rounded-lg ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
              title="Select"
            >
              {isSelected ? "☑️" : "☐"}
            </button>
            <button
              onClick={() => onOpenEdit(todo)}
              className={`p-2 rounded-lg ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
              title="Edit"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className={`p-2 rounded-lg hover:bg-red-100 text-red-500`}
              title="Delete"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

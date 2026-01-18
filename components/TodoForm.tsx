"use client";

import { useState, useEffect, useRef } from "react";
import { Todo, Priority, Category } from "@/lib/types";
import { PRIORITIES, CATEGORIES } from "@/lib/constants";

interface TodoFormProps {
  onAdd: (todo: Todo) => void;
  onEdit: (id: string, updates: Partial<Todo>) => void;
  onClose: () => void;
  darkMode: boolean;
  editingTodo: Todo | null;
}

export function TodoForm({
  onAdd,
  onEdit,
  onClose,
  darkMode,
  editingTodo,
}: TodoFormProps) {
  const [title, setTitle] = useState(editingTodo?.title || "");
  const [description, setDescription] = useState(
    editingTodo?.description || ""
  );
  const [priority, setPriority] = useState<Priority>(
    editingTodo?.priority || "medium"
  );
  const [category, setCategory] = useState<Category>(
    editingTodo?.category || "personal"
  );
  const [dueDate, setDueDate] = useState(editingTodo?.dueDate || "");
  const [subtasks, setSubtasks] = useState<string[]>(
    editingTodo?.subtasks?.map((s) => s.title) || []
  );
  const [newSubtask, setNewSubtask] = useState("");

  const titleRef = useRef<HTMLInputElement>(null);
  const subtaskRef = useRef<HTMLInputElement>(null);

  const priorityKeys = Object.keys(PRIORITIES) as Priority[];

  const handleSubmit = () => {
    if (!title.trim()) return;

    const todoData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate,
      subtasks: subtasks.map((s, i) => ({
        id: editingTodo?.subtasks?.[i]?.id || `s${Date.now()}-${i}`,
        title: s,
        completed: editingTodo?.subtasks?.[i]?.completed || false,
      })),
    };

    if (editingTodo) {
      onEdit(editingTodo.id, todoData);
    } else {
      onAdd({
        id: Date.now().toString(),
        ...todoData,
        completed: false,
        createdAt: new Date().toISOString(),
      });
    }

    onClose();
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, newSubtask.trim()]);
      setNewSubtask("");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key >= "1" && e.key <= "4") {
        e.preventDefault();
        setPriority(priorityKeys[parseInt(e.key) - 1]);
        return;
      }

      if (e.altKey) {
        const catMap: Record<string, Category> = {
          p: "personal",
          w: "work",
          h: "health",
          f: "finance",
          l: "learning",
          s: "social",
        };
        if (catMap[e.key.toLowerCase()]) {
          e.preventDefault();
          setCategory(catMap[e.key.toLowerCase()]);
          return;
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [title, description, priority, category, dueDate, subtasks, newSubtask]);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const isEditing = !!editingTodo;

  return (
    <div className="space-y-4">
      <div
        className={`text-xs ${
          darkMode ? "text-gray-400" : "text-gray-500"
        } flex flex-wrap gap-3 pb-2 border-b ${
          darkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <span>
          <kbd
            className={`px-1 rounded ${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            Alt+1-4
          </kbd>{" "}
          Priority
        </span>
        <span>
          <kbd
            className={`px-1 rounded ${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            Alt+P/W/H/F/L/S
          </kbd>{" "}
          Category
        </span>
        <span>
          <kbd
            className={`px-1 rounded ${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            Ctrl+Enter
          </kbd>{" "}
          Save
        </span>
        <span>
          <kbd
            className={`px-1 rounded ${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            Esc
          </kbd>{" "}
          Cancel
        </span>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Title *</label>
        <input
          ref={titleRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-purple-500 transition-colors
            ${
              darkMode
                ? "bg-gray-700 border-gray-600 placeholder-gray-400"
                : "bg-white border-gray-200 placeholder-gray-400"
            }
          `}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add some details..."
          rows={2}
          className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-purple-500 transition-colors resize-none
            ${
              darkMode
                ? "bg-gray-700 border-gray-600 placeholder-gray-400"
                : "bg-white border-gray-200 placeholder-gray-400"
            }
          `}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Priority{" "}
            <span
              className={`text-xs ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              (Alt+1-4)
            </span>
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-purple-500
              ${
                darkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-200"
              }
            `}
          >
            {Object.entries(PRIORITIES).map(([key, val], i) => (
              <option key={key} value={key}>
                {val.emoji} {val.label} ({i + 1})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Category{" "}
            <span
              className={`text-xs ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              (Alt+key)
            </span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-purple-500
              ${
                darkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-200"
              }
            `}
          >
            {Object.entries(CATEGORIES).map(([key, val]) => (
              <option key={key} value={key}>
                {val.emoji} {val.label} ({key[0].toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-purple-500
            ${
              darkMode
                ? "bg-gray-700 border-gray-600"
                : "bg-white border-gray-200"
            }
          `}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Subtasks</label>
        <div className="flex gap-2 mb-2">
          <input
            ref={subtaskRef}
            type="text"
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            placeholder="Add a subtask... (Enter to add)"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                addSubtask();
              }
            }}
            className={`flex-1 px-4 py-2 rounded-xl border-2 focus:outline-none focus:border-purple-500
              ${
                darkMode
                  ? "bg-gray-700 border-gray-600 placeholder-gray-400"
                  : "bg-white border-gray-200 placeholder-gray-400"
              }
            `}
          />
          <button
            type="button"
            onClick={addSubtask}
            className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
          >
            +
          </button>
        </div>
        {subtasks.length > 0 && (
          <div className="space-y-1">
            {subtasks.map((s, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <span className="flex-1 text-sm">{s}</span>
                <button
                  type="button"
                  onClick={() =>
                    setSubtasks(subtasks.filter((_, j) => j !== i))
                  }
                  className="text-red-500 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors
            ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-100 hover:bg-gray-200"
            }
          `}
        >
          Cancel{" "}
          <span
            className={`text-xs ${
              darkMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            (Esc)
          </span>
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
        >
          {isEditing ? "Save Changes" : "Add Task"} ✨{" "}
          <span className="text-xs opacity-75">(Ctrl+↵)</span>
        </button>
      </div>
    </div>
  );
}

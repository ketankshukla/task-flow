"use client";

import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { Todo, FilterStatus, SortBy } from "@/lib/types";
import { MOTIVATIONAL_QUOTES } from "@/lib/constants";
import { useTodos } from "@/hooks/useTodos";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { Confetti } from "./Confetti";
import { ShortcutsModal } from "./ShortcutsModal";
import { StatsPanel } from "./StatsPanel";
import { TodoItem } from "./TodoItem";
import { TodoForm } from "./TodoForm";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";

export default function TaskFlow() {
  const {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    toggleSubtask,
    bulkComplete,
    bulkDelete,
  } = useTodos();

  const [darkMode, setDarkMode] = useLocalStorage("taskflow_darkmode", false);
  const [streak, setStreak] = useLocalStorage("taskflow_streak", 3);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortBy>("created");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [selectedTodos, setSelectedTodos] = useState(new Set<string>());
  const [showConfetti, setShowConfetti] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    todoId: string;
    todoTitle: string;
  }>({ isOpen: false, todoId: "", todoTitle: "" });

  useEffect(() => {
    setQuote(
      MOTIVATIONAL_QUOTES[
        Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)
      ]
    );
  }, []);

  const searchRef = useRef<HTMLInputElement>(null);

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setFilterStatus("all");
    setFilterPriority("all");
    setFilterCategory("all");
    setSortBy("created");
  }, []);

  const closeModal = useCallback(() => {
    setShowAddModal(false);
    setEditingTodo(null);
  }, []);

  const openEditModal = useCallback((todo: Todo) => {
    setEditingTodo(todo);
    setShowAddModal(true);
  }, []);

  const handleToggleTodo = useCallback(
    (id: string) => {
      const todo = todos.find((t) => t.id === id);
      if (todo && !todo.completed) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 100);
      }
      toggleTodo(id);
    },
    [todos, toggleTodo]
  );

  const handleDeleteTodo = useCallback(
    (id: string) => {
      const todo = todos.find((t) => t.id === id);
      if (todo) {
        setDeleteConfirmation({
          isOpen: true,
          todoId: id,
          todoTitle: todo.title,
        });
      }
    },
    [todos]
  );

  const confirmDelete = useCallback(() => {
    deleteTodo(deleteConfirmation.todoId);
    setSelectedTodos((prev) => {
      const next = new Set(prev);
      next.delete(deleteConfirmation.todoId);
      return next;
    });
    setDeleteConfirmation({ isOpen: false, todoId: "", todoTitle: "" });
  }, [deleteConfirmation.todoId, deleteTodo]);

  const cancelDelete = useCallback(() => {
    setDeleteConfirmation({ isOpen: false, todoId: "", todoTitle: "" });
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setSelectedTodos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleBulkComplete = useCallback(() => {
    if (selectedTodos.size === 0) return;
    bulkComplete(selectedTodos);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 100);
    setSelectedTodos(new Set());
  }, [selectedTodos, bulkComplete]);

  const handleBulkDelete = useCallback(() => {
    if (selectedTodos.size === 0) return;
    bulkDelete(selectedTodos);
    setSelectedTodos(new Set());
  }, [selectedTodos, bulkDelete]);

  useKeyboardShortcuts({
    onNew: () => {
      setEditingTodo(null);
      setShowAddModal(true);
    },
    onSearch: () => searchRef.current?.focus(),
    onToggleDarkMode: () => setDarkMode((d) => !d),
    onShowShortcuts: () => setShowShortcuts(true),
    onResetFilters: () => {
      setShowShortcuts(false);
      resetFilters();
    },
    onFilterAll: () => setFilterStatus("all"),
    onFilterActive: () => setFilterStatus("active"),
    onFilterCompleted: () => setFilterStatus("completed"),
    onFilterOverdue: () => setFilterStatus("overdue"),
    isModalOpen: showAddModal,
  });

  const filteredTodos = useMemo(() => {
    let result = [...todos];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
      );
    }

    switch (filterStatus) {
      case "active":
        result = result.filter((t) => !t.completed);
        break;
      case "completed":
        result = result.filter((t) => t.completed);
        break;
      case "overdue":
        result = result.filter(
          (t) => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
        );
        break;
    }

    if (filterPriority !== "all") {
      result = result.filter((t) => t.priority === filterPriority);
    }

    if (filterCategory !== "all") {
      result = result.filter((t) => t.category === filterCategory);
    }

    switch (sortBy) {
      case "created":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "priority":
        const priorityOrder: Record<string, number> = {
          urgent: 0,
          high: 1,
          medium: 2,
          low: 3,
        };
        result.sort(
          (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
        );
        break;
      case "dueDate":
        result.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
        break;
      case "alphabetical":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return result;
  }, [
    todos,
    searchQuery,
    filterStatus,
    filterPriority,
    filterCategory,
    sortBy,
  ]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 relative ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 text-gray-800"
      }`}
    >
      <Confetti active={showConfetti} />

      {showAddModal && (
        <div
          className="absolute inset-0 bg-black/50 flex items-start justify-center z-50 p-4 pt-20 overflow-auto"
          onClick={closeModal}
        >
          <div
            className={`${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            } rounded-2xl p-6 max-w-lg w-full shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-4">
              {editingTodo ? "✏️ Edit Task" : "✨ New Task"}
            </h3>
            <TodoForm
              onAdd={addTodo}
              onEdit={editTodo}
              onClose={closeModal}
              darkMode={darkMode}
              editingTodo={editingTodo}
            />
          </div>
        </div>
      )}

      <ShortcutsModal
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
        darkMode={darkMode}
      />
      <DeleteConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        darkMode={darkMode}
        taskTitle={deleteConfirmation.todoTitle}
      />

      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                ✨ TaskFlow
              </h1>
              <p
                className={`mt-1 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Your beautiful productivity companion
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFocusMode(!focusMode)}
                className={`px-4 py-2 rounded-xl transition-all ${
                  focusMode
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : darkMode
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-white hover:bg-gray-100"
                }`}
                title="Focus Mode"
              >
                🎯 {focusMode ? "Exit Focus" : "Focus Mode"}
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-xl transition-all ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-white hover:bg-gray-100 shadow-sm"
                }`}
                title="Toggle Dark Mode (D)"
              >
                {darkMode ? "☀️" : "🌙"}
              </button>
              <button
                onClick={() => setShowShortcuts(true)}
                className={`p-3 rounded-xl transition-all ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-white hover:bg-gray-100 shadow-sm"
                }`}
                title="Keyboard Shortcuts (?)"
              >
                ⌨️
              </button>
            </div>
          </div>

          {!focusMode && (
            <div
              className={`${
                darkMode
                  ? "bg-gradient-to-r from-purple-900/30 to-pink-900/30"
                  : "bg-gradient-to-r from-purple-100 to-pink-100"
              } rounded-2xl p-4 mb-6`}
            >
              <p className="italic">&quot;{quote.text}&quot;</p>
              <p
                className={`text-sm mt-1 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                — {quote.author}
              </p>
            </div>
          )}
        </header>

        <div className={`grid gap-6 ${focusMode ? "" : "lg:grid-cols-4"}`}>
          <div className={focusMode ? "" : "lg:col-span-3"}>
            <div
              className={`${
                darkMode ? "bg-gray-800/50" : "bg-white/50"
              } backdrop-blur-sm rounded-2xl p-4 mb-6`}
            >
              <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      🔍
                    </span>
                    <input
                      ref={searchRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search tasks... (F)"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:border-purple-500 transition-colors
                        ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 placeholder-gray-400"
                            : "bg-white border-gray-200 placeholder-gray-400"
                        }
                      `}
                    />
                  </div>
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(e.target.value as FilterStatus)
                  }
                  className={`px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-purple-500
                    ${
                      darkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-200"
                    }
                  `}
                >
                  <option value="all">📋 All Tasks</option>
                  <option value="active">⏳ Active</option>
                  <option value="completed">✅ Completed</option>
                  <option value="overdue">⚠️ Overdue</option>
                </select>

                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className={`px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-purple-500
                    ${
                      darkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-200"
                    }
                  `}
                >
                  <option value="all">🎯 All Priorities</option>
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🟠 High</option>
                  <option value="urgent">🔴 Urgent</option>
                </select>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className={`px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-purple-500
                    ${
                      darkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-200"
                    }
                  `}
                >
                  <option value="all">📁 All Categories</option>
                  <option value="personal">🏠 Personal</option>
                  <option value="work">💼 Work</option>
                  <option value="health">💪 Health</option>
                  <option value="finance">💰 Finance</option>
                  <option value="learning">📚 Learning</option>
                  <option value="social">👥 Social</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className={`px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-purple-500
                    ${
                      darkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-200"
                    }
                  `}
                >
                  <option value="created">🕐 Newest First</option>
                  <option value="priority">🔥 By Priority</option>
                  <option value="dueDate">📅 By Due Date</option>
                  <option value="alphabetical">🔤 Alphabetical</option>
                </select>

                {(searchQuery ||
                  filterStatus !== "all" ||
                  filterPriority !== "all" ||
                  filterCategory !== "all" ||
                  sortBy !== "created") && (
                  <button
                    onClick={resetFilters}
                    className={`px-4 py-3 rounded-xl border-2 transition-colors flex items-center gap-2
                      ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 hover:bg-gray-600"
                          : "bg-white border-gray-200 hover:bg-gray-100"
                      }
                    `}
                    title="Reset all filters (R or Esc)"
                  >
                    🔄 Reset
                  </button>
                )}
              </div>

              {selectedTodos.size > 0 && (
                <div
                  className={`flex items-center gap-3 mt-4 pt-4 border-t ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <span className="text-sm font-medium">
                    {selectedTodos.size} selected
                  </span>
                  <button
                    onClick={handleBulkComplete}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm"
                  >
                    ✅ Complete All
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                  >
                    🗑️ Delete All
                  </button>
                  <button
                    onClick={() => setSelectedTodos(new Set())}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    Clear Selection
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setEditingTodo(null);
                setShowAddModal(true);
              }}
              className="w-full mb-6 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg"
            >
              <span className="text-xl">+</span> Add New Task (N)
            </button>

            <div className="space-y-3">
              {filteredTodos.length === 0 ? (
                <div
                  className={`${
                    darkMode ? "bg-gray-800/50" : "bg-white/50"
                  } backdrop-blur-sm rounded-2xl p-12 text-center`}
                >
                  <div className="text-6xl mb-4">
                    {searchQuery ? "🔍" : todos.length === 0 ? "🎉" : "✨"}
                  </div>
                  <h3 className="text-xl font-medium mb-2">
                    {searchQuery
                      ? "No tasks found"
                      : todos.length === 0
                      ? "All caught up!"
                      : "No tasks match your filters"}
                  </h3>
                  <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
                    {searchQuery
                      ? "Try a different search term"
                      : todos.length === 0
                      ? "Add your first task to get started"
                      : "Try adjusting your filters"}
                  </p>
                </div>
              ) : (
                filteredTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggleTodo}
                    onDelete={handleDeleteTodo}
                    onToggleSubtask={toggleSubtask}
                    darkMode={darkMode}
                    isSelected={selectedTodos.has(todo.id)}
                    onSelect={toggleSelect}
                    onOpenEdit={openEditModal}
                  />
                ))
              )}
            </div>
          </div>

          {!focusMode && (
            <div className="lg:col-span-1">
              <StatsPanel todos={todos} streak={streak} darkMode={darkMode} />
            </div>
          )}
        </div>

        <footer
          className={`mt-12 text-center text-sm ${
            darkMode ? "text-gray-500" : "text-gray-400"
          }`}
        >
          <p>
            Made with 💜 • Press{" "}
            <kbd
              className={`px-2 py-0.5 rounded ${
                darkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              ?
            </kbd>{" "}
            for shortcuts
          </p>
        </footer>
      </div>
    </div>
  );
}

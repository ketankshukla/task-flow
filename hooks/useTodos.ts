import { useState, useCallback, useEffect } from "react";
import { Todo } from "@/lib/types";
import { SAMPLE_TODOS } from "@/lib/constants";
import { storage } from "@/lib/storage";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadedTodos = storage.getTodos();
    setTodos(loadedTodos.length > 0 ? loadedTodos : SAMPLE_TODOS);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      storage.saveTodos(todos);
    }
  }, [todos, isLoaded]);

  const addTodo = useCallback((todo: Todo) => {
    setTodos((prev) => [todo, ...prev]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const editTodo = useCallback((id: string, updates: Partial<Todo>) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const toggleSubtask = useCallback((todoId: string, subtaskId: string) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id === todoId) {
          const newSubtasks = t.subtasks.map((s) =>
            s.id === subtaskId ? { ...s, completed: !s.completed } : s
          );
          return { ...t, subtasks: newSubtasks };
        }
        return t;
      })
    );
  }, []);

  const bulkComplete = useCallback((ids: Set<string>) => {
    setTodos((prev) =>
      prev.map((t) => (ids.has(t.id) ? { ...t, completed: true } : t))
    );
  }, []);

  const bulkDelete = useCallback((ids: Set<string>) => {
    setTodos((prev) => prev.filter((t) => !ids.has(t.id)));
  }, []);

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    toggleSubtask,
    bulkComplete,
    bulkDelete,
  };
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Todo, Subtask } from "@/lib/types";

export function useSupabaseTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all todos with subtasks
  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: todosData, error: todosError } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });

      if (todosError) throw todosError;

      if (!todosData || todosData.length === 0) {
        setTodos([]);
        setLoading(false);
        return;
      }

      // Fetch subtasks for all todos
      const { data: subtasksData, error: subtasksError } = await supabase
        .from("subtasks")
        .select("*")
        .order("position", { ascending: true });

      if (subtasksError) throw subtasksError;

      // Map database format to app format
      const mappedTodos: Todo[] = todosData.map((todo: any) => ({
        id: todo.id,
        title: todo.title,
        description: todo.description || "",
        completed: todo.completed,
        priority: todo.priority as any,
        category: todo.category as any,
        dueDate: todo.due_date || "",
        createdAt: todo.created_at,
        subtasks: (subtasksData || [])
          .filter((st: any) => st.todo_id === todo.id)
          .map((st: any) => ({
            id: st.id,
            title: st.title,
            completed: st.completed,
          })),
      }));

      setTodos(mappedTodos);
    } catch (err: any) {
      console.error("Error fetching todos:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new todo
  const addTodo = useCallback(
    async (todo: Todo) => {
      try {
        setError(null);

        const { data: newTodo, error: todoError } = await supabase
          .from("todos")
          .insert({
            title: todo.title,
            description: todo.description,
            completed: todo.completed,
            priority: todo.priority,
            category: todo.category,
            due_date: todo.dueDate || null,
          })
          .select()
          .single();

        if (todoError) throw todoError;

        // Add subtasks if any
        if (todo.subtasks.length > 0) {
          const subtasksToInsert = todo.subtasks.map((st, index) => ({
            todo_id: newTodo.id,
            title: st.title,
            completed: st.completed,
            position: index,
          }));

          const { error: subtasksError } = await supabase
            .from("subtasks")
            .insert(subtasksToInsert);

          if (subtasksError) throw subtasksError;
        }

        await fetchTodos();
      } catch (err: any) {
        console.error("Error adding todo:", err);
        setError(err.message);
      }
    },
    [fetchTodos]
  );

  // Toggle todo completion
  const toggleTodo = useCallback(
    async (id: string) => {
      try {
        setError(null);

        const todo = todos.find((t) => t.id === id);
        if (!todo) return;

        const { error: updateError } = await supabase
          .from("todos")
          .update({ completed: !todo.completed })
          .eq("id", id);

        if (updateError) throw updateError;

        await fetchTodos();
      } catch (err: any) {
        console.error("Error toggling todo:", err);
        setError(err.message);
      }
    },
    [todos, fetchTodos]
  );

  // Delete todo
  const deleteTodo = useCallback(
    async (id: string) => {
      try {
        setError(null);

        // Subtasks will be deleted automatically due to CASCADE
        const { error: deleteError } = await supabase
          .from("todos")
          .delete()
          .eq("id", id);

        if (deleteError) throw deleteError;

        await fetchTodos();
      } catch (err: any) {
        console.error("Error deleting todo:", err);
        setError(err.message);
      }
    },
    [fetchTodos]
  );

  // Edit todo
  const editTodo = useCallback(
    async (id: string, updates: Partial<Todo>) => {
      try {
        setError(null);

        const { error: updateError } = await supabase
          .from("todos")
          .update({
            title: updates.title,
            description: updates.description,
            priority: updates.priority,
            category: updates.category,
            due_date: updates.dueDate || null,
          })
          .eq("id", id);

        if (updateError) throw updateError;

        // Handle subtasks update
        if (updates.subtasks) {
          // Delete existing subtasks
          await supabase.from("subtasks").delete().eq("todo_id", id);

          // Insert new subtasks
          if (updates.subtasks.length > 0) {
            const subtasksToInsert = updates.subtasks.map((st, index) => ({
              todo_id: id,
              title: st.title,
              completed: st.completed,
              position: index,
            }));

            const { error: subtasksError } = await supabase
              .from("subtasks")
              .insert(subtasksToInsert);

            if (subtasksError) throw subtasksError;
          }
        }

        await fetchTodos();
      } catch (err: any) {
        console.error("Error editing todo:", err);
        setError(err.message);
      }
    },
    [fetchTodos]
  );

  // Toggle subtask
  const toggleSubtask = useCallback(
    async (todoId: string, subtaskId: string) => {
      try {
        setError(null);

        const todo = todos.find((t) => t.id === todoId);
        if (!todo) return;

        const subtask = todo.subtasks.find((st) => st.id === subtaskId);
        if (!subtask) return;

        const { error: updateError } = await supabase
          .from("subtasks")
          .update({ completed: !subtask.completed })
          .eq("id", subtaskId);

        if (updateError) throw updateError;

        await fetchTodos();
      } catch (err: any) {
        console.error("Error toggling subtask:", err);
        setError(err.message);
      }
    },
    [todos, fetchTodos]
  );

  // Bulk complete
  const bulkComplete = useCallback(
    async (ids: Set<string>) => {
      try {
        setError(null);

        const { error: updateError } = await supabase
          .from("todos")
          .update({ completed: true })
          .in("id", Array.from(ids));

        if (updateError) throw updateError;

        await fetchTodos();
      } catch (err: any) {
        console.error("Error bulk completing:", err);
        setError(err.message);
      }
    },
    [fetchTodos]
  );

  // Bulk delete
  const bulkDelete = useCallback(
    async (ids: Set<string>) => {
      try {
        setError(null);

        const { error: deleteError } = await supabase
          .from("todos")
          .delete()
          .in("id", Array.from(ids));

        if (deleteError) throw deleteError;

        await fetchTodos();
      } catch (err: any) {
        console.error("Error bulk deleting:", err);
        setError(err.message);
      }
    },
    [fetchTodos]
  );

  // Initial fetch and real-time subscription
  useEffect(() => {
    fetchTodos();

    // Subscribe to real-time changes
    const todosChannel = supabase
      .channel("todos-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "todos" },
        () => {
          fetchTodos();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "subtasks" },
        () => {
          fetchTodos();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(todosChannel);
    };
  }, [fetchTodos]);

  return {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    toggleSubtask,
    bulkComplete,
    bulkDelete,
    refetch: fetchTodos,
  };
}

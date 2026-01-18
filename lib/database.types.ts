export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      todos: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          description: string;
          completed: boolean;
          priority: "low" | "medium" | "high" | "urgent";
          category:
            | "personal"
            | "work"
            | "health"
            | "finance"
            | "learning"
            | "social";
          due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title: string;
          description?: string;
          completed?: boolean;
          priority: "low" | "medium" | "high" | "urgent";
          category:
            | "personal"
            | "work"
            | "health"
            | "finance"
            | "learning"
            | "social";
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title?: string;
          description?: string;
          completed?: boolean;
          priority?: "low" | "medium" | "high" | "urgent";
          category?:
            | "personal"
            | "work"
            | "health"
            | "finance"
            | "learning"
            | "social";
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      subtasks: {
        Row: {
          id: string;
          todo_id: string;
          title: string;
          completed: boolean;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          todo_id: string;
          title: string;
          completed?: boolean;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          todo_id?: string;
          title?: string;
          completed?: boolean;
          position?: number;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

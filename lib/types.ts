export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  dueDate: string;
  createdAt: string;
  subtasks: Subtask[];
}

export type Priority = "low" | "medium" | "high" | "urgent";
export type Category =
  | "personal"
  | "work"
  | "health"
  | "finance"
  | "learning"
  | "social";
export type FilterStatus = "all" | "active" | "completed" | "overdue";
export type SortBy = "created" | "priority" | "dueDate" | "alphabetical";

export interface PriorityConfig {
  label: string;
  emoji: string;
  color: string;
}

export interface CategoryConfig {
  label: string;
  emoji: string;
  color: string;
}

export interface MotivationalQuote {
  text: string;
  author: string;
}

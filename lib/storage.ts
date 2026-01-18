import { Todo } from "./types";

const STORAGE_KEY = "taskflow_todos";
const DARK_MODE_KEY = "taskflow_darkmode";
const STREAK_KEY = "taskflow_streak";

export const storage = {
  getTodos: (): Todo[] => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading todos from localStorage:", error);
      return [];
    }
  },

  saveTodos: (todos: Todo[]): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error("Error saving todos to localStorage:", error);
    }
  },

  getDarkMode: (): boolean => {
    if (typeof window === "undefined") return false;
    try {
      const stored = localStorage.getItem(DARK_MODE_KEY);
      return stored ? JSON.parse(stored) : false;
    } catch (error) {
      console.error("Error loading dark mode from localStorage:", error);
      return false;
    }
  },

  saveDarkMode: (darkMode: boolean): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(DARK_MODE_KEY, JSON.stringify(darkMode));
    } catch (error) {
      console.error("Error saving dark mode to localStorage:", error);
    }
  },

  getStreak: (): number => {
    if (typeof window === "undefined") return 0;
    try {
      const stored = localStorage.getItem(STREAK_KEY);
      return stored ? JSON.parse(stored) : 3;
    } catch (error) {
      console.error("Error loading streak from localStorage:", error);
      return 3;
    }
  },

  saveStreak: (streak: number): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
    } catch (error) {
      console.error("Error saving streak to localStorage:", error);
    }
  },

  clearAll: (): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(DARK_MODE_KEY);
      localStorage.removeItem(STREAK_KEY);
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  },
};

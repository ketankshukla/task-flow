import {
  PriorityConfig,
  CategoryConfig,
  MotivationalQuote,
  Priority,
  Category,
} from "./types";

export const PRIORITIES: Record<Priority, PriorityConfig> = {
  low: {
    label: "Low",
    emoji: "🟢",
    color: "bg-emerald-100 text-emerald-700 border-emerald-300",
  },
  medium: {
    label: "Medium",
    emoji: "🟡",
    color: "bg-amber-100 text-amber-700 border-amber-300",
  },
  high: {
    label: "High",
    emoji: "🟠",
    color: "bg-orange-100 text-orange-700 border-orange-300",
  },
  urgent: {
    label: "Urgent",
    emoji: "🔴",
    color: "bg-red-100 text-red-700 border-red-300",
  },
};

export const CATEGORIES: Record<Category, CategoryConfig> = {
  personal: {
    label: "Personal",
    emoji: "🏠",
    color: "bg-purple-100 text-purple-700 border-purple-300",
  },
  work: {
    label: "Work",
    emoji: "💼",
    color: "bg-blue-100 text-blue-700 border-blue-300",
  },
  health: {
    label: "Health",
    emoji: "💪",
    color: "bg-green-100 text-green-700 border-green-300",
  },
  finance: {
    label: "Finance",
    emoji: "💰",
    color: "bg-yellow-100 text-yellow-700 border-yellow-300",
  },
  learning: {
    label: "Learning",
    emoji: "📚",
    color: "bg-indigo-100 text-indigo-700 border-indigo-300",
  },
  social: {
    label: "Social",
    emoji: "👥",
    color: "bg-pink-100 text-pink-700 border-pink-300",
  },
};

export const MOTIVATIONAL_QUOTES: MotivationalQuote[] = [
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { text: "Small progress is still progress.", author: "Unknown" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "You don't have to be great to start.", author: "Zig Ziglar" },
  {
    text: "Action is the foundational key to all success.",
    author: "Pablo Picasso",
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
  },
  {
    text: "Start where you are. Use what you have. Do what you can.",
    author: "Arthur Ashe",
  },
];

export const SAMPLE_TODOS = [
  {
    id: "1",
    title: "Welcome to TaskFlow! 🎉",
    description:
      "This is your new productivity companion. Try completing this task!",
    completed: false,
    priority: "medium" as Priority,
    category: "personal" as Category,
    dueDate: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
    subtasks: [
      { id: "s1", title: "Explore the features", completed: false },
      { id: "s2", title: "Add your first task", completed: false },
      { id: "s3", title: "Try dark mode", completed: false },
    ],
  },
  {
    id: "2",
    title: "Learn keyboard shortcuts ⌨️",
    description: "Press ? to see all available shortcuts",
    completed: false,
    priority: "low" as Priority,
    category: "learning" as Category,
    dueDate: "",
    createdAt: new Date().toISOString(),
    subtasks: [],
  },
];

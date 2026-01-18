"use client";

import { useMemo } from "react";
import { Todo } from "@/lib/types";
import { CATEGORIES, PRIORITIES } from "@/lib/constants";

interface StatsPanelProps {
  todos: Todo[];
  streak: number;
  darkMode: boolean;
}

export function StatsPanel({ todos, streak, darkMode }: StatsPanelProps) {
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const pending = total - completed;
    const overdue = todos.filter(
      (t) => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
    ).length;
    const todayDue = todos.filter(
      (t) =>
        !t.completed && t.dueDate === new Date().toISOString().split("T")[0]
    ).length;

    const byCategory = Object.keys(CATEGORIES).reduce((acc, cat) => {
      acc[cat] = todos.filter((t) => t.category === cat).length;
      return acc;
    }, {} as Record<string, number>);

    const byPriority = Object.keys(PRIORITIES).reduce((acc, pri) => {
      acc[pri] = todos.filter((t) => !t.completed && t.priority === pri).length;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      completed,
      pending,
      overdue,
      todayDue,
      byCategory,
      byPriority,
    };
  }, [todos]);

  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800/50" : "bg-white/50"
      } backdrop-blur-sm rounded-2xl p-5 space-y-4`}
    >
      <h3 className="text-lg font-bold flex items-center gap-2">
        📊 Statistics
      </h3>

      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="35"
              className={`${darkMode ? "stroke-gray-700" : "stroke-gray-200"}`}
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="40"
              cy="40"
              r="35"
              className="stroke-emerald-500"
              strokeWidth="6"
              fill="none"
              strokeDasharray={`${completionRate * 2.2} 220`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold">{completionRate}%</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm">
            <span className="font-semibold">{stats.completed}</span> completed
          </p>
          <p className="text-sm">
            <span className="font-semibold">{stats.pending}</span> pending
          </p>
          {stats.overdue > 0 && (
            <p className="text-sm text-red-500">
              <span className="font-semibold">{stats.overdue}</span> overdue
            </p>
          )}
        </div>
      </div>

      <div
        className={`${
          darkMode
            ? "bg-gradient-to-r from-orange-900/30 to-red-900/30"
            : "bg-gradient-to-r from-orange-100 to-red-100"
        } rounded-xl p-3`}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <div>
            <p className="font-bold">{streak} Day Streak</p>
            <p
              className={`text-xs ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Keep it going!
            </p>
          </div>
        </div>
      </div>

      {stats.todayDue > 0 && (
        <div
          className={`${
            darkMode ? "bg-blue-900/30" : "bg-blue-100"
          } rounded-xl p-3`}
        >
          <p className="text-sm">
            <span className="font-semibold">{stats.todayDue}</span> task
            {stats.todayDue > 1 ? "s" : ""} due today
          </p>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm font-semibold">By Priority</p>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(PRIORITIES).map(
            ([key, val]) =>
              stats.byPriority[key] > 0 && (
                <span
                  key={key}
                  className={`px-2 py-1 rounded-full text-xs border ${val.color}`}
                >
                  {val.emoji} {stats.byPriority[key]}
                </span>
              )
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect } from "react";

interface KeyboardShortcutsConfig {
  onNew?: () => void;
  onSearch?: () => void;
  onToggleDarkMode?: () => void;
  onShowShortcuts?: () => void;
  onResetFilters?: () => void;
  onFilterAll?: () => void;
  onFilterActive?: () => void;
  onFilterCompleted?: () => void;
  onFilterOverdue?: () => void;
  isModalOpen?: boolean;
}

export function useKeyboardShortcuts(config: KeyboardShortcutsConfig) {
  const {
    onNew,
    onSearch,
    onToggleDarkMode,
    onShowShortcuts,
    onResetFilters,
    onFilterAll,
    onFilterActive,
    onFilterCompleted,
    onFilterOverdue,
    isModalOpen = false,
  } = config;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModalOpen) return;

      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        if (e.key === "Escape") {
          (e.target as HTMLElement).blur();
          onResetFilters?.();
        }
        return;
      }

      switch (e.key) {
        case "n":
          e.preventDefault();
          onNew?.();
          break;
        case "f":
          e.preventDefault();
          onSearch?.();
          break;
        case "d":
          e.preventDefault();
          onToggleDarkMode?.();
          break;
        case "?":
          e.preventDefault();
          onShowShortcuts?.();
          break;
        case "Escape":
          onResetFilters?.();
          break;
        case "r":
          e.preventDefault();
          onResetFilters?.();
          break;
        case "1":
          onFilterAll?.();
          break;
        case "2":
          onFilterActive?.();
          break;
        case "3":
          onFilterCompleted?.();
          break;
        case "4":
          onFilterOverdue?.();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    onNew,
    onSearch,
    onToggleDarkMode,
    onShowShortcuts,
    onResetFilters,
    onFilterAll,
    onFilterActive,
    onFilterCompleted,
    onFilterOverdue,
    isModalOpen,
  ]);
}

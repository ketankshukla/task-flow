import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// ============================================
// STORAGE HELPERS (uncomment for localStorage)
// ============================================
// const saveToStorage = (key, data) => {
//   localStorage.setItem(key, JSON.stringify(data));
// };
// const loadFromStorage = (key, defaultValue) => {
//   const stored = localStorage.getItem(key);
//   return stored ? JSON.parse(stored) : defaultValue;
// };

// ============================================
// CONSTANTS & DATA
// ============================================
const PRIORITIES = {
  low: { label: 'Low', emoji: '🟢', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
  medium: { label: 'Medium', emoji: '🟡', color: 'bg-amber-100 text-amber-700 border-amber-300' },
  high: { label: 'High', emoji: '🟠', color: 'bg-orange-100 text-orange-700 border-orange-300' },
  urgent: { label: 'Urgent', emoji: '🔴', color: 'bg-red-100 text-red-700 border-red-300' }
};

const CATEGORIES = {
  personal: { label: 'Personal', emoji: '🏠', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  work: { label: 'Work', emoji: '💼', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  health: { label: 'Health', emoji: '💪', color: 'bg-green-100 text-green-700 border-green-300' },
  finance: { label: 'Finance', emoji: '💰', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  learning: { label: 'Learning', emoji: '📚', color: 'bg-indigo-100 text-indigo-700 border-indigo-300' },
  social: { label: 'Social', emoji: '👥', color: 'bg-pink-100 text-pink-700 border-pink-300' }
};

const MOTIVATIONAL_QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { text: "Small progress is still progress.", author: "Unknown" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "You don't have to be great to start.", author: "Zig Ziglar" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" }
];

const SAMPLE_TODOS = [
  {
    id: '1',
    title: 'Welcome to TaskFlow! 🎉',
    description: 'This is your new productivity companion. Try completing this task!',
    completed: false,
    priority: 'medium',
    category: 'personal',
    dueDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    subtasks: [
      { id: 's1', title: 'Explore the features', completed: false },
      { id: 's2', title: 'Add your first task', completed: false },
      { id: 's3', title: 'Try dark mode', completed: false }
    ]
  },
  {
    id: '2',
    title: 'Learn keyboard shortcuts ⌨️',
    description: 'Press ? to see all available shortcuts',
    completed: false,
    priority: 'low',
    category: 'learning',
    dueDate: '',
    createdAt: new Date().toISOString(),
    subtasks: []
  }
];

// ============================================
// CONFETTI COMPONENT
// ============================================
const Confetti = ({ active }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (active) {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'][Math.floor(Math.random() * 7)]
      }));
      setParticles(newParticles);
      const timer = setTimeout(() => setParticles([]), 2000);
      return () => clearTimeout(timer);
    }
  }, [active]);

  if (!particles.length) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute w-3 h-3 rounded-full animate-bounce"
          style={{
            left: `${p.x}%`,
            top: '-20px',
            backgroundColor: p.color,
            animation: `confetti-fall 2s ease-out ${p.delay}s forwards`
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// ============================================
// STATISTICS PANEL
// ============================================
const StatsPanel = ({ todos, streak, darkMode }) => {
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;
    const overdue = todos.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length;
    const todayDue = todos.filter(t => !t.completed && t.dueDate === new Date().toISOString().split('T')[0]).length;
    
    const byCategory = Object.keys(CATEGORIES).reduce((acc, cat) => {
      acc[cat] = todos.filter(t => t.category === cat).length;
      return acc;
    }, {});
    
    const byPriority = Object.keys(PRIORITIES).reduce((acc, pri) => {
      acc[pri] = todos.filter(t => !t.completed && t.priority === pri).length;
      return acc;
    }, {});

    return { total, completed, pending, overdue, todayDue, byCategory, byPriority };
  }, [todos]);

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm rounded-2xl p-5 space-y-4`}>
      <h3 className="text-lg font-bold flex items-center gap-2">
        📊 Statistics
      </h3>
      
      {/* Progress Ring */}
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle
              cx="40" cy="40" r="35"
              className={`${darkMode ? 'stroke-gray-700' : 'stroke-gray-200'}`}
              strokeWidth="6" fill="none"
            />
            <circle
              cx="40" cy="40" r="35"
              className="stroke-emerald-500"
              strokeWidth="6" fill="none"
              strokeDasharray={`${completionRate * 2.2} 220`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold">{completionRate}%</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm"><span className="font-semibold">{stats.completed}</span> completed</p>
          <p className="text-sm"><span className="font-semibold">{stats.pending}</span> pending</p>
          {stats.overdue > 0 && (
            <p className="text-sm text-red-500"><span className="font-semibold">{stats.overdue}</span> overdue</p>
          )}
        </div>
      </div>

      {/* Streak */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-orange-900/30 to-red-900/30' : 'bg-gradient-to-r from-orange-100 to-red-100'} rounded-xl p-3`}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <div>
            <p className="font-bold">{streak} Day Streak</p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Keep it going!</p>
          </div>
        </div>
      </div>

      {/* Today's Focus */}
      {stats.todayDue > 0 && (
        <div className={`${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'} rounded-xl p-3`}>
          <p className="text-sm">
            <span className="font-semibold">{stats.todayDue}</span> task{stats.todayDue > 1 ? 's' : ''} due today
          </p>
        </div>
      )}

      {/* Priority Breakdown */}
      <div className="space-y-2">
        <p className="text-sm font-semibold">By Priority</p>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(PRIORITIES).map(([key, val]) => (
            stats.byPriority[key] > 0 && (
              <span key={key} className={`px-2 py-1 rounded-full text-xs border ${val.color}`}>
                {val.emoji} {stats.byPriority[key]}
              </span>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// TODO ITEM COMPONENT
// ============================================
const TodoItem = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
  onToggleSubtask,
  darkMode,
  isSelected,
  onSelect,
  onOpenEdit
}) => {
  const isOverdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date();
  const isDueToday = todo.dueDate === new Date().toISOString().split('T')[0];
  const subtaskProgress = todo.subtasks.length > 0
    ? Math.round((todo.subtasks.filter(s => s.completed).length / todo.subtasks.length) * 100)
    : null;

  return (
    <div
      className={`group rounded-xl border-2 transition-all duration-300 overflow-hidden
        ${todo.completed 
          ? darkMode ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-200'
          : darkMode ? 'bg-gray-800/50 border-gray-700 hover:border-purple-500' : 'bg-white border-gray-200 hover:border-purple-400'
        }
        ${isSelected ? 'ring-2 ring-purple-500' : ''}
        ${isOverdue ? 'border-red-400' : ''}
      `}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={() => onToggle(todo.id)}
            className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0
              ${todo.completed
                ? 'bg-gradient-to-r from-emerald-400 to-teal-500 border-transparent'
                : darkMode ? 'border-gray-500 hover:border-purple-400' : 'border-gray-300 hover:border-purple-400'
              }`}
          >
            {todo.completed && <span className="text-white text-sm">✓</span>}
          </button>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <h3
              className={`font-medium transition-all
                ${todo.completed ? 'line-through opacity-50' : ''}
              `}
            >
              {todo.title}
            </h3>

            {/* Meta Tags */}
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`px-2 py-0.5 rounded-full text-xs border ${PRIORITIES[todo.priority].color}`}>
                {PRIORITIES[todo.priority].emoji} {PRIORITIES[todo.priority].label}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs border ${CATEGORIES[todo.category].color}`}>
                {CATEGORIES[todo.category].emoji} {CATEGORIES[todo.category].label}
              </span>
              {todo.dueDate && (
                <span className={`px-2 py-0.5 rounded-full text-xs border
                  ${isOverdue ? 'bg-red-100 text-red-700 border-red-300' : 
                    isDueToday ? 'bg-blue-100 text-blue-700 border-blue-300' :
                    darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-600 border-gray-300'}
                `}>
                  📅 {isOverdue ? 'Overdue' : isDueToday ? 'Today' : todo.dueDate}
                </span>
              )}
              {subtaskProgress !== null && (
                <span className={`px-2 py-0.5 rounded-full text-xs border ${darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-600 border-gray-300'}`}>
                  📋 {subtaskProgress}%
                </span>
              )}
            </div>

            {/* Description */}
            {todo.description && (
              <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {todo.description}
              </p>
            )}

            {/* Subtasks - Always visible */}
            {todo.subtasks.length > 0 && (
              <div className="mt-3 pl-2 space-y-1 border-l-2 border-purple-300">
                {todo.subtasks.map(sub => (
                  <div key={sub.id} className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleSubtask(todo.id, sub.id)}
                      className={`w-4 h-4 rounded border flex items-center justify-center text-xs
                        ${sub.completed
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : darkMode ? 'border-gray-500' : 'border-gray-300'
                        }`}
                    >
                      {sub.completed && '✓'}
                    </button>
                    <span className={`text-sm ${sub.completed ? 'line-through opacity-50' : ''}`}>
                      {sub.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onSelect(todo.id)}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              title="Select"
            >
              {isSelected ? '☑️' : '☐'}
            </button>
            <button
              onClick={() => onOpenEdit(todo)}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              title="Edit"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className={`p-2 rounded-lg hover:bg-red-100 text-red-500`}
              title="Delete"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// ADD/EDIT TODO FORM (used inside modal)
// ============================================
const TodoForm = ({ onAdd, onEdit, onClose, darkMode, editingTodo }) => {
  const [title, setTitle] = useState(editingTodo?.title || '');
  const [description, setDescription] = useState(editingTodo?.description || '');
  const [priority, setPriority] = useState(editingTodo?.priority || 'medium');
  const [category, setCategory] = useState(editingTodo?.category || 'personal');
  const [dueDate, setDueDate] = useState(editingTodo?.dueDate || '');
  const [subtasks, setSubtasks] = useState(editingTodo?.subtasks?.map(s => s.title) || []);
  const [newSubtask, setNewSubtask] = useState('');
  const [focusedField, setFocusedField] = useState(0);
  
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const priorityRef = useRef(null);
  const categoryRef = useRef(null);
  const dueDateRef = useRef(null);
  const subtaskRef = useRef(null);
  
  const fieldRefs = [titleRef, descRef, priorityRef, categoryRef, dueDateRef, subtaskRef];
  const priorityKeys = Object.keys(PRIORITIES);
  const categoryKeys = Object.keys(CATEGORIES);

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
        completed: editingTodo?.subtasks?.[i]?.completed || false 
      }))
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
      setNewSubtask('');
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt + number for priority (1-4)
      if (e.altKey && e.key >= '1' && e.key <= '4') {
        e.preventDefault();
        setPriority(priorityKeys[parseInt(e.key) - 1]);
        return;
      }
      
      // Alt + letter for category
      if (e.altKey) {
        const catMap = { p: 'personal', w: 'work', h: 'health', f: 'finance', l: 'learning', s: 'social' };
        if (catMap[e.key.toLowerCase()]) {
          e.preventDefault();
          setCategory(catMap[e.key.toLowerCase()]);
          return;
        }
      }

      // Ctrl/Cmd + Enter to submit
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
        return;
      }

      // Tab navigation (handled by browser, but track focus)
      if (e.key === 'Tab') {
        setFocusedField(prev => e.shiftKey ? Math.max(0, prev - 1) : Math.min(5, prev + 1));
      }

      // Escape to close
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [title, description, priority, category, dueDate, subtasks, newSubtask]);

  // Auto-focus title on mount
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const isEditing = !!editingTodo;

  return (
    <div className="space-y-4">
      {/* Keyboard hints */}
      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex flex-wrap gap-3 pb-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <span><kbd className={`px-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>Alt+1-4</kbd> Priority</span>
        <span><kbd className={`px-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>Alt+P/W/H/F/L/S</kbd> Category</span>
        <span><kbd className={`px-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>Ctrl+Enter</kbd> Save</span>
        <span><kbd className={`px-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>Esc</kbd> Cancel</span>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Title *</label>
        <input
          ref={titleRef}
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-purple-500 transition-colors
            ${darkMode ? 'bg-gray-700 border-gray-600 placeholder-gray-400' : 'bg-white border-gray-200 placeholder-gray-400'}
          `}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          ref={descRef}
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Add some details..."
          rows={2}
          className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-purple-500 transition-colors resize-none
            ${darkMode ? 'bg-gray-700 border-gray-600 placeholder-gray-400' : 'bg-white border-gray-200 placeholder-gray-400'}
          `}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Priority <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>(Alt+1-4)</span></label>
          <select
            ref={priorityRef}
            value={priority}
            onChange={e => setPriority(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-purple-500
              ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}
            `}
          >
            {Object.entries(PRIORITIES).map(([key, val], i) => (
              <option key={key} value={key}>{val.emoji} {val.label} ({i + 1})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>(Alt+key)</span></label>
          <select
            ref={categoryRef}
            value={category}
            onChange={e => setCategory(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-purple-500
              ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}
            `}
          >
            {Object.entries(CATEGORIES).map(([key, val]) => (
              <option key={key} value={key}>{val.emoji} {val.label} ({key[0].toUpperCase()})</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Due Date</label>
        <input
          ref={dueDateRef}
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-purple-500
            ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}
          `}
        />
      </div>

      {/* Subtasks */}
      <div>
        <label className="block text-sm font-medium mb-1">Subtasks</label>
        <div className="flex gap-2 mb-2">
          <input
            ref={subtaskRef}
            type="text"
            value={newSubtask}
            onChange={e => setNewSubtask(e.target.value)}
            placeholder="Add a subtask... (Enter to add)"
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), e.stopPropagation(), addSubtask())}
            className={`flex-1 px-4 py-2 rounded-xl border-2 focus:outline-none focus:border-purple-500
              ${darkMode ? 'bg-gray-700 border-gray-600 placeholder-gray-400' : 'bg-white border-gray-200 placeholder-gray-400'}
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
              <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <span className="flex-1 text-sm">{s}</span>
                <button
                  type="button"
                  onClick={() => setSubtasks(subtasks.filter((_, j) => j !== i))}
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
            ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}
          `}
        >
          Cancel <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>(Esc)</span>
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
        >
          {isEditing ? 'Save Changes' : 'Add Task'} ✨ <span className="text-xs opacity-75">(Ctrl+↵)</span>
        </button>
      </div>
    </div>
  );
};

// ============================================
// MAIN APP COMPONENT
// ============================================
export default function TaskFlow() {
  // State
  const [todos, setTodos] = useState(SAMPLE_TODOS);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('created');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [selectedTodos, setSelectedTodos] = useState(new Set());
  const [showConfetti, setShowConfetti] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [streak, setStreak] = useState(3);
  const [quote] = useState(() => MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
  const [editingTodo, setEditingTodo] = useState(null);

  const searchRef = useRef(null);
  const containerRef = useRef(null);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setFilterStatus('all');
    setFilterPriority('all');
    setFilterCategory('all');
    setSortBy('created');
  }, []);

  // Close modal helper
  const closeModal = useCallback(() => {
    setShowAddModal(false);
    setEditingTodo(null);
  }, []);

  // Open edit modal
  const openEditModal = useCallback((todo) => {
    setEditingTodo(todo);
    setShowAddModal(true);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if modal is open (modal handles its own keys)
      if (showAddModal) return;
      
      // Don't trigger if typing in input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        if (e.key === 'Escape') {
          e.target.blur();
          resetFilters();
        }
        return;
      }

      switch (e.key) {
        case 'n':
          e.preventDefault();
          setEditingTodo(null);
          setShowAddModal(true);
          break;
        case 'f':
          e.preventDefault();
          searchRef.current?.focus();
          break;
        case 'd':
          e.preventDefault();
          setDarkMode(d => !d);
          break;
        case '?':
          e.preventDefault();
          setShowShortcuts(true);
          break;
        case 'Escape':
          setShowShortcuts(false);
          resetFilters();
          break;
        case '1':
          setFilterStatus('all');
          break;
        case '2':
          setFilterStatus('active');
          break;
        case '3':
          setFilterStatus('completed');
          break;
        case '4':
          setFilterStatus('overdue');
          break;
        case 'r':
          e.preventDefault();
          resetFilters();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAddModal, resetFilters]);

  // Todo operations
  const addTodo = useCallback((todo) => {
    setTodos(prev => [todo, ...prev]);
  }, []);

  const toggleTodo = useCallback((id) => {
    setTodos(prev => prev.map(t => {
      if (t.id === id) {
        const newCompleted = !t.completed;
        if (newCompleted) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 100);
        }
        return { ...t, completed: newCompleted };
      }
      return t;
    }));
  }, []);

  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
    setSelectedTodos(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const editTodo = useCallback((id, updates) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const toggleSubtask = useCallback((todoId, subtaskId) => {
    setTodos(prev => prev.map(t => {
      if (t.id === todoId) {
        const newSubtasks = t.subtasks.map(s =>
          s.id === subtaskId ? { ...s, completed: !s.completed } : s
        );
        return { ...t, subtasks: newSubtasks };
      }
      return t;
    }));
  }, []);

  const toggleSelect = useCallback((id) => {
    setSelectedTodos(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const bulkDelete = useCallback(() => {
    if (selectedTodos.size === 0) return;
    setTodos(prev => prev.filter(t => !selectedTodos.has(t.id)));
    setSelectedTodos(new Set());
  }, [selectedTodos]);

  const bulkComplete = useCallback(() => {
    if (selectedTodos.size === 0) return;
    setTodos(prev => prev.map(t =>
      selectedTodos.has(t.id) ? { ...t, completed: true } : t
    ));
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 100);
    setSelectedTodos(new Set());
  }, [selectedTodos]);

  // Filtering & Sorting
  const filteredTodos = useMemo(() => {
    let result = [...todos];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query)
      );
    }

    // Status filter
    switch (filterStatus) {
      case 'active':
        result = result.filter(t => !t.completed);
        break;
      case 'completed':
        result = result.filter(t => t.completed);
        break;
      case 'overdue':
        result = result.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date());
        break;
    }

    // Priority filter
    if (filterPriority !== 'all') {
      result = result.filter(t => t.priority === filterPriority);
    }

    // Category filter
    if (filterCategory !== 'all') {
      result = result.filter(t => t.category === filterCategory);
    }

    // Sorting
    switch (sortBy) {
      case 'created':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'priority':
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        break;
      case 'dueDate':
        result.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
        break;
      case 'alphabetical':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return result;
  }, [todos, searchQuery, filterStatus, filterPriority, filterCategory, sortBy]);

  return (
    <div ref={containerRef} className={`min-h-screen transition-colors duration-300 relative ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 text-gray-800'}`}>
      <Confetti active={showConfetti} />
      
      {/* Inline Modal for Adding/Editing Tasks */}
      {showAddModal && (
        <div className="absolute inset-0 bg-black/50 flex items-start justify-center z-50 p-4 pt-20 overflow-auto" onClick={closeModal}>
          <div
            className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-2xl p-6 max-w-lg w-full shadow-2xl`}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-4">{editingTodo ? '✏️ Edit Task' : '✨ New Task'}</h3>
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
      
      {/* Shortcuts Modal */}
      {showShortcuts && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowShortcuts(false)}>
          <div
            className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-2xl p-6 max-w-md w-full shadow-2xl`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">⌨️ Keyboard Shortcuts</h3>
              <button onClick={() => setShowShortcuts(false)} className="text-2xl hover:opacity-70">×</button>
            </div>
            <div className="space-y-3">
              {[
                { key: 'N', desc: 'New task' },
                { key: 'F', desc: 'Focus search' },
                { key: 'D', desc: 'Toggle dark mode' },
                { key: 'R', desc: 'Reset all filters' },
                { key: 'Esc', desc: 'Close modal / Reset filters' },
                { key: '?', desc: 'Show shortcuts' },
                { key: '1-4', desc: 'Filter by status' }
              ].map(s => (
                <div key={s.key} className="flex justify-between items-center">
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{s.desc}</span>
                  <kbd className={`px-3 py-1 rounded-lg font-mono text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    {s.key}
                  </kbd>
                </div>
              ))}
            </div>
            <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>In Add/Edit Dialog:</p>
              <div className="space-y-2">
                {[
                  { key: 'Alt+1-4', desc: 'Set priority' },
                  { key: 'Alt+P/W/H/F/L/S', desc: 'Set category' },
                  { key: 'Ctrl+Enter', desc: 'Save task' },
                ].map(s => (
                  <div key={s.key} className="flex justify-between items-center">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{s.desc}</span>
                    <kbd className={`px-2 py-0.5 rounded font-mono text-xs ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      {s.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                ✨ TaskFlow
              </h1>
              <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Your beautiful productivity companion
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFocusMode(!focusMode)}
                className={`px-4 py-2 rounded-xl transition-all ${focusMode
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
                }`}
                title="Focus Mode"
              >
                🎯 {focusMode ? 'Exit Focus' : 'Focus Mode'}
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-xl transition-all ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100 shadow-sm'}`}
                title="Toggle Dark Mode (D)"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <button
                onClick={() => setShowShortcuts(true)}
                className={`p-3 rounded-xl transition-all ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100 shadow-sm'}`}
                title="Keyboard Shortcuts (?)"
              >
                ⌨️
              </button>
            </div>
          </div>

          {/* Motivational Quote */}
          {!focusMode && (
            <div className={`${darkMode ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30' : 'bg-gradient-to-r from-purple-100 to-pink-100'} rounded-2xl p-4 mb-6`}>
              <p className="italic">"{quote.text}"</p>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>— {quote.author}</p>
            </div>
          )}
        </header>

        <div className={`grid gap-6 ${focusMode ? '' : 'lg:grid-cols-4'}`}>
          {/* Main Content */}
          <div className={focusMode ? '' : 'lg:col-span-3'}>
            {/* Search & Filters */}
            <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm rounded-2xl p-4 mb-6`}>
              <div className="flex flex-wrap gap-3">
                {/* Search */}
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                    <input
                      ref={searchRef}
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search tasks... (F)"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:border-purple-500 transition-colors
                        ${darkMode ? 'bg-gray-700 border-gray-600 placeholder-gray-400' : 'bg-white border-gray-200 placeholder-gray-400'}
                      `}
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className={`px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-purple-500
                    ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}
                  `}
                >
                  <option value="all">📋 All Tasks</option>
                  <option value="active">⏳ Active</option>
                  <option value="completed">✅ Completed</option>
                  <option value="overdue">⚠️ Overdue</option>
                </select>

                {/* Priority Filter */}
                <select
                  value={filterPriority}
                  onChange={e => setFilterPriority(e.target.value)}
                  className={`px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-purple-500
                    ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}
                  `}
                >
                  <option value="all">🎯 All Priorities</option>
                  {Object.entries(PRIORITIES).map(([key, val]) => (
                    <option key={key} value={key}>{val.emoji} {val.label}</option>
                  ))}
                </select>

                {/* Category Filter */}
                <select
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                  className={`px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-purple-500
                    ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}
                  `}
                >
                  <option value="all">📁 All Categories</option>
                  {Object.entries(CATEGORIES).map(([key, val]) => (
                    <option key={key} value={key}>{val.emoji} {val.label}</option>
                  ))}
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className={`px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-purple-500
                    ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}
                  `}
                >
                  <option value="created">🕐 Newest First</option>
                  <option value="priority">🔥 By Priority</option>
                  <option value="dueDate">📅 By Due Date</option>
                  <option value="alphabetical">🔤 Alphabetical</option>
                </select>

                {/* Reset Filters Button - show when any filter is active */}
                {(searchQuery || filterStatus !== 'all' || filterPriority !== 'all' || filterCategory !== 'all' || sortBy !== 'created') && (
                  <button
                    onClick={resetFilters}
                    className={`px-4 py-3 rounded-xl border-2 transition-colors flex items-center gap-2
                      ${darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-white border-gray-200 hover:bg-gray-100'}
                    `}
                    title="Reset all filters (R or Esc)"
                  >
                    🔄 Reset
                  </button>
                )}
              </div>

              {/* Bulk Actions */}
              {selectedTodos.size > 0 && (
                <div className={`flex items-center gap-3 mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <span className="text-sm font-medium">{selectedTodos.size} selected</span>
                  <button
                    onClick={bulkComplete}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm"
                  >
                    ✅ Complete All
                  </button>
                  <button
                    onClick={bulkDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                  >
                    🗑️ Delete All
                  </button>
                  <button
                    onClick={() => setSelectedTodos(new Set())}
                    className={`px-4 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    Clear Selection
                  </button>
                </div>
              )}
            </div>

            {/* Add Button */}
            <button
              onClick={() => { setEditingTodo(null); setShowAddModal(true); }}
              className="w-full mb-6 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg"
            >
              <span className="text-xl">+</span> Add New Task (N)
            </button>

            {/* Todo List */}
            <div className="space-y-3">
              {filteredTodos.length === 0 ? (
                <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm rounded-2xl p-12 text-center`}>
                  <div className="text-6xl mb-4">
                    {searchQuery ? '🔍' : todos.length === 0 ? '🎉' : '✨'}
                  </div>
                  <h3 className="text-xl font-medium mb-2">
                    {searchQuery ? 'No tasks found' : todos.length === 0 ? 'All caught up!' : 'No tasks match your filters'}
                  </h3>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                    {searchQuery ? 'Try a different search term' : todos.length === 0 ? 'Add your first task to get started' : 'Try adjusting your filters'}
                  </p>
                </div>
              ) : (
                filteredTodos.map(todo => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                    onEdit={editTodo}
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

          {/* Sidebar - Stats */}
          {!focusMode && (
            <div className="lg:col-span-1">
              <StatsPanel todos={todos} streak={streak} darkMode={darkMode} />
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className={`mt-12 text-center text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          <p>Made with 💜 • Press <kbd className={`px-2 py-0.5 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>?</kbd> for shortcuts</p>
        </footer>
      </div>
    </div>
  );
}

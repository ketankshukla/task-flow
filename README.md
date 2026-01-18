# ✨ TaskFlow

A beautiful, modern task management application built with Next.js 14, TypeScript, and TailwindCSS. Your productivity companion with powerful features and an intuitive interface.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### Core Functionality

- ✅ **Complete Task Management** - Create, edit, delete, and complete tasks
- 📋 **Subtasks** - Break down tasks into smaller, manageable steps with progress tracking
- 🎯 **Priority Levels** - Low, Medium, High, and Urgent priorities with visual indicators
- 📁 **Categories** - Organize tasks by Personal, Work, Health, Finance, Learning, or Social
- 📅 **Due Dates** - Set deadlines with overdue detection and today's tasks highlighting
- 🔍 **Advanced Search** - Real-time search across task titles and descriptions
- 🎨 **Smart Filtering** - Filter by status, priority, category, and more
- 📊 **Statistics Dashboard** - Track completion rate, streaks, and task distribution

### User Experience

- 🌙 **Dark Mode** - Beautiful dark theme with smooth transitions
- ⌨️ **Keyboard Shortcuts** - Navigate and manage tasks without touching the mouse
- 🎯 **Focus Mode** - Distraction-free view for maximum productivity
- 🎉 **Confetti Animations** - Celebrate task completions
- 💬 **Motivational Quotes** - Daily inspiration to keep you motivated
- 🔥 **Streak Tracking** - Build habits with consecutive day tracking
- ✨ **Bulk Operations** - Select and manage multiple tasks at once

### Technical Features

- 💾 **Supabase Database** - Cloud-based PostgreSQL database with real-time sync
- ⚡ **Real-time Updates** - See changes instantly across all devices
- 🔔 **Toast Notifications** - Clear feedback for all actions (no loading spinners)
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🎨 **Modern UI** - Clean, gradient-based design with smooth animations
- ♿ **Accessible** - Keyboard navigation and semantic HTML
- 🚀 **React Compiler** - Automatic performance optimization

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/task-flow.git
cd task-flow
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

See `SUPABASE_SETUP.md` for complete database setup instructions.

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm run start
```

## ⌨️ Keyboard Shortcuts

### Global Shortcuts

- `N` - Create new task
- `F` - Focus search bar
- `D` - Toggle dark mode
- `R` - Reset all filters
- `?` - Show keyboard shortcuts
- `Esc` - Close modals / Reset filters
- `1-4` - Quick filter by status (All, Active, Completed, Overdue)

### In Add/Edit Dialog

- `Alt + 1-4` - Set priority (Low, Medium, High, Urgent)
- `Alt + P/W/H/F/L/S` - Set category (Personal, Work, Health, Finance, Learning, Social)
- `Ctrl/Cmd + Enter` - Save task
- `Esc` - Cancel and close dialog

## 📁 Project Structure

```
task-flow/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page (renders TaskFlow)
│   ├── globals.css         # Global styles and Tailwind
│   ├── favicon.svg         # Custom favicon
│   └── icon.svg            # App icon
├── components/
│   ├── TaskFlow.tsx        # Main application component
│   ├── TodoItem.tsx        # Individual task card
│   ├── TodoForm.tsx        # Add/Edit task form
│   ├── StatsPanel.tsx      # Statistics sidebar
│   ├── Confetti.tsx        # Celebration animation
│   ├── ShortcutsModal.tsx  # Keyboard shortcuts help
│   ├── Toast.tsx           # Toast notification component
│   ├── DeleteConfirmationModal.tsx  # Delete confirmation
│   └── IncompleteSubtasksModal.tsx  # Subtask warning
├── lib/
│   ├── types.ts            # TypeScript type definitions
│   ├── constants.ts        # App constants (priorities, categories, quotes)
│   └── supabase.ts         # Supabase client configuration
├── hooks/
│   ├── useSupabaseTodos.ts # Supabase CRUD operations with real-time
│   └── useKeyboardShortcuts.ts  # Keyboard navigation
├── public/                 # Static assets
├── .env.local              # Environment variables (Supabase keys)
├── SUPABASE_SETUP.md       # Database schema and setup
└── README.md               # This file
```

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router) with React Compiler
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime subscriptions
- **State Management**: React Hooks + Custom Hooks
- **Deployment**: Vercel

## 🔮 Current Status

### ✅ Completed Features

- [x] Next.js 14 setup with TypeScript and React Compiler
- [x] Component architecture with separation of concerns
- [x] Supabase PostgreSQL database integration
- [x] Real-time synchronization across devices
- [x] Toast notifications for all CRUD operations
- [x] All core features implemented
- [x] Keyboard shortcuts
- [x] Dark mode
- [x] Statistics dashboard
- [x] Subtask management with warnings
- [x] Bulk operations
- [x] Advanced filtering and sorting

### 🚀 Future Enhancements

- [ ] User authentication with Supabase Auth
- [ ] User-specific data isolation with RLS
- [ ] Shared task lists and collaboration
- [ ] Task comments and attachments
- [ ] Email notifications for due tasks
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [TailwindCSS](https://tailwindcss.com/)
- Icons from Unicode Emoji
- Deployed on [Vercel](https://vercel.com/)

## 📞 Support

For support, please open an issue in the GitHub repository.

---

Made with 💜 by [Your Name]

# 🚀 Quick Supabase Setup (Without Authentication)

## Run This SQL in Supabase SQL Editor

This simplified schema allows the app to work without authentication. You can add auth later.

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create todos table
CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID DEFAULT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  completed BOOLEAN DEFAULT FALSE,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  category TEXT NOT NULL CHECK (category IN ('personal', 'work', 'health', 'finance', 'learning', 'social')),
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subtasks table
CREATE TABLE IF NOT EXISTS subtasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  todo_id UUID REFERENCES todos(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
CREATE INDEX IF NOT EXISTS idx_todos_due_date ON todos(due_date);
CREATE INDEX IF NOT EXISTS idx_subtasks_todo_id ON subtasks(todo_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to todos table
DROP TRIGGER IF EXISTS update_todos_updated_at ON todos;
CREATE TRIGGER update_todos_updated_at
  BEFORE UPDATE ON todos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for development (allows all operations)
-- WARNING: These are for development only! Add proper auth before production!

DROP POLICY IF EXISTS "Allow all operations on todos" ON todos;
CREATE POLICY "Allow all operations on todos"
  ON todos
  FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on subtasks" ON subtasks;
CREATE POLICY "Allow all operations on subtasks"
  ON subtasks
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

## After Running the SQL

1. ✅ Tables created: `todos` and `subtasks`
2. ✅ RLS enabled but with permissive policies (allows all operations)
3. ✅ Indexes created for performance
4. ✅ Triggers set up for auto-updating timestamps

## Test Your Setup

1. Go to Supabase Dashboard → Table Editor
2. You should see `todos` and `subtasks` tables
3. Try manually inserting a test row to verify it works

## Your App Should Now Work!

- Tasks will be saved to Supabase database
- Real-time sync enabled
- No authentication required (for now)

## Important for Production

Before deploying to production with real users, you should:

1. Implement authentication (Supabase Auth)
2. Update RLS policies to restrict access by user
3. Remove the permissive "Allow all" policies

For now, this setup lets you develop and test without auth complications.

# 🚀 Supabase Migration Guide - Phase 2

## Overview

This guide will help you migrate TaskFlow from localStorage to Supabase PostgreSQL database with real-time synchronization.

---

## Step 1: Create Supabase Project

### 1.1 Sign Up / Log In

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in with GitHub (recommended) or email
3. Click "New Project"

### 1.2 Project Configuration

- **Organization**: Create new or select existing
- **Project Name**: `taskflow` or `task-flow-db`
- **Database Password**: Generate a strong password (save it securely!)
- **Region**: Choose closest to your users
- **Pricing Plan**: Free tier is sufficient for development

### 1.3 Wait for Setup

- Project creation takes 1-2 minutes
- You'll see a dashboard when ready

---

## Step 2: Database Schema

### 2.1 SQL Schema

Run this SQL in the Supabase SQL Editor (Database → SQL Editor → New Query):

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create todos table
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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
CREATE TABLE subtasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  todo_id UUID REFERENCES todos(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_completed ON todos(completed);
CREATE INDEX idx_todos_due_date ON todos(due_date);
CREATE INDEX idx_subtasks_todo_id ON subtasks(todo_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to todos table
CREATE TRIGGER update_todos_updated_at
  BEFORE UPDATE ON todos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for todos (allow users to manage their own todos)
CREATE POLICY "Users can view their own todos"
  ON todos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own todos"
  ON todos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos"
  ON todos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own todos"
  ON todos FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for subtasks (through parent todo)
CREATE POLICY "Users can view subtasks of their todos"
  ON subtasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM todos
      WHERE todos.id = subtasks.todo_id
      AND todos.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert subtasks to their todos"
  ON subtasks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM todos
      WHERE todos.id = subtasks.todo_id
      AND todos.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update subtasks of their todos"
  ON subtasks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM todos
      WHERE todos.id = subtasks.todo_id
      AND todos.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete subtasks of their todos"
  ON subtasks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM todos
      WHERE todos.id = subtasks.todo_id
      AND todos.user_id = auth.uid()
    )
  );
```

### 2.2 Verify Schema

1. Go to Database → Tables
2. You should see `todos` and `subtasks` tables
3. Check that RLS is enabled (green shield icon)

---

## Step 3: Get API Credentials

### 3.1 Find Your Credentials

1. Go to Project Settings (gear icon)
2. Click "API" in the sidebar
3. Copy these values:

```
Project URL: https://[your-project-ref].supabase.co
anon/public key: eyJhbGc...
service_role key: eyJhbGc... (keep this SECRET!)
```

### 3.2 Create Environment File

Create `.env.local` in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: For server-side operations
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Important**:

- Never commit `.env.local` to git (it's already in `.gitignore`)
- Use `NEXT_PUBLIC_` prefix for client-accessible variables
- Keep `SERVICE_ROLE_KEY` private (server-side only)

---

## Step 4: Enable Authentication (Optional but Recommended)

### 4.1 Email Authentication

1. Go to Authentication → Providers
2. Enable "Email" provider
3. Configure email templates (optional)

### 4.2 OAuth Providers (Optional)

- Enable GitHub, Google, etc. for social login
- Configure OAuth apps in respective platforms
- Add redirect URLs: `https://[your-project-ref].supabase.co/auth/v1/callback`

### 4.3 Disable Email Confirmation (Development Only)

1. Go to Authentication → Settings
2. Disable "Enable email confirmations"
3. **Re-enable for production!**

---

## Step 5: Configure Vercel Environment Variables

### 5.1 Add to Vercel

1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add these variables:
   - `ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (if using server-side operations)

### 5.2 Redeploy

- Vercel will automatically redeploy with new environment variables
- Or manually trigger: Deployments → [...] → Redeploy

---

## Step 6: Data Migration

### 6.1 Export LocalStorage Data

The app includes a migration utility. To export your current data:

1. Open your TaskFlow app (with localStorage data)
2. Open browser console (F12)
3. Run:

```javascript
// Export todos
const todos = JSON.parse(localStorage.getItem("taskflow_todos") || "[]");
console.log(JSON.stringify(todos, null, 2));
// Copy the output
```

### 6.2 Import to Supabase

Option A: **Use the built-in migration tool** (recommended)

- The app will detect localStorage data
- Click "Migrate to Cloud" button
- Confirm migration
- Data will be uploaded to Supabase

Option B: **Manual SQL insert**

- Use the exported JSON
- Convert to SQL INSERT statements
- Run in Supabase SQL Editor

---

## Step 7: Testing

### 7.1 Test Checklist

- [ ] Create new todo → Check Supabase dashboard
- [ ] Edit todo → Verify changes in database
- [ ] Delete todo → Confirm deletion
- [ ] Add subtasks → Check subtasks table
- [ ] Toggle completion → Verify boolean update
- [ ] Test real-time sync (open app in 2 tabs)

### 7.2 Real-Time Verification

1. Open app in two browser tabs
2. Create a todo in tab 1
3. It should appear in tab 2 instantly
4. If not, check Supabase Realtime settings

---

## Step 8: Security Considerations

### 8.1 Row Level Security (RLS)

- ✅ Already enabled in schema
- ✅ Users can only access their own data
- ✅ Prevents unauthorized access

### 8.2 API Key Security

- ✅ `anon` key is safe for client-side (limited permissions)
- ⚠️ Never expose `service_role` key in client code
- ✅ Use environment variables

### 8.3 Production Checklist

- [ ] Enable email confirmation
- [ ] Set up password requirements
- [ ] Configure rate limiting
- [ ] Enable MFA (Multi-Factor Authentication)
- [ ] Set up database backups
- [ ] Monitor usage and logs

---

## Step 9: Monitoring & Maintenance

### 9.1 Supabase Dashboard

- **Database**: View tables, run queries
- **Authentication**: Manage users
- **Storage**: File uploads (future feature)
- **Logs**: Debug issues
- **Reports**: Usage statistics

### 9.2 Performance Optimization

- Indexes already created for common queries
- Monitor slow queries in Logs
- Consider adding more indexes if needed

---

## Troubleshooting

### Issue: "Failed to fetch"

- Check internet connection
- Verify Supabase URL and API key
- Check browser console for CORS errors

### Issue: "Row Level Security policy violation"

- User not authenticated
- Check auth.uid() matches user_id
- Verify RLS policies are correct

### Issue: Real-time not working

- Enable Realtime in Supabase dashboard
- Check Realtime settings for tables
- Verify subscription in code

### Issue: Data not persisting

- Check network tab for failed requests
- Verify environment variables loaded
- Check Supabase logs for errors

---

## Database Schema Diagram

```
┌─────────────────────────────────────┐
│            todos                     │
├─────────────────────────────────────┤
│ id (UUID, PK)                       │
│ user_id (UUID, FK → auth.users)    │
│ title (TEXT, NOT NULL)              │
│ description (TEXT)                   │
│ completed (BOOLEAN)                  │
│ priority (TEXT)                      │
│ category (TEXT)                      │
│ due_date (DATE)                      │
│ created_at (TIMESTAMP)               │
│ updated_at (TIMESTAMP)               │
└─────────────────────────────────────┘
                ↓ (one-to-many)
┌─────────────────────────────────────┐
│           subtasks                   │
├─────────────────────────────────────┤
│ id (UUID, PK)                       │
│ todo_id (UUID, FK → todos)          │
│ title (TEXT, NOT NULL)              │
│ completed (BOOLEAN)                  │
│ position (INTEGER)                   │
│ created_at (TIMESTAMP)               │
└─────────────────────────────────────┘
```

---

## Next Steps

After completing this setup:

1. ✅ Database schema created
2. ✅ Environment variables configured
3. ✅ RLS policies enabled
4. ⏳ Implement Supabase client in app
5. ⏳ Create API routes
6. ⏳ Add authentication UI
7. ⏳ Test migration
8. ⏳ Deploy to production

---

## Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Next.js + Supabase**: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
- **RLS Guide**: https://supabase.com/docs/guides/auth/row-level-security
- **Realtime**: https://supabase.com/docs/guides/realtime

---

**Ready to proceed with code implementation!** 🚀

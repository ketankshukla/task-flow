# Professional Project Refactoring Prompt Template

## Project Context

I have a [COMPONENT_NAME] file/application in this folder that needs to be refactored into a professional Next.js application.

## Requirements

### Phase 1: Next.js Refactoring with Local Storage

- Refactor the existing code into a **Next.js 14** application with **App Router**
- Use **TypeScript** for type safety
- Use **TailwindCSS** for styling
- Implement proper component architecture with separation of concerns
- Keep all data persistence in **localStorage** for this phase
- Preserve all existing features and functionality
- Create custom hooks for state management and business logic
- Follow Next.js best practices and modern React patterns

### Phase 2: Supabase Database Migration (Future)

- Migrate from localStorage to **Supabase** PostgreSQL database
- Create proper database schema with tables and relationships
- Implement Row Level Security (RLS) policies
- Add real-time subscriptions for live updates
- Create API routes for secure database operations
- Provide data migration script from localStorage to Supabase
- (Optional) Add user authentication with Supabase Auth

## Project Structure Requirements

```
[project-name]/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── api/ (for Phase 2)
├── components/
│   ├── [MainComponent].tsx
│   ├── [SubComponents].tsx
│   └── ui/
├── lib/
│   ├── constants.ts
│   ├── storage.ts
│   ├── types.ts
│   └── supabase.ts (Phase 2)
├── hooks/
│   ├── use[Feature].ts
│   └── useLocalStorage.ts
├── public/
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── .env.local
```

## Deployment Workflow

### Pre-Deployment Checklist

1. **Build Verification**: Create and test a production build locally

   - Run `npm run build` to ensure no build errors
   - Run `npm run start` to verify production build works
   - Test all features in production mode

2. **GitHub Repository Setup**

   - Use **GitHub CLI (`gh`)** to create the remote repository
   - Repository name must match the root folder name: `[project-folder-name]`
   - Initialize git, commit all files, and push to GitHub

3. **Vercel Deployment**
   - I will manually connect the GitHub repository to Vercel
   - After initial connection, all subsequent pushes to GitHub will auto-deploy to Vercel
   - You should push code to GitHub after each significant milestone

### Git Commands Pattern

```bash
# Initialize repository
git init
git add .
git commit -m "Initial commit: [description]"

# Create GitHub repo using gh CLI (repo name = folder name)
gh repo create [folder-name] --public --source=. --remote=origin --push

# Subsequent updates
git add .
git commit -m "[meaningful commit message]"
git push origin main
```

## Technology Stack

### Core Technologies

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: React Hooks + Context API (if needed)
- **Storage (Phase 1)**: localStorage
- **Database (Phase 2)**: Supabase (PostgreSQL)
- **Authentication (Phase 2)**: Supabase Auth (optional)
- **Deployment**: Vercel (via GitHub integration)

### Development Tools

- **Package Manager**: npm
- **Version Control**: Git + GitHub
- **GitHub CLI**: `gh` for repository creation
- **Linting**: ESLint (Next.js default)
- **Formatting**: Prettier (optional)

## Development Process

### Step 1: Analysis & Planning

1. Analyze the existing code structure
2. Identify all features and functionality
3. Create a component breakdown
4. Design the new architecture
5. Present recommendations (if requested)

### Step 2: Next.js Setup

1. Initialize Next.js 14 project with TypeScript
2. Configure TailwindCSS
3. Set up project structure (folders and files)
4. Configure necessary dependencies

### Step 3: Component Refactoring

1. Break down monolithic components into smaller, reusable pieces
2. Create proper TypeScript interfaces and types
3. Implement custom hooks for business logic
4. Add localStorage persistence layer
5. Preserve all existing features

### Step 4: Testing & Validation

1. Test all features work identically to original
2. Verify dark mode, keyboard shortcuts, and all interactions
3. Check responsive design
4. Run production build locally
5. Fix any build errors or warnings
6. **Fix hydration errors** - Ensure no SSR/client mismatches:
   - Avoid `Math.random()` or `Date.now()` during initial render
   - Use `useEffect` for client-only random values
   - Ensure consistent server/client rendering
   - Check for browser-only APIs (window, localStorage) wrapped in checks

### Step 5: GitHub & Deployment

1. Create `.gitignore` with proper exclusions
2. Initialize git repository
3. Create GitHub repository using `gh` CLI (name = folder name)
4. Push initial commit
5. Verify build on local machine before pushing

### Step 6: Documentation

1. Update README.md with:
   - Project description
   - Features list
   - Installation instructions
   - Development commands
   - Deployment instructions
   - Environment variables (for Phase 2)

## Quality Standards

### Code Quality

- ✅ TypeScript strict mode enabled
- ✅ No `any` types (use proper typing)
- ✅ Proper error handling
- ✅ Clean, readable code with meaningful variable names
- ✅ Comments only where necessary (self-documenting code preferred)
- ✅ Consistent code style

### Performance

- ✅ Use React.memo for expensive components
- ✅ Implement useMemo and useCallback where appropriate
- ✅ Lazy load components when beneficial
- ✅ Optimize images (use Next.js Image component)
- ✅ Minimize bundle size

### Accessibility

- ✅ Semantic HTML
- ✅ Keyboard navigation support
- ✅ ARIA labels where needed
- ✅ Focus management
- ✅ Color contrast compliance

### User Experience

- ✅ Loading states
- ✅ Error states
- ✅ Empty states
- ✅ Smooth transitions and animations
- ✅ Responsive design (mobile, tablet, desktop)

## Important Notes

### Build Before Push

- **CRITICAL**: Always run `npm run build` and verify it succeeds before pushing to GitHub
- Test the production build with `npm run start`
- Fix all TypeScript errors, ESLint warnings, and build issues
- Ensure the application works correctly in production mode

### Repository Naming

- GitHub repository name **must** match the root folder name
- Use kebab-case for folder/repo names (e.g., `task-flow`, `my-app`)
- Keep names descriptive and professional

### Vercel Integration

- Initial setup: I will manually connect GitHub repo to Vercel
- Automatic deployments: Every push to `main` branch auto-deploys
- Preview deployments: Pull requests get preview URLs
- Environment variables: Set in Vercel dashboard (for Phase 2)

### Phase Separation

- **Phase 1**: Complete Next.js refactoring with localStorage (current request)
- **Phase 2**: Supabase migration (future request)
- Do not mix phases - complete Phase 1 fully before Phase 2

## Success Criteria

### Phase 1 Completion Checklist

- [ ] Next.js 14 project initialized with TypeScript
- [ ] TailwindCSS configured and working
- [ ] All components refactored and properly structured
- [ ] All original features preserved and working
- [ ] localStorage persistence implemented
- [ ] Custom hooks created for state management
- [ ] TypeScript types defined for all data structures
- [ ] Production build succeeds with no errors
- [ ] Application tested and working locally
- [ ] GitHub repository created (name matches folder)
- [ ] Code pushed to GitHub
- [ ] README.md updated with documentation

### Phase 2 Completion Checklist (Future)

- [ ] Supabase project created
- [ ] Database schema designed and implemented
- [ ] Row Level Security policies configured
- [ ] API routes created for CRUD operations
- [ ] Data migration script provided
- [ ] Real-time subscriptions implemented
- [ ] Authentication added (if requested)
- [ ] Environment variables documented
- [ ] Production build succeeds
- [ ] Deployed to Vercel with Supabase integration

---

## Example Usage

Replace the placeholders with your specific project details:

```
I have a [ToDo.jsx] file in this folder that needs to be refactored into a professional Next.js application.

Please follow the standard refactoring workflow:
1. Analyze the existing code
2. Refactor to Next.js 14 with TypeScript and TailwindCSS
3. Keep localStorage for Phase 1
4. Create proper component structure
5. Build and test locally
6. Create GitHub repo named [task-flow] using gh CLI
7. Push to GitHub

The project will be deployed to Vercel (I'll connect it manually after you push).
```

---

## Template Version

**Version**: 1.0  
**Last Updated**: January 2026  
**Default Framework**: Next.js 14 (App Router)  
**Default Language**: TypeScript

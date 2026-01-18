# Next.js 14 Automated Project Setup Guide

## Quick Start Command

Use this single command to create a Next.js 14 project with all recommended settings:

```bash
npx create-next-app@latest [project-name] --typescript --tailwind --app --no-src-dir --import-alias "@/*" --turbopack --use-npm --experimental-react-compiler
```

## Command Breakdown

### Flags Explained

| Flag                            | Purpose                 | Default | Our Choice                  |
| ------------------------------- | ----------------------- | ------- | --------------------------- |
| `--typescript`                  | Enable TypeScript       | No      | **Yes** - Type safety       |
| `--tailwind`                    | Install TailwindCSS     | No      | **Yes** - Styling           |
| `--app`                         | Use App Router          | Yes     | **Yes** - Modern routing    |
| `--no-src-dir`                  | Don't use `src/` folder | No      | **Yes** - Cleaner structure |
| `--import-alias "@/*"`          | Set import alias        | `@/*`   | **Yes** - Clean imports     |
| `--turbopack`                   | Use Turbopack (faster)  | No      | **Yes** - Speed             |
| `--use-npm`                     | Use npm (not pnpm/yarn) | Asks    | **Yes** - Consistency       |
| `--experimental-react-compiler` | Enable React Compiler   | No      | **Yes** - Performance       |

## What Gets Installed

### Automatic Dependencies

```json
{
  "dependencies": {
    "next": "^14.x.x",
    "react": "^18.x.x",
    "react-dom": "^18.x.x"
  },
  "devDependencies": {
    "@types/node": "^20.x.x",
    "@types/react": "^18.x.x",
    "@types/react-dom": "^18.x.x",
    "autoprefixer": "^10.x.x",
    "postcss": "^8.x.x",
    "tailwindcss": "^3.x.x",
    "typescript": "^5.x.x",
    "eslint": "^8.x.x",
    "eslint-config-next": "^14.x.x"
  }
}
```

### Additional Required Dependencies

After project creation, install Supabase:

```bash
cd [project-name]
npm install @supabase/supabase-js
```

## Project Structure Created

```
[project-name]/
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
├── .eslintrc.json
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Next Steps After Creation

### 1. Navigate to Project

```bash
cd [project-name]
```

### 2. Install Supabase

```bash
npm install @supabase/supabase-js
```

### 3. Create Environment File

```bash
# Create .env.local file
echo "NEXT_PUBLIC_SUPABASE_URL=your_supabase_url" > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key" >> .env.local
```

### 4. Create Additional Folders

```bash
# Windows PowerShell
New-Item -ItemType Directory -Path components, lib, hooks

# macOS/Linux
mkdir components lib hooks
```

### 5. Start Development Server

```bash
npm run dev
```

## React Compiler Benefits

The `--experimental-react-compiler` flag enables automatic optimization:

- **Automatic Memoization**: No need for `useMemo`/`useCallback` in most cases
- **Better Performance**: Smarter re-renders
- **Less Boilerplate**: Compiler handles optimization
- **Future-Proof**: Aligns with React's direction

### Important Notes

- Still experimental but stable for production
- May show warnings in console (safe to ignore)
- Provides significant performance improvements
- Reduces need for manual optimization

## Configuration Files

### next.config.js (Auto-Generated)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
};

module.exports = nextConfig;
```

### tailwind.config.ts (Auto-Generated)

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
```

### tsconfig.json (Auto-Generated)

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Troubleshooting

### Issue: React Compiler Warnings

**Symptom**: Console shows React Compiler warnings

**Solution**: These are informational and safe to ignore during development. They help identify optimization opportunities.

### Issue: Import Alias Not Working

**Symptom**: `@/` imports show errors

**Solution**: Restart TypeScript server in your IDE (VS Code: Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server")

### Issue: Turbopack Errors

**Symptom**: Build fails with Turbopack

**Solution**: Turbopack is still in beta. If issues persist, remove `--turbopack` flag and use standard webpack.

## Comparison: Manual vs Automated Setup

### Manual Setup (Old Way)

```bash
npx create-next-app@latest
# Then answer 7 interactive questions:
# - TypeScript? Yes
# - ESLint? Yes
# - Tailwind? Yes
# - src/ directory? No
# - App Router? Yes
# - Import alias? Yes (@/*)
# - React Compiler? No (default)
```

### Automated Setup (New Way)

```bash
npx create-next-app@latest [project-name] --typescript --tailwind --app --no-src-dir --import-alias "@/*" --turbopack --use-npm --experimental-react-compiler
# No questions asked - instant setup!
```

## Best Practices

1. **Always use the automated command** - Ensures consistency
2. **Enable React Compiler** - Better performance out of the box
3. **Use Turbopack** - Faster development builds
4. **Keep import alias as `@/*`** - Industry standard
5. **Use npm** - Consistent with most tutorials and documentation

## Version Information

- **Next.js**: 14.x (latest stable)
- **React**: 18.x (with Compiler support)
- **TypeScript**: 5.x
- **TailwindCSS**: 3.x
- **Node.js**: 18.x or higher recommended

---

**Last Updated**: January 2026  
**Template Version**: 2.0

# Agent Instructions: Weather in Calendar

This document provides essential guidelines and commands for AI agents working in this repository. Follow these conventions to ensure consistency and quality.

## 🚀 Development Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Starts the development server at http://localhost:3000 |
| `npm run build` | Builds the application for production |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint for code quality checks |

*Note: There are currently no automated test suites configured. If you add tests, use Vitest as the preferred framework.*

## 📂 Project Structure

- `src/app/[locale]/`: Next.js 15 App Router pages with internationalized routing.
- `src/components/ui/`: Reusable UI components powered by shadcn/ui.
- `src/components/`: Feature-specific components (e.g., `hero-search.tsx`).
- `src/lib/`: Core logic, utilities, and API client (e.g., `qweather.ts`).
- `src/messages/`: i18n translation files (`en.json`, `zh.json`).
- `src/i18n.ts`: Internationalization configuration.

## 🎨 Code Style & Conventions

### 1. Naming Conventions
- **Files/Folders**: Always use `kebab-case.tsx` (e.g., `hero-search.tsx`, `language-switcher.tsx`).
- **Components**: Use `PascalCase` for React component names (e.g., `export function HeroSearch`).
- **Functions/Variables**: Use `camelCase` for utilities and standard variables.
- **Interfaces/Types**: Use `PascalCase`. Prefer `interface` for object shapes and API responses.

### 2. Imports & Path Aliases
- Use the `@/` alias to refer to the `src/` directory.
- **Import Order**:
    1. React and React hooks
    2. Next.js components and hooks
    3. UI components (`@/components/ui/...`)
    4. Feature components (`@/components/...`)
    5. Icons (`lucide-react`)
    6. Utilities and Types (`@/lib/...`)
    7. i18n hooks (`next-intl`)

### 3. Styling
- **Tailwind CSS v4**: Use utility classes exclusively.
- **shadcn/ui**: Use provided components in `src/components/ui/`.
- **Dynamic Classes**: Always use the `cn()` utility from `@/lib/utils` for conditional class merging.

### 4. Internationalization (i18n)
- Use `next-intl` for all user-facing strings.
- Add new strings to `src/messages/en.json` and `src/messages/zh.json`.
- Use the `useTranslations` hook:
  ```tsx
  const t = useTranslations('Namespace');
  return <div>{t('key')}</div>;
  ```

### 5. TypeScript
- Strict mode is enabled. Avoid `any` at all costs.
- Define explicit types for component props.
- Use **Zod** for data validation, especially for API responses and form inputs.

### 6. Error Handling
- Use `try...catch` blocks in API routes and complex utility functions.
- API routes should return meaningful HTTP status codes (400, 404, 500) with JSON error messages.
- Client-side errors should be handled gracefully, often using toast notifications or inline error states.

### 7. Next.js 15 & React 19 Patterns
- **Server Components**: Prefer Server Components by default. Use `"use client"` only when necessary (interactivity, hooks).
- **Async Params**: In Next.js 15, `params` and `searchParams` in `layout.tsx` and `page.tsx` are Promises. Always `await` them.
  ```tsx
  export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    // ...
  }
  ```
- **Fetching**: Use standard `fetch` with Next.js cache options or Server Actions for mutations.

## 🧪 Testing Guidance

*Current Status: No tests implemented.*

### Adding New Tests
If you implement tests, follow these guidelines:
- **Framework**: Use **Vitest** for unit and integration tests.
- **Location**: Place test files next to the source code (e.g., `src/lib/utils.test.ts`).
- **React Testing**: Use **React Testing Library** for component tests.
- **Naming**: Use `.test.ts` or `.spec.ts` (or `.tsx`).
- **Running Tests**: Add a `test` script to `package.json` if it doesn't exist.
  - `npm run test`: Run all tests.
  - `npm run test <filename>`: Run a specific test file.

## 📡 API Integration (QWeather)

The project currently uses a mock or specific implementation for weather data in `src/lib/qweather.ts`.
- **API Key**: Managed via environment variables.
- **Data Shape**: Ensure any new weather providers adhere to the `WeatherEvent` interface.
- **Caching**: API results should be cached appropriately to avoid rate limits.

## 🛠️ Specialized Subagents

- **Frontend UI/UX**: Delegate visual/styling changes to `frontend-ui-ux-engineer`.
- **Deep Research**: Use `librarian` for external library docs and `explore` for codebase patterns.
- **Architecture**: Consult `oracle` for complex tradeoffs or multi-system designs.

## ⚠️ Important Rules
- **DO NOT** modify visual components directly if you are not a frontend specialist.
- **DO NOT** add new dependencies without checking for existing ones first.
- **ALWAYS** run `npm run lint` before claiming a task is complete.
- **NEVER** use `as any` or suppress type errors.

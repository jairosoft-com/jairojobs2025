# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
npm run dev                # Start dev server with Turbopack on http://localhost:3000

# Testing
npm test                   # Run all unit tests with Vitest
npm test src/stores       # Run tests for specific directory
npm test JobCard          # Run tests matching pattern
npm run test:e2e          # Run all E2E tests with Playwright
npm run test:e2e:ui       # Open Playwright UI mode
npx playwright test --project=chromium tests/e2e/homepage.spec.ts  # Run specific E2E test

# Code Quality
npm run lint              # Run ESLint
npm run type-check        # Run TypeScript compiler check
npm run format            # Format code with Prettier

# Build & Production
npm run build             # Build for production
npm start                 # Start production server
```

## Architecture Overview

This is a **JairoJobs** job board application built with:
- **Next.js 15** with App Router and Turbopack
- **TypeScript** with strict mode enabled
- **Zustand** for global state management
- **shadcn/ui** components with Radix UI primitives
- **TDD approach** with Vitest (unit) and Playwright (E2E)

### Key Architectural Decisions

1. **Server/Client Component Separation**: Next.js 15 defaults to Server Components. Components that need interactivity, hooks, or browser APIs must have `'use client'` directive.

2. **Mock Data System**: All data is currently mocked in `/src/lib/db/mockData.ts`. The system is designed to easily swap to real APIs by replacing the data access functions.

3. **State Management Structure**:
   ```
   /src/stores/
      useAuthStore.ts        # Authentication state
      useApplicationStore.ts # Job applications
      useSavedJobsStore.ts   # Saved/bookmarked jobs
      useJobFiltersStore.ts  # Search filters (not persisted)
   ```

4. **Component Organization**:
   ```
   /src/components/
      ui/          # shadcn/ui base components (don't modify directly)
      features/    # Business logic components (JobCard, SearchBar, etc.)
      layout/      # App layout components (Header, Footer, MobileNav)
   ```

5. **Testing Strategy**:
   - Write tests FIRST (TDD)
   - Unit tests alongside components (`*.test.tsx`)
   - E2E tests in `/tests/e2e/` with page objects pattern
   - Components include `data-testid` attributes for E2E reliability

## Critical Implementation Patterns

### Next.js 15 Specifics
```typescript
// Async params in dynamic routes (Next.js 15)
interface PageProps {
  params: Promise<{ id: string }>;  // Note: Promise type
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;  // Use await to unwrap
}

// Client components with use() hook
export default function Page({ params }: PageProps) {
  const { id } = use(params);  // Use React.use() to unwrap in client components
}

// useSearchParams requires Suspense boundary
function SearchContent() {
  const searchParams = useSearchParams(); // Must be wrapped
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}

// Server components with metadata
export async function generateMetadata({ params }: PageProps) {
  // This MUST be at module level, not inside components
  // Only works in Server Components
}
```

### Form Handling Pattern
```typescript
// All forms use react-hook-form + zod
const schema = z.object({
  email: z.string().email(),
  // ...
});

const form = useForm<FormData>({
  resolver: zodResolver(schema),
});
```

### Component Composition
```typescript
// Feature components are composed of smaller ui components
// Example: JobDetailsPage uses JobDetailsHeader, CompanyCard, JobDescription, etc.
// Each component is independently tested
```

## Important Conventions

1. **URL Search Params**: Job filters persist in URL for shareable searches
2. **Error Boundaries**: Job details page handles missing jobs with proper 404
3. **Mobile First**: Separate MobileNav component, responsive filter sheets
4. **Type Safety**: All API responses and component props are strongly typed
5. **Accessibility**: Proper ARIA labels, semantic HTML, keyboard navigation
6. **Card Components**: When using CardTitle with asChild prop, ensure proper imports

## Development Workflow

1. Create/update tests first (TDD)
2. Implement feature to pass tests
3. Run `npm run lint` and `npm run type-check` before committing
4. E2E tests require Playwright browsers: `npx playwright install`

## Current Limitations

- Authentication is mocked (no real login)
- All data is static (no backend API)
- File uploads are simulated in tests
- No real email notifications

## Mock Data Structure

The mock data includes:
- 23 job listings with various states (active/inactive, featured)
- 3 companies
- Job categories with counts
- Only jobs with `active: true` are displayed

## Common Gotchas

1. **Missing Imports**: Always verify component imports, especially for CardTitle and other shadcn/ui components
2. **Server vs Client**: `generateMetadata` only works in Server Components
3. **Dynamic Routes**: Next.js 15 params are Promises and must be awaited
4. **Test Mocks**: Use `vi.mock` for Vitest, not `jest.mock`
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UUID Playground is a React + TypeScript single-page application for generating and exploring UUIDs. It supports multiple UUID versions (v1, v4, v7) and displays each UUID in 8 different format representations. The application uses Web Crypto API for cryptographically secure UUID generation and features a glassmorphism UI with light/dark themes.

## Development Commands

```bash
# Development
npm run dev              # Start Vite dev server at http://localhost:5173

# Testing
npm test                 # Run tests once with Vitest
npm run test:watch       # Run tests in watch mode

# Linting & Building
npm run lint             # ESLint check with TypeScript
npm run build            # TypeScript check + Vite production build
npm run preview          # Preview production build locally
```

## Architecture & Code Structure

### Core UUID Logic (`src/lib/uuid.ts`)

The heart of the application - all UUID generation and conversion logic:

- **Generation Functions**: `generateUUIDv1()`, `generateUUIDv4()`, `generateUUIDv7()` use Web Crypto API directly
- **Format Conversions**: `getAllFormats()` converts a UUID to 8 representations (canonical, hex, braced, URN, decimal, binary, base64, base64url)
- **Validation**: `normalizeUUID()` accepts various input formats (canonical, hex, braced, URN) and normalizes to canonical format
- **Byte Operations**: Uses `Uint8Array` for low-level UUID manipulation, BigInt for 128-bit arithmetic
- **Version Detection**: `detectUUIDVersion()` reads version bits from UUID bytes

When modifying UUID logic, remember that UUIDs are 128-bit (16 bytes) with specific bit positions for version and variant fields.

### Custom Hooks (`src/hooks/`)

Reusable React hooks following standard patterns:

- **`useTheme`**: Manages light/dark theme, persists to localStorage key `uuid-playground-theme`, syncs with `data-theme` attribute
- **`useToast`**: Toast notification system with 3-second auto-dismiss, generates random IDs
- **`useKeyboard`**: Global keyboard handler that ignores events from input/textarea elements

All hooks return stable references using `useCallback` where appropriate.

### Component Architecture

- **`App.tsx`**: Main component with all application state (UUID, formats, lock, version, auto-generate). Uses React hooks for state management
- **`FormatCard`**: Reusable card component for displaying each UUID format with copy functionality
- **`ValidationPanel`**: Handles UUID input/validation using `normalizeUUID()`
- **`Toast`**: Notification component styled with glassmorphism
- **`InfoPanel`**: Static information display

State flows unidirectionally from App to components via props.

### Styling (`src/styles/App.css`)

Pure CSS with CSS variables for theming. Uses `[data-theme='light']` and `[data-theme='dark']` attribute selectors. Glassmorphism effects achieved through backdrop-filter. All animations use GPU-accelerated transforms.

## Testing

Tests are in `src/lib/uuid.test.ts` using Vitest with jsdom environment. The test suite covers:

- UUID generation for each version (validates format and version bits)
- Normalization of various input formats
- Format conversions (all 8 representations)
- Version detection
- Edge cases and error handling

When adding UUID functionality, add corresponding test cases following existing patterns.

## Deployment Configuration

### GitHub Pages Setup

The repository uses GitHub Actions for deployment ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)):
- Triggers on push to `main` branch
- Runs `npm test` before building (deployment fails if tests fail)
- Builds with `npm run build` (creates `dist/` directory)
- Deploys to GitHub Pages

### Important: Repository Name Changes

If you rename the repository, you must update the `base` path in [vite.config.ts](vite.config.ts):

```typescript
export default defineConfig({
  base: '/your-new-repo-name/',  // Must match repository name
  // ...
})
```

The base path is required for asset URLs to work correctly on GitHub Pages.

## Key Implementation Details

### UUID Generation Strategy

- **v4 (Random)**: Uses `crypto.randomUUID()` when available, falls back to manual byte manipulation
- **v1 (Time-based)**: Calculates Unix timestamp with UUID epoch offset (0x01b21dd213814000), uses random node ID
- **v7 (Time-ordered)**: Uses 48-bit millisecond timestamp followed by random bits

All versions set correct version (4 bits at byte[6]) and variant (2 bits at byte[8]) fields per RFC 4122.

### State Management Pattern

The app uses standard React hooks without external state management:
- `useState` for all application state
- `useEffect` for side effects (auto-generate timer, initial UUID generation)
- Lock state prevents both manual and auto-generation
- Version selection persists only for current session (not localStorage)

### BigInt Usage

UUID decimal representation requires 128-bit integers. The code uses BigInt for arithmetic:

```typescript
const decimal = bytes.reduce((acc, byte, i) => {
  const shift = BigInt(15 - i) * 8n
  return acc + (BigInt(byte) << shift)
}, 0n).toString()
```

Always use BigInt literals (`0n`) and constructors when working with large numbers.

# 🔑 UUID Playground

A modern, production-ready web application for generating and exploring UUIDs with a beautiful glassmorphism interface. Generate UUIDs and view them in multiple formats with one click.

[![Deploy to GitHub Pages](https://github.com/xixu-me/UUID-Playground/actions/workflows/deploy.yml/badge.svg)](https://github.com/xixu-me/UUID-Playground/actions/workflows/deploy.yml)

## ✨ Features

### Core Functionality

- **Multiple UUID Versions**: Generate UUIDv1 (time-based), UUIDv4 (random), and UUIDv7 (time-ordered)
- **8 Format Representations**: View each UUID in canonical, hex, braced, URN, decimal, binary, Base64, and URL-safe Base64 formats
- **One-Click Copy**: Copy any format to clipboard with visual feedback
- **UUID Validation**: Paste UUID strings (canonical, hex, braced, or URN) to normalize and view all representations
- **Lock Feature**: Prevent accidental regeneration with UUID lock toggle
- **Auto-Generate**: Automatically generate new UUIDs at configurable intervals (1-60 seconds)
- **Keyboard Shortcuts**: Press `Space` or `Enter` to generate new UUIDs

### UI/UX Excellence

- **Glassmorphism Design**: Modern translucent panels with blur effects
- **Light/Dark Themes**: Automatic theme detection with manual toggle (preference saved)
- **Smooth Animations**: GPU-accelerated animations with non-linear easing
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Toast Notifications**: Elegant feedback for all user actions
- **Accessibility**: Full keyboard navigation and ARIA labels

## 🚀 Live Demo

Visit the live application at: [https://uuid.xi-xu.me](https://uuid.xi-xu.me)

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Pure CSS with CSS Variables
- **Testing**: Vitest
- **Deployment**: GitHub Actions → GitHub Pages
- **UUID Generation**: Web Crypto API

## 📦 Installation & Development

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/xixu-me/UUID-Playground.git
   cd UUID-Playground
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

4. **Run tests**

   ```bash
   # Run tests once
   npm test
   # Run tests in watch mode
   npm run test:watch
   ```

5. **Lint code**

   ```bash
   npm run lint
   ```

6. **Build for production**

   ```bash
   npm run build
   ```

   Built files will be in the `dist/` directory

7. **Preview production build**

   ```bash
   npm run preview
   ```

## 🚢 Deployment

### GitHub Pages Deployment

This repository is configured to automatically deploy to GitHub Pages using GitHub Actions.

#### Setup Instructions

1. **Enable GitHub Pages**
   - Go to your repository settings
   - Navigate to **Pages** section
   - Under "Build and deployment":
     - Source: **GitHub Actions**

2. **Push to main branch**

   ```bash
   git push origin main
   ```

3. **Workflow automatically runs**

   - Installs dependencies
   - Runs tests
   - Builds the project
   - Deploys to GitHub Pages

4. **Access your site**
   - Your site will be available at: `https://<username>.github.io/<repository-name>/`

#### Workflow Details

The deployment workflow (`.github/workflows/deploy.yml`):

- Triggers on push to `main` branch or manual dispatch
- Uses Node.js 20 LTS
- Caches npm dependencies for faster builds
- Runs tests before deployment
- Uploads build artifacts to GitHub Pages
- Deploys using official GitHub Actions

#### Customizing Repository Name

If you rename the repository, update the `base` path in `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/your-new-repo-name/',
  // ... other config
})
```

## 🎨 Customization

### Changing Colors

Edit CSS variables in `src/styles/App.css`:

```css
[data-theme='light'] {
  --accent-primary: #667eea;  /* Primary accent color */
  --accent-hover: #5a67d8;    /* Hover state color */
  /* ... other variables */
}
```

### Adding New UUID Formats

1. Add format conversion in `src/lib/uuid.ts`:

   ```typescript
   export interface UUIDFormats {
     // ... existing formats
     yourNewFormat: string
   }
   ```

2. Update `getAllFormats()` function to include new format

3. Add description in `App.tsx` formatDescriptions object

### Modifying Auto-Generate Limits

In `src/App.tsx`, change the min/max values:

```typescript
<input
  type="number"
  min="1"    // Minimum seconds
  max="60"   // Maximum seconds
  // ...

/>
```

## 🧪 Testing

The repository includes comprehensive tests for UUID utilities:

- **UUID Generation**: Validates correct version formatting
- **UUID Normalization**: Tests various input formats
- **Format Conversion**: Verifies all format representations
- **Version Detection**: Ensures correct UUID version identification

Run tests:

```bash
npm test              # Run once
npm run test:watch    # Watch mode
```

## 🔒 Security

- Uses native Web Crypto API for cryptographically secure random generation
- No external dependencies for UUID generation
- Client-side only - no data sent to servers
- No tracking or analytics

## ♿ Accessibility

- Full keyboard navigation support
- ARIA labels on interactive elements
- Sufficient color contrast ratios
- Respects `prefers-reduced-motion`
- Focus indicators on all interactive elements

## 📝 License

Copyright (c) Xi Xu. All rights reserved.

Licensed under the [MIT](LICENSE) license.

## 📚 Resources

- [UUID Specification (RFC 4122)](https://datatracker.ietf.org/doc/html/rfc4122)
- [UUID Version 7 Draft](https://datatracker.ietf.org/doc/html/draft-peabody-dispatch-new-uuid-format)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

## 🙏 Acknowledgments

- Design inspired by modern glassmorphism trends
- UUID generation using Web Crypto API standards
- Built with Vite's lightning-fast tooling

---

Made with ❤️ and TypeScript

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Oglasnik is a classified ads application. The client is built with React 19, TypeScript, and Tailwind CSS 4, using Vite as the build tool.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server with hot module replacement
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## Architecture

### Tech Stack
- **Frontend Framework**: React 19.1.1 with TypeScript 5.9.3
- **Build Tool**: Vite 7.1.7 with @vitejs/plugin-react
- **Styling**: Tailwind CSS 4.1.14 (using @tailwindcss/postcss)
- **Linting**: ESLint 9 with TypeScript ESLint, React Hooks, and React Refresh plugins

### Project Structure
- `src/main.tsx` - Application entry point, renders App with StrictMode
- `src/App.tsx` - Root component, currently renders SignIn page
- `src/components/` - React components directory
  - `SignIn.tsx` - Authentication form with email/password and social login UI
- `src/index.css` - Global styles, imports Tailwind CSS

### TypeScript Configuration
- Strict mode enabled with additional linting rules
- Uses `react-jsx` transform (no need to import React in components)
- Bundler module resolution for Vite compatibility
- Separate configs: `tsconfig.app.json` for app code, `tsconfig.node.json` for Node/Vite config files

### Styling Approach
- Tailwind CSS 4 with PostCSS plugin architecture
- Utility-first CSS with component-scoped styling
- Current UI uses gradient backgrounds, modern card layouts, and focus states

### Current Features
- Login form component with controlled inputs (email, password)
- Social authentication UI (Google, Facebook, Instagram) - UI only, no implementation
- Form validation using HTML5 required attributes
- Responsive design with mobile-first approach

## Development Notes

### ESLint Configuration
The project uses flat config format with:
- React Hooks recommended rules
- React Refresh for Vite
- TypeScript recommended rules
- Ignores `dist` directory

### Build Process
TypeScript compilation happens before Vite build (`tsc -b && vite build`)

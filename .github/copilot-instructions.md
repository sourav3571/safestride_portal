# AI Coding Agent Instructions for SafeStride Portal

## Project Overview
SafeStride (GuardHer) is a personal safety platform providing real-time emergency alerts, location-based safety monitoring, and AI-powered guidance. It's a React 18 + TypeScript frontend built with Vite, leveraging modern safety-focused features.

## Architecture & Key Components

### Tech Stack
- **Build**: Vite with React SWC compiler
- **Framework**: React 18 + TypeScript (strict disabled for flexibility)
- **Styling**: Tailwind CSS + shadcn/ui component library
- **State/Data**: TanStack React Query, React Hook Form + Zod validation
- **Maps/Visualization**: Mapbox (react-map-gl / mapbox-gl) for interactive maps, Recharts for statistics
- **AI Integration**: Google Gemini API for Safety Assistant chatbot
- **Data Storage**: Firebase Firestore for incident reports, safe zones, SOS logs, and user preferences
- **Animation**: Framer Motion for UI transitions
- **Backend**: None (frontend-only, external services via APIs)

### Project Structure
```
src/
├── pages/          # Route-level components (Index, Features, SafetyMap, SOS, etc.)
├── components/     # Reusable UI components
│   ├── ui/         # shadcn/ui primitives (Button, Input, Dialog, etc.)
│   ├── demos/      # Feature demonstrations
│   ├── SafetyAssistant.tsx    # Gemini AI chatbot component
│   ├── SafetyMapComponent.tsx # Leaflet map integration
│   ├── FloatingSOS.tsx        # Persistent emergency widget
│   └── ...         # Navbar, Footer, etc.
├── lib/            # Utilities & external services
│   ├── firebase.ts # Firestore initialization & incident report functions
│   ├── gemini.ts   # Gemini API initialization & helper functions
│   └── utils.ts    # General utilities
├── hooks/          # Custom React hooks (use-mobile, use-toast)
└── assets/         # Images & static files
```

## Critical Workflows & Commands

### Development
```bash
bun dev          # Start dev server (port 8080)
bun build        # Production build
bun build:dev    # Development build
bun lint         # Run ESLint (unused vars/params disabled)
bun preview      # Preview production build
```

### Path Aliases
- `@/` resolves to `src/` (configured in vite.config.ts and tsconfig.json)

## Pattern & Convention Guide

### Component Organization
1. **Page Components** (`src/pages/`): Top-level route components with full page layout
2. **Feature Components** (`src/components/`): Self-contained, reusable features
3. **UI Components** (`src/components/ui/`): Low-level primitives from shadcn/ui—import directly from `@/components/ui/`

### Routing Pattern
- **BrowserRouter wrapper** with `<Routes>` in App.tsx (src/App.tsx)
- **Global overlays**: FloatingSOS (emergency widget) and SafetyAssistant (AI chatbot) render outside route tree
- **Route structure**: Simple paths like `/`, `/features`, `/safety-map`, `/sos`, `/report`

### Styling Conventions
- **Tailwind utility-first**: Use `className="flex gap-4 p-3 rounded-lg"`
- **Component variants**: shadcn/ui components export variant props (e.g., `Button variant="destructive"`)
- **Motion/Animation**: Use Framer Motion's `motion.div`, `AnimatePresence`, and predefined variants for consistency
- **Theme system**: Tailwind uses `foreground`, `background`, `muted`, `primary` CSS variables from shadcn

### Data Fetching & Forms
- **TanStack Query**: Use `useQuery`/`useMutation` for async data (not visible in this codebase yet—prepare for future integration)
- **React Hook Form**: Forms use `useForm` + Zod schema validation (see Report.tsx pattern)
- **No global state**: Use React context or query client for state management

### Integrations

#### Firebase (src/lib/firebase.ts)
- **Firestore**: Fully integrated with CRUD operations for multiple data types
- **Incident Reports**: `saveIncidentReport()`, `getIncidentReports()`, `updateIncidentReport()`, `deleteIncidentReport()`
  - Fields: location, latitude/longitude, incidentType, severity, description, isAnonymous
- **Safe Zones**: `saveSafeZone()`, `getSafeZones()`, `getSafeZonesNearby()`, `deleteSafeZone()`
  - Types: police_station, hospital, community_center, safe_house, public_space
- **SOS Logs**: `logSOSAction()`, `getSOSLogs()`
  - Types: HOLD_COMPLETE, CLICK_NUMBER, ACTIVATED, CANCELLED
- **User Preferences**: `saveUserPreference()`, `getUserPreference()`
  - Stores trusted contacts, emergency numbers, notification settings per user
- **Config**: Environment variables: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, etc.
- **Radius Filtering**: Client-side distance calculations for nearby markers (~111 km per degree)

#### Google Gemini AI (src/lib/gemini.ts)
- **Chat Sessions**: Use `createChatSession()` for multi-turn conversations
- **Direct responses**: Use `getGeminiResponse(prompt)` for single prompts
- **API Key**: Environment variable `VITE_GEMINI_API_KEY`
- **Model**: Currently `gemini-flash-latest` (fast/cheap, suitable for real-time safety chat)
- **System Prompt**: Pre-configured to provide safety advice, emergency procedures, first aid

#### Mapbox (MapboxComponent.tsx)
- **Component**: `MapboxComponent` (src/components/MapboxComponent.tsx) uses `react-map-gl` + `mapbox-gl`
- **Features**: Markers, popups, legend overlay, responsive view; can be extended with clustering via Supercluster
- **Data sources**: Default `indiaMarkers` + Firebase incident reports via `getIncidentReports()`
- **Usage**: Embedded in `SafetyMap` page with real-time filter support and zoom-based marker visibility
- **API Key**: Environment variable `VITE_MAPBOX_API_KEY` (add to your `.env`)

### UI/UX Patterns
1. **Floating SOS Widget**: Persistent emergency contact menu at bottom-right (hides on `/sos` page)
2. **Safety Assistant**: Floating chat interface with Gemini AI for on-demand guidance
3. **Toast Notifications**: Use `useToast()` hook for alerts (Sonner + native toaster)
4. **Loading States**: Use `<Loader2>` spinner icon from Lucide React
5. **Responsive Design**: Built with Tailwind—test mobile behavior via `use-mobile` hook

## Environment Setup

### Required Environment Variables
```
VITE_GEMINI_API_KEY=<your-gemini-api-key>
VITE_GOOGLE_MAPS_API_KEY=<your-google-maps-api-key>
VITE_FIREBASE_API_KEY=<firebase-config>
VITE_FIREBASE_AUTH_DOMAIN=<firebase-config>
VITE_FIREBASE_PROJECT_ID=<firebase-config>
VITE_FIREBASE_STORAGE_BUCKET=<firebase-config>
VITE_FIREBASE_MESSAGING_SENDER_ID=<firebase-config>
VITE_FIREBASE_APP_ID=<firebase-config>
```

## Code Quality & Lint Rules
- **ESLint Config**: Tolerant—unused variables/parameters ignored to reduce friction
- **React Hooks**: Plugin enforced (rules required)
- **React Refresh**: Components must export functions/components for HMR
- **TypeScript**: Strict null checks disabled—use care with null/undefined checks

## Key Development Guidelines
1. **Always use path aliases** (`@/components/Button` not `../../../components/Button`)
2. **Wrap new features in AnimatePresence + motion.div** for consistency with SafetyAssistant/FloatingSOS patterns
3. **Maintain responsive design**: Test mobile views with Tailwind breakpoints
4. **API error handling**: Gracefully degrade when Firebase/Gemini keys are missing (see SafetyAssistant patterns)
5. **Component exports**: Page and feature components should be default exports; UI components named exports
6. **Safety-first UX**: Emergency features (SOS, hotlines) should always be accessible and visually prominent

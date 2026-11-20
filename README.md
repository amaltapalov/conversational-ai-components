# DS Core AI

Conversational AI design library: React + TypeScript components (XDS) and a Vite showcase app.

## Requirements

- Node.js 20 or newer
- npm

## Install

```bash
npm install
```

## Run the dev server

```bash
npm run dev
```

Open `http://localhost:5173/` in the browser. Vite hot-reloads on save. Stop the server with `Ctrl + C` in the terminal.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite dev server at `http://localhost:5173/` |
| `npm run build` | Type-check (`tsc -b`) and build for production into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint on the project |
| `npm run typecheck` | Run TypeScript without emitting files |
| `npm run format` | Format `.ts` and `.tsx` files with Prettier |

## Project structure

- `src/components/xds/`: XDS components (`InitialCta`, `CapabilityIntro`, `PrivacyNotice`, and others)
- `src/components/ui/`: base UI primitives
- `src/examples/`: example pages built from XDS components
- `src/App.tsx`: showcase app with the sidebar and overview
- `styles/theme.css`: design tokens
- `CONTEXT.md`: project context, conventions, and component catalog

## Adding shadcn components

```bash
npx shadcn@latest add button
```

Components are placed in `src/components/ui/`. Import them with the `@` alias:

```tsx
import { Button } from "@/components/ui/button"
```

# CONTEXT.md

Persistent context for developers and AI coding assistants working on **DS Core AI**. Read this before exploring the codebase. Keep it up to date when components, tokens, or conventions change.

> The [README.md](README.md) is shadcn/Vite template boilerplate — this file is the real project overview.

## 1. What this is

**XDS (Experience Design System)** — a React component library focused on AI-assistant UI (prompt composer, suggestions, citations, stream-of-thought, action plan), plus a single-page showcase app. The app previews each component and includes a working **Chatbot** example that combines them.

- Owner: DD&IT Experience & Adoption
- Package version: `0.0.1` (private); component files carry their own `Version: 0.1.0` header
- No backend, no router, no tests

## 2. Tech stack

| Area | Choice | Notes |
|---|---|---|
| Framework | React 19 + `react-dom` 19 | Client-only SPA, no RSC. Registry files may keep `"use client"` (e.g. `dialog.tsx`); it's a no-op in Vite |
| Build | Vite 8 + `@vitejs/plugin-react` | Alias `@` → `./src` ([vite.config.ts](vite.config.ts)) |
| Language | TypeScript ~6, `strict`, `verbatimModuleSyntax` | Use `import type` for type-only imports |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` | **No `tailwind.config.*`** — tokens live in CSS `@theme` blocks |
| Primitives | `@base-ui/react` | **Not Radix.** Composition uses the `render` prop, not `asChild` |
| Variants | `class-variance-authority` (CVA) | |
| Class merge | `cn` npm package (`^0.5.0`) | Imported directly as `import { cn } from "cn"`; also re-exported from `@/lib/utils` |
| Icons | `lucide-react` | Import individually |
| Animation | `tw-animate-css` | `animate-in`, `fade-in-0`, `slide-in-from-*`, etc. |
| Scaffolding | shadcn CLI 4, style `base-nova` | See [components.json](components.json) |
| Quality | ESLint 10 (TS, react-hooks, react-refresh), Prettier 3 + `prettier-plugin-tailwindcss` | [.prettierrc](.prettierrc): no semicolons, double quotes, `trailingComma: es5`, width 80; sorts classes inside `cn()`/`cva()` |

## 3. Commands

Run from the project root.

| Command | Purpose |
|---|---|
| `npm run dev` | Vite dev server (http://127.0.0.1:5173) |
| `npm run build` | `tsc -b && vite build` |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run format` | Prettier on `**/*.{ts,tsx}` |
| `npm run preview` | Preview the production build |

There is no test runner. Validate changes with `npm run lint && npm run build`.

## 4. Directory map

```
DS Core AI/
├─ components.json            shadcn config (+ @xds registry)
├─ .prettierrc                Prettier + Tailwind class sorting
├─ vite.config.ts             react + tailwind plugins, @ alias
├─ styles/                    ← design tokens live OUTSIDE src/
│  ├─ theme.css               @theme palettes, semantic tokens, light/.dark values
│  └─ fonts.css               @font-face for VoltaModernDisplay
├─ public/assets/xds/
│  ├─ fonts/                  VoltaModernDisplay-{55Roman,65Medium,75Bold}.woff2
│  └─ logo/                   brand-symbol-*.svg, logo-*.svg (soft-white / warm-black)
└─ src/
   ├─ main.tsx                StrictMode → ThemeProvider → App
   ├─ App.tsx                 Showcase app (grouped sidebar + preview + code panel)
   ├─ examples/
   │  ├─ assistant-home-example.tsx  Assistant landing page built on CapabilityIntro
   │  └─ chatbot-example.tsx  Full chat demo composed from XDS components
   ├─ index.css               Imports tailwindcss, tw-animate-css, shadcn/tailwind.css, ../styles/*; `.docs-hero` backdrop (showcase header only)
   ├─ components/
   │  ├─ xds/                 ← SOURCE OF TRUTH for all components
   │  ├─ ui/button.tsx        Re-export shim of xds/button (for shadcn-generated imports)
   │  └─ theme-provider.tsx   ThemeProvider + useTheme
   └─ lib/
      ├─ utils.ts            cn re-export, getSafeHref()
      └─ thought-vocabulary.ts  Shared StreamOfThought/ResponseStatus kind icons + labels, status labels, formatDuration()
```

## 5. Component catalog (`src/components/xds/`)

| File | Exports | Key API | Built on / depends on |
|---|---|---|---|
| [action-plan.tsx](src/components/xds/action-plan.tsx) | `ActionPlan`, types `ActionPlanStep`, `ActionPlanStepStatus`, `ActionPlanStatus`, `ActionPlanMode`, `ActionPlanProps` | `mode`: `contractual` (default, approval gate) \| `advisory` (no approval footer; read-only unless `editable`). `status`: `draft` \| `approved` \| `running` \| `complete` \| `cancelled`. Step `status`: `pending` \| `running` \| `complete` \| `skipped` \| `error`. Controlled `steps`/`onStepsChange` (editing needs `onStepsChange`; `editable` defaults to contractual drafts): inline edit, add/remove, drag or keyboard reorder (grip: Space lift, arrows move, Esc cancel). `onApprove(steps)`, `onRegenerate`, `onCancel`, `approveLabel`; `open`/`defaultOpen`/`onOpenChange` | `Button`, `Textarea`, `ThoughtStepKind` type |
| [attachments.tsx](src/components/xds/attachments.tsx) | `Attachments` | `files: File[]`, `disabled`, `onRemove(index)` (shows a remove button per file). Renders nothing when `files` is empty. Image files get an object-URL thumbnail; PDF/Word/Excel get a colored type tile; shows name + size | `Button`. No XDS header yet |
| [button.tsx](src/components/xds/button.tsx) | `Button`, `buttonVariants` | `variant`: `primary` (default), `outline`, `secondary`, `tertiary`, `destructive`, `link`. `size`: `default`, `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg` | `@base-ui/react/button`, CVA |
| [capability-intro.tsx](src/components/xds/capability-intro.tsx) | `CapabilityIntro`, types `CapabilityIntroProps`, `CapabilityItem`, `CapabilityIntroStartersLayout` | Empty-state intro: renders title, capabilities/starters, then the `children` composer (`InitialCta`, which owns the one-line `disclaimer`). Capabilities are `{ id, title, description?, icon?, starters? }`, capped at 3 and shown as a condensed 3-column grid (`sm` and up). `startersLayout`: `flat` (default; one `Suggestions` row, falls back to all capability starters) \| `grouped` (tile per capability with its own starters). `onSelectStarter(prompt)`, `disabled`; labels `capabilitiesLabel`, `startersLabel` | `Suggestions` |
| [card.tsx](src/components/xds/card.tsx) | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter` | `Card size`: `default` \| `sm` (drives `--card-spacing`) | Plain `div`s |
| [citations.tsx](src/components/xds/citations.tsx) | `Citations`, `CitationReference`, types `CitationItem`, `CitationsProps`, `CitationReferenceProps` | `Citations items={CitationItem[]}` wraps content; `<CitationReference citationId="…" />` renders numbered inline link to the reference list. `CitationItem = { id, title, href, source?, locator? }`. Reference chips truncate long labels in the middle (the last 16 characters stay visible; the full label is in `title`/`aria-label`) | React Context, `useId`, `getSafeHref` |
| [confirmation-prompt.tsx](src/components/xds/confirmation-prompt.tsx) | `ConfirmationPrompt`, types `ConfirmationPromptProps`, `ConfirmationPromptStatus`, `ConfirmationPromptIntent`, `ConfirmationPromptField` | Inline approval for **one** risky action (use `ActionPlan` for multi-step plans). `status`: `pending` (default) \| `confirming` \| `confirmed` \| `cancelled` \| `error`. `intent`: `default` \| `destructive` (destructive Confirm button + red accents). `title` (the action), `description?`, `icon?` (defaults to shield), `fields?` (`{ label, value }` as `<dl>`), `children` (scrollable preview, e.g. an email body), `irreversible?` (`true` → "This can't be undone.", or a custom node). `onConfirm`, `onCancel`, optional `onEdit`; `confirmLabel`, `cancelLabel`, `editLabel`, `errorMessage`. Buttons are enabled only in `pending`/`error`; the card stays in place after a decision with a status label in the header | `Button` |
| [dialog.tsx](src/components/xds/dialog.tsx) | `Dialog`, `DialogTrigger`, `DialogPortal`, `DialogClose`, `DialogOverlay`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription` | Centered modal (`max-w-[calc(100%-2rem)]`, `sm:max-w-sm`, `p-4`). `DialogContent showCloseButton` (default `true`, tertiary `icon-sm` button). `DialogFooter showCloseButton` (default `false`) appends an outline "Close" button; the footer bleeds to the edges (`-mx-4 -mb-4`, `bg-muted/50`, `border-t`) | `@base-ui/react/dialog` (portal + blurred backdrop), `Button`. Synced with the `@xds` registry |
| [initial-cta.tsx](src/components/xds/initial-cta.tsx) | `InitialCta`, types `InitialCtaProps`, `InitialCtaMode`, `InitialCtaTemplate`, `InitialCtaSubmitPayload`, `InitialCtaSuggestion` | `variant`: `standard` \| `chat`. Controlled `value`/`onValueChange`, `attachments`/`onAttachmentsChange`, `attachmentError`/`onAttachmentErrorDismiss`, `onSubmit({ prompt, attachments, mode?, templateId? })`, optional `modes`/`mode`, `templates`/`templateId`, `onAttach`, `onVoiceInput`, `disclaimer`, `footer` (rendered inside the box below the disclaimer, behind a top border; used for an `embedded` `PrivacyNotice`), `disabled` | `Button`, `Select`, `Textarea`, `SuggestionItem` type |
| [limitation-notice.tsx](src/components/xds/limitation-notice.tsx) | `LimitationNotice`, types `LimitationKind`, `LimitationNoticeProps` | A quiet, factual note about one limitation of an answer. There's no confidence score. `kind` (required): `stale` \| `permission` \| `uncertain` \| `partial`, each with its own icon and a screen-reader prefix ("Out of date", "No access", "Uncertain", "Incomplete"; override with `label`). `title` is the factual statement; `icon?`. `children` become details behind a "Details" toggle (`detailsLabel`, `open`/`defaultOpen` (`false`)/`onOpenChange`). An optional action shows when both `actionLabel` and `onAction` are set. The root has `role="note"` and a muted left border. Stack several notices when there's more than one limitation | `Button` |
| [permission-request.tsx](src/components/xds/permission-request.tsx) | `PermissionRequest`, types `PermissionRequestProps`, `PermissionRequestStatus`, `PermissionScope`, `PermissionAccess` | Asks for access **before** the assistant uses a resource (`LimitationNotice kind="permission"` reports missing access after the fact). `title` (the question), `reason` (why, required), `scopes?: { label, access? }[]` (what; `access`: `read` (default, eye icon) \| `write` (pencil icon), with screen-reader text), `fallback` (required; always-visible "Without access:" line), `icon?` (defaults to a key). `status`: `pending` (default) \| `granting` \| `granted` \| `declined` \| `error`. `onAllow`, `onContinueWithout`; `allowLabel`, `continueLabel`, `scopesLabel`, `fallbackLabel`, `errorMessage`. Buttons are enabled only in `pending`/`error`; the card stays in place after a decision with a status label in the header | `Button` |
| [privacy-notice.tsx](src/components/xds/privacy-notice.tsx) | `PrivacyNotice`, types `PrivacyNoticeProps`, `PrivacyNoticeVariant`, `PrivacyTopic`, `PrivacyNoticeItem` | Inline disclosure of data use, retention, and external sharing. Informational only: there's no acknowledgement. `variant`: `composer` (default; muted strip with its own border, placed directly under `InitialCta` with `disclaimer=""`) \| `embedded` (borderless muted strip for `InitialCta`'s `footer` slot, so it reads as part of the input box) \| `inline` (left-border note inside a turn, e.g. when a query goes to an external service). `title` is the one-line summary; `icon?` (defaults to a shield). `items?: { topic, description, label? }[]`, where `topic` is `use` \| `retention` \| `sharing`, each with an icon and a default label ("How it's used", "How long it's kept", "Who it's shared with"), rendered as a `<dl>`. `policyHref` (through `getSafeHref`) + `policyLabel` ("Privacy policy"). Items and the policy link sit behind a "Learn more" toggle (`detailsLabel`, `open`/`defaultOpen` (`false`)/`onOpenChange`); the toggle only appears when there's something to show. The root has `role="note"` and `ariaLabel` (default "Privacy notice") | `Button`, `getSafeHref` |
| [response-status.tsx](src/components/xds/response-status.tsx) | `ResponseStatus`, types `ResponseStatusProps`, `ResponseActivity` | Compact inline indicator for short waits, as an alternative to `StreamOfThought`. `status`: `StreamOfThoughtStatus` (default `thinking`; `complete` renders nothing). `activity`: `ThoughtStepKind` \| `drafting` (default `reasoning`) → "Thinking…", "Searching…", "Reading…", "Using tools…", "Running code…", "Drafting…". `label` overrides the text; `elapsed` (**seconds**); `onStop`/`stopLabel` (shown while thinking). No icons: a spinner while thinking, text only otherwise. Only the spinner + label sit in the `role="status"` region. No approve/retry actions: use `StreamOfThought` for those | `Button`, `lib/thought-vocabulary` |
| [select.tsx](src/components/xds/select.tsx) | `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`, `SelectGroup`, `SelectLabel`, `SelectSeparator`, `SelectScrollUpButton`, `SelectScrollDownButton` | `SelectTrigger size`: `default` \| `sm`. `SelectContent` accepts `side`, `sideOffset`, `align`, `alignOffset`, `alignItemWithTrigger` | `@base-ui/react/select` (portal) |
| [sheet.tsx](src/components/xds/sheet.tsx) | `Sheet`, `SheetTrigger`, `SheetClose`, `SheetContent`, `SheetHeader`, `SheetFooter`, `SheetTitle`, `SheetDescription` | `SheetContent side`: `top` \| `right` (default) \| `bottom` \| `left`; `showCloseButton` (default `true`) | `@base-ui/react/dialog` (portal + backdrop) |
| [stream-of-thought.tsx](src/components/xds/stream-of-thought.tsx) | `StreamOfThought`, types `ThoughtStep`, `ThoughtStepStatus`, `ThoughtStepKind`, `ThoughtStepDetail`, `StreamOfThoughtStatus`, `StreamOfThoughtProps` | `status`: `thinking` \| `waiting` \| `complete` \| `error` \| `stopped`. Step `status`: `queued` \| `running` \| `waiting` \| `error` \| `retried` \| `complete`. Step `kind`: `reasoning` \| `search` \| `read` \| `tool` \| `code`. Callbacks `onStop`, `onApprove`, `onReject`, `onRetry`; `open`/`defaultOpen`/`onOpenChange`; durations in **seconds** | `Button`, `CitationItem` (step `sources`), `getSafeHref` |
| [suggestions.tsx](src/components/xds/suggestions.tsx) | `Suggestions`, types `SuggestionItem`, `SuggestionsProps` | `items: { label, prompt }[]`, `onSelect(prompt)`, `disabled`. Renders nothing when `items` is empty | `Button` (`size="sm"`, `variant="secondary"`) |
| [textarea.tsx](src/components/xds/textarea.tsx) | `Textarea` | Native `textarea` props; auto-grows via `field-sizing-content` | Plain `textarea` |
| [tool-result.tsx](src/components/xds/tool-result.tsx) | `ToolResult`, types `ToolResultStatus`, `ToolResultField`, `ToolResultDetail`, `ToolResultProps` | One tool action and its outcome, separate from reasoning and the answer. `status`: `running` \| `success` \| `error` \| `cancelled`. `title` (what the assistant did), `tool?`, `icon?` (defaults to wrench), `summary?`, `duration?` (**seconds**). Expandable only when it has `fields` (`{ label, value }`, rendered as `<dl>`) or `detail` (`{ input?, output?, language? }`); `open`/`defaultOpen` (`false`)/`onOpenChange`. `onRetry` shows on `error`, `onUndo` on `success` (`retryLabel`, `undoLabel`) | `Button`, `formatDuration` (`lib/thought-vocabulary`) |

Internal dependency graph:

```mermaid
graph LR
  CapabilityIntro --> Suggestions
  InitialCta --> Button
  InitialCta --> Select
  InitialCta --> Textarea
  InitialCta -. type .-> Suggestions
  Suggestions --> Button
  StreamOfThought --> Button
  StreamOfThought -. type .-> Citations
  Citations --> utils[lib/utils getSafeHref]
  StreamOfThought --> utils
  StreamOfThought --> vocab[lib/thought-vocabulary]
  ResponseStatus --> Button
  ResponseStatus --> vocab
  ResponseStatus -. type .-> StreamOfThought
  Attachments --> Button
  ActionPlan --> Button
  ActionPlan --> Textarea
  ActionPlan -. type .-> StreamOfThought
  Dialog --> Button
  ToolResult --> Button
  ConfirmationPrompt --> Button
  LimitationNotice --> Button
  PermissionRequest --> Button
  PrivacyNotice --> Button
  PrivacyNotice --> utils
```

## 6. Design tokens ([styles/theme.css](styles/theme.css))

- **Tailwind defaults are reset**: `--color-*: initial` and `--font-weight-*: initial`. Default Tailwind colors like `blue-500`, `slate-*`, `zinc-*` **do not exist**. Only the palettes below are available.
- **Palettes** (`100`–`900`, plus a bare alias = `500`):
  - `gray-*`
  - `space-orange-*` (brand accent, `space-orange` = `#ff4e00`)
  - `red-*`, `green-*`, `amber-*`
  - Singles: `white`, `soft-white`, `warm-black`, `black` (= `warm-black`)
- **Semantic tokens** (prefer these in components): `background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `accent-brand` (space orange), `destructive`, `danger`, `success`, `warning`, `disabled`, `border`, `input`, `ring`, `sidebar-*`, `chart-1`…`chart-20`. Most have a `-foreground` pair.
- **Light/dark**: values defined in `:root` and `.dark`. Dark mode uses `@custom-variant dark (&:is(.dark *))`, so the `dark:` utility works when `.dark` is on an ancestor (set on `<html>` by `ThemeProvider`).
- **Font weights**: only `normal` (400), `medium` (500), `bold` (700) are defined, so utilities like `font-semibold` won't map to a theme weight.
- **Typography**: `--font-sans` = `VoltaModernDisplay` (from [styles/fonts.css](styles/fonts.css), served from `/assets/xds/fonts/`), fallback Arial.
- **Corners**: components and chat bubbles use `rounded-lg` (`var(--radius)` = `0.625rem`); `Button` is pill-shaped (`rounded-full`), except inside a button group where it stays square.
- To add a semantic token: define the raw value in `:root` and `.dark`, then map it in `@theme inline` as `--color-<name>: var(--<name>)`.

## 7. Theming ([src/components/theme-provider.tsx](src/components/theme-provider.tsx))

- `ThemeProvider` props: `defaultTheme` (`"system"`), `storageKey` (`"theme"`), `disableTransitionOnChange` (`true`).
- `useTheme()` returns `{ theme, setTheme }` where `theme` is `"light" | "dark" | "system"`.
- Applies `light`/`dark` class to `<html>`, follows OS changes in `system` mode, persists to `localStorage`, and syncs across tabs.
- **Keyboard shortcut**: pressing `d` (outside inputs/editable elements, no modifiers) toggles light/dark.
- **Showcase toggle**: `ThemeToggle` in the showcase header (`Sun`/`Moon` icon button) calls `setTheme` with the opposite theme.

## 8. Showcase app ([src/App.tsx](src/App.tsx))

- Sidebar items are **auto-generated** from `import.meta.glob("./components/xds/*.tsx")`. Every file in `xds/` appears; the id is the filename (e.g. `initial-cta`).
- Items are grouped into collapsible `<details>` sections (`componentGroups`):
  - **General**: everything not listed in `conversationalAiIds`.
  - **Conversational AI**: ids in `conversationalAiIds` (`action-plan`, `capability-intro`, `citations`, `confirmation-prompt`, `initial-cta`, `limitation-notice`, `permission-request`, `privacy-notice`, `response-status`, `stream-of-thought`, `suggestions`, `tool-result`).
  - **Example**: hard-coded items rendered from the `examplePages` record (`{ description, render }`) in a tall section with no code panel: `chatbot` → `ChatbotExample`, `assistant-home` → `AssistantHomeExample`.
- Content for each component comes from the `componentExamples` record, keyed by that id: `{ description, code, preview }`. `code` may be a string or a function of the preview props.
- Missing entries render a "Add a preview…" placeholder.
- **Docs shell**: a `docs-hero` header with the `ThemeToggle` and an `Overview` nav item. The overview (`activeComponentId === null`, the default) lists `overviewLinks` as cards that jump to a component or example. The hero title stays on one line (`whitespace-nowrap`, `tracking-normal`), and each benefit tile is a short landscape panel (`h-36`, `p-4`) with a `BenefitIllustration`. Benefit card titles use `leading-tight`.
- **Collapsible sidebar**: `SidebarToggle` (desktop only, `md:` and up) shows or hides the sidebar via `isSidebarOpen`.
- No router: selection is local state (`activeComponentId`). Hash URLs like `#citation-<instanceId>-<citationId>` are just in-page citation anchors.
- Stateful demos live in `*Preview` functions. Examples: `StreamOfThoughtPreview` simulates a run with timed steps, an error step, and an approval step. `ActionPlanPreview` runs draft → approve → run, with a toggle between contractual and advisory (which runs immediately). `DialogPreview` shows a basic modal. `ToolResultPreview` shows a save that completes and can be undone, a failed send that can be retried, and a non-expandable result. `ConfirmationPromptPreview` switches between a send-email and a destructive delete scenario, with a "Simulate failure" toggle. `LimitationNoticePreview` shows one notice of each kind under a sample answer; the permission notice's "Request access" changes it to a requested state. `PermissionRequestPreview` asks for Outlook calendar access with a "Simulate failure" toggle; continuing without access shows a generic answer plus a permission `LimitationNotice` whose "Allow access" reopens the request. `PrivacyNoticePreview` switches between Composer (an `InitialCta` with the notice inside its input box via `footer`) and Inline (a notice about an external web search inside a turn).

### Chatbot example ([src/examples/chatbot-example.tsx](src/examples/chatbot-example.tsx))

- Front-end only: replies are **canned responses** (`cannedResponses`) with sources, paragraphs that include citation ids, and follow-up suggestions. There is no API call.
- Each `Turn` animates on timers: stream of thought, an optional simulated error + retry, an optional approval step, then a word-by-word answer.
- Uses `InitialCta`, `Suggestions` (starters + follow-ups), `StreamOfThought`, `ToolResult` (outcome of the "Save notes" step: saved with Undo, undone, or not saved after a rejection), `Citations`/`CitationReference`, `Sheet` (settings: `showReasoning`, `requireApproval`, `simulateError`, `streamAnswer`), `Dialog` + `Textarea` (feedback), and `Button`.
- Prompts matching `/\b(email|send)\b/i` (e.g. the "Email the summary to my team" starter) end with a `ConfirmationPrompt` under the answer. The composer stays disabled until it's confirmed or cancelled; Edit returns the prompt to the composer, and a confirmed send shows a `ToolResult`.
- Each canned response can have `limitations` (`kind`, `title`, `detail?`, `requestAccess?`). Once the answer finishes, these appear as `LimitationNotice`s below `Sources`: AI risks → `stale`, rollout plan → `permission` with "Request access" (sets the turn's `accessRequested`), accessibility → `partial` with details.
- The composer passes `disclaimer=""` to `InitialCta` and passes an `embedded` `PrivacyNotice` as its `footer`, so the notice sits inside the input box (use, retention, sharing items + policy link). Prompts matching `/\b(web|internet|online)\b/i` (e.g. the "Search the web for AI news" starter) set `Turn.externalSearch`; once the search step starts, an inline `PrivacyNotice` appears above the reasoning.
- Prompts matching `/\b(calendar|meetings?|schedule)\b/i` (e.g. the "Check my calendar" starter) start with a `PermissionRequest` for Outlook calendar access. Reasoning and the composer wait until the user decides; continuing without access adds a permission `LimitationNotice` after the answer.
- `showReasoning` off swaps `StreamOfThought` for `ResponseStatus` (activity follows the current step's `kind`), falling back to `StreamOfThought` when waiting for approval or on error. Every answer shows `ResponseStatus activity="drafting"` for ~700ms before the first words.
- Turn actions: new chat, edit prompt, copy prompt/answer (clipboard), like/dislike feedback.
- Use it as the reference for how XDS components fit together in a real conversation layout.

## 9. Conventions

- **Function components** with named exports collected at the bottom of the file: `export { Button, buttonVariants }`.
- **Props**: extend native or base-ui props (`React.ComponentProps<"div">`, `SelectPrimitive.Trigger.Props`), destructure `className`, spread `...props` last.
- **`data-slot`** on every part (`data-slot="card-header"`, `"select-trigger"`…), plus `data-size`/`data-side` for variant state. Parents style children with selectors like `has-data-[slot=card-footer]:` and `*:data-[slot=select-value]:`.
- **Variants**: CVA for multi-variant components (export the variants helper); simple size props use `data-[size=…]` selectors instead.
- **Class merging**: always `cn(baseClasses, className)` so consumers can override.
- **File header** for each XDS component:
  ```ts
  /**
   * <Component Name>
   * XDS — Experience Design System
   * Version: 0.1.0
   * Owner: DD&IT Experience & Adoption
   */
  ```
- **Composition**: base-ui `render` prop, e.g. `<SheetTrigger render={<Button />}>Open</SheetTrigger>`.
- **Links from data** (citations, sources) must go through `getSafeHref()`. It allows only http(s) and relative URLs and throws otherwise.
- **Accessibility**: provide `ariaLabel` props with sensible defaults; use `useId` for ARIA relationships.
- **Imports**: `@/` alias for internal modules; `import type` for types.
- Styling is Tailwind utilities only. Don't add new CSS files or inline style objects for component styling. The one exception is the `.docs-hero` class in `src/index.css`, which is for the showcase header only.

## 10. Adding or changing a component

1. Create `src/components/xds/<kebab-name>.tsx`, or pull one from the registry: `npx shadcn@latest add @xds/<name>`. The `@xds` registry is configured in [components.json](components.json).
2. If the CLI generates into `src/components/ui/`, move the implementation to `xds/` and keep `ui/` as a re-export only.
3. Add the XDS header, `data-slot` attributes, and named exports.
4. Add an entry to `componentExamples` in [src/App.tsx](src/App.tsx) keyed by the filename. If it's an AI-specific component, also add its id to `conversationalAiIds`.
5. Run `npm run lint && npm run build`.
6. Update the catalog in this file.

### Registry sync

- To check for upstream updates, fetch `https://waw-usertown-dev-westeurope-01.azurewebsites.net/r/<name>.json` and compare `files[0].content` with the local file. Every item currently reports `meta.version` `0.1.0`, so compare the content, not the version.
- Last check (2026-11-04): `dialog` refreshed from the registry. `button`, `card`, `textarea` matched exactly. `select` and `sheet` differ only by the registry's `"use client"` line (left out locally). The conversational AI components (`action-plan`, `attachments`, `capability-intro`, `citations`, `initial-cta`, `limitation-notice`, `permission-request`, `privacy-notice`, `response-status`, `stream-of-thought`, `suggestions`) are not published in the registry; they're local only.

## 11. Gotchas for AI assistants

- **base-ui, not Radix**: don't use `asChild`, `@radix-ui/*`, or Radix prop names. Check the base-ui API (`render`, `Popup`, `Positioner`, `Backdrop`, `data-open`/`data-closed`).
- **Tailwind v4 only**: no `tailwind.config.js`, no `theme.extend`. Use CSS-variable syntax like `gap-(--card-spacing)` and `max-h-(--available-height)`.
- **Default Tailwind colors are removed**, so use the XDS palettes or semantic tokens.
- **Tokens live in `/styles`, not `/src`.**
- **Edit `xds/`, not `ui/`.** `ui/button.tsx` is only a shim.
- `cn` is the `cn` npm package, not a local `clsx` + `tailwind-merge` helper.
- **Prompt inputs always use `InitialCta`.** Any component, organism, preview, or example that accepts a user prompt must use `InitialCta`; don't build a separate text input or textarea for prompts.
- Components are controlled-friendly. For example, `InitialCta` requires `value` and `onValueChange`.
- `StreamOfThought` and `ResponseStatus` durations are in seconds.
- Shared step vocabulary (kind icons/labels, status labels, `formatDuration`) lives in `src/lib/thought-vocabulary.ts`. It's in `lib/` because any file in `xds/` would show up as a sidebar component.
- Composite demos belong in `src/examples/`, not `src/components/xds/`, because every file in `xds/` automatically appears as a sidebar component.

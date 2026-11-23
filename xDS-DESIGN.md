# xDS Design System — DESIGN.md

Design reference for building web pages with the **xDS** design system.
Source of truth: the xDS registry (`https://waw-usertown-dev-westeurope-01.azurewebsites.net/r/registry.json`, theme at `/r/theme.json`).
Stack: React + Tailwind CSS v4 + Base UI primitives (shadcn-style registry), icons from `lucide-react`.

---

## 1. Visual Principles

- **Monochrome first.** Interfaces are built from warm black (`#161616`), white and a neutral gray scale. Primary actions are black on light, near-white on dark.
- **Orange is a signal, not a surface.** Space Orange (`#ff4e00`) is the brand accent. Use it for brand moments, active indicators (e.g. tab underline), hover accents and chart series 1 — never as large backgrounds.
- **Quiet surfaces.** Containers are separated by a hairline ring (`ring-1 ring-foreground/10`) and very light shadows rather than heavy borders or elevation.
- **Compact density.** Base text is 14px (`text-sm`), default control height 36px.
- **Light and dark parity.** Every color is consumed through a semantic token that has a light and a dark value. Toggle dark mode with a `.dark` class on an ancestor.
- **Accessible by default.** Visible keyboard focus on every interactive element, pointer cursor on all interactive roles, semantic status colors always paired with text/icons.

---

## 2. Color

### 2.1 Brand palette (primitive tokens)

| Token | Hex |
|---|---|
| `white` | `#ffffff` |
| `black` (warm black) | `#161616` |

**Neutral**

| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|---|---|---|---|---|---|---|---|---|---|---|
| `#fafafa` | `#f5f5f5` | `#e5e5e5` | `#cfcfcf` | `#bdbdbd` | `#949494` | `#666666` | `#4f4f4f` | `#3d3d3d` | `#303030` | `#242424` |

**Space Orange (brand)** — base `space-orange-500`

| 100 | 200 | 300 | 400 | **500** | 600 | 700 | 800 | 900 |
|---|---|---|---|---|---|---|---|---|
| `#ffccbc` | `#ffaf8f` | `#ff9466` | `#ff7f48` | **`#ff4e00`** | `#e64a19` | `#d84315` | `#bf360c` | `#8e2606` |

**Red**

| 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
|---|---|---|---|---|---|---|---|---|
| `#fcd0cf` | `#fbb1b1` | `#f87777` | `#e85454` | `#ce0011` | `#b80000` | `#9e0000` | `#750000` | `#570000` |

**Green**

| 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
|---|---|---|---|---|---|---|---|---|
| `#d0f7cf` | `#abe9aa` | `#7dda7c` | `#4dbb26` | `#2e9e32` | `#008113` | `#006400` | `#004d00` | `#003d00` |

**Amber**

| 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
|---|---|---|---|---|---|---|---|---|
| `#ffefc2` | `#ffdb8f` | `#fcc264` | `#f3a220` | `#db7100` | `#bd5500` | `#a34600` | `#802f00` | `#611b00` |

### 2.2 Semantic tokens

Always style with semantic tokens (`bg-primary`, `text-muted-foreground`, `border-border`…), never raw hex.

| Token | Light | Dark | Use |
|---|---|---|---|
| `background` | white | black | Page background |
| `foreground` | black | neutral-50 | Default text |
| `card` / `card-foreground` | white / black | black / neutral-50 | Card surfaces |
| `popover` / `popover-foreground` | white / black | black / neutral-50 | Menus, popovers, dialogs |
| `primary` / `primary-foreground` | black / white | neutral-50 / black | Primary actions, checked controls |
| `secondary` / `secondary-foreground` | neutral-100 / black | neutral-900 / neutral-50 | Secondary (filled) actions |
| `muted` / `muted-foreground` | neutral-100 / neutral-600 | neutral-900 / neutral-400 | Subtle fills, hover, helper text |
| `accent` / `accent-foreground` | neutral-100 / black | neutral-800 / neutral-50 | Highlighted list items, info alerts |
| `destructive` | red-600 | red-400 | Destructive actions, errors on fields |
| `border` | neutral-200 | white 10% | Dividers, container borders |
| `input` | neutral-200 | white 15% | Form control borders |
| `ring` | neutral-400 | neutral-600 | Soft rings (e.g. slider thumb hover) |
| `focus` | black | white | Keyboard focus outline |
| `brand` / `brand-foreground` | space-orange-500 / white | space-orange-500 / white | Brand accent |
| `hover-accent` | space-orange-800 | space-orange-300 | Hover on primary/brand elements |
| `success` / `-foreground` / `-border` | green-200 / green-700 / green-400 | green-800 / green-300 / green-600 | Success feedback |
| `warning` / `-foreground` / `-border` | amber-200 / amber-700 / amber-400 | amber-800 / amber-300 / amber-600 | Warning feedback |
| `error` / `-foreground` / `-border` | red-200 / red-700 / red-400 | red-800 / red-300 / red-600 | Error feedback |
| `sidebar` | neutral-50 | black | Sidebar surface |
| `sidebar-primary` | black | space-orange-500 | Active sidebar item emphasis |
| `sidebar-accent` | neutral-100 | neutral-900 | Sidebar hover/active fill |
| `sidebar-border` | neutral-200 | white 10% | Sidebar dividers |

### 2.3 Chart palette

Use in order; series 1 is always brand orange.

| # | Hex | # | Hex | # | Hex | # | Hex |
|---|---|---|---|---|---|---|---|
| 1 | `#ff4e00` | 6 | `#939393` | 11 | `#6552a9` | 16 | `#d8e8fd` |
| 2 | `#161616` | 7 | `#b8a8f0` | 12 | `#71809f` | 17 | `#d89a87` |
| 3 | `#795ae7` | 8 | `#a8c8fa` | 13 | `#ffd5b0` | 18 | `#717171` |
| 4 | `#568af7` | 9 | `#b43c07` | 14 | `#dedede` | 19 | `#4a3a8c` |
| 5 | `#ffaa70` | 10 | `#3f3e3e` | 15 | `#e2dcf9` | 20 | `#2b5fd4` |

### 2.4 Color rules

- Text on `background`: `foreground` for content, `muted-foreground` for secondary text, captions, placeholders.
- Status surfaces pair background + foreground + border of the same family (e.g. `bg-success text-success-foreground border-success-border`).
- Destructive buttons/badges use a tint: `bg-destructive/10 text-destructive`, not a solid red fill.
- Limit brand orange to ≤ 1 prominent element per view.

---

## 3. Typography

### 3.1 Typeface

- **Family:** `VoltaModernDisplay`, fallback `Arial, sans-serif`. Same family for headings (`font-heading`) and body (`font-sans`).
- **Files** (served from `/assets/xds/fonts/`, `font-display: swap`):

| Weight token | Value | File |
|---|---|---|
| `font-normal` | 500 | `VoltaModernDisplay-55Roman.woff2` |
| `font-medium` | 600 | `VoltaModernDisplay-65Medium.woff2` |
| `font-bold` | 700 | `VoltaModernDisplay-75Bold.woff2` |

Only these three weights exist; Tailwind default weights are reset.

### 3.2 Type scale (Tailwind defaults)

| Class | Size / line-height | Use |
|---|---|---|
| `text-xs` | 12 / 16px | Badges, tooltips, shortcuts, chart labels, captions in dense UI |
| `text-sm` | 14 / 20px | **Body default**, buttons, labels, menu items, table cells |
| `text-base` | 16 / 24px | Inputs on mobile (prevents iOS zoom), lead text |
| `text-lg` | 18 / 28px | Dialog titles, H3 |
| `text-xl` | 20 / 28px | Sheet titles, H2 |
| `text-2xl` – `text-3xl` | 24–30px | Page titles, H1 |
| `text-4xl`+ | 36px+ | Marketing / hero headlines only |

### 3.3 Rules

- `body` is `text-sm bg-background text-foreground`.
- Headings and titles: `font-bold`. Labels, triggers, table heads: `font-medium`. Body: `font-normal`.
- Descriptions: `text-sm text-muted-foreground`; long descriptions use `text-balance`.
- Numeric values that update or align: `tabular-nums`.
- Keyboard shortcuts: `text-xs tracking-widest text-muted-foreground`.
- Link style: `text-primary underline-offset-4 hover:underline`.

---

## 4. Layout & Spacing

### 4.1 Spacing scale

Tailwind 4px base unit (`1` = 4px).

| Context | Value |
|---|---|
| Icon ↔ label inside controls | `gap-1` – `gap-1.5` (4–6px) |
| Related inline items | `gap-2` (8px) |
| Form field internals (label, control, help) | `gap-3` (12px) |
| Groups / sections inside a card | `gap-4` – `gap-6` (16–24px) |
| Container padding | `p-2` menus, `p-4` popovers/sheets, `p-6` dialogs/cards |
| Card spacing | default `24px`, `sm` `16px` |
| Page sections | `py-12` – `py-24` (48–96px) |

### 4.2 Sizing

| Element | Size |
|---|---|
| Control height xs / sm / **default** / lg | 24 / 32 / **36** / 40px (`h-6`/`h-8`/`h-9`/`h-10`) |
| Icon button | `size-6` / `size-8` / `size-9` / `size-10` |
| Checkbox, radio, default icon | 16px (`size-4`) |
| Avatar sm / default / lg | 24 / 32 / 40px |
| Badge height | 20px (`h-5`) |
| Popover width | `w-72` (288px) |
| Hover card width | `w-64` (256px) |
| Dialog | `max-w-md` (448px) |
| Alert dialog | `max-w-xs`, `sm:max-w-lg`; small size `max-w-xs` |
| Sheet (left/right) | `w-3/4 sm:max-w-sm` |
| Sidebar | 16rem expanded, 3rem icon-only, 18rem mobile |
| Command list | `max-h-72` |

### 4.3 Grid & breakpoints

- Breakpoints: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, `2xl` 1536px.
- Mobile breakpoint for app behaviors (`useIsMobile`): below 768px — sidebar becomes a sheet.
- Content max widths: reading content `max-w-3xl`, app content `max-w-7xl`, centered with `mx-auto px-4 md:px-6`.
- Use container queries for component-level responsiveness (e.g. Field `@md/field-group:flex-row`).
- Footers of dialogs stack on mobile (`flex-col-reverse`) and align right from `sm` (`sm:flex-row sm:justify-end`).

---

## 5. Shape, Elevation & Motion

### 5.1 Radius

Base `--radius: 0.625rem` (10px).

| Token | Calc | px | Use |
|---|---|---|---|
| `rounded-sm` | ×0.6 | 6 | Combobox chips, command items |
| `rounded-md` | ×0.8 | 8 | Buttons, inputs, selects, menus, popovers, tooltips |
| `rounded-lg` | ×1 | 10 | Alerts, tab list, hover cards, chart tooltip |
| `rounded-xl` | ×1.4 | 14 | Cards, dialogs, command, drawers |
| `rounded-2xl`–`3xl` | ×1.8–2.2 | 18–22 | Large hero media |
| `rounded-4xl` | ×2.6 | 26 | Pills (badges) |
| `rounded-full` | — | — | Avatars, switches, radios, slider/progress tracks |

Checkbox uses `rounded-[4px]`; xs buttons cap at `min(var(--radius-md), 8px)`.

### 5.2 Elevation

| Level | Recipe | Use |
|---|---|---|
| Flat | none | Page sections |
| Hairline | `ring-1 ring-foreground/10` | Cards, dialogs, popovers, menus |
| xs | `shadow-xs` | Inputs, outline buttons, checkbox, switch, cards |
| sm | `shadow-sm` | Active tab indicator, slider thumb |
| md | `shadow-md` | Popovers, select/combobox content, hover card |
| xl | `shadow-xl` | Chart tooltip |

Overlay/backdrop: `fixed inset-0 z-50 bg-black/10 backdrop-blur-xs`.

### 5.3 Motion

- Default easing: `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out); simple color changes use `transition-colors`.
- Durations: 100ms (overlays, micro), 200ms (tab indicator, ease-in-out), 300ms (page transitions), 450ms (drawer).
- Popups enter/exit: `animate-in fade-in-0 zoom-in-95` / `animate-out fade-out-0 zoom-out-95`.
- Accordion: `animate-accordion-down` / `animate-accordion-up`.
- Sheets slide 2.5rem from their side; drawers follow swipe progress.
- Loading: `animate-spin` (spinner), `animate-pulse` (skeleton).
- Button press: `active:translate-y-px`.

---

## 6. Interaction States

| State | Recipe |
|---|---|
| **Focus (keyboard)** | `focus-visible:focus-indicator` → `outline-1 outline-offset-2 outline-solid outline-focus` (black on light, white on dark) |
| **Hover** | Neutral: `hover:bg-muted`. Primary: `hover:bg-hover-accent`. Text links/nav: `hover:text-foreground` / `hover:underline` |
| **Active / pressed** | `active:translate-y-px` (buttons); `aria-pressed:bg-muted` (toggles); `aria-expanded:bg-muted` |
| **Selected** | `data-checked:bg-primary data-checked:border-primary data-checked:text-primary-foreground`; list items `data-highlighted:bg-accent`; table rows `data-[state=selected]:bg-muted` |
| **Disabled** | `disabled:pointer-events-none disabled:opacity-50` (inputs: `cursor-not-allowed`) |
| **Invalid** | `aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20` (dark: `/40`) |
| **Placeholder** | `placeholder:text-muted-foreground` |
| **Cursor** | `cursor: pointer` on all enabled buttons, links and interactive ARIA roles (tab, option, menuitem, checkbox, radio, switch, slider, combobox) |

---

## 7. Iconography

- Library: `lucide-react`, outline style, stroke default.
- Default size `size-4` (16px); badges `size-3`; breadcrumb separators and check indicators `size-3.5`; empty-state media larger.
- Icons inherit `currentColor`; secondary icons use `text-muted-foreground`.
- Icons inside controls are `shrink-0` and sit in the control's gap — never add manual margins.
- Common icons: `ChevronDown` (select, accordion, nav), `ChevronRight` (breadcrumb), `Check` (checkbox, select), `X` (close), `Loader2` (spinner).

---

## 8. Components

All components live in `@/components/xds/*` and are installed from the registry (`@xds/<name>`).

### 8.1 Actions

**Button**

| Variant | Style |
|---|---|
| `default` | `bg-primary text-primary-foreground hover:bg-hover-accent` |
| `outline` | `border-border bg-background shadow-xs hover:bg-muted` |
| `secondary` | `bg-secondary text-secondary-foreground` (filled neutral) |
| `ghost` | transparent, `hover:bg-muted` |
| `destructive` | `bg-destructive/10 text-destructive` |
| `link` | `text-primary underline-offset-4 hover:underline` |

| Size | Classes |
|---|---|
| `xs` | `h-6 px-2 gap-1 text-xs` |
| `sm` | `h-8 px-2.5 gap-1` |
| `default` | `h-9 px-2.5 gap-1.5` |
| `lg` | `h-10 px-2.5 gap-1.5` |
| `icon-xs` / `icon-sm` / `icon` / `icon-lg` | `size-6` / `size-8` / `size-9` / `size-10` |

Shape `rounded-md border border-transparent`; text `text-sm font-medium`. One `default` button per region; pair with `outline`/`ghost` for secondary actions.

**Button Group** — joins buttons/inputs into one control; inner radii and borders collapse; uses `Separator` between items. Horizontal or vertical.

**Toggle** — `default` (transparent) or `outline` (`border border-input shadow-xs`); sizes `h-8`/`h-9`/`h-10` with matching `min-w`; pressed `aria-pressed:bg-muted`; `rounded-md`.

**Toggle Group** — set of toggles, single or multiple selection; `spacing=0` renders a connected segmented control (`shadow-xs`, inner `rounded-none`); selected item `bg-muted`.

### 8.2 Form controls

**Label** — `text-sm font-medium flex items-center gap-2`; dims with `peer-disabled:opacity-50`.

**Field** — composes label, control, description, error. Orientation `vertical` (default), `horizontal` (`flex-row items-center`), `responsive`. Gap `gap-3`. Description `text-sm text-muted-foreground`; error `text-sm text-destructive`.

**Input** — `h-9 px-2.5 py-1 rounded-md border border-input bg-transparent shadow-xs text-base md:text-sm`; dark `bg-input/30`; focus/invalid/disabled per §6.

**Textarea** — like Input, `min-h-16 px-2.5 py-2`, auto-grows (`field-sizing-content`).

**Input Group** — wraps input/textarea with addons: `flex h-9 rounded-md border border-input shadow-xs`; inner input borderless; addons `text-sm text-muted-foreground gap-2`; embedded buttons `xs`/`icon-xs`/`sm`/`icon-sm`. Invalid state propagates to the wrapper.

**Select** — trigger `h-9` (sm `h-8`), `rounded-md border border-input pl-2.5 pr-2`, chevron `size-4 text-muted-foreground`. Content `rounded-md bg-popover shadow-md ring-1 ring-foreground/10`. Items `py-1.5 pl-2 pr-8 text-sm`, `focus:bg-accent`, check icon on selected.

**Combobox** — input-based autocomplete with filtering, single or multiple. Content same as Select, width matches anchor. Items `data-highlighted:bg-accent`. Multiple mode shows chips: `bg-muted px-1.5 text-xs rounded-sm` inside a `min-h-9` field. Empty state centered `py-2`.

**Checkbox** — `size-4 rounded-[4px] border border-input shadow-xs`; checked fills `primary` with `Check` `size-3.5`.

**Radio Group** — items `size-4 rounded-full border border-input shadow-xs`; checked fills `primary` with inner `size-2` dot.

**Switch** — default `32×18.4px`, sm `24×14px`, `rounded-full`; off `bg-input`, on `bg-primary`; thumb `size-4` / `size-3`, slides with `transition-transform`.

**Slider** — track `h-1.5 rounded-full bg-muted`, range `bg-primary`, thumb `size-4 rounded-full border border-primary bg-white shadow-sm`, `hover:ring-4 ring-ring/50`. Supports range and vertical (`min-h-40`).

**Calendar** — cell `--spacing(8)` (32px); days `hover:bg-muted`; selected `bg-primary text-primary-foreground`; range middle `bg-muted`; today `bg-muted`; outside days `text-muted-foreground opacity-50`.

**Questionnaire** — guided single-choice, multiple-choice, freeform and optional questions; uses xDS Button for navigation; options follow selection states in §6.

### 8.3 Feedback & status

**Alert** — `grid gap-0.5 rounded-lg border px-4 py-3 text-sm`; icon `size-4` spans two rows; title `font-bold`; description `text-sm text-muted-foreground text-balance`.

| Variant | Style |
|---|---|
| `default` | `bg-card` |
| `info` | `bg-accent text-accent-foreground` |
| `success` | `bg-success text-success-foreground border-success-border` |
| `warning` | `bg-warning text-warning-foreground border-warning-border` |
| `error` | `bg-error text-error-foreground border-error-border` |
| `destructive` | `bg-card text-destructive` |

**Badge** — `h-5 px-2 py-0.5 text-xs font-medium rounded-4xl`; icons `size-3`. Variants: `default` (primary), `secondary`, `destructive` (`bg-destructive/10 text-destructive`), `outline` (`border-border`), `ghost`, `link`.

**Progress** — track `h-1.5 rounded-full bg-muted`, indicator `bg-primary`; optional label `text-sm font-medium` and value `text-sm text-muted-foreground tabular-nums`.

**Spinner** — `Loader2` `size-4 animate-spin`, `role="status"`.

**Skeleton** — `rounded-md bg-muted animate-pulse`; match the size of the content it replaces.

**Toast** — brief notification at the screen edge; popover-style surface (`bg-popover`, hairline ring, `shadow-md`, `rounded-lg`), title `font-medium`, description `text-muted-foreground`, optional action/close via Button. Status variants mirror Alert colors.

**Empty** — centered empty-state layout: media (icon in `bg-muted` rounded tile or illustration), title `font-medium`/`text-lg`, description `text-sm text-muted-foreground`, actions row of Buttons.

**Tooltip** — inverted: `rounded-md bg-foreground text-background px-3 py-1.5 text-xs`, arrow `size-2.5`. Short text only.

### 8.4 Navigation

**Tabs** — list `default`: `h-9 rounded-lg bg-muted p-[3px]` with sliding indicator `rounded-md bg-background shadow-sm`; list `line`: transparent, indicator `h-0.5 bg-brand`. Triggers `px-2 py-1 text-sm font-medium text-foreground/60 hover:text-foreground`, active `text-foreground`. Indicator animates 200ms.

**Breadcrumb** — `flex flex-wrap gap-1.5 text-sm text-muted-foreground`; links `hover:text-foreground`; current page `text-foreground`; separator `ChevronRight size-3.5`; ellipsis `size-5`.

**Navigation Menu** — horizontal links; triggers `h-9 px-4 py-2 text-sm font-medium rounded-md hover:bg-muted`, chevron `size-3` rotates when open; panel `rounded-lg bg-popover shadow ring-1 ring-foreground/10 p-2`; links `rounded-md p-2 hover:bg-muted`, active `bg-muted/50`.

**Pagination** — centered `gap-1`; page links are icon-size Buttons: active `outline`, inactive `ghost`; Previous/Next show chevron + label; ellipsis `size-9`.

**Sidebar** — app shell navigation. Widths 16rem / 3rem (icon) / 18rem (mobile sheet). Surface `bg-sidebar text-sidebar-foreground`; groups `p-2`; menu buttons `h-8 px-2 rounded-md text-sm gap-2`, `hover:bg-sidebar-accent`, active `bg-sidebar-accent text-sidebar-accent-foreground`. Collapsible `icon` or `offcanvas`; `inset` variant puts main content in a `rounded-xl` panel with `m-2`. Includes resize rail.

**Command** — searchable palette: `rounded-xl bg-popover p-1`; search via Input Group (`h-8 bg-input/30`); list `max-h-72`; group headings `px-2 py-1.5 text-xs font-medium text-muted-foreground`; items `rounded-sm px-2 py-1.5 text-sm gap-2`, selected `bg-muted`; shortcuts right-aligned. Can open inside Dialog.

### 8.5 Containers & overlays

**Card** — `rounded-xl bg-card text-card-foreground shadow-xs ring-1 ring-foreground/10`; spacing 24px (`sm`: 16px) across header, content, footer; title `font-bold`, description `text-sm text-muted-foreground`; a leading image removes top padding.

**Accordion** — items separated by `border-b`; trigger `py-4 text-sm font-medium hover:underline` with `ChevronDown size-4 text-muted-foreground`; content `pb-4 text-sm`, animated height.

**Collapsible** — unstyled show/hide primitive; style trigger as Button `ghost`/`outline`.

**Separator** — `h-px w-full bg-border` or vertical `w-px self-stretch bg-border`.

**Scroll Area** — custom thin scrollbar over overflow content; thumb `rounded-full bg-border`.

**Aspect Ratio** — fixed-ratio media frame (e.g. 16/9, 1/1, 4/3); pair with `rounded-lg overflow-hidden`.

**Popover** — `w-72 rounded-md bg-popover p-4 text-sm shadow-md ring-1 ring-foreground/10`; title `font-medium`.

**Hover Card** — `w-64 rounded-lg bg-popover p-4 text-sm shadow-md ring-1 ring-foreground/10`; for previews only, never essential actions.

**Dialog** — overlay per §5.2; content centered `max-w-md rounded-xl bg-popover p-6 text-sm ring-1 ring-foreground/10`; header `gap-2`, title `text-lg font-bold`, description `text-sm text-muted-foreground`; close button `icon-sm` at `top-4 right-4`; footer buttons right-aligned.

**Alert Dialog** — confirmation modal, `grid gap-6`; header centered on mobile, left-aligned from `sm`; optional media tile `size-16 rounded-md bg-muted`; footer `flex-col-reverse gap-2 sm:flex-row sm:justify-end` (cancel `outline`, confirm `default` or `destructive`).

**Sheet** — slide-over from `top`/`right`/`bottom`/`left`; side sheets `w-3/4 sm:max-w-sm h-full` with border on the inner edge; header `p-4 gap-1.5`, title `text-xl font-bold`.

**Drawer** — swipeable bottom/side panel; `rounded-t-xl` (bottom); handle `h-1.5 w-[100px] rounded-full bg-muted`; max height `100dvh - 6rem`; overlay fades with swipe.

**Carousel** — horizontal or vertical slides (`basis-full`); prev/next round `outline` icon buttons outside the track (`-left-12`/`-right-12`), disabled at ends.

### 8.6 Data display

**Table** — header row `border-b`, head cells `h-10 px-2 text-left font-medium whitespace-nowrap`; cells `p-2 align-middle`; rows `border-b hover:bg-muted/50`, selected `bg-muted`; footer `border-t bg-muted/50 font-medium`; caption `mt-4 text-sm text-muted-foreground`.

**Avatar** — `rounded-full`, sizes `size-6`/`size-8`/`size-10`; fallback initials `bg-muted text-muted-foreground text-sm`; status badge bottom-right `bg-primary ring-2 ring-background`; groups overlap `-space-x-2` with `ring-2 ring-background`.

**Chart** — Recharts in a `aspect-video text-xs` container; axis text `muted-foreground`, grid lines `border/50`; tooltip `rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl`; legend `gap-4` centered. Colors from §2.3 in order.

**Attachment** — file chip with preview, metadata, actions, upload state. Sizes `default` (`px-2.5 py-2 text-sm`), `sm` (`px-2 py-1.5 text-xs`), `xs` (`px-1.5 py-1 rounded-lg`). Media tile `size-10 rounded-lg bg-muted`. States: idle `border-dashed`, uploading/processing (progress/spinner), error `border-destructive/30 bg-destructive/10`, done `border-solid`. Title `font-medium truncate`, meta `text-xs text-muted-foreground`. Groups scroll horizontally with snap.

---

## 9. Page Composition Patterns

- **App shell:** Sidebar (left) + main area with a top bar (`h-14`, `border-b`, breadcrumb left, actions right) + content `p-4 md:p-6`.
- **Settings / forms:** single column `max-w-2xl`, Field groups separated by `Separator`, actions at bottom-right.
- **Dashboard:** responsive grid of Cards (`grid gap-4 md:grid-cols-2 xl:grid-cols-4`), KPI value `text-2xl font-bold tabular-nums`, label `text-sm text-muted-foreground`.
- **Data list:** toolbar (Input Group search + filter Select + `default` action) above a Table, Pagination below.
- **Marketing / landing:** white background, large bold headlines (`text-4xl md:text-6xl font-bold`), muted subcopy, one `default` CTA + one `outline` CTA, orange used only as an accent detail.

---

## 10. Do / Don't

| Do | Don't |
|---|---|
| Use semantic tokens (`bg-primary`, `text-muted-foreground`) | Hard-code hex values or Tailwind default palette colors |
| Keep orange for brand accents and indicators | Fill large areas or primary buttons with orange |
| Use `ring-1 ring-foreground/10` + `shadow-xs` for surfaces | Add heavy custom shadows or thick borders |
| Use only weights 500 / 600 / 700 | Use `font-light`, `font-semibold`, `font-black` |
| Keep controls at 32/36/40px heights | Invent intermediate control heights |
| Apply `focus-visible:focus-indicator` on custom interactive elements | Remove outlines or rely on color alone for focus |
| Pair status colors with icon + text | Communicate state by color only |
| Test every screen in light and dark | Design light-only |
| Compose from xDS components | Re-implement components with raw markup |

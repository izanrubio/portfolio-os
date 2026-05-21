@AGENTS.md

# IzanOS — Aurora Portfolio

Interactive OS-style portfolio for Izan Rubio Cerezo. macOS-inspired desktop with aurora animated background, glassmorphism windows, boot sequence, file explorer, embedded browser, and real terminal.

Stack: **Next.js 16 (App Router)**, React 19, TypeScript, Tailwind CSS v4. Deployed on Vercel.

## Run locally

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Folder structure

```
/app
  layout.tsx         — fonts (JetBrains Mono, Inter), metadata
  page.tsx           — boot → desktop orchestration
  globals.css        — CSS theme vars (dark/light), aurora blob classes, reset, scrollbars
/components
  LockScreen.tsx     — aurora bg + frosted glass, clock, profile, breathe hint, Framer Motion unlock fade
  NotificationSystem.tsx — context + hook + stack UI; NotificationProvider, useNotifications, default export
  Spotlight.tsx          — Cmd/Ctrl+K search overlay; apps, skills, projects, quick actions
  BootScreen.tsx     — 4s boot: dragon SVG, progress bar, system messages
  Desktop.tsx        — #000 bg + ParticleNetwork canvas (hero) + 3 aurora CSS blobs at reduced opacity, no desktop icons
  ParticleNetwork.tsx — canvas RAF animation: 45 nodes, velocity bounce, mouse proximity lighting, connection lines, data pulses
  Menubar.tsx        — fixed top 28px: IzanOS logo left, lang switcher (CAS·CAT·ENG) + wifi+battery+clock right, blur bg
  Taskbar.tsx        — floating dock (8 icons, all apps), centered bottom-18px
  Window.tsx         — draggable, resizable, glassmorphism shell (TASKBAR_H = 110)
  WindowManager.tsx  — useWindowManager hook + 8-window renderer
  /icons
    ProjectsIcon.tsx — 60×60, green gradient #00c97a→#00ff9d + folder SVG
    AboutIcon.tsx    — 60×60, purple gradient #7b2ff7→#a855f7 + person SVG
    SkillsIcon.tsx   — 60×60, blue gradient #0066ff→#00d4ff + lightning SVG
    ContactIcon.tsx  — 60×60, orange gradient #ff6b00→#ff9500 + mail SVG
    BrowserIcon.tsx  — 60×60, blue-purple gradient + globe SVG
    FilesIcon.tsx    — 60×60, green-blue gradient + folder SVG
    GameIcon.tsx     — 60×60, red gradient #ff4757→#ff6b35 + game controller SVG
    TerminalIcon.tsx — 60×60, dark gradient + green >_ SVG
  /windows
    ProjectsWindow.tsx  — sidebar (200px) + detail panel, useState project selector
    WhoamiWindow.tsx    — photo with duotone overlays + role typer animation (useEffect)
    SkillsWindow.tsx    — categorized skill cards with proficiency bars (Expert/Advanced/Proficient)
    ContactWindow.tsx   — split layout: contact items left, form right
    BrowserWindow.tsx   — simulated browser: internal portfolio or iframe
    FilesWindow.tsx     — sidebar groups + breadcrumb toolbar + file grid + statusbar
    TerminalWindow.tsx  — Kali-style prompt ┌──(izanos㉿IzanOS)-[~] with interactive history
    GameWindow.tsx      — Firewall Breaker breakout game; canvas + useRef game loop, 3 levels, RAF cleanup
    PortfolioSite.tsx   — internal website rendered inside BrowserWindow
/contexts
  LanguageContext.tsx — Lang type ('CAS'|'CAT'|'ENG'), LanguageProvider, useLanguage(); persists to localStorage key 'izanos-lang'; default 'CAS'
  ThemeContext.tsx   — Theme type ('dark'|'light'), ThemeProvider, useTheme(); persists to localStorage key 'izanos-theme'; default 'dark'
/data
  content.ts         — ALL content: personal, projects, skills, filesystem, terminal, browser
  translations.ts    — All UI strings in 3 languages + t(key, lang) helper + tRoles(lang) for the WhoamiWindow typing animation
/types
  windows.ts         — WindowId, WindowState (with browserUrl), FileNode, DesktopIcon
/public
  /images
    foto-portafolio.png  — profile photo (grayscale in whoami)
  cv.pdf                 — CV download (referenced in files.exe)
```

## Dark / Light theme

- **Toggle button**: sun/moon icon in Menubar, between lang switcher and wifi. Calls `toggleTheme()`. CSS crossfade animation defined in `globals.css` via `.theme-toggle .moon/.sun`.
- **ThemeProvider**: wraps entire app in `page.tsx` (outermost). `useTheme()` → `{ theme, toggleTheme }`
- **Persistence**: `localStorage.setItem('izanos-theme', theme)`. Anti-flash inline script in `layout.tsx` sets `data-theme` before React hydrates.
- **CSS vars**: `globals.css` defines full variable sets under `html[data-theme="dark"]` and `html[data-theme="light"]` — `--bg`, `--menubar-bg/bd/text`, `--dock-bg/bd`, `--tip-bg/text/bd`, `--win-body/bd`, `--titlebar-bg/bd`, `--title-text`, `--b1/b2/b3-color`, `--aurora-blend`, `--grain-opacity/blend`, etc.
- **Components**: Desktop uses CSS classes `.aurora-blob-1/2/3`, `.aurora-grain`, `.desktop-bg`. Menubar uses `.menubar-bar` class. Dock uses `.dock-pill`. Window chrome uses `.win-chrome`, `.win-titlebar`, `.win-title-text`.
- **Terminal always dark**: terminal window gets `.w-term` class on its chrome div — overrides theme vars with hardcoded dark values via `!important`.
- **Terminal command**: `theme --switch` toggles theme and prints confirmation.
- Transitions: `background-color 400ms ease, border-color 400ms ease, color 400ms ease` on shell elements.

## i18n / Language switcher

- Languages: **CAS** (Castellano, default), **CAT** (Català), **ENG** (English)
- Provider: `LanguageProvider` wraps entire app in `page.tsx` (outside NotificationProvider). `useLanguage()` → `{ lang, setLang }`
- All UI strings: `t(key, lang)` from `data/translations.ts`. Roles array: `tRoles(lang)`
- Switcher: inline in `Menubar.tsx`, right group, left of wifi icon. Active lang = bordered pill; inactive = 40% opacity + hover 70%
- Adding a new translatable string: add key+value for all 3 langs in `data/translations.ts`; call `t('your.key', lang)` in the component after importing `useLanguage` + `t`

## Editing content

All content in `/data/content.ts`. No hardcoded strings elsewhere.

- **Personal**: `personal` — name, shortName, role, roles[], bio, email, github, linkedin, location, photo
- **Lock screen**: `lockScreen` — version string (e.g. `'Aurora 0.3'`)
- **Notifications**: `notifications` — all notification copy
- **Spotlight**: `spotlight` — apps list and quick actions copy (`{ apps[], actions[] }`): `welcome`, `projectsOpened`, `contactOpened`, `terminalOpened`, `idleHire`, `intrusionDetected`
- **Projects**: `projects[]` — slug, name, category, description, longDescription, stack, demo, repo, repoShort, launched, status
- **Skills**: `skills: SkillCategory[]` — array of `{key, label, proficiency, items[]}`. `ProficiencyLevel = 'Expert' | 'Advanced' | 'Proficient'`
- **File system**: `filesystem` — nested `FileNode` tree. Files have `action: { type, payload }` — types: `browser` (open URL), `download`, `preview`
- **Terminal**: `terminal.commands`, `terminal.easterEggs`, `terminal.projectDetails`
- **Browser**: `browser.homepage`, `browser.bookmarks`

## Window system

- `useWindowManager()` in WindowManager.tsx manages all state
- `windowState.browserUrl` controls BrowserWindow navigation (updated via `navigateBrowser()`)
- FilesWindow receives `onOpenBrowser` callback to trigger browser navigation

## Window snap

Implemented in `Window.tsx`. All snap state is local (`useState`) — no changes to WindowManager needed.

- **Left snap**: drag title bar to x < 20px → snaps to `{ x:0, y:28, width:50vw, height:100vh-28-48 }`
- **Right snap**: drag to x > innerWidth-20px → snaps to `{ x:50vw, y:28, width:50vw, height:100vh-28-48 }`
- **Top snap**: drag to y < 20px → calls `onMaximize` (toggle)
- **Preview**: `rgba(0,212,255,0.1)` fixed overlay with cyan border, rendered as React fragment sibling to `<AnimatePresence>` (avoids transform inheritance from `motion.div`)
- **Animation**: CSS transition `250ms cubic-bezier(0.16,1,0.3,1)` on left/top/width/height (transition is disabled during drag, re-enabled on mouseup → smooth snap)
- **`savedPreSnap`**: tracks last cursor position NOT near any edge, so restore always targets a sensible previous position (never a clamped-to-zero coordinate)
- **Un-snap via double-click**: restores `preSnap` state; if window is maximized (top-snap), calls `onMaximize` first then sets position/size
- **Un-snap via drag**: detects `preSnap !== null` on mousedown, restores original size with cursor position proportional to title bar width, clears preSnap

## Adding a new window

1. Add `WindowId` to `types/windows.ts`
2. Add to `DEFAULT_WINDOWS` in `WindowManager.tsx` with default position/size
3. Create `components/windows/YourWindow.tsx`
4. Add to `CONTENT` map in `WindowManager.tsx`
5. Add icon component to `components/icons/` and add to `DOCK_ITEMS` in `Taskbar.tsx`

## Spotlight

- Trigger: `Cmd+K` / `Ctrl+K` toggles; `Escape` or click-outside closes
- Mounted inside `appState === 'desktop'` in `page.tsx` with `onOpenWindow` and `onNavigate` props
- `z-index: 500`; overlay `rgba(0,0,0,0.5) + blur(8px)`; panel `640px` centered at `top: 20vh`
- Sections: **Applications** (7 apps) → **Quick Actions** (CV download, Send email, View GitHub) → **Search Results** (skills + projects, query-filtered)
- Arrow keys navigate, Enter commits, mouse hover updates active row
- Query highlights matched text in cyan (`#00d4ff`)
- Quick actions: CV downloads `/cv.pdf`, email opens `contact`, GitHub calls `navigateBrowser('https://github.com/izanrubio')`
- All app/action copy in `data/content.ts` under `spotlight`; skills/projects sourced from existing exports

## Notification system

- `NotificationProvider` wraps the entire app in `page.tsx`; `<NotificationSystem />` is a sibling inside the provider
- `useNotifications()` → `{ notify }` — call from any client component
- `notify({ type, app, title, body })` — types: `message` | `system` | `alert` | `achievement`
- Stack: `fixed top:44px right:16px`, `width:320px`, `z-index:9999`, newest on top
- Enter: `x:110%→0 + opacity 0→1`, 400ms spring. Exit: `x:0→110% + opacity 1→0`, 300ms ease-in
- Auto-dismiss: 5s; progress bar at bottom of each card
- Triggers: welcome 3s after desktop, per-window on first open (projects/contact/terminal), idle 60s, intrusion on `nmap localhost`/`exploit` in terminal
- Notification text sourced via `t('notif.X.title/body', lang)` at call site — lang-aware at fire time via `langRef`
- All copy in `data/translations.ts` under `notif.*` keys

## App state flow

`page.tsx` manages a `AppState = 'booting' | 'locked' | 'desktop'` enum:
1. **booting** — `BootScreen` renders (4s boot sequence)
2. **locked** — `LockScreen` renders; click or any keypress triggers Framer Motion fade-out (600ms)
3. **desktop** — Menubar + Desktop + Taskbar render; `useWindowManager` state active

## Taskbar / Menubar architecture

- **Menubar** (`top: 0`) — fixed 28px bar: IzanOS logo left, lang switcher + theme toggle + wifi+battery+clock right. `z-index: 100`.
- **Dock** (`bottom: 18px`, centered) — floating pill with ALL 7 icons. `z-index: 50`.
  - Icons: projects / whoami / skills / contact | separator | browser / files / terminal
  - Magnification: cosine falloff, `SCALE_MAX=1.40`, `RANGE=130px`
  - Tooltip: appears on nearest icon within 60px, `position:absolute bottom:calc(100%+12px)`
  - Open indicator: white `#fff` dot below each icon, opacity 0→1 when window open
  - Press feedback: `scale(0.92)` on mousedown
  - No desktop icons — all apps via dock only

## Design system

- Background: `#000` + ParticleNetwork canvas (hero, z-index 0) + aurora blobs (z-index 1) at reduced opacity as ambient glow
- ParticleNetwork: 45 nodes, velocity ±0.4, mouse-proximity lighting (120px radius), connections within 150px, RAF loop, theme read from `data-theme` DOM attr each frame. No React state in loop — all refs
- Aurora blobs (dark): green `rgba(0,255,102,0.06)`, blue `rgba(0,102,255,0.05)`, cyan `rgba(0,255,255,0.04)` — reduced from 0.12/0.10/0.08 since network is hero
- Aurora blobs (light): mint `rgba(0,201,122,0.04)`, lavender `rgba(124,58,237,0.03)`, sky `rgba(0,102,255,0.02)`
- Aurora keyframes in `app/globals.css`: `aurora-drift-1` (20s), `aurora-drift-2` (25s), `aurora-pulse-3` (15s)
- Dock glass: `rgba(255,255,255,0.08)` + `backdrop-filter:blur(40px) saturate(180%)`, border `rgba(255,255,255,0.12)`
- Window glass: `rgba(10,15,30,0.92)` + `backdrop-filter: blur(20px) saturate(180%)`
- Window border: `1px solid rgba(0,212,255,0.2)`
- Title bar: `rgba(8,12,24,0.95)`, traffic lights: `#ff4757` / `#ffd32a` / `#00ff88`
- Text: primary `#f0f4ff`, secondary `#8892a4`, muted `#4a5568`

## Code conventions

- `'use client'` on all interactive components
- Inline styles for colors/design values — Tailwind for layout/spacing
- `useCallback` + `useRef` for performance-sensitive handlers
- Window drag/resize: manual `mousemove` events, `dragging` state disables CSS transitions during drag
- Mobile: windows open fullscreen (no drag/resize), single-click opens
- No comments unless WHY is non-obvious

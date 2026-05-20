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
  globals.css        — reset, custom scrollbars
/components
  LockScreen.tsx     — aurora bg + frosted glass, clock, profile, breathe hint, Framer Motion unlock fade
  NotificationSystem.tsx — context + hook + stack UI; NotificationProvider, useNotifications, default export
  BootScreen.tsx     — 4s boot: dragon SVG, progress bar, system messages
  Desktop.tsx        — #000 bg + 3 aurora CSS blobs (green/blue/cyan) + film grain, no desktop icons
  Menubar.tsx        — fixed top 28px: IzanOS logo left, wifi+battery+clock right, blur bg
  Taskbar.tsx        — floating dock (7 icons, all apps), centered bottom-18px
  Window.tsx         — draggable, resizable, glassmorphism shell (TASKBAR_H = 110)
  WindowManager.tsx  — useWindowManager hook + 7-window renderer
  /icons
    ProjectsIcon.tsx — 60×60, green gradient #00c97a→#00ff9d + folder SVG
    AboutIcon.tsx    — 60×60, purple gradient #7b2ff7→#a855f7 + person SVG
    SkillsIcon.tsx   — 60×60, blue gradient #0066ff→#00d4ff + lightning SVG
    ContactIcon.tsx  — 60×60, orange gradient #ff6b00→#ff9500 + mail SVG
    BrowserIcon.tsx  — 60×60, blue-purple gradient + globe SVG
    FilesIcon.tsx    — 60×60, green-blue gradient + folder SVG
    TerminalIcon.tsx — 60×60, dark gradient + green >_ SVG
  /windows
    ProjectsWindow.tsx  — sidebar (200px) + detail panel, useState project selector
    WhoamiWindow.tsx    — photo with duotone overlays + role typer animation (useEffect)
    SkillsWindow.tsx    — categorized skill cards with proficiency bars (Expert/Advanced/Proficient)
    ContactWindow.tsx   — split layout: contact items left, form right
    BrowserWindow.tsx   — simulated browser: internal portfolio or iframe
    FilesWindow.tsx     — sidebar groups + breadcrumb toolbar + file grid + statusbar
    TerminalWindow.tsx  — Kali-style prompt ┌──(izanos㉿IzanOS)-[~] with interactive history
    PortfolioSite.tsx   — internal website rendered inside BrowserWindow
/data
  content.ts         — ALL content: personal, projects, skills, filesystem, terminal, browser
/types
  windows.ts         — WindowId, WindowState (with browserUrl), FileNode, DesktopIcon
/public
  /images
    foto-portafolio.png  — profile photo (grayscale in whoami)
  cv.pdf                 — CV download (referenced in files.exe)
```

## Editing content

All content in `/data/content.ts`. No hardcoded strings elsewhere.

- **Personal**: `personal` — name, shortName, role, roles[], bio, email, github, linkedin, location, photo
- **Lock screen**: `lockScreen` — version string (e.g. `'Aurora 0.3'`)
- **Notifications**: `notifications` — all notification copy: `welcome`, `projectsOpened`, `contactOpened`, `terminalOpened`, `idleHire`, `intrusionDetected`
- **Projects**: `projects[]` — slug, name, category, description, longDescription, stack, demo, repo, repoShort, launched, status
- **Skills**: `skills: SkillCategory[]` — array of `{key, label, proficiency, items[]}`. `ProficiencyLevel = 'Expert' | 'Advanced' | 'Proficient'`
- **File system**: `filesystem` — nested `FileNode` tree. Files have `action: { type, payload }` — types: `browser` (open URL), `download`, `preview`
- **Terminal**: `terminal.commands`, `terminal.easterEggs`, `terminal.projectDetails`
- **Browser**: `browser.homepage`, `browser.bookmarks`

## Window system

- `useWindowManager()` in WindowManager.tsx manages all state
- `windowState.browserUrl` controls BrowserWindow navigation (updated via `navigateBrowser()`)
- FilesWindow receives `onOpenBrowser` callback to trigger browser navigation

## Adding a new window

1. Add `WindowId` to `types/windows.ts`
2. Add to `DEFAULT_WINDOWS` in `WindowManager.tsx` with default position/size
3. Create `components/windows/YourWindow.tsx`
4. Add to `CONTENT` map in `WindowManager.tsx`
5. Add icon component to `components/icons/` and add to `DOCK_ITEMS` in `Taskbar.tsx`

## Notification system

- `NotificationProvider` wraps the entire app in `page.tsx`; `<NotificationSystem />` is a sibling inside the provider
- `useNotifications()` → `{ notify }` — call from any client component
- `notify({ type, app, title, body })` — types: `message` | `system` | `alert` | `achievement`
- Stack: `fixed top:44px right:16px`, `width:320px`, `z-index:9999`, newest on top
- Enter: `x:110%→0 + opacity 0→1`, 400ms spring. Exit: `x:0→110% + opacity 1→0`, 300ms ease-in
- Auto-dismiss: 5s; progress bar at bottom of each card
- Triggers: welcome 3s after desktop, per-window on first open (projects/contact/terminal), idle 60s, intrusion on `nmap localhost`/`exploit` in terminal
- Dev-only test button (renders in `next dev`, stripped from production build)
- All copy in `data/content.ts` under `notifications`

## App state flow

`page.tsx` manages a `AppState = 'booting' | 'locked' | 'desktop'` enum:
1. **booting** — `BootScreen` renders (4s boot sequence)
2. **locked** — `LockScreen` renders; click or any keypress triggers Framer Motion fade-out (600ms)
3. **desktop** — Menubar + Desktop + Taskbar render; `useWindowManager` state active

## Taskbar / Menubar architecture

- **Menubar** (`top: 0`) — fixed 28px bar: IzanOS logo left, wifi+battery+clock right. `z-index: 100`.
- **Dock** (`bottom: 18px`, centered) — floating pill with ALL 7 icons. `z-index: 50`.
  - Icons: projects / whoami / skills / contact | separator | browser / files / terminal
  - Magnification: cosine falloff, `SCALE_MAX=1.40`, `RANGE=130px`
  - Tooltip: appears on nearest icon within 60px, `position:absolute bottom:calc(100%+12px)`
  - Open indicator: white `#fff` dot below each icon, opacity 0→1 when window open
  - Press feedback: `scale(0.92)` on mousedown
  - No desktop icons — all apps via dock only

## Design system

- Background: `#000` + aurora blobs (green `rgba(0,255,102,0.32)`, blue `rgba(0,102,255,0.28)`, cyan `rgba(0,255,255,0.18)`) with `filter:blur(120px)` + `mix-blend-mode:screen`
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

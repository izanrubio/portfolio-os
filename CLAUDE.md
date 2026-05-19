@AGENTS.md

# IzanOS — Kali Linux Premium Portfolio

Interactive OS-style portfolio for Izan Rubio Cerezo. Simulates a Kali Linux-inspired desktop with glassmorphism windows, boot sequence, particle background, file explorer, embedded browser, and real terminal.

Stack: **Next.js 15 (App Router)**, React 19, TypeScript, Tailwind CSS v4, Framer Motion. Deployed on Vercel.

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
  BootScreen.tsx     — 4s boot: dragon SVG, progress bar, system messages
  Desktop.tsx        — #060810 bg, ParticleField, 7 left-column icons
  ParticleField.tsx  — canvas ~60 particle field (cyan, connections)
  Taskbar.tsx        — 48px bottom bar: logo, window pills, live clock
  Window.tsx         — draggable, resizable, glassmorphism shell
  WindowManager.tsx  — useWindowManager hook + 7-window renderer
  /windows
    ProjectsWindow.tsx  — numbered list, expandable with longDescription
    WhoamiWindow.tsx    — photo + bio two-column layout
    SkillsWindow.tsx    — category pills with color coding
    ContactWindow.tsx   — links + contact form
    BrowserWindow.tsx   — simulated browser: internal portfolio or iframe
    FilesWindow.tsx     — sidebar + grid file explorer with navigation
    TerminalWindow.tsx  — typewriter terminal with history
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

- **Personal**: `personal` — name, role, bio, email, github, linkedin, photo
- **Projects**: `projects[]` — slug, name, description, longDescription, stack, demo, repo
- **Skills**: `skills` — languages/frontend/backend/security/devops arrays
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
5. Add icon to `ICONS` array in `Desktop.tsx`

## Design system

- Background: `#060810` | Accent: `#00d4ff` | Secondary: `#7c3aed`
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

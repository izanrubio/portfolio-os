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
  Desktop.tsx        — #060810 bg + radial gradients + scanlines, ParticleField, 7 left-column icons
  ParticleField.tsx  — canvas ~60 particle field (cyan, connections)
  Taskbar.tsx        — floating dock (3 icons) + brand bottom-left + clock bottom-right
  Window.tsx         — draggable, resizable, glassmorphism shell (TASKBAR_H = 110)
  WindowManager.tsx  — useWindowManager hook + 7-window renderer
  /icons
    BrowserIcon.tsx  — Firefox-style SVG (56×56, detailed globe+flame)
    FilesIcon.tsx    — Nautilus-style SVG (56×56, folder with depth)
    TerminalIcon.tsx — Terminal SVG (56×56, title bar + >_ prompt)
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

- **Personal**: `personal` — name, role, roles[], bio, email, github, linkedin, location, photo
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
5. Add icon to `ICONS` array in `Desktop.tsx`

## Taskbar architecture

Three separate fixed elements (no full-width bar):
- **Brand** (`bottom: 22px; left: 24px`) — new dragon path SVG (cyan→purple gradient) + "Izan**OS**" wordmark
- **Clock** (`bottom: 22px; right: 24px`) — ticking HH:MM:SS + day/date
- **Dock** (`bottom: 18px`, centered) — floating pill with 3 icons: browser, files, terminal

Magnification: cosine falloff, `SCALE_MAX=1.35`, `RANGE=110px`. Tooltip appears when nearest icon distance `< 60px`. Per-icon color glow underlay (`blur(14px)`) on hover. Open indicator dot pulses with icon color. Press feedback scales icon to `0.92×`.

Dock only controls browser/files/terminal. projects/whoami/skills/contact are desktop-icon-only.

## Design system

- CSS variables in `app/globals.css` `:root` block: `--cyan`, `--violet`, `--green`, `--orange`, `--pink`, `--text`, `--text-2` through `--text-4`, `--hairline`, `--glass`, `--mono`, `--inter`, etc.
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

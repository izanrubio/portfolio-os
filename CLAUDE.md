@AGENTS.md

# IzanOS — Kali Linux Inspired Portfolio

Interactive OS-style portfolio for Izan Rubio Cerezo. Simulates a Kali Linux desktop: boot sequence → particle desktop → draggable/resizable windows. Built with Next.js 15, React 19, TypeScript, Tailwind CSS v4, Framer Motion.

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
  globals.css        — base reset, scrollbar styles
/components
  BootScreen.tsx     — 4-second boot: logo, progress bar, system messages
  Desktop.tsx        — wallpaper + left-column icons, double-click to open
  ParticleBackground.tsx — canvas particle field (cyan, subtle)
  Taskbar.tsx        — bottom bar: logo, open-window tabs, live clock
  Window.tsx         — draggable, resizable, min/max/close shell
  WindowManager.tsx  — useWindowManager hook + window renderer
  /windows
    ProjectsWindow.tsx  — numbered projects, expandable details
    WhoamiWindow.tsx    — two-column: photo left, bio right
    SkillsWindow.tsx    — category pills grid
    ContactWindow.tsx   — links + contact form
    TerminalWindow.tsx  — real terminal with command history
/data
  content.ts         — ALL editable content: personalInfo, projects, skills, terminalCommands
/types
  windows.ts         — WindowId, WindowState, DesktopIcon types
/public
  /images
    foto-portafolio.png  — profile photo (grayscale in whoami window)
```

## Editing content

All content lives in `/data/content.ts`. No hardcoded strings elsewhere.

- **Personal info**: `personalInfo` object — name, role, bio, email, github, linkedin
- **Projects**: `projects` array — add/remove items with id, name, description, stack, demo, github, details
- **Skills**: `skills` object — keys are category names, values are string arrays
- **Terminal commands**: `terminalCommands` — string key → string output (or function)

## Adding a new window

1. Add the `WindowId` to `types/windows.ts`
2. Add to `INITIAL_WINDOWS` in `WindowManager.tsx`
3. Create `components/windows/YourWindow.tsx`
4. Add to `WINDOW_CONTENT` map in `WindowManager.tsx`
5. Add icon to `ICONS` array in `Desktop.tsx`

## Code conventions

- `'use client'` on all interactive components
- Inline styles for design-system values (colors, etc.) — Tailwind for layout/spacing
- `useCallback` on all window manager operations — `useRef` for mutable counters
- No comments unless WHY is non-obvious
- Mobile: windows open fullscreen (no drag/resize), single-click opens
- Desktop: double-click opens, draggable by title bar, resizable from corner

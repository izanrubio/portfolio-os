import { FileNode } from '@/types/windows';

export const personal = {
  name: 'Izan Rubio Cerezo',
  role: 'Full Stack Developer & Cybersecurity Specialist',
  roles: ['Full Stack Developer', 'Cybersecurity Specialist', 'Problem Solver', 'OS-style designer'],
  bio: 'Developer focused on building secure, performant web applications. Five years writing TypeScript and PHP, last two pivoting hard into offensive security and OS-style frontend experiments. Currently based in Barcelona.',
  photo: '/images/foto-portafolio.png',
  email: 'izanrubiocerezo@gmail.com',
  github: 'https://github.com/izanrubio',
  linkedin: 'https://linkedin.com/in/izanrubio',
  location: 'Barcelona, Spain · UTC+1',
};

export const projects = [
  {
    slug: 'stastarat',
    name: 'StasTarat.es',
    category: 'FULL STACK',
    description: 'Statistics and analytics platform for online communities. Real-time data dashboards, growth tracking, and automated reports.',
    longDescription: 'Real-time statistics and analytics platform for online communities. Live dashboards, growth tracking, automated weekly reports and a custom alerting engine — all wired together with Server-Sent Events and a tuned PostgreSQL backend.',
    stack: ['Next.js', 'Node.js', 'PostgreSQL', 'WebSockets', 'Stripe'],
    demo: 'https://stastatat.es',
    repo: 'https://github.com/izanrubio/stastarat',
    repoShort: 'izanrubio/stastarat',
    launched: 'Q3 · 2025',
    status: 'In production',
  },
  {
    slug: 'laraveles',
    name: 'Laraveles.es',
    category: 'LARAVEL · CONTENT',
    description: 'Spanish-language Laravel community hub. Tutorials, packages, and resources for the Laravel ecosystem.',
    longDescription: 'Spanish-language Laravel learning hub. Long-form tutorials, a versioned curriculum and a content pipeline that converts MDX to printable PDFs. 75+ articles, 29 lessons, 12K monthly readers.',
    stack: ['Laravel', 'MySQL', 'Alpine.js', 'Tailwind CSS'],
    demo: 'https://laraveles.es',
    repo: 'https://github.com/izanrubio/laraveles',
    repoShort: 'izanrubio/laraveles',
    launched: 'Q1 · 2024',
    status: 'In production',
  },
  {
    slug: 'goldenbids',
    name: 'GoldenBids',
    category: 'FULL STACK · REALTIME',
    description: 'Real-time auction platform. Live bidding engine, fraud detection, and automated dispute resolution.',
    longDescription: 'Production auction platform handling concurrent bidding at scale. WebSocket-based live bid updates with optimistic UI. Fraud detection via behavioral analysis. Dispute resolution workflow with admin dashboard.',
    stack: ['React', 'Laravel', 'Redis', 'WebSockets', 'MySQL'],
    demo: 'https://goldenbids.izanrubio.dev',
    repo: 'https://github.com/izanrubio/goldenbids',
    repoShort: 'izanrubio/goldenbids',
    launched: 'Q2 · 2024',
    status: 'In production',
  },
  {
    slug: 'rooming',
    name: 'Rooming',
    category: 'SAAS · BOOKING',
    description: 'Smart room booking and coworking space management platform with calendar sync and access control.',
    longDescription: 'End-to-end space management solution for coworking operators. Drag-and-drop booking calendar, Google Calendar sync, RFID access control integration, and Stripe subscription management. Multi-tenant architecture.',
    stack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Stripe'],
    demo: 'https://rooming.izanrubio.dev',
    repo: 'https://github.com/izanrubio/rooming',
    repoShort: 'izanrubio/rooming',
    launched: 'Q4 · 2024',
    status: 'In production',
  },
];

export type ProficiencyLevel = 'Expert' | 'Advanced' | 'Proficient';

export interface SkillCategory {
  key: string;
  label: string;
  proficiency: ProficiencyLevel;
  items: string[];
}

export const skills: SkillCategory[] = [
  { key: 'languages', label: 'Languages', proficiency: 'Expert',    items: ['TypeScript', 'JavaScript', 'PHP', 'Python', 'Bash', 'SQL'] },
  { key: 'frontend',  label: 'Frontend',  proficiency: 'Expert',    items: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Vue 3', 'Three.js'] },
  { key: 'backend',   label: 'Backend',   proficiency: 'Advanced',  items: ['Node.js', 'Laravel', 'Express', 'PostgreSQL', 'Redis', 'GraphQL'] },
  { key: 'security',  label: 'Security',  proficiency: 'Advanced',  items: ['Nmap', 'Burp Suite', 'Wireshark', 'Metasploit', 'OWASP Top 10'] },
  { key: 'devops',    label: 'DevOps',    proficiency: 'Proficient', items: ['Docker', 'Vercel', 'GitHub Actions', 'Nginx', 'Linux servers'] },
];

export const filesystem: FileNode = {
  name: 'Home',
  type: 'folder',
  icon: '🏠',
  children: [
    {
      name: 'Documents',
      type: 'folder',
      icon: '📄',
      children: [
        {
          name: 'Projects',
          type: 'folder',
          icon: '📁',
          children: [
            {
              name: 'StasTarat.es',
              type: 'file',
              icon: '🌐',
              action: { type: 'browser', payload: 'https://stastatat.es' },
            },
            {
              name: 'Laraveles.es',
              type: 'file',
              icon: '🌐',
              action: { type: 'browser', payload: 'https://laraveles.es' },
            },
            {
              name: 'GoldenBids.exe',
              type: 'file',
              icon: '🔨',
              action: { type: 'browser', payload: 'https://goldenbids.izanrubio.dev' },
            },
            {
              name: 'Rooming.exe',
              type: 'file',
              icon: '🏢',
              action: { type: 'browser', payload: 'https://rooming.izanrubio.dev' },
            },
          ],
        },
        {
          name: 'IzanRubio_CV.pdf',
          type: 'file',
          icon: '📄',
          action: { type: 'download', payload: '/cv.pdf' },
        },
      ],
    },
    {
      name: 'Pictures',
      type: 'folder',
      icon: '🖼️',
      children: [
        {
          name: 'foto-portafolio.png',
          type: 'file',
          icon: '🖼️',
          action: { type: 'preview', payload: '/images/foto-portafolio.png' },
        },
      ],
    },
    {
      name: 'Downloads',
      type: 'folder',
      icon: '⬇️',
      children: [
        {
          name: 'IzanRubio_CV.pdf',
          type: 'file',
          icon: '📄',
          action: { type: 'download', payload: '/cv.pdf' },
        },
      ],
    },
    {
      name: 'Trash',
      type: 'folder',
      icon: '🗑️',
      children: [],
    },
  ],
};

export const terminal = {
  welcomeMessage: `IzanOS Terminal v2.0.4
Type 'help' for available commands.
──────────────────────────────────────────`,
  commands: {
    help: `AVAILABLE COMMANDS
  help          Show this help
  whoami        About Izan
  ls            List files
  ls projects   List projects
  skills        Show tech stack
  ping izan     Test connection
  sudo hire-me  Make the right call
  cat <slug>    Read project details
  clear         Clear terminal`,

    whoami: `izanos@IzanOS — Izan Rubio Cerezo
──────────────────────────────────────
Role    Full Stack Developer & Cybersecurity Specialist
Email   izanrubiocerezo@gmail.com
GitHub  github.com/izanrubio
Status  Available — open to work`,

    ls: `total 4
drwxr-xr-x  Documents/
drwxr-xr-x  Pictures/
drwxr-xr-x  Downloads/
drwxr-xr-x  Trash/`,

    'ls projects': `total 4
drwxr-xr-x  izan  stastarat    → Next.js · Postgres · Stripe
drwxr-xr-x  izan  laraveles    → Laravel · MySQL · Alpine
drwxr-xr-x  izan  goldenbids   → React · Laravel · Redis
drwxr-xr-x  izan  rooming      → Next.js · Prisma · Stripe`,

    skills: `LANGUAGES    TypeScript · JavaScript · PHP · Python · Bash · SQL
FRONTEND     React · Next.js · Tailwind CSS · Framer Motion · Vue 3
BACKEND      Node.js · Laravel · Express · PostgreSQL · Redis · GraphQL
SECURITY     Nmap · Burp Suite · Wireshark · Metasploit · OWASP Top 10
DEVOPS       Docker · Vercel · GitHub Actions · Nginx · Linux servers`,

    'ping izan': `PING izan (10.0.1.337) 56 bytes of data.
64 bytes from izan: icmp_seq=0 ttl=64 time=0.420ms
64 bytes from izan: icmp_seq=1 ttl=64 time=1.337ms
64 bytes from izan: icmp_seq=2 ttl=64 time=0.337ms

--- izan ping statistics ---
3 packets sent, 3 received, 0% loss
rtt min/avg/max = 0.337/0.698/1.337ms`,

    'sudo hire-me': `[sudo] password for visitor: ••••••••••
Verifying credentials...
✓ Skills verified
✓ Portfolio reviewed
✓ Background check passed

HIRE GRANTED — contact: izanrubiocerezo@gmail.com`,
  },
  easterEggs: {
    'nmap localhost': `Starting Nmap 7.94 ( https://nmap.org )
Scanning localhost (127.0.0.1)...

PORT      STATE     SERVICE
22/tcp    filtered  ssh
80/tcp    filtered  http
443/tcp   filtered  https
1337/tcp  filtered  leet

All ports filtered by IzanOS firewall.
Nice try. Try email instead → izanrubiocerezo@gmail.com`,

    exploit: `[*] Initializing exploit module...
[*] Target: localhost
[*] Payload: reverse_shell/tcp
[*] Connecting...
[-] Connection refused — firewall active
[-] Brute force blocked
[-] Social engineering rejected (no one home)
[!] EXPLOIT FAILED

Suggestion: email works better → izanrubiocerezo@gmail.com`,

    'sudo rm -rf /': `[sudo] password for visitor: ••••••••
rm: cannot remove '/': Operation not permitted
rm: cannot remove '/bin': Permission denied
rm: cannot remove '/home/izanos': It's my house, you can't delete me.

Nice try.`,
  },
  projectDetails: {
    stastarat: `StasTarat.es — Analytics Platform
──────────────────────────────────
Stack   Next.js · Node.js · PostgreSQL · WebSockets
Demo    https://stastatat.es
Repo    github.com/izanrubio/stastarat

Real-time stats platform for online communities.
WebSocket streaming, role-based access, Stripe billing.`,

    laraveles: `Laraveles.es — Laravel Community Hub
──────────────────────────────────────
Stack   Laravel · PHP · MySQL · Alpine.js · Tailwind
Demo    https://laraveles.es
Repo    github.com/izanrubio/laraveles

Spanish-language knowledge base for Laravel devs.
75+ articles, 29 lessons, 12K monthly readers.`,

    goldenbids: `GoldenBids — Auction Platform
──────────────────────────────
Stack   React · Laravel · Redis · WebSockets · MySQL
Demo    https://goldenbids.izanrubio.dev
Repo    github.com/izanrubio/goldenbids

Real-time concurrent bidding at scale.
Fraud detection, dispute resolution, admin dashboard.`,

    rooming: `Rooming — Coworking Booking System
────────────────────────────────────
Stack   Next.js · TypeScript · Prisma · PostgreSQL · Stripe
Demo    https://rooming.izanrubio.dev
Repo    github.com/izanrubio/rooming

Space management for coworking operators.
Calendar sync, RFID access, multi-tenant architecture.`,
  },
};

export const browser = {
  homepage: 'izanrubio.dev',
  bookmarks: [
    { title: 'izanrubio.dev', url: 'izanrubio.dev' },
    { title: 'GitHub', url: 'https://github.com/izanrubio' },
    { title: 'StasTarat', url: 'https://stastatat.es' },
    { title: 'Laraveles', url: 'https://laraveles.es' },
  ],
};

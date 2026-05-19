import { FileNode } from '@/types/windows';

export const personal = {
  name: 'Izan Rubio Cerezo',
  role: 'Full Stack Developer & Cybersecurity Specialist',
  bio: 'Developer focused on building secure, performant web applications. Passionate about cybersecurity, ethical hacking, and creating tools that push the boundaries of what\'s possible on the web. Open to full-time roles and freelance projects.',
  photo: '/images/foto-portafolio.png',
  email: 'izan@videoatencion.com',
  github: 'https://github.com/izanrubio',
  linkedin: 'https://linkedin.com/in/izanrubio',
};

export const projects = [
  {
    slug: 'stastarat',
    name: 'StasTarat.es',
    description: 'Statistics and analytics platform for online communities. Real-time data dashboards, growth tracking, and automated reports.',
    longDescription: 'Full-stack SaaS platform for tracking community growth metrics. Built with Next.js frontend, Node.js API, WebSocket streaming, and PostgreSQL. Features role-based access, PDF report generation, and Stripe billing integration.',
    stack: ['Next.js', 'Node.js', 'PostgreSQL', 'WebSockets', 'Stripe'],
    demo: 'https://stastatat.es',
    repo: 'https://github.com/izanrubio/stastarat',
  },
  {
    slug: 'laraveles',
    name: 'Laraveles.es',
    description: 'Spanish-language Laravel community hub. Tutorials, packages, and resources for the Laravel ecosystem.',
    longDescription: 'Community platform and knowledge base for Spanish-speaking Laravel developers. Features blog engine, package directory, interactive tutorials, and user forum. SEO optimized with structured data.',
    stack: ['Laravel', 'PHP', 'MySQL', 'Alpine.js', 'Tailwind CSS'],
    demo: 'https://laraveles.es',
    repo: 'https://github.com/izanrubio/laraveles',
  },
  {
    slug: 'goldenbids',
    name: 'GoldenBids',
    description: 'Real-time auction platform. Live bidding engine, fraud detection, and automated dispute resolution.',
    longDescription: 'Production auction platform handling concurrent bidding at scale. WebSocket-based live bid updates with optimistic UI. Fraud detection via behavioral analysis. Dispute resolution workflow with admin dashboard.',
    stack: ['React', 'Laravel', 'Redis', 'WebSockets', 'MySQL'],
    demo: 'https://goldenbids.izanrubio.dev',
    repo: 'https://github.com/izanrubio/goldenbids',
  },
  {
    slug: 'rooming',
    name: 'Rooming',
    description: 'Smart room booking and coworking space management platform with calendar sync and access control.',
    longDescription: 'End-to-end space management solution for coworking operators. Drag-and-drop booking calendar, Google Calendar sync, RFID access control integration, and Stripe subscription management. Multi-tenant architecture.',
    stack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Stripe'],
    demo: 'https://rooming.izanrubio.dev',
    repo: 'https://github.com/izanrubio/rooming',
  },
];

export const skills = {
  languages: ['TypeScript', 'JavaScript', 'PHP', 'Python', 'Bash', 'SQL'],
  frontend: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Alpine.js', 'HTML5'],
  backend: ['Node.js', 'Laravel', 'Express', 'FastAPI', 'PostgreSQL', 'MySQL', 'Redis'],
  security: ['Penetration Testing', 'OWASP Top 10', 'Burp Suite', 'Nmap', 'Wireshark', 'Kali Linux'],
  devops: ['Docker', 'Linux', 'Git', 'CI/CD', 'Nginx', 'Vercel'],
};

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

    whoami: `izanos@portfolio — Izan Rubio Cerezo
──────────────────────────────────────
Role    Full Stack Developer & Cybersecurity Specialist
Email   izan@videoatencion.com
GitHub  github.com/izanrubio
Status  Available — open to work`,

    ls: `total 4
drwxr-xr-x  Documents/
drwxr-xr-x  Pictures/
drwxr-xr-x  Downloads/
drwxr-xr-x  Trash/`,

    'ls projects': `total 4
-rw-r--r--  StasTarat.es       Analytics & stats platform
-rw-r--r--  Laraveles.es       Laravel Spanish community
-rw-r--r--  GoldenBids.exe     Real-time auction engine
-rw-r--r--  Rooming.exe        Coworking booking system`,

    skills: `LANGUAGES    TypeScript  JavaScript  PHP  Python  Bash
FRONTEND     React  Next.js  Tailwind  Framer Motion  Alpine.js
BACKEND      Node.js  Laravel  Express  FastAPI  PostgreSQL  Redis
SECURITY     PenTest  OWASP  Burp Suite  Nmap  Wireshark
DEVOPS       Docker  Linux  Git  CI/CD  Nginx  Vercel`,

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

HIRE GRANTED — contact: izan@videoatencion.com`,
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
Nice try. Try email instead → izan@videoatencion.com`,

    exploit: `[*] Initializing exploit module...
[*] Target: localhost
[*] Payload: reverse_shell/tcp
[*] Connecting...
[-] Connection refused — firewall active
[-] Brute force blocked
[-] Social engineering rejected (no one home)
[!] EXPLOIT FAILED

Suggestion: email works better → izan@videoatencion.com`,

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

Full-stack SaaS for community growth metrics.
WebSocket streaming, role-based access, Stripe billing.`,

    laraveles: `Laraveles.es — Laravel Community Hub
──────────────────────────────────────
Stack   Laravel · PHP · MySQL · Alpine.js · Tailwind
Demo    https://laraveles.es
Repo    github.com/izanrubio/laraveles

Spanish-language knowledge base for Laravel devs.
Blog engine, package directory, SEO optimized.`,

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

export const personalInfo = {
  name: 'Izan Rubio Cerezo',
  role: 'Full Stack Developer & Cybersecurity Specialist',
  bio: 'Developer focused on building secure, performant web applications. Passionate about cybersecurity, ethical hacking, and creating tools that push the boundaries of what\'s possible on the web. Currently exploring offensive security and building things that matter.',
  photo: '/images/foto-portafolio.png',
  email: 'izan@videoatencion.com',
  github: 'https://github.com/izanrubio',
  linkedin: 'https://linkedin.com/in/izanrubio',
};

export const projects = [
  {
    id: '01',
    name: 'Portfolio OS',
    description: 'Kali Linux-inspired interactive desktop portfolio. Full OS simulation with draggable windows, real terminal, and animated boot sequence.',
    stack: ['Next.js 15', 'React 19', 'TypeScript', 'Framer Motion', 'Tailwind CSS'],
    demo: '#',
    github: 'https://github.com/izanrubio/portfolio-os',
    details: 'Built as an alternative to the traditional portfolio. Visitors get an OS-like experience — boot sequence, desktop with icons, draggable windows, and a working terminal. The entire UI is CSS-only for the desktop shell, with React state managing window stacking and focus.',
  },
  {
    id: '02',
    name: 'SecureScan CLI',
    description: 'Command-line vulnerability scanner for web applications. Identifies common OWASP Top 10 issues with detailed reports.',
    stack: ['Python', 'Click', 'Requests', 'BeautifulSoup', 'SQLite'],
    demo: '#',
    github: 'https://github.com/izanrubio/securescan',
    details: 'A lightweight CLI tool for security auditing. Scans for XSS, SQLi, open redirects, and misconfigured headers. Outputs structured JSON reports and integrates with CI pipelines for automated security checks.',
  },
  {
    id: '03',
    name: 'NetWatch Dashboard',
    description: 'Real-time network monitoring dashboard. Visualizes traffic, detects anomalies, and alerts on suspicious patterns.',
    stack: ['React', 'Node.js', 'WebSockets', 'D3.js', 'PostgreSQL'],
    demo: '#',
    github: 'https://github.com/izanrubio/netwatch',
    details: 'Full-stack network monitoring tool built for home lab environments. WebSocket streams live packet data to a React frontend. D3.js renders real-time traffic graphs. Rule-based anomaly detection triggers browser notifications.',
  },
];

export const skills = {
  'Languages': ['TypeScript', 'JavaScript', 'Python', 'Bash', 'SQL', 'Rust'],
  'Frontend': ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'HTML5', 'CSS3'],
  'Backend': ['Node.js', 'Express', 'FastAPI', 'PostgreSQL', 'MongoDB', 'Redis'],
  'Security': ['Penetration Testing', 'OWASP Top 10', 'Burp Suite', 'Nmap', 'Wireshark', 'Metasploit'],
  'DevOps': ['Docker', 'Linux', 'Git', 'CI/CD', 'Nginx', 'Vercel'],
};

export const terminalCommands: Record<string, string | ((args: string[]) => string)> = {
  help: `Available commands:
  help          Show this help
  whoami        About me
  ls            List projects
  skills        Show tech stack
  ping izan     Test connection
  clear         Clear terminal
  nmap localhost  Try it ;)
  exploit       Bold move`,

  whoami: `Izan Rubio Cerezo
Role:   Full Stack Developer & Cybersecurity Specialist
Email:  izan@videoatencion.com
GitHub: github.com/izanrubio
Status: Available for freelance & full-time`,

  ls: `total 3
drwxr-xr-x  portfolio-os/     Next.js OS-inspired portfolio
drwxr-xr-x  securescan-cli/   Web vulnerability scanner
drwxr-xr-x  netwatch/         Network monitoring dashboard`,

  skills: `LANGUAGES    TypeScript  JavaScript  Python  Bash  Rust
FRONTEND     React  Next.js  Tailwind  Framer Motion
BACKEND      Node.js  Express  FastAPI  PostgreSQL  Redis
SECURITY     PenTest  OWASP  Burp Suite  Nmap  Wireshark
DEVOPS       Docker  Linux  Git  CI/CD  Nginx`,

  'ping izan': `PING izan (192.168.1.337): 56 data bytes
64 bytes from izan: icmp_seq=0 ttl=64 time=1.337 ms
64 bytes from izan: icmp_seq=1 ttl=64 time=0.420 ms
64 bytes from izan: icmp_seq=2 ttl=64 time=0.337 ms

--- izan ping statistics ---
3 packets transmitted, 3 received, 0% packet loss
Round-trip: min=0.337ms avg=0.698ms max=1.337ms`,

  'nmap localhost': `Starting Nmap 7.94 ( https://nmap.org )
Nmap scan report for localhost (127.0.0.1)
Host is up (0.00013s latency).

PORT     STATE    SERVICE
22/tcp   filtered ssh
80/tcp   filtered http
443/tcp  filtered https
1337/tcp filtered leet-hax

Nmap done: 1 IP address (1 host up) scanned in 2.13 seconds

[!] Nice try. All ports filtered by Izan's firewall.
    Maybe ask nicely instead? → izan@videoatencion.com`,

  exploit: `[*] Initializing exploit module...
[*] Targeting: localhost
[*] Payload: reverse_shell/tcp
[*] Attempting connection...
[-] Connection refused
[-] Firewall detected
[-] Social engineering attempt failed
[-] Brute force blocked (you tried 0 passwords)
[!] EXPLOIT FAILED

Suggestion: Try email instead.
→ izan@videoatencion.com`,
};

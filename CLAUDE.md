# IzanOS Aurora — Claude Code Instructions

## Graphify
Este proyecto tiene Graphify instalado para análisis del codebase.
Grafo en `graphify-out/graph.json` (373 nodos, 626 edges, 22 comunidades).

Antes de leer archivos individuales, consulta siempre el grafo:
- `graphify query "..."` → buscar componentes por concepto
- `graphify explain "..."` → entender qué hace un componente
- `graphify path "A" "B"` → trazar conexión entre dos componentes

## Stack
Next.js 15, React 19, TypeScript, Tailwind v4, Framer Motion.
Deployment: VPS con PM2. Rama main = producción.

## Reglas
- Trabajar siempre en rama dev, nunca pushear directo a main
- Nunca romper el sistema de idiomas (CAS/CAT/ENG) ni el de temas
- El sistema de ventanas es el núcleo — consultar grafo antes de modificarlo
- Assets estáticos en /public/ — rutas sin prefijo /public en el código
- .env.local solo existe en el VPS, nunca en el repo

## Integraciones activas
- Telegram Bot API → notificaciones y mensajes reales
- Claude API (claude-sonnet) → auto-reply en Missatges
- html2canvas + jsPDF → generación de certificado CTF

## Workflow
1. graphify query antes de tocar cualquier componente existente
2. rama dev para cada feature
3. build limpio antes de mergear a main
4. pm2 restart portfolio-os tras cada deploy en el VPS

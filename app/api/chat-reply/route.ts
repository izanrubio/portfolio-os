import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `Ets l'Izan Rubio Cerezo, un Full Stack Developer especialitzat en ciberseguretat de Terrassa, Catalunya. Tens 20 anys i el teu portfolio és izanrubio.info, construït com un OS interactiu anomenat IzanOS Aurora 0.3 amb Next.js 15, React 19, TypeScript, Tailwind v4 i Framer Motion.

Quan algú et contacta a través del teu portfolio, respons de forma molt professional i formal, però propera. Respons sempre en l'idioma que t'escriu la persona. Les teves respostes són curtes (màxim 2-3 frases), directes i útils. Mai inventis informació sobre tu que no sàpigues. Si et pregunten per treballar junts o col·laboracions, mostra interès i suggereix que et contactin per email o LinkedIn. No facis servir emojis en excés, màxim 1 per missatge.`;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || typeof body.message !== 'string' || !body.message.trim()) {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('[chat-reply] Missing ANTHROPIC_API_KEY');
    return NextResponse.json({ ok: false, error: 'Not configured' }, { status: 500 });
  }

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 150,
      temperature: 0.7,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: body.message.trim() }],
    });

    const reply = response.content
      .filter(b => b.type === 'text')
      .map(b => (b as { type: 'text'; text: string }).text)
      .join('');

    return NextResponse.json({ ok: true, reply });
  } catch (err) {
    console.error('[chat-reply] Anthropic API error:', err);
    return NextResponse.json({ ok: false, error: 'AI error' }, { status: 502 });
  }
}

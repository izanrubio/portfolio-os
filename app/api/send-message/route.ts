import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || typeof body.message !== 'string' || !body.message.trim()) {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }

  const message: string = body.message.trim();

  if (message.length > 1000) {
    return NextResponse.json({ ok: false, error: 'Message too long' }, { status: 400 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return NextResponse.json({ ok: false, error: 'Not configured' }, { status: 500 });
  }

  const timestamp = new Date().toLocaleString('ca-ES', { timeZone: 'Europe/Madrid' });
  const text = `💬 *Nou missatge des d'IzanOS Aurora*\n\n${message}\n\n🕐 ${timestamp}`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
    });
    const data = await res.json();
    if (!data.ok) {
      return NextResponse.json({ ok: false, error: 'Telegram error' }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Network error' }, { status: 502 });
  }
}

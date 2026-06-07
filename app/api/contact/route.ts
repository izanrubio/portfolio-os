import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, subject, message } = body as Record<string, string>;

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  if (!resend) {
    return NextResponse.json({ error: 'Email service not configured' }, { status: 503 });
  }

  try {
    await resend.emails.send({
      from: 'IzanOS Portfolio <noreply@izanrubio.info>',
      to: 'izanrubiocerezo@gmail.com',
      replyTo: email,
      subject: `[IzanOS Contact] ${subject} — de ${name}`,
      text: `Nombre: ${name}\nEmail: ${email}\nAsunto: ${subject}\n\nMensaje:\n${message}`,
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}

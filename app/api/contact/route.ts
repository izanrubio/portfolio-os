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
      from: 'onboarding@izanrubio.info',
      to: 'izanrubiocerezo@gmail.com',
      replyTo: email,
      subject: `[IzanOS Contact] ${subject} — de ${name}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Courier New',monospace;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#0d1117;border:1px solid rgba(0,245,255,0.2);max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid rgba(0,245,255,0.1);">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:11px;letter-spacing:4px;color:rgba(0,245,255,0.6);text-transform:uppercase;">IzanOS Aurora</span><br>
                    <span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:1px;">Nuevo mensaje</span>
                  </td>
                  <td align="right">
                    <span style="background:rgba(0,255,136,0.1);border:1px solid rgba(0,255,136,0.3);color:#00ff88;font-size:9px;letter-spacing:2px;padding:4px 10px;text-transform:uppercase;">✓ RECIBIDO</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">

              <!-- Nombre -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td style="padding:16px;background:#0a0a0f;border-left:2px solid #00f5ff;">
                    <span style="font-size:9px;letter-spacing:3px;color:rgba(0,245,255,0.5);text-transform:uppercase;display:block;margin-bottom:6px;">Nombre</span>
                    <span style="font-size:16px;color:#ffffff;font-weight:600;">${name}</span>
                  </td>
                </tr>
              </table>

              <!-- Email -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td style="padding:16px;background:#0a0a0f;border-left:2px solid rgba(0,245,255,0.4);">
                    <span style="font-size:9px;letter-spacing:3px;color:rgba(0,245,255,0.5);text-transform:uppercase;display:block;margin-bottom:6px;">Email</span>
                    <span style="font-size:14px;color:#00f5ff;">${email}</span>
                  </td>
                </tr>
              </table>

              <!-- Asunto -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td style="padding:16px;background:#0a0a0f;border-left:2px solid rgba(0,245,255,0.4);">
                    <span style="font-size:9px;letter-spacing:3px;color:rgba(0,245,255,0.5);text-transform:uppercase;display:block;margin-bottom:6px;">Asunto</span>
                    <span style="font-size:14px;color:#ffffff;">${subject}</span>
                  </td>
                </tr>
              </table>

              <!-- Mensaje -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:16px;background:#0a0a0f;border-left:2px solid rgba(180,0,255,0.6);">
                    <span style="font-size:9px;letter-spacing:3px;color:rgba(0,245,255,0.5);text-transform:uppercase;display:block;margin-bottom:10px;">Mensaje</span>
                    <span style="font-size:14px;color:rgba(255,255,255,0.8);line-height:1.7;">${message}</span>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.05);">
              <span style="font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.15);text-transform:uppercase;">
                izanrubio.info · IzanOS Aurora Portfolio
              </span>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}

/**
 * Invite email — sent by POST /api/admin/users/invite.
 *
 * Branded HTML (cream background, wine CTA, Playfair title). Falls soft
 * when RESEND_API_KEY is unset so local/dev environments don't blow up
 * the invite endpoint.
 */

import { Resend } from "resend";
import { env } from "./agents/env";

const resend = env.resendApiKey() ? new Resend(env.resendApiKey()!) : null;

const CREAM = "#FAF5F0";
const WINE = "#6A2C3E";
const CHARCOAL = "#3D2430";
const BORDER = "#E7DFD6";
const MUTED = "#6b5b55";

function renderHtml(inviteUrl: string, invitedEmail: string): string {
  // Inline styles: email clients strip <style>. Playfair Display + Inter
  // via Google Fonts with serif / sans-serif fallbacks.
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Welcome aboard — Ops by Noell</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:0;background-color:${CREAM};font-family:Inter,Arial,sans-serif;color:${CHARCOAL};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${CREAM};">
<tr><td align="center" style="padding:40px 16px;">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background-color:#ffffff;border:1px solid ${BORDER};border-radius:20px;overflow:hidden;">
<tr><td style="padding:40px 40px 8px 40px;">
<p style="margin:0 0 12px 0;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:${MUTED};font-family:Inter,Arial,sans-serif;">Ops by Noell</p>
<h1 style="margin:0 0 16px 0;font-family:'Playfair Display',Georgia,serif;font-size:30px;font-weight:700;color:${CHARCOAL};line-height:1.2;">Welcome aboard</h1>
<p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:${CHARCOAL};">You've been invited to the <strong>${invitedEmail}</strong> admin account. Set your password to get started — it only takes a moment.</p>
</td></tr>
<tr><td align="left" style="padding:16px 40px 8px 40px;">
<a href="${inviteUrl}" style="display:inline-block;background-color:${WINE};color:${CREAM};text-decoration:none;font-family:Inter,Arial,sans-serif;font-weight:600;font-size:14px;padding:14px 28px;border-radius:12px;">Set your password</a>
</td></tr>
<tr><td style="padding:16px 40px 8px 40px;">
<p style="margin:0 0 8px 0;font-size:13px;line-height:1.6;color:${MUTED};">Or copy this link into your browser:</p>
<p style="margin:0 0 20px 0;font-size:12px;line-height:1.5;color:${WINE};word-break:break-all;"><a href="${inviteUrl}" style="color:${WINE};text-decoration:underline;">${inviteUrl}</a></p>
</td></tr>
<tr><td style="padding:8px 40px 40px 40px;border-top:1px solid ${BORDER};">
<p style="margin:16px 0 0 0;font-size:12px;line-height:1.5;color:${MUTED};">This link expires in 48 hours. If you weren't expecting this invite you can safely ignore it.</p>
</td></tr>
</table>
<p style="margin:20px 0 0 0;font-size:11px;font-family:Inter,Arial,sans-serif;color:${MUTED};letter-spacing:0.12em;">hello@opsbynoell.com</p>
</td></tr>
</table>
</body>
</html>`;
}

function renderText(inviteUrl: string, invitedEmail: string): string {
  return [
    `Welcome aboard.`,
    ``,
    `You've been invited to the ${invitedEmail} admin account at Ops by Noell.`,
    `Set your password using the link below — it expires in 48 hours.`,
    ``,
    inviteUrl,
    ``,
    `If you weren't expecting this invite you can safely ignore it.`,
    `— hello@opsbynoell.com`,
  ].join("\n");
}

export async function sendAdminInviteEmail(params: {
  toEmail: string;
  inviteUrl: string;
}): Promise<{ ok: boolean; error?: string }> {
  if (!resend) {
    console.warn("[admin-invite-email] Resend not configured — email skipped");
    return { ok: false, error: "resend_not_configured" };
  }

  try {
    await resend.emails.send({
      from: env.resendFromEmail(),
      to: params.toEmail,
      subject: "Welcome aboard — set your Ops by Noell password",
      html: renderHtml(params.inviteUrl, params.toEmail),
      text: renderText(params.inviteUrl, params.toEmail),
    });
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    console.error("[admin-invite-email] send failed:", message);
    return { ok: false, error: message };
  }
}

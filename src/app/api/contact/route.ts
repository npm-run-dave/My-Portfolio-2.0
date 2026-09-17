import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { createAdminClient } from '@/lib/supabase/admin'
import { ContactFormConfig, DEFAULT_CONTACT_FORM_CONFIG } from '@/lib/types'

const PROFILE_ID = '00000000-0000-0000-0000-000000000001'

function renderTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] ?? '')
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildNotificationHtml(fields: { label: string; value: string }[], submitterEmail: string): string {
  const rows = fields
    .map(f => `
      <tr>
        <td style="padding:0 0 20px 0;vertical-align:top;width:140px">
          <span style="font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#64748b">${escapeHtml(f.label)}</span>
        </td>
        <td style="padding:0 0 20px 16px;vertical-align:top">
          <span style="font-size:14px;color:#e2e8f0;line-height:1.6">${escapeHtml(f.value).replace(/\n/g, '<br>')}</span>
        </td>
      </tr>`)
    .join('')

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080d18;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080d18;padding:40px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

        <!-- Logo header -->
        <tr>
          <td style="padding-bottom:24px">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="vertical-align:middle;padding-right:12px">
                  <div style="width:36px;height:36px;border-radius:8px;background:rgba(20,184,166,0.15);border:1px solid rgba(20,184,166,0.3);display:inline-flex;align-items:center;justify-content:center;line-height:0">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 6L3 10l4 4M13 6l4 4-4 4" stroke="#14b8a6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                </td>
                <td style="vertical-align:middle">
                  <p style="margin:0;font-size:13px;font-weight:700;letter-spacing:0.08em;color:#ffffff">DAVE<span style="color:#14b8a6">.DEV</span></p>
                  <p style="margin:2px 0 0;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#475569">Web Architect</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Card -->
        <tr>
          <td style="background:#0f1929;border-radius:16px;overflow:hidden;border:1px solid #1e293b">

            <!-- Card header -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:linear-gradient(135deg,#0f2744 0%,#0d1f3a 100%);padding:28px 36px;border-bottom:1px solid #1e293b">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="vertical-align:middle;padding-right:14px">
                        <div style="width:42px;height:42px;border-radius:10px;background:rgba(20,184,166,0.12);border:1px solid rgba(20,184,166,0.25);text-align:center;line-height:42px;font-size:18px">✉️</div>
                      </td>
                      <td style="vertical-align:middle">
                        <p style="margin:0;font-size:9px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#14b8a6">New Inquiry</p>
                        <h1 style="margin:4px 0 0;font-size:20px;font-weight:700;color:#f1f5f9;letter-spacing:-0.01em">Contact Form Submission</h1>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Reply-to banner -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:14px 36px;background:rgba(20,184,166,0.06);border-bottom:1px solid #1e293b">
                  <p style="margin:0;font-size:12px;color:#64748b">
                    Reply to &nbsp;<a href="mailto:${escapeHtml(submitterEmail)}" style="color:#14b8a6;text-decoration:none;font-weight:600">${escapeHtml(submitterEmail)}</a>
                  </p>
                </td>
              </tr>
            </table>

            <!-- Fields -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:32px 36px">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    ${rows}
                  </table>
                </td>
              </tr>
            </table>

            <!-- Footer -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:20px 36px;border-top:1px solid #1e293b;background:#080d18;border-radius:0 0 16px 16px">
                  <p style="margin:0;font-size:11px;color:#334155">Sent via <strong style="color:#475569">DAVE.DEV</strong> portfolio contact form &nbsp;·&nbsp; Do not reply to this automated email</p>
                </td>
              </tr>
            </table>

          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function createTransporter() {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!host || !user || !pass) return null

  return nodemailer.createTransport({
    host,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
  })
}

async function sendEmail({ to, replyTo, subject, html }: { to: string; replyTo?: string; subject: string; html: string }) {
  const transporter = createTransporter()
  if (!transporter) return

  const from = process.env.EMAIL_FROM || process.env.SMTP_USER!
  await transporter.sendMail({ from, to, replyTo, subject, html })
}

async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY
  if (!secret) return true // skip if not configured
  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
  })
  const data = await res.json() as { success: boolean }
  return data.success === true
}

export async function POST(req: NextRequest) {
  try {
    const body: Record<string, string> = await req.json()

    // Verify reCAPTCHA token
    const recaptchaToken = body['recaptchaToken'] || ''
    if (!recaptchaToken) {
      return NextResponse.json({ error: 'CAPTCHA token missing' }, { status: 400 })
    }
    const captchaOk = await verifyRecaptcha(recaptchaToken)
    if (!captchaOk) {
      return NextResponse.json({ error: 'CAPTCHA verification failed' }, { status: 400 })
    }

    // Load contact form config — two queries so a missing column doesn't block email delivery
    const supabase = createAdminClient()
    const { data: profileData } = await supabase
      .from('profiles')
      .select('email, name')
      .eq('id', PROFILE_ID)
      .single()

    const { data: configData } = await supabase
      .from('profiles')
      .select('contact_form_config')
      .eq('id', PROFILE_ID)
      .single()

    const config: ContactFormConfig = (configData as { contact_form_config?: ContactFormConfig } | null)?.contact_form_config || DEFAULT_CONTACT_FORM_CONFIG
    const activeFields = config.fields
      .filter(f => f.enabled)
      .sort((a, b) => a.order - b.order)

    // Validate required fields
    for (const field of activeFields) {
      if (field.required && !body[field.key]?.trim()) {
        return NextResponse.json({ error: `"${field.label}" is required` }, { status: 400 })
      }
    }

    const submitterEmail = body['email'] || ''
    const submitterName = body['name'] || 'Visitor'

    // Build labelled field list for the notification email
    const labelledFields = activeFields
      .filter(f => body[f.key] !== undefined)
      .map(f => ({ label: f.label, value: body[f.key] || '' }))

    // Send notification email to admin
    const notificationTarget = config.notification_email || profileData?.email
    if (notificationTarget) {
      await sendEmail({
        to: notificationTarget,
        replyTo: submitterEmail || undefined,
        subject: `New contact form submission from ${submitterName}`,
        html: buildNotificationHtml(labelledFields, submitterEmail),
      })
    }

    // Send auto-reply to submitter
    if (config.auto_reply_enabled && submitterEmail) {
      const tplValues: Record<string, string> = { ...body, name: submitterName }
      const replySubject = renderTemplate(config.auto_reply_subject || 'Thanks for reaching out!', tplValues)
      const replyBodyText = renderTemplate(config.auto_reply_body || '', tplValues)
      const replyHtml = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;color:#1e293b;padding:32px;max-width:600px">
        <p>${replyBodyText.replace(/\n/g, '<br>')}</p>
      </body></html>`

      await sendEmail({ to: submitterEmail, subject: replySubject, html: replyHtml })
    }

    console.log('[Contact Form] fields:', JSON.stringify(labelledFields), '| notificationTarget:', notificationTarget)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[Contact Form Error]', err)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

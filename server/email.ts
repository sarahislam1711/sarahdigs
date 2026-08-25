import nodemailer from "nodemailer";
import { Resend } from "resend";

// Resend — preferred sender for outbound (welcome / lead-magnet) emails.
// Set RESEND_API_KEY + RESEND_FROM (e.g. "sarahdigs <hello@sarahdigs.com>")
// in the environment. Falls back to SMTP if not configured.
const resendApiKey = process.env.RESEND_API_KEY;
const resendFrom = process.env.RESEND_FROM || "sarahdigs <onboarding@resend.dev>";
const resend = resendApiKey ? new Resend(resendApiKey) : null;
if (resendApiKey) {
  console.log("[Email] Resend configured — from:", resendFrom);
} else {
  console.log("[Email] Resend NOT configured (RESEND_API_KEY unset) — will fall back to SMTP for welcome emails.");
}

const smtpHost = process.env.SMTP_HOST || "mail.privateemail.com";
const smtpPort = Number(process.env.SMTP_PORT) || 465;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

// Log SMTP config status on startup (no secrets)
console.log(`[Email] SMTP config: host=${smtpHost}, port=${smtpPort}, user=${smtpUser ? smtpUser : "NOT SET"}, pass=${smtpPass ? "SET" : "NOT SET"}`);

if (!smtpUser || !smtpPass) {
  console.warn("[Email] WARNING: SMTP_USER or SMTP_PASS not set — emails will NOT be sent.");
}

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: true,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

// Verify SMTP connection on startup
transporter.verify().then(() => {
  console.log("[Email] SMTP connection verified successfully — ready to send emails.");
}).catch((err) => {
  console.error("[Email] SMTP connection FAILED:", err.message);
});

export async function sendCustomPlanEmail(data: {
  name: string;
  email: string;
  businessDescription: string;
  mainChallenge: string;
  selectedModules: string[];
  budgetRange: string;
}) {
  const contactEmail = process.env.CONTACT_EMAIL || smtpUser;

  const html = `
    <h2>New Custom Plan Request</h2>
    <p><strong>From:</strong> ${data.name} (${data.email})</p>
    <hr/>
    <h3>Business Description</h3>
    <p>${data.businessDescription}</p>
    <h3>Main Challenge</h3>
    <p>${data.mainChallenge}</p>
    <h3>Selected Focus Areas</h3>
    <p>${data.selectedModules.length > 0 ? data.selectedModules.join(", ") : "None selected"}</p>
    <h3>Budget Range</h3>
    <p>${data.budgetRange}</p>
    <hr/>
    <p><em>Sent from SarahDigs website</em></p>
  `;

  await transporter.sendMail({
    from: `"SarahDigs Website" <${smtpUser}>`,
    to: contactEmail,
    replyTo: data.email,
    subject: `New Custom Plan Request from ${data.name}`,
    html,
  });
}

export async function sendContactEmail(data: {
  name: string;
  email: string;
  companyWebsite?: string;
  projectType?: string;
  message: string;
}) {
  const contactEmail = process.env.CONTACT_EMAIL || smtpUser;

  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>From:</strong> ${data.name} (${data.email})</p>
    ${data.companyWebsite ? `<p><strong>Company:</strong> ${data.companyWebsite}</p>` : ""}
    ${data.projectType ? `<p><strong>Project Type:</strong> ${data.projectType}</p>` : ""}
    <hr/>
    <h3>Message</h3>
    <p>${data.message}</p>
    <hr/>
    <p><em>Sent from SarahDigs website</em></p>
  `;

  await transporter.sendMail({
    from: `"SarahDigs Website" <${smtpUser}>`,
    to: contactEmail,
    replyTo: data.email,
    subject: `New Contact from ${data.name}`,
    html,
  });
}

// ── Welcome / resource-delivery email sent TO the subscriber on signup. ──
const SITE = "https://www.sarahdigs.com";

// Per-asset content: subject + the exact resource the person signed up for.
// `heading` is the big line, `intro` the paragraph, `ctaLabel`/`ctaHref` the button.
function resourceBlock(assetRequested?: string | null): {
  subject: string;
  heading: string;
  intro: string;
  ctaLabel: string;
  ctaHref: string;
} {
  switch (assetRequested) {
    case "article":
      return {
        subject: "your read is here",
        heading: "here's your read.",
        intro:
          "thanks for the interest. this is a short, data-backed look at what actually decides whether a website converts, and how sarahdigs fixes it.",
        ctaLabel: "read the article",
        ctaHref: `${SITE}/journal/post/why-most-business-websites-fail-to-convert`,
      };
    default: // newsletter / anything else
      return {
        subject: "you're in.",
        heading: "you're in.",
        intro:
          "thanks for subscribing. you'll get occasional notes on websites, ai search visibility, and building a brand that gets found. no spam, unsubscribe anytime.",
        ctaLabel: "read the journal",
        ctaHref: `${SITE}/journal`,
      };
  }
}

// Fully branded, email-client-safe welcome template (table layout, inline
// styles). Brand: bone canvas #F4F1EA, ink #181612, oxblood #6B1421, Syne-ish
// heading via a bold serif/sans fallback (webfonts don't load in most clients).
function welcomeEmailHtml(opts: {
  heading: string;
  intro: string;
  ctaLabel: string;
  ctaHref: string;
}): string {
  const { heading, intro, ctaLabel, ctaHref } = opts;
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"></head>
<body style="margin:0;padding:0;background:#E7E2D6;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#E7E2D6;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#F4F1EA;border-radius:16px;overflow:hidden;border:1px solid rgba(24,22,18,0.08);">

        <!-- header / wordmark -->
        <tr><td style="padding:28px 36px 0 36px;">
          <div style="font-family:'Syne',Georgia,serif;font-weight:800;font-size:22px;letter-spacing:-0.02em;color:#181612;">
            sarah<span style="color:#6B1421;">digs</span>.
          </div>
        </td></tr>

        <!-- body -->
        <tr><td style="padding:24px 36px 8px 36px;">
          <h1 style="margin:0 0 14px 0;font-family:'Syne',Georgia,serif;font-weight:800;font-size:30px;line-height:1.05;letter-spacing:-0.02em;color:#181612;text-transform:lowercase;">
            ${heading}
          </h1>
          <p style="margin:0 0 24px 0;font-family:Inter,Arial,sans-serif;font-size:15px;line-height:1.6;color:#4A463E;">
            ${intro}
          </p>

          <!-- button -->
          <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:10px;background:#6B1421;">
            <a href="${ctaHref}" style="display:inline-block;padding:13px 26px;font-family:Inter,Arial,sans-serif;font-size:15px;font-weight:600;color:#F4F1EA;text-decoration:none;border-radius:10px;">
              ${ctaLabel} &nbsp;&rarr;
            </a>
          </td></tr></table>

          <p style="margin:28px 0 0 0;font-family:Inter,Arial,sans-serif;font-size:15px;line-height:1.6;color:#181612;">
            sarah
          </p>
        </td></tr>

        <!-- divider -->
        <tr><td style="padding:24px 36px 0 36px;">
          <div style="border-top:1px solid rgba(24,22,18,0.1);"></div>
        </td></tr>

        <!-- footer -->
        <tr><td style="padding:16px 36px 28px 36px;">
          <p style="margin:0;font-family:Inter,Arial,sans-serif;font-size:12px;line-height:1.6;color:#8A8579;">
            sarahdigs &middot; websites, ai search &amp; systems<br>
            <a href="${SITE}" style="color:#8A8579;text-decoration:underline;">sarahdigs.com</a>
            &nbsp;&middot;&nbsp;
            <a href="mailto:${process.env.CONTACT_EMAIL || "hello@sarahdigs.com"}?subject=unsubscribe" style="color:#8A8579;text-decoration:underline;">unsubscribe</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`;
}

export async function sendWelcomeEmail(data: { email: string; assetRequested?: string | null }) {
  const { subject, heading, intro, ctaLabel, ctaHref } = resourceBlock(data.assetRequested);
  const html = welcomeEmailHtml({ heading, intro, ctaLabel, ctaHref });
  const replyTo = process.env.CONTACT_EMAIL || smtpUser || undefined;

  // Prefer Resend when configured.
  if (resend) {
    const { error } = await resend.emails.send({
      from: resendFrom,
      to: data.email,
      subject,
      html,
      ...(replyTo ? { replyTo } : {}),
    });
    if (error) {
      console.error("[Email] Resend failed to send welcome email:", error);
      throw new Error(`Resend error: ${error.message ?? "unknown"}`);
    }
    return;
  }

  // Fallback: SMTP (only if credentials are set).
  if (!smtpUser || !smtpPass) {
    console.warn("[Email] Neither Resend nor SMTP configured — welcome email NOT sent to", data.email);
    return;
  }
  await transporter.sendMail({
    from: `"sarahdigs" <${smtpUser}>`,
    to: data.email,
    replyTo,
    subject,
    html,
  });
}
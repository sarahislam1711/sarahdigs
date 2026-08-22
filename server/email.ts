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

// Per-asset content: subject + the block that delivers what they asked for.
function resourceBlock(assetRequested?: string | null): { subject: string; intro: string; cta: string } {
  switch (assetRequested) {
    case "article":
      return {
        subject: "your read is here — how sarahdigs thinks about websites",
        intro: "thanks for the interest. here's a short read on how i think about building websites that get found and convert:",
        cta: `<p><a href="${SITE}/journal/post/why-most-business-websites-fail-to-convert" style="color:#6B1421;font-weight:600;">read it →</a></p>`,
      };
    case "sample-plan":
      return {
        subject: "your sample action plan (from sarahdigs)",
        intro: "thanks for the interest. i'm putting the sanitized sample action plan in front of you — i'll follow up with it directly within one business day.",
        cta: `<p><a href="${SITE}/dig-in-consultations" style="color:#6B1421;font-weight:600;">learn about a dig-in →</a></p>`,
      };
    default: // newsletter / anything else
      return {
        subject: "you're in — welcome to sarahdigs",
        intro: "thanks for subscribing. you'll get occasional notes on web design, ai search visibility, and building a brand that gets found — no spam, unsubscribe anytime.",
        cta: `<p><a href="${SITE}/journal" style="color:#6B1421;font-weight:600;">read the journal →</a></p>`,
      };
  }
}

export async function sendWelcomeEmail(data: { email: string; assetRequested?: string | null }) {
  const { subject, intro, cta } = resourceBlock(data.assetRequested);
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;color:#181612;max-width:520px;">
      <p style="font-size:18px;font-weight:600;">hey,</p>
      <p style="font-size:15px;line-height:1.55;">${intro}</p>
      ${cta}
      <p style="font-size:15px;line-height:1.55;">sarah</p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;"/>
      <p style="font-size:12px;color:#888;">sarahdigs · <a href="${SITE}" style="color:#888;">sarahdigs.com</a></p>
    </div>
  `;
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
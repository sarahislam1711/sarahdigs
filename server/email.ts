import nodemailer from "nodemailer";

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
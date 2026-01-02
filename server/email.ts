import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendCustomPlanEmail(data: {
  name: string;
  email: string;
  businessDescription: string;
  mainChallenge: string;
  selectedModules: string[];
  budgetRange: string;
}) {
  const contactEmail = process.env.CONTACT_EMAIL || process.env.SMTP_USER;

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
    from: `"SarahDigs Website" <${process.env.SMTP_USER}>`,
    to: contactEmail,
    replyTo: data.email,
    subject: `New Custom Plan Request from ${data.name}`,
    html,
  });
}

export async function sendContactEmail(data: {
  name: string;
  email: string;
  company?: string;
  message: string;
}) {
  const contactEmail = process.env.CONTACT_EMAIL || process.env.SMTP_USER;

  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>From:</strong> ${data.name} (${data.email})</p>
    ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ""}
    <hr/>
    <h3>Message</h3>
    <p>${data.message}</p>
    <hr/>
    <p><em>Sent from SarahDigs website</em></p>
  `;

  await transporter.sendMail({
    from: `"SarahDigs Website" <${process.env.SMTP_USER}>`,
    to: contactEmail,
    replyTo: data.email,
    subject: `New Contact from ${data.name}`,
    html,
  });
}
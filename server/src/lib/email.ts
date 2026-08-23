import nodemailer from 'nodemailer';

// Sistem za slanje mejla za zaboravljenu lozinku
export const emailEnabled = Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);

const transporter = emailEnabled
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })
  : null;

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  if (!transporter) {
    console.log(`[email] not configured — reset link for ${to}: ${resetUrl}`);
    return;
  }

  await transporter.sendMail({
    from: `Activity Planner <${process.env.GMAIL_USER}>`,
    to,
    subject: 'Reset your password',
    text: `Reset your password: ${resetUrl}\n\nThis link expires in 1 hour. If you didn't request this, ignore this email.`,
    html: `
      <p>Someone requested a password reset for your Activity Planner account.</p>
      <p><a href="${resetUrl}">Reset your password</a></p>
      <p>This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>
    `,
  });
}

import nodemailer from 'nodemailer';
import { logger } from './logger.js';

type SendEmailOptions = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const service = process.env.SMTP_SERVICE; // e.g., 'gmail'

  if ((service || host) && (user && pass)) {
    try {
      // Prefer service if provided (e.g., Gmail via App Password)
      const transport = service
        ? nodemailer.createTransport({
            service,
            auth: { user, pass },
          } as any)
        : nodemailer.createTransport({
            host,
            port: port ?? 587,
            secure: Boolean(process.env.SMTP_SECURE === 'true') || (port === 465),
            auth: { user, pass },
            tls: {
              rejectUnauthorized: false // For development only
            }
          });
      
      // Verify transport configuration
      logger.info({ host: host || service, user, port: port ?? 587 }, 'SMTP transport created');
      return transport;
    } catch (error: any) {
      logger.error({ error: error.message }, 'Failed to create SMTP transport');
      return null;
    }
  }

  // Fallback: no SMTP configured
  logger.warn('SMTP not configured: missing SMTP_HOST/SMTP_SERVICE or SMTP_USER/SMTP_PASS');
  return null;
}

const transport = createTransport();
const fromAddress = process.env.EMAIL_FROM || process.env.SMTP_USER || 'no-reply@example.com';

export async function sendEmail(options: SendEmailOptions): Promise<void> {
  if (!transport) {
    // Development fallback: log instead of sending
    logger.warn(
      {
        to: options.to,
        subject: options.subject,
        text: options.text,
      },
      'SMTP not configured. Email not sent (logged for development).'
    );
    return;
  }
  
  try {
    const info = await transport.sendMail({
      from: fromAddress,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    logger.info({ messageId: info.messageId, to: options.to }, 'Email sent successfully');
  } catch (error: any) {
    logger.error({ error: error.message, to: options.to }, 'Failed to send email');
    throw error;
  }
}

export async function sendSignupOtpEmail(to: string, otpCode: string): Promise<void> {
  const subject = 'Your BookYourTrip verification code';
  const text =
    `Your verification code is: ${otpCode}\n` +
    `It expires in 10 minutes. If you did not request this, please ignore this email.`;
  const html =
    `<p>Your verification code is: <strong style="font-size:18px;">${otpCode}</strong></p>` +
    `<p>It expires in 10 minutes. If you did not request this, please ignore this email.</p>`;
  await sendEmail({ to, subject, text, html });
}




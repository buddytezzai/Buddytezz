import crypto from 'crypto';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, name } = req.body || {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'A valid email address is required.' });
  }

  const secret = process.env.DOWNLOAD_SECRET || process.env.RAZORPAY_KEY_SECRET || 'buddy-tezz-otp-secret-key';
  
  // Generate 6-digit numeric OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes validity

  // Create HMAC signature of email + otp + expiry
  const payload = `${email.toLowerCase().trim()}:${otp}:${expiry}`;
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  
  // Hash token sent to client (does NOT contain the plain OTP)
  const hashToken = Buffer.from(`${email.toLowerCase().trim()}:${expiry}:${signature}`).toString('base64url');

  // Configure Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER || 'buddytezzai@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const displayName = name ? name.trim() : 'there';

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 550px; margin: 0 auto; background: #0a0f1e; color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #1e293b;">
      <div style="background: linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 100%); padding: 28px 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">🔐 Email Verification Code</h1>
        <p style="margin: 6px 0 0; opacity: 0.9; font-size: 14px; color: #e0f2fe;">Buddy Tezz AI — Digital Store</p>
      </div>
      <div style="padding: 32px 24px; text-align: center;">
        <p style="font-size: 16px; color: #cbd5e1; margin-bottom: 20px; text-align: left;">Hi <strong>${displayName}</strong>,</p>
        <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 24px; text-align: left;">
          Please use the following 6-digit verification code to confirm your email address before completing your purchase. Your digital product download link will be delivered to this email.
        </p>

        <div style="background: #0f172a; border: 2px dashed #2563eb; border-radius: 12px; padding: 20px; margin: 24px 0; display: inline-block;">
          <span style="font-family: 'Courier New', monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #38bdf8;">${otp}</span>
        </div>

        <p style="color: #64748b; font-size: 13px; margin-top: 16px;">
          ⏱️ This code is valid for <strong>10 minutes</strong>.
        </p>
        <p style="color: #64748b; font-size: 12px; margin-top: 8px;">
          If you did not request this verification code, you can safely ignore this email.
        </p>
      </div>
      <div style="background: #020617; padding: 14px 24px; text-align: center; border-top: 1px solid #1e293b;">
        <p style="margin: 0; font-size: 12px; color: #475569;">© 2026 Buddy Tezz AI · <a href="mailto:buddytezzai@gmail.com" style="color: #38bdf8; text-decoration: none;">buddytezzai@gmail.com</a></p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Buddy Tezz AI Verification" <buddytezzai@gmail.com>`,
      to: email.trim(),
      subject: `🔐 Your Verification Code: ${otp} — Buddy Tezz AI`,
      html: htmlContent,
      text: `Hi ${displayName},\n\nYour 6-digit verification code for Buddy Tezz AI is: ${otp}\n\nThis code is valid for 10 minutes.\n\nThank you!`,
    });

    return res.status(200).json({
      message: 'OTP sent successfully',
      hashToken,
    });
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    return res.status(500).json({
      message: 'Failed to send verification code. Please check the email address and try again.',
      details: error.message,
    });
  }
}

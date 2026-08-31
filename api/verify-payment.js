import crypto from 'crypto';
import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';

// Must match the product catalog in create-order.js
const PRODUCTS = {
  'ai-automation-playbook': {
    name: 'Personal Budget Tracker Template',
    filename: 'Personal_Budget_Tracker_Template.xlsx',
  }
};

// Generate a signed, time-limited download token
function generateDownloadToken(productId, email) {
  const secret = process.env.DOWNLOAD_SECRET || process.env.RAZORPAY_KEY_SECRET || 'buddy-tezz-default-secret-change-me';
  const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now
  const payload = `${productId}:${email}:${expiry}`;
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  const token = Buffer.from(`${payload}:${signature}`).toString('base64url');
  return token;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, buyerName, buyerEmail, productId = 'ai-automation-playbook' } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment verification fields.' });
    }

    if (!buyerEmail || !buyerName) {
      return res.status(400).json({ message: 'Missing buyer details.' });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.error('RAZORPAY_KEY_SECRET not set');
      return res.status(500).json({ message: 'Payment gateway misconfigured.' });
    }

    // Verify Razorpay signature to prevent fraud
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.warn('Payment signature mismatch — possible tampering attempt:', { razorpay_order_id });
      return res.status(400).json({ message: 'Payment verification failed. Signature mismatch.' });
    }

    // Signature is valid — generate secure download link
    const product = PRODUCTS[productId] || PRODUCTS['ai-automation-playbook'];
    const downloadToken = generateDownloadToken(productId, buyerEmail);
    
    // Resolve base domain to use custom/public domain instead of Vercel private preview deployment
    let baseUrl = process.env.SITE_URL;
    if (!baseUrl) {
      const origin = req.headers.origin || req.headers.referer;
      if (origin && !origin.includes('-projects.vercel.app')) {
        try {
          baseUrl = new URL(origin).origin;
        } catch (e) {}
      }
      if (!baseUrl) {
        const host = req.headers['x-forwarded-host'] || req.headers.host;
        if (host && !host.includes('-projects.vercel.app')) {
          const proto = req.headers['x-forwarded-proto'] || (host.includes('localhost') ? 'http' : 'https');
          baseUrl = `${proto}://${host}`;
        } else {
          baseUrl = 'https://buddytezzai.com';
        }
      }
    }
    baseUrl = baseUrl.replace(/\/+$/, '');
    const downloadUrl = `${baseUrl}/api/download?token=${downloadToken}`;

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER || 'buddytezzai@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Try to load product file to attach directly in email
    let fileAttachment = null;
    const candidatePaths = [
      path.join(process.cwd(), 'apps', 'web', 'public', 'products', product.filename),
      path.join(process.cwd(), 'apps', 'web', 'out', 'products', product.filename),
      path.join(process.cwd(), 'public', 'products', product.filename),
      path.join(process.cwd(), 'products', product.filename),
      path.resolve(process.cwd(), '../apps/web/public/products', product.filename),
    ];

    for (const candidate of candidatePaths) {
      try {
        if (fs.existsSync(candidate)) {
          fileAttachment = {
            filename: product.filename,
            content: fs.readFileSync(candidate),
            contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          };
          break;
        }
      } catch (e) {
        console.warn('Could not read candidate path:', candidate, e.message);
      }
    }

    // ── Buyer Delivery Email ──
    const buyerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f1e; color: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #1e293b;">
        <div style="background: linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 100%); padding: 32px 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">🎉 Your Purchase is Confirmed!</h1>
          <p style="margin: 8px 0 0; opacity: 0.9; font-size: 15px; color: #e0f2fe;">Thank you for buying from Buddy Tezz AI</p>
        </div>
        <div style="padding: 32px 24px;">
          <p style="font-size: 16px; color: #e2e8f0;">Hi <strong>${buyerName}</strong>,</p>
          <p style="color: #94a3b8; line-height: 1.7;">Your payment of <strong>₹99</strong> was successful! Your <strong>${product.name}</strong> is attached directly to this email and can also be downloaded below.</p>

          <div style="background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 24px 20px; margin: 24px 0; text-align: center;">
            <p style="margin: 0 0 14px; font-size: 14px; color: #94a3b8;">Click the button below to download your template directly:</p>
            <a href="${downloadUrl}" style="display: inline-block; background: linear-gradient(135deg, #2563eb, #0ea5e9); color: #fff; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-weight: 700; font-size: 16px; letter-spacing: 0.3px;">
              ⬇️ Download Template
            </a>
            <p style="margin: 14px 0 0; font-size: 12px; color: #64748b;">Link is valid for 24 hours. The file is also attached to this email.</p>
          </div>

          <div style="border-top: 1px solid #1e293b; padding-top: 20px; margin-top: 8px;">
            <p style="font-size: 13px; color: #64748b; margin: 4px 0;">Order ID: <span style="color: #94a3b8;">${razorpay_order_id}</span></p>
            <p style="font-size: 13px; color: #64748b; margin: 4px 0;">Payment ID: <span style="color: #94a3b8;">${razorpay_payment_id}</span></p>
            <p style="font-size: 13px; color: #64748b; margin: 12px 0 0;">Need any help? Just reply directly to this email at <a href="mailto:buddytezzai@gmail.com" style="color: #60a5fa;">buddytezzai@gmail.com</a>.</p>
          </div>
        </div>
        <div style="background: #0f172a; padding: 16px 24px; text-align: center; border-top: 1px solid #1e293b;">
          <p style="margin: 0; font-size: 12px; color: #475569;">© 2026 Buddy Tezz AI · <a href="mailto:buddytezzai@gmail.com" style="color: #60a5fa;">buddytezzai@gmail.com</a></p>
        </div>
      </div>
    `;

    // ── Admin Notification Email ──
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 8px;">
        <h2 style="color: #2563eb;">💰 New Digital Product Sale!</h2>
        <table style="width:100%; border-collapse:collapse; background:#fff; border-radius:6px; overflow:hidden;">
          <tr style="background:#f3f4f6;"><td style="padding:12px 16px; font-weight:bold; color:#374151; width:40%;">Product</td><td style="padding:12px 16px; color:#111827;">${product.name}</td></tr>
          <tr><td style="padding:12px 16px; font-weight:bold; color:#374151;">Buyer Name</td><td style="padding:12px 16px; color:#111827;">${buyerName}</td></tr>
          <tr style="background:#f3f4f6;"><td style="padding:12px 16px; font-weight:bold; color:#374151;">Buyer Email</td><td style="padding:12px 16px; color:#111827;"><a href="mailto:${buyerEmail}" style="color:#2563eb;">${buyerEmail}</a></td></tr>
          <tr><td style="padding:12px 16px; font-weight:bold; color:#374151;">Amount</td><td style="padding:12px 16px; color:#111827;">₹99</td></tr>
          <tr style="background:#f3f4f6;"><td style="padding:12px 16px; font-weight:bold; color:#374151;">Razorpay Order ID</td><td style="padding:12px 16px; color:#111827;">${razorpay_order_id}</td></tr>
          <tr><td style="padding:12px 16px; font-weight:bold; color:#374151;">Payment ID</td><td style="padding:12px 16px; color:#111827;">${razorpay_payment_id}</td></tr>
          <tr style="background:#f3f4f6;"><td style="padding:12px 16px; font-weight:bold; color:#374151;">Purchased At</td><td style="padding:12px 16px; color:#111827;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td></tr>
        </table>
      </div>
    `;

    try {
      const buyerMailOptions = {
        from: `"Buddy Tezz AI" <buddytezzai@gmail.com>`,
        to: buyerEmail,
        subject: `🎉 Your Download Link & Excel Sheet — ${product.name}`,
        html: buyerHtml,
        text: `Hi ${buyerName}, your payment was successful! Download your template here: ${downloadUrl}. Order ID: ${razorpay_order_id}`,
      };

      if (fileAttachment) {
        buyerMailOptions.attachments = [fileAttachment];
      }

      // Send buyer delivery email
      await transporter.sendMail(buyerMailOptions);

      // Send admin notification
      await transporter.sendMail({
        from: `"Buddy Tezz AI Website" <buddytezzai@gmail.com>`,
        to: 'buddytezzai@gmail.com',
        subject: `💰 New Sale: ${product.name} — ${buyerName}`,
        html: adminHtml,
      });

      return res.status(200).json({ message: 'Payment verified and email sent successfully.' });
    } catch (emailError) {
      console.error('Email delivery failed after verified payment:', emailError);
      return res.status(200).json({
        message: 'Payment verified. Email delivery encountered a delay — please check your inbox shortly or contact buddytezzai@gmail.com.',
        paymentId: razorpay_payment_id,
      });
    }
  } catch (err) {
    console.error('Unexpected error in verify-payment handler:', err);
    return res.status(500).json({
      message: 'Failed to verify payment.',
      details: err.message,
    });
  }
}

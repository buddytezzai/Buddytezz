import nodemailer from 'nodemailer';
import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';
import { readFileSync } from 'node:fs';
import Razorpay from 'razorpay';

// Load root .env and .env.local manually so variables are available in Vite dev server process.
function loadRootEnv() {
  const candidatePaths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), '.env.local'),
    path.resolve(process.cwd(), '../.env'),
    path.resolve(process.cwd(), '../.env.local'),
    path.resolve(process.cwd(), '../../.env'),
    path.resolve(process.cwd(), '../../.env.local'),
  ];

  for (const envPath of candidatePaths) {
    if (fs.existsSync(envPath)) {
      try {
        const lines = readFileSync(envPath, 'utf-8').split(/\r?\n/);
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;
          const eqIdx = trimmed.indexOf('=');
          if (eqIdx === -1) continue;
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
          if (key && !process.env[key]) {
            process.env[key] = val;
          }
        }
      } catch (e) {
        console.warn(`[vite-plugin-api] Error reading ${envPath}:`, e.message);
      }
    }
  }
}

/**
 * Vite plugin that serves /api/* routes locally during development.
 * Mirrors the Vercel serverless functions in /api so form submissions work
 * without needing a separate backend process or the Vercel CLI.
 */
export default function apiPlugin() {
  return {
    name: 'vite-plugin-api',
    configureServer(server) {
      loadRootEnv(); // load root .env into process.env
      server.middlewares.use('/api/submit-form', async (req, res) => {
        // Only allow POST
        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Method Not Allowed' }));
          return;
        }

        // Read request body
        let body = '';
        req.on('data', (chunk) => (body += chunk.toString()));
        req.on('end', async () => {
          try {
            const { name, businessName, phone, email, service, description } =
              JSON.parse(body);

            // Validate required fields
            if (!name || !email || !phone || !service) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Missing required fields' }));
              return;
            }

            // Build CSV attachment
            const escapeCsv = (str) =>
              `"${String(str || '').replace(/"/g, '""')}"`;
            const csvHeaders =
              'Name,Business Name,Phone,Email,Service,Message / Requirement\n';
            const csvRow = `${escapeCsv(name)},${escapeCsv(businessName)},${escapeCsv(phone)},${escapeCsv(email)},${escapeCsv(service)},${escapeCsv(description)}`;
            const csvContent = csvHeaders + csvRow;

            const dateStr = new Date().toISOString().split('T')[0];
            const filename = `Lead_${name.replace(/\s+/g, '_')}_${dateStr}.csv`;

            // Configure nodemailer transporter
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: process.env.GMAIL_USER || 'buddytezzai@gmail.com',
                pass: process.env.GMAIL_APP_PASSWORD,
              },
            });

            const htmlBody = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 8px;">
                <h2 style="color: #4f46e5; margin-bottom: 20px;">🎉 New Lead from Buddy Tezz AI Website</h2>
                <table style="width: 100%; border-collapse: collapse; background: #fff; border-radius: 6px; overflow: hidden;">
                  <tr style="background: #f3f4f6;">
                    <td style="padding: 12px 16px; font-weight: bold; color: #374151; width: 40%;">Name</td>
                    <td style="padding: 12px 16px; color: #111827;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 16px; font-weight: bold; color: #374151;">Business Name</td>
                    <td style="padding: 12px 16px; color: #111827;">${businessName || 'N/A'}</td>
                  </tr>
                  <tr style="background: #f3f4f6;">
                    <td style="padding: 12px 16px; font-weight: bold; color: #374151;">Email</td>
                    <td style="padding: 12px 16px; color: #111827;"><a href="mailto:${email}" style="color: #4f46e5;">${email}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 16px; font-weight: bold; color: #374151;">Phone Number</td>
                    <td style="padding: 12px 16px; color: #111827;">${phone}</td>
                  </tr>
                  <tr style="background: #f3f4f6;">
                    <td style="padding: 12px 16px; font-weight: bold; color: #374151;">Selected Service</td>
                    <td style="padding: 12px 16px; color: #111827;">${service}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 16px; font-weight: bold; color: #374151; vertical-align: top;">Message / Requirement</td>
                    <td style="padding: 12px 16px; color: #111827;">${description || 'Not provided'}</td>
                  </tr>
                </table>
                <p style="margin-top: 20px; color: #6b7280; font-size: 13px;">A CSV file with this lead's details is attached. Submitted on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST.</p>
              </div>
            `;

            const mailOptions = {
              from: `"Buddy Tezz AI Website" <buddytezzai@gmail.com>`,
              to: 'buddytezzai@gmail.com',
              subject: `🔔 New Lead: ${name} — ${service}`,
              html: htmlBody,
              text: `New lead from ${name}!\n\nName: ${name}\nBusiness: ${businessName || 'N/A'}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\nMessage: ${description || 'Not provided'}`,
              attachments: [
                {
                  filename,
                  content: csvContent,
                  contentType: 'text/csv',
                },
              ],
            };

            await transporter.sendMail(mailOptions);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Email sent successfully!' }));
          } catch (error) {
            console.error('[api/submit-form] Error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(
              JSON.stringify({
                message: 'Failed to send email.',
                details: error.message,
              })
            );
          }
        });
      });

      // ── /api/send-otp ───────────────────────────────────────────────
      server.middlewares.use('/api/send-otp', async (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Method Not Allowed' }));
          return;
        }
        let body = '';
        req.on('data', chunk => (body += chunk.toString()));
        req.on('end', async () => {
          try {
            const { email, name } = JSON.parse(body || '{}');
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'A valid email address is required.' }));
              return;
            }
            const secret = process.env.DOWNLOAD_SECRET || process.env.RAZORPAY_KEY_SECRET || 'buddy-tezz-otp-secret-key';
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const expiry = Date.now() + 10 * 60 * 1000;
            const payload = `${email.toLowerCase().trim()}:${otp}:${expiry}`;
            const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
            const hashToken = Buffer.from(`${email.toLowerCase().trim()}:${expiry}:${signature}`).toString('base64url');

            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: process.env.GMAIL_USER || 'buddytezzai@gmail.com',
                pass: process.env.GMAIL_APP_PASSWORD,
              },
            });
            const displayName = name ? name.trim() : 'there';
            await transporter.sendMail({
              from: '"Buddy Tezz AI Verification" <buddytezzai@gmail.com>',
              to: email.trim(),
              subject: `🔐 Your Verification Code: ${otp} — Buddy Tezz AI`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #0a0f1e; color: #fff; border-radius: 12px; padding: 24px; text-align: center;">
                  <h2 style="color: #38bdf8;">Email Verification Code</h2>
                  <p style="color: #cbd5e1; text-align: left;">Hi <strong>${displayName}</strong>,</p>
                  <p style="color: #94a3b8; text-align: left;">Enter this 6-digit code to verify your email before payment:</p>
                  <div style="background: #0f172a; border: 2px dashed #2563eb; border-radius: 8px; padding: 16px; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #38bdf8;">${otp}</span>
                  </div>
                  <p style="color: #64748b; font-size: 12px;">Valid for 10 minutes.</p>
                </div>
              `,
              text: `Hi ${displayName}, your 6-digit verification code is: ${otp}`,
            });

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'OTP sent successfully', hashToken }));
          } catch (err) {
            console.error('[api/send-otp]', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Failed to send verification code.', details: err.message }));
          }
        });
      });

      // ── /api/verify-otp ─────────────────────────────────────────────
      server.middlewares.use('/api/verify-otp', async (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Method Not Allowed' }));
          return;
        }
        let body = '';
        req.on('data', chunk => (body += chunk.toString()));
        req.on('end', async () => {
          try {
            const { email, otp, hashToken } = JSON.parse(body || '{}');
            if (!email || !otp || !hashToken) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Missing required parameters.' }));
              return;
            }
            const cleanOtp = String(otp).trim();
            const cleanEmail = String(email).toLowerCase().trim();
            const secret = process.env.DOWNLOAD_SECRET || process.env.RAZORPAY_KEY_SECRET || 'buddy-tezz-otp-secret-key';
            const decoded = Buffer.from(hashToken, 'base64url').toString('utf-8');
            const [storedEmail, expiryStr, signature] = decoded.split(':');
            if (storedEmail !== cleanEmail || Date.now() > parseInt(expiryStr, 10)) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Code expired or invalid email.' }));
              return;
            }
            const expectedPayload = `${cleanEmail}:${cleanOtp}:${expiryStr}`;
            const expectedSignature = crypto.createHmac('sha256', secret).update(expectedPayload).digest('hex');
            if (expectedSignature !== signature) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Invalid verification code. Please check your email.' }));
              return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Email verified!', verified: true }));
          } catch (err) {
            console.error('[api/verify-otp]', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: err.message }));
          }
        });
      });

      // ── /api/create-order ────────────────────────────────────────────
      const PRODUCTS = {
        'ai-automation-playbook': { name: 'Personal Budget Tracker Template', priceINR: 9900, priceUSD: 199 },
      };

      server.middlewares.use('/api/create-order', async (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Method Not Allowed' }));
          return;
        }
        let body = '';
        req.on('data', chunk => (body += chunk.toString()));
        req.on('end', async () => {
          try {
            const { productId = 'ai-automation-playbook', currency = 'INR' } = JSON.parse(body || '{}');
            const product = PRODUCTS[productId];
            if (!product) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Product not found.' }));
              return;
            }
            if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
              // Dev: return a mock response so UI works without real Razorpay keys
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                orderId: 'order_DEV_' + Date.now(),
                amount: currency === 'USD' ? product.priceUSD : product.priceINR,
                currency: currency === 'USD' ? 'USD' : 'INR',
                productName: product.name,
                keyId: 'rzp_test_REPLACE_WITH_YOUR_KEY',
              }));
              return;
            }
            const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
            const amount = currency === 'USD' ? product.priceUSD : product.priceINR;
            const order = await razorpay.orders.create({ amount, currency: currency === 'USD' ? 'USD' : 'INR', receipt: `receipt_${productId}_${Date.now()}` });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ orderId: order.id, amount: order.amount, currency: order.currency, productName: product.name, keyId: process.env.RAZORPAY_KEY_ID }));
          } catch (err) {
            console.error('[api/create-order]', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: err.message }));
          }
        });
      });

      // ── /api/verify-payment ──────────────────────────────────────────
      function generateDownloadToken(productId, email) {
        const secret = process.env.DOWNLOAD_SECRET || 'buddy-tezz-default-secret-change-me';
        const expiry = Date.now() + 24 * 60 * 60 * 1000;
        const payload = `${productId}:${email}:${expiry}`;
        const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
        return Buffer.from(`${payload}:${signature}`).toString('base64url');
      }

      server.middlewares.use('/api/verify-payment', async (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Method Not Allowed' }));
          return;
        }
        let body = '';
        req.on('data', chunk => (body += chunk.toString()));
        req.on('end', async () => {
          try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature, buyerName, buyerEmail, productId = 'ai-automation-playbook' } = JSON.parse(body || '{}');
            const keySecret = process.env.RAZORPAY_KEY_SECRET;
            // In dev without keys, skip signature check
            if (keySecret) {
              const expected = crypto.createHmac('sha256', keySecret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
              if (expected !== razorpay_signature) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Payment signature mismatch.' }));
                return;
              }
            }
            const product = PRODUCTS[productId] || PRODUCTS['ai-automation-playbook'];
            const token = generateDownloadToken(productId, buyerEmail);
            const downloadUrl = `http://localhost:${process.env.PORT || 3000}/api/download?token=${token}`;
            const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.GMAIL_USER || 'buddytezzai@gmail.com', pass: process.env.GMAIL_APP_PASSWORD } });
            await transporter.sendMail({
              from: '"Buddy Tezz AI" <buddytezzai@gmail.com>',
              to: buyerEmail,
              subject: `🎉 Your Download Link — ${product.name}`,
              html: `<p>Hi ${buyerName},</p><p>Thank you for your purchase! <a href="${downloadUrl}">Click here to download ${product.name}</a>. This link expires in 24 hours.</p><p>Order ID: ${razorpay_order_id}</p>`,
            });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Payment verified and email sent.' }));
          } catch (err) {
            console.error('[api/verify-payment]', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: err.message }));
          }
        });
      });

      // ── /api/download ────────────────────────────────────────────────
      function verifyDownloadToken(token) {
        const secret = process.env.DOWNLOAD_SECRET || 'buddy-tezz-default-secret-change-me';
        try {
          const decoded = Buffer.from(token, 'base64url').toString('utf-8');
          const parts = decoded.split(':');
          if (parts.length !== 4) return { valid: false, reason: 'Malformed token' };
          const [productId, email, expiry, signature] = parts;
          if (Date.now() > parseInt(expiry, 10)) return { valid: false, reason: 'Link expired. Email buddytezzai@gmail.com for a new one.' };
          const payload = `${productId}:${email}:${expiry}`;
          const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
          if (expected !== signature) return { valid: false, reason: 'Invalid token.' };
          return { valid: true, productId, email };
        } catch { return { valid: false, reason: 'Parse error.' }; }
      }

      server.middlewares.use('/api/download', (req, res) => {
        const url = new URL(req.url, 'http://localhost');
        const token = url.searchParams.get('token');
        if (!token) { res.writeHead(400); res.end('Missing token'); return; }
        const result = verifyDownloadToken(token);
        if (!result.valid) { res.writeHead(403, { 'Content-Type': 'text/plain' }); res.end(result.reason); return; }
        // Look for file relative to monorepo root
        const filePath = path.resolve(process.cwd(), '../../apps/web/public/products/Personal_Budget_Tracker_Template.xlsx');
        if (!fs.existsSync(filePath)) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Product file not found. Please upload it to apps/web/public/products/');
          return;
        }
        const fileBuffer = fs.readFileSync(filePath);
        res.writeHead(200, {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="Personal_Budget_Tracker_Template.xlsx"',
          'Content-Length': fileBuffer.length,
          'Cache-Control': 'no-store',
        });
        res.end(fileBuffer);
      });
    },
  };
}

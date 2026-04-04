import nodemailer from 'nodemailer';
import path from 'node:path';
import { readFileSync } from 'node:fs';

// Load root .env manually so GMAIL_APP_PASSWORD is available in the Vite server process.
// (Vite only loads apps/web/.env by default, not the monorepo root .env)
function loadRootEnv() {
  try {
    // npm run dev --prefix apps/web sets cwd to apps/web/, so ../../ = monorepo root
    const envPath = path.resolve(process.cwd(), '../../.env');
    const lines = readFileSync(envPath, 'utf-8').split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      if (key && !(key in process.env)) process.env[key] = val;
    }
  } catch (e) {
    console.warn('[vite-plugin-api] Could not load .env file:', e.message);
    // .env not found — rely on process.env set externally
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
    },
  };
}

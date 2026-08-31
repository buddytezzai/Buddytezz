import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

// Must match the generate function in verify-payment.js
function verifyDownloadToken(token) {
  const secret = process.env.DOWNLOAD_SECRET || 'buddy-tezz-default-secret-change-me';
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length !== 4) return { valid: false, reason: 'Malformed token' };

    const [productId, email, expiry, signature] = parts;

    // Check expiry
    if (Date.now() > parseInt(expiry, 10)) {
      return { valid: false, reason: 'Download link has expired. Please contact buddytezzai@gmail.com to get a fresh link.' };
    }

    // Verify signature
    const payload = `${productId}:${email}:${expiry}`;
    const expectedSig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    if (expectedSig !== signature) {
      return { valid: false, reason: 'Invalid download token.' };
    }

    return { valid: true, productId, email };
  } catch {
    return { valid: false, reason: 'Failed to parse token.' };
  }
}

// Product file map — update filename when you upload your product
const PRODUCT_FILES = {
  'ai-automation-playbook': {
    filename: 'Personal_Budget_Tracker_Template.xlsx',
    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    displayName: 'Personal_Budget_Tracker_Template.xlsx',
  },
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { token } = req.query;

  if (!token) {
    return res.status(400).send(buildErrorPage('Missing download token. Please use the link from your purchase email.'));
  }

  const result = verifyDownloadToken(token);
  if (!result.valid) {
    return res.status(403).send(buildErrorPage(result.reason));
  }

  const productInfo = PRODUCT_FILES[result.productId] || PRODUCT_FILES['ai-automation-playbook'];

  // Try to find the file in /public/products/
  // Vercel serverless functions can read from /public via process.cwd()
  const filePath = path.join(process.cwd(), 'apps', 'web', 'public', 'products', productInfo.filename);

  if (!fs.existsSync(filePath)) {
    console.error(`Product file not found at: ${filePath}`);
    // Fallback: send a helpful email-them page
    return res.status(404).send(buildErrorPage(
      'Product file is temporarily unavailable. Please email buddytezzai@gmail.com with your Payment ID and we will send it directly.'
    ));
  }

  const fileBuffer = fs.readFileSync(filePath);
  const fileSize = fs.statSync(filePath).size;

  res.setHeader('Content-Type', productInfo.contentType);
  res.setHeader('Content-Disposition', `attachment; filename="${productInfo.displayName}"`);
  res.setHeader('Content-Length', fileSize);
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  return res.status(200).send(fileBuffer);
}

function buildErrorPage(message) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Download Error — Buddy Tezz AI</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', sans-serif; background: #0a0f1e; color: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 24px; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 48px 32px; max-width: 480px; text-align: center; }
    .icon { font-size: 48px; margin-bottom: 16px; }
    h1 { font-size: 22px; font-weight: 700; color: #f87171; margin-bottom: 12px; }
    p { color: #94a3b8; line-height: 1.7; font-size: 15px; margin-bottom: 24px; }
    a { display: inline-block; background: linear-gradient(135deg, #2563eb, #0ea5e9); color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">⚠️</div>
    <h1>Download Unavailable</h1>
    <p>${message}</p>
    <a href="mailto:buddytezzai@gmail.com">Contact Support</a>
  </div>
</body>
</html>`;
}

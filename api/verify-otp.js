import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, otp, hashToken } = req.body || {};

  if (!email || !otp || !hashToken) {
    return res.status(400).json({ message: 'Missing required OTP verification parameters.' });
  }

  const cleanOtp = String(otp).trim();
  const cleanEmail = String(email).toLowerCase().trim();
  const secret = process.env.DOWNLOAD_SECRET || process.env.RAZORPAY_KEY_SECRET || 'buddy-tezz-otp-secret-key';

  try {
    const decoded = Buffer.from(hashToken, 'base64url').toString('utf-8');
    const parts = decoded.split(':');

    if (parts.length !== 3) {
      return res.status(400).json({ message: 'Invalid verification token format.' });
    }

    const [storedEmail, expiryStr, signature] = parts;
    const expiry = parseInt(expiryStr, 10);

    if (storedEmail !== cleanEmail) {
      return res.status(400).json({ message: 'Email mismatch during verification.' });
    }

    if (Date.now() > expiry) {
      return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
    }

    // Recompute signature with provided OTP
    const expectedPayload = `${cleanEmail}:${cleanOtp}:${expiry}`;
    const expectedSignature = crypto.createHmac('sha256', secret).update(expectedPayload).digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).json({ message: 'Invalid verification code. Please check and enter the 6-digit code sent to your email.' });
    }

    // Generate verified token
    const verifiedTokenPayload = `verified:${cleanEmail}:${Date.now() + 30 * 60 * 1000}`;
    const verifiedSignature = crypto.createHmac('sha256', secret).update(verifiedTokenPayload).digest('hex');
    const verifiedToken = Buffer.from(`${verifiedTokenPayload}:${verifiedSignature}`).toString('base64url');

    return res.status(200).json({
      message: 'Email verified successfully!',
      verified: true,
      verifiedToken,
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(400).json({ message: 'Failed to verify code. Please try again.' });
  }
}

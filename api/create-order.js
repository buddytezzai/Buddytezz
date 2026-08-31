import Razorpay from 'razorpay';

// Product catalog — update price/name here when you're ready
const PRODUCTS = {
  'ai-automation-playbook': {
    name: 'Personal Budget Tracker Template',
    priceINR: 99900, // in paise — ₹999
    priceUSD: 1200,  // in cents — $12
    filename: 'Personal_Budget_Tracker_Template.xlsx',
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { productId = 'ai-automation-playbook', currency = 'INR' } = req.body || {};

  const product = PRODUCTS[productId];
  if (!product) {
    return res.status(400).json({ message: 'Product not found.' });
  }

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error('Razorpay keys not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your environment variables.');
    return res.status(500).json({ message: 'Payment gateway not configured. Please contact support.' });
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const amount = currency === 'USD' ? product.priceUSD : product.priceINR;

  try {
    const order = await razorpay.orders.create({
      amount,
      currency: currency === 'USD' ? 'USD' : 'INR',
      receipt: `receipt_${productId}_${Date.now()}`,
      notes: {
        product_id: productId,
        product_name: product.name,
      },
    });

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      productName: product.name,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    return res.status(500).json({ message: 'Failed to create payment order.', details: error.message });
  }
}

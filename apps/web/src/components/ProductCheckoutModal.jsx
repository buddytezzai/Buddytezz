
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Shield, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Dynamically load Razorpay checkout script
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const PRODUCT_ID = 'ai-automation-playbook';

const ProductCheckoutModal = ({ isOpen, onClose, productName, priceINR, priceUSD }) => {
  const [step, setStep] = useState('form'); // 'form' | 'paying' | 'success' | 'error'
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setFormData({ name: '', email: '' });
      setErrors({});
      setErrorMsg('');
    }
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape' && step !== 'paying') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, step]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Your name is required.';
    if (!formData.email.trim()) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Enter a valid email address.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePay = useCallback(async () => {
    if (!validate()) return;
    setIsLoading(true);
    setStep('paying');

    try {
      // 1. Load Razorpay SDK
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error('Razorpay SDK failed to load. Please check your connection.');

      // 2. Create an order on the server
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: PRODUCT_ID, currency: 'INR' }),
      });

      if (!orderRes.ok) {
        const errData = await orderRes.json();
        throw new Error(errData.message || 'Failed to create payment order.');
      }
      const orderData = await orderRes.json();

      // 3. Open Razorpay modal
      await new Promise((resolve, reject) => {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Buddy Tezz AI',
          description: productName,
          image: '/images/logo.png',
          order_id: orderData.orderId,
          prefill: {
            name: formData.name,
            email: formData.email,
          },
          theme: { color: '#2563eb' },
          modal: {
            ondismiss: () => {
              setStep('form');
              setIsLoading(false);
              reject(new Error('Payment cancelled by user.'));
            },
          },
          handler: async (response) => {
            try {
              // 4. Verify payment on the server
              const verifyRes = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  buyerName: formData.name,
                  buyerEmail: formData.email,
                  productId: PRODUCT_ID,
                }),
              });
              if (!verifyRes.ok) {
                const errData = await verifyRes.json();
                throw new Error(errData.message || 'Payment verification failed.');
              }
              setStep('success');
              resolve();
            } catch (err) {
              setStep('error');
              setErrorMsg(err.message);
              reject(err);
            } finally {
              setIsLoading(false);
            }
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (response) => {
          setStep('error');
          setErrorMsg(response.error?.description || 'Payment failed. Please try again.');
          setIsLoading(false);
          reject(new Error('Payment failed'));
        });
        rzp.open();
      });
    } catch (err) {
      if (err.message !== 'Payment cancelled by user.') {
        setStep('error');
        setErrorMsg(err.message || 'Something went wrong. Please try again.');
        setIsLoading(false);
      }
    }
  }, [formData, productName]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => step !== 'paying' && onClose()}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Purchase digital product"
          >
            <div className="relative w-full max-w-md glass-card rounded-2xl overflow-hidden">
              {/* Header gradient bar */}
              <div className="h-1 w-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))]" />

              {/* Close button */}
              {step !== 'paying' && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-[hsl(var(--muted-foreground))] hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              <div className="p-6 md:p-8">
                {/* STEP: form */}
                {step === 'form' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-white mb-1">Complete Your Purchase</h2>
                      <p className="text-[hsl(var(--muted-foreground))] text-sm">
                        You'll receive an email with your download link instantly after payment.
                      </p>
                    </div>

                    {/* Product summary */}
                    <div className="flex items-center justify-between bg-[hsl(var(--muted))] rounded-xl px-4 py-3 mb-6 border border-[hsl(var(--border))]">
                      <div>
                        <p className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wide">You're buying</p>
                        <p className="text-white font-semibold text-sm mt-0.5 leading-snug">{productName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wide">Price</p>
                        <p className="text-[hsl(var(--primary))] font-bold text-lg mt-0.5">{priceINR}</p>
                      </div>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); handlePay(); }} className="space-y-5" noValidate>
                      <div className="space-y-2">
                        <Label htmlFor="buyer-name" className="text-sm font-medium text-[hsl(var(--foreground))]">
                          Full Name <span className="text-red-400">*</span>
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                          <Input
                            id="buyer-name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                            placeholder="Buddy Tezz"
                            className="pl-10 bg-[hsl(var(--muted))] border-[hsl(var(--border))] text-white placeholder:text-[hsl(var(--muted-foreground))] focus-visible:ring-[hsl(var(--primary))]"
                            required
                            aria-required="true"
                            aria-invalid={!!errors.name}
                          />
                        </div>
                        {errors.name && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="buyer-email" className="text-sm font-medium text-[hsl(var(--foreground))]">
                          Email Address <span className="text-red-400">*</span>
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                          <Input
                            id="buyer-email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                            placeholder="you@example.com"
                            className="pl-10 bg-[hsl(var(--muted))] border-[hsl(var(--border))] text-white placeholder:text-[hsl(var(--muted-foreground))] focus-visible:ring-[hsl(var(--primary))]"
                            required
                            aria-required="true"
                            aria-invalid={!!errors.email}
                          />
                        </div>
                        {errors.email && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
                        <p className="text-[hsl(var(--muted-foreground))] text-xs">Download link will be sent to this email.</p>
                      </div>

                      <Button
                        type="submit"
                        className="w-full glow-button text-white font-bold py-6 text-base rounded-xl mt-2"
                        disabled={isLoading}
                      >
                        Proceed to Secure Payment →
                      </Button>
                    </form>

                    <div className="mt-4 flex items-center justify-center gap-2 text-[hsl(var(--muted-foreground))] text-xs">
                      <Shield className="w-3.5 h-3.5 text-green-400" />
                      <span>Secured by Razorpay · 256-bit SSL encryption</span>
                    </div>
                  </motion.div>
                )}

                {/* STEP: paying */}
                {step === 'paying' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-12 text-center"
                  >
                    <Loader2 className="w-10 h-10 animate-spin text-[hsl(var(--primary))] mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Processing Payment…</h3>
                    <p className="text-[hsl(var(--muted-foreground))] text-sm">Please complete the payment in the Razorpay window.</p>
                  </motion.div>
                )}

                {/* STEP: success */}
                {step === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-8 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.1 }}
                      className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto mb-5"
                    >
                      <CheckCircle2 className="w-8 h-8 text-green-400" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2">Payment Successful! 🎉</h3>
                    <p className="text-[hsl(var(--muted-foreground))] text-sm leading-relaxed mb-6">
                      Your download link has been sent to <strong className="text-white">{formData.email}</strong>. Check your inbox (and spam folder) in the next few minutes.
                    </p>
                    <Button
                      onClick={onClose}
                      className="glow-button text-white font-semibold px-8 py-3 rounded-xl"
                    >
                      Done
                    </Button>
                  </motion.div>
                )}

                {/* STEP: error */}
                {step === 'error' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-8 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center mx-auto mb-5">
                      <AlertCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Something Went Wrong</h3>
                    <p className="text-[hsl(var(--muted-foreground))] text-sm mb-6">{errorMsg || 'Please try again or contact support.'}</p>
                    <div className="flex gap-3 justify-center">
                      <Button
                        variant="outline"
                        onClick={onClose}
                        className="border-[hsl(var(--border))] text-white hover:bg-[hsl(var(--muted))]"
                      >
                        Close
                      </Button>
                      <Button
                        onClick={() => { setStep('form'); setErrorMsg(''); }}
                        className="glow-button text-white font-semibold px-6 rounded-xl"
                      >
                        Try Again
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductCheckoutModal;

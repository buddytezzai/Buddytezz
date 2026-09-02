
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Shield, Loader2, AlertCircle, CheckCircle2, KeyRound, ArrowRight, Edit2, RotateCw } from 'lucide-react';
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
  const [step, setStep] = useState('form'); // 'form' | 'otp' | 'paying' | 'success' | 'error'
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [otp, setOtp] = useState('');
  const [hashToken, setHashToken] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [countdown, setCountdown] = useState(0);
  const otpInputRef = useRef(null);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setFormData({ name: '', email: '' });
      setOtp('');
      setHashToken('');
      setErrors({});
      setErrorMsg('');
      setCountdown(0);
    }
  }, [isOpen]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Auto focus OTP input when entering 'otp' step
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => otpInputRef.current?.focus(), 150);
    }
  }, [step]);

  // Escape key to close
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape' && step !== 'paying') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, step]);

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Your name is required.';
    if (!formData.email.trim()) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Enter a valid email address.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // 1. Send OTP to buyer's email
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email.trim(), name: formData.name.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to send verification code.');
      }

      setHashToken(data.hashToken);
      setStep('otp');
      setOtp('');
      setCountdown(60); // 60 seconds countdown
    } catch (err) {
      setErrors({ email: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Verify OTP & Launch Razorpay Checkout
  const handleVerifyOtpAndPay = async (e) => {
    if (e) e.preventDefault();

    if (!otp.trim() || otp.trim().length !== 6) {
      setErrors({ otp: 'Please enter the complete 6-digit code.' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Step A: Verify OTP with server
      const verifyRes = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim(),
          otp: otp.trim(),
          hashToken,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        throw new Error(verifyData.message || 'Invalid verification code.');
      }

      // Step B: OTP is verified! Now initiate Razorpay payment
      setStep('paying');
      await initiateRazorpayPayment();
    } catch (err) {
      setErrors({ otp: err.message || 'Invalid or expired code.' });
      setIsLoading(false);
    }
  };

  // 3. Razorpay Payment Initiation
  const initiateRazorpayPayment = useCallback(async () => {
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error('Razorpay SDK failed to load. Please check your connection.');

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
              setStep('otp');
              setIsLoading(false);
              reject(new Error('Payment window closed.'));
            },
          },
          handler: async (response) => {
            try {
              const payVerifyRes = await fetch('/api/verify-payment', {
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

              const rawText = await payVerifyRes.text();
              let verifyData = {};
              try {
                verifyData = JSON.parse(rawText);
              } catch (e) {
                verifyData = { message: rawText || 'Server error occurred during payment verification.' };
              }

              if (!payVerifyRes.ok) {
                throw new Error(verifyData.message || 'Payment signature verification failed.');
              }

              setStep('success');
              resolve();
            } catch (err) {
              setStep('error');
              setErrorMsg(err.message || 'Something went wrong during payment verification.');
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
      if (err.message !== 'Payment window closed.') {
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
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm"
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
            <div className="relative w-full max-w-md glass-card rounded-2xl overflow-hidden shadow-2xl border border-[hsl(var(--primary))/0.3]">
              {/* Header gradient bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--accent))] to-[hsl(var(--primary))]" />

              {/* Close button */}
              {step !== 'paying' && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-[hsl(var(--muted-foreground))] hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              <div className="p-6 md:p-8">
                {/* ── STEP 1: FORM (Name & Email) ── */}
                {step === 'form' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="mb-5">
                      <h2 className="text-2xl font-bold text-white mb-1">Get Instant Access</h2>
                      <p className="text-[hsl(var(--muted-foreground))] text-sm">
                        Enter your details to verify your email and receive your download link.
                      </p>
                    </div>

                    {/* Product Summary */}
                    <div className="flex items-center justify-between bg-[hsl(var(--muted))] rounded-xl px-4 py-3 mb-5 border border-[hsl(var(--border))]">
                      <div>
                        <p className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wide">Product</p>
                        <p className="text-white font-semibold text-sm mt-0.5 leading-snug">{productName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wide">Price</p>
                        <p className="text-[hsl(var(--primary))] font-bold text-lg mt-0.5">{priceINR}</p>
                      </div>
                    </div>

                    <form onSubmit={handleSendOtp} className="space-y-4" noValidate>
                      <div className="space-y-1.5">
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
                            placeholder="User Name"
                            className="pl-10 bg-[hsl(var(--muted))] border-[hsl(var(--border))] text-white placeholder:text-[hsl(var(--muted-foreground))] focus-visible:ring-[hsl(var(--primary))]"
                            required
                            aria-required="true"
                            aria-invalid={!!errors.name}
                          />
                        </div>
                        {errors.name && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
                      </div>

                      <div className="space-y-1.5">
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
                            placeholder="you@gmail.com"
                            className="pl-10 bg-[hsl(var(--muted))] border-[hsl(var(--border))] text-white placeholder:text-[hsl(var(--muted-foreground))] focus-visible:ring-[hsl(var(--primary))]"
                            required
                            aria-required="true"
                            aria-invalid={!!errors.email}
                          />
                        </div>
                        {errors.email && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
                        <p className="text-[hsl(var(--muted-foreground))] text-xs">A 6-digit OTP will be sent to verify this email.</p>
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full glow-button text-white font-bold py-6 text-base rounded-xl mt-2 group"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                            Sending Verification Code...
                          </>
                        ) : (
                          <>
                            Verify Email & Proceed
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </form>

                    <div className="mt-4 flex items-center justify-center gap-2 text-[hsl(var(--muted-foreground))] text-xs">
                      <Shield className="w-3.5 h-3.5 text-green-400" />
                      <span>One-time verification ensures safe delivery of your product</span>
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 2: OTP VERIFICATION ── */}
                {step === 'otp' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="text-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-[hsl(var(--primary))/0.15] border border-[hsl(var(--primary))/0.3] flex items-center justify-center mx-auto mb-3">
                        <KeyRound className="w-6 h-6 text-[hsl(var(--primary))]" />
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-1">Enter Verification Code</h2>
                      <p className="text-[hsl(var(--muted-foreground))] text-sm">
                        We sent a 6-digit code to
                      </p>
                      <div className="inline-flex items-center gap-2 mt-1 px-3 py-1 rounded-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))]">
                        <span className="text-sm font-medium text-white">{formData.email}</span>
                        <button
                          type="button"
                          onClick={() => { setStep('form'); setErrors({}); }}
                          className="text-[hsl(var(--primary))] hover:underline flex items-center gap-0.5 text-xs"
                          title="Change email"
                        >
                          <Edit2 className="w-3 h-3" /> Edit
                        </button>
                      </div>
                    </div>

                    <form onSubmit={handleVerifyOtpAndPay} className="space-y-5" noValidate>
                      <div className="space-y-2">
                        <Label htmlFor="otp-input" className="text-sm font-medium text-center block text-[hsl(var(--foreground))]">
                          6-Digit Code
                        </Label>
                        <Input
                          id="otp-input"
                          ref={otpInputRef}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={6}
                          value={otp}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                            setOtp(val);
                            if (errors.otp) setErrors({});
                          }}
                          placeholder="••••••"
                          className="text-center font-mono text-2xl tracking-[0.4em] bg-[hsl(var(--muted))] border-[hsl(var(--border))] text-white py-6 focus-visible:ring-[hsl(var(--primary))]"
                          required
                          autoComplete="one-time-code"
                        />
                        {errors.otp && (
                          <p className="text-red-400 text-xs flex items-center justify-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {errors.otp}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs px-1">
                        <span className="text-[hsl(var(--muted-foreground))]">Didn't receive code?</span>
                        {countdown > 0 ? (
                          <span className="text-[hsl(var(--muted-foreground))]">Resend in {countdown}s</span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={isLoading}
                            className="text-[hsl(var(--primary))] font-semibold hover:underline flex items-center gap-1"
                          >
                            <RotateCw className="w-3 h-3" /> Resend Code
                          </button>
                        )}
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading || otp.length !== 6}
                        className="w-full glow-button text-white font-bold py-6 text-base rounded-xl group"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                            Verifying & Opening Payment...
                          </>
                        ) : (
                          <>
                            Verify & Pay {priceINR}
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </form>

                    <div className="mt-4 flex items-center justify-center gap-2 text-[hsl(var(--muted-foreground))] text-xs">
                      <Shield className="w-3.5 h-3.5 text-green-400" />
                      <span>Razorpay 256-bit SSL encrypted checkout</span>
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 3: PAYING (Razorpay active) ── */}
                {step === 'paying' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-12 text-center"
                  >
                    <Loader2 className="w-12 h-12 animate-spin text-[hsl(var(--primary))] mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Processing Payment…</h3>
                    <p className="text-[hsl(var(--muted-foreground))] text-sm max-w-xs mx-auto">
                      Please complete the payment in the Razorpay window. Do not close this browser tab.
                    </p>
                  </motion.div>
                )}

                {/* ── STEP 4: SUCCESS ── */}
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
                      <CheckCircle2 className="w-9 h-9 text-green-400" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2">Payment Successful! 🎉</h3>
                    <p className="text-[hsl(var(--muted-foreground))] text-sm leading-relaxed mb-6">
                      Your Excel template download link has been sent to your verified email: <strong className="text-white block mt-1">{formData.email}</strong>
                    </p>
                    <Button
                      onClick={onClose}
                      className="glow-button text-white font-semibold px-8 py-3 rounded-xl"
                    >
                      Done
                    </Button>
                  </motion.div>
                )}

                {/* ── STEP 5: ERROR ── */}
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
                    <p className="text-[hsl(var(--muted-foreground))] text-sm mb-6 max-w-xs mx-auto">{errorMsg || 'Please try again or contact support.'}</p>
                    <div className="flex gap-3 justify-center">
                      <Button
                        variant="outline"
                        onClick={onClose}
                        className="border-[hsl(var(--border))] text-white hover:bg-[hsl(var(--muted))]"
                      >
                        Close
                      </Button>
                      <Button
                        onClick={() => { setStep('otp'); setErrorMsg(''); }}
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

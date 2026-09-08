import React, { useEffect, useState } from 'react';
import { useLocation, Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
  CheckCircle2, Download, Mail, ArrowRight, ShieldCheck,
  Copy, Check, FileSpreadsheet, Sparkles, ExternalLink, RefreshCw, Home
} from 'lucide-react';
import StickyNavBar from '@/components/StickyNavBar.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';

const OrderSuccessPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [copiedId, setCopiedId] = useState(false);

  // Retrieve details from router state or query parameters (for direct URLs/reloads)
  const state = location.state || {};
  const orderId = state.orderId || searchParams.get('order_id') || 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  const paymentId = state.paymentId || searchParams.get('payment_id') || 'PAY-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  const email = state.email || searchParams.get('email') || 'your verified email';
  const name = state.name || searchParams.get('name') || 'Valued Customer';
  const productName = state.productName || searchParams.get('product') || 'Personal Budget Tracker Template';
  const downloadUrl = state.downloadUrl || searchParams.get('download_url') || '/products/Personal_Budget_Tracker_Template.xlsx';
  const amount = state.amount || 99;

  // Track conversion in Meta Pixel and Google Tag Manager
  useEffect(() => {
    // 1. Meta Pixel Standard Purchase Event
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      try {
        window.fbq('track', 'Purchase', {
          value: Number(amount) || 99.00,
          currency: 'INR',
          content_name: productName,
          content_type: 'product',
          content_ids: ['ai-automation-playbook'],
          order_id: orderId || paymentId,
        });
      } catch (err) {
        console.warn('Meta Pixel tracking error:', err);
      }
    }

    // 2. Google Tag Manager Ecommerce Purchase Event
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      try {
        window.dataLayer.push({
          event: 'purchase',
          ecommerce: {
            transaction_id: orderId || paymentId,
            value: Number(amount) || 99.00,
            currency: 'INR',
            items: [
              {
                item_name: productName,
                item_id: 'ai-automation-playbook',
                price: Number(amount) || 99.00,
                quantity: 1,
              },
            ],
          },
        });

        // Custom GTM event trigger for easy tag setup
        window.dataLayer.push({
          event: 'digital_product_purchase_success',
          payment_id: paymentId,
          order_id: orderId,
          product_name: productName,
          value: Number(amount) || 99.00,
          currency: 'INR',
          customer_email: email,
          customer_name: name,
        });
      } catch (err) {
        console.warn('GTM tracking error:', err);
      }
    }
  }, [orderId, paymentId, amount, productName, email, name]);

  const handleCopyPaymentId = () => {
    if (paymentId) {
      navigator.clipboard.writeText(paymentId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] flex flex-col">
      <Helmet>
        <title>Order Confirmed 🎉 | Buddy Tezz AI</title>
        <meta name="description" content="Thank you for your purchase! Your Personal Budget Tracker Template download is ready." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <StickyNavBar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Top Celebration Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 260 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/50 mb-5 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Payment Verified · Instant Delivery
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Thank You, <span className="gradient-text">{name}</span>!
            </h1>
            <p className="mt-3 text-[hsl(var(--muted-foreground))] text-base sm:text-lg max-w-xl mx-auto">
              Your purchase is complete and your Excel spreadsheet template is ready for immediate download.
            </p>
          </motion.div>

          {/* Main Confirmation Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card rounded-2xl p-6 sm:p-8 border border-[hsl(var(--border))] shadow-2xl relative overflow-hidden mb-8"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--accent))] to-green-400" />

            {/* Product Overview Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[hsl(var(--border))]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[hsl(var(--primary))/0.15] border border-[hsl(var(--primary))/0.3] flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-7 h-7 text-[hsl(var(--primary))]" />
                </div>
                <div>
                  <span className="text-xs font-medium text-[hsl(var(--primary))] uppercase tracking-wider">Digital Product</span>
                  <h2 className="text-lg sm:text-xl font-bold text-white">{productName}</h2>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">Automated Excel Spreadsheets (.xlsx)</p>
                </div>
              </div>

              <div className="sm:text-right">
                <span className="text-xs text-[hsl(var(--muted-foreground))] block">Amount Paid</span>
                <span className="text-2xl font-extrabold text-white">₹{amount}</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-green-400 block mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Razorpay Verified
                </span>
              </div>
            </div>

            {/* Email Delivery Notice Banner */}
            <div className="my-6 p-4 rounded-xl bg-[hsl(var(--primary))/0.1] border border-[hsl(var(--primary))/0.25] flex items-start gap-3">
              <Mail className="w-5 h-5 text-[hsl(var(--primary))] shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-white">Direct Email Delivery Sent!</p>
                <p className="text-[hsl(var(--muted-foreground))] text-xs mt-0.5 leading-relaxed">
                  We have dispatched an email to <strong className="text-white font-medium">{email}</strong> with your official purchase receipt and the file attached.
                </p>
              </div>
            </div>

            {/* Instant Download Action Box */}
            <div className="bg-[hsl(var(--muted))] rounded-xl p-5 border border-[hsl(var(--border))] text-center">
              <p className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-3">
                Instant Access
              </p>
              <a
                href={downloadUrl}
                download="Personal_Budget_Tracker_Template.xlsx"
                className="inline-flex items-center justify-center w-full sm:w-auto glow-button text-white font-bold px-8 py-4 rounded-xl text-base group gap-2 shadow-lg"
              >
                <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                Download Excel Sheet Now
              </a>
              <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-2.5">
                Compatible with Microsoft Excel, Google Sheets, Apple Numbers & LibreOffice
              </p>
            </div>

            {/* Transaction Metadata Grid */}
            <div className="mt-6 pt-6 border-t border-[hsl(var(--border))] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-[hsl(var(--background))/0.6] p-3 rounded-lg border border-[hsl(var(--border))/0.5]">
                <span className="text-[hsl(var(--muted-foreground))] block mb-1 font-medium">Payment ID</span>
                <div className="flex items-center justify-between text-white font-mono font-medium">
                  <span className="truncate mr-2">{paymentId}</span>
                  <button
                    onClick={handleCopyPaymentId}
                    className="text-[hsl(var(--muted-foreground))] hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                    title="Copy Payment ID"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="bg-[hsl(var(--background))/0.6] p-3 rounded-lg border border-[hsl(var(--border))/0.5]">
                <span className="text-[hsl(var(--muted-foreground))] block mb-1 font-medium">Order ID</span>
                <span className="text-white font-mono font-medium truncate block">{orderId}</span>
              </div>
            </div>
          </motion.div>

          {/* Next Steps Guide */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          >
            <div className="glass-card p-5 rounded-xl border border-[hsl(var(--border))]">
              <div className="w-8 h-8 rounded-lg bg-[hsl(var(--primary))/0.15] text-[hsl(var(--primary))] font-bold flex items-center justify-center text-sm mb-3">
                1
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">Open Spreadsheet</h3>
              <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                Open in Excel or import into Google Sheets to start customizing your budget categories.
              </p>
            </div>

            <div className="glass-card p-5 rounded-xl border border-[hsl(var(--border))]">
              <div className="w-8 h-8 rounded-lg bg-[hsl(var(--accent))/0.15] text-[hsl(var(--accent))] font-bold flex items-center justify-center text-sm mb-3">
                2
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">Check Your Email</h3>
              <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                A permanent backup copy of the template has been delivered directly to your inbox.
              </p>
            </div>

            <div className="glass-card p-5 rounded-xl border border-[hsl(var(--border))]">
              <div className="w-8 h-8 rounded-lg bg-green-500/15 text-green-400 font-bold flex items-center justify-center text-sm mb-3">
                3
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">Lifetime Updates</h3>
              <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                Keep the file safely stored. Future updates & enhancements are free for existing customers.
              </p>
            </div>
          </motion.div>

          {/* Support and Navigation Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-[hsl(var(--muted))] border border-[hsl(var(--border))]"
          >
            <div>
              <h4 className="text-sm font-semibold text-white">Need assistance or have feedback?</h4>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                Our support team is available at <a href="mailto:buddytezzai@gmail.com" className="text-[hsl(var(--primary))] hover:underline font-medium">buddytezzai@gmail.com</a>
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link to="/" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full border-[hsl(var(--border))] text-white hover:bg-white/10 gap-1.5">
                  <Home className="w-4 h-4" /> Home
                </Button>
              </Link>
              <Link to="/digital-products" className="w-full sm:w-auto">
                <Button className="w-full glow-button text-white font-medium gap-1.5">
                  Digital Store <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccessPage;

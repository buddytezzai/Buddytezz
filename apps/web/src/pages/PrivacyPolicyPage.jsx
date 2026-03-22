import React from 'react';
import StickyNavBar from '@/components/StickyNavBar.jsx';
import Footer from '@/components/Footer.jsx';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <StickyNavBar />
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 font-['Outfit']">Privacy Policy – Buddy Tezz AI</h1>
        <p className="text-[hsl(var(--muted-foreground))] mb-12">Last Updated: 22 March 2026</p>
        
        <div className="space-y-8 text-[hsl(var(--foreground))] text-lg leading-relaxed">
          <p>Buddy Tezz AI (“we”, “our”, “us”) respects your privacy and is committed to protecting your information.</p>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">1. Information We Collect</h2>
            <p className="mb-2">We may collect:</p>
            <ul className="list-disc pl-6 space-y-2 text-[hsl(var(--muted-foreground))]">
              <li>Name, email, phone number (via forms)</li>
              <li>Business details shared for consultation</li>
              <li>Usage data (pages visited, time spent, device info)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">2. How We Use Your Information</h2>
            <p className="mb-2">We use your data to:</p>
            <ul className="list-disc pl-6 space-y-2 text-[hsl(var(--muted-foreground))]">
              <li>Provide services and consultation</li>
              <li>Improve our website and user experience</li>
              <li>Communicate updates, offers, or responses</li>
              <li>Run analytics and marketing campaigns</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">3. Data Sharing</h2>
            <p className="text-[hsl(var(--muted-foreground))]">We do not sell your personal data.<br/>We may share data with trusted tools (analytics, CRM, email services) only to operate our services.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">4. Cookies</h2>
            <p className="text-[hsl(var(--muted-foreground))]">We may use cookies to improve experience and track performance.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">5. Data Security</h2>
            <p className="text-[hsl(var(--muted-foreground))]">We take reasonable steps to protect your data, but no system is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">6. Your Rights</h2>
            <p className="mb-2">You can request:</p>
            <ul className="list-disc pl-6 space-y-2 text-[hsl(var(--muted-foreground))]">
              <li>Access, update, or deletion of your data</li>
              <li>Opt-out of marketing communication</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">7. Contact Us</h2>
            <p className="text-[hsl(var(--muted-foreground))]">For any queries:<br/>📧 buddytezzai@gmail.com</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;

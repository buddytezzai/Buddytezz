import React from 'react';
import ServiceHeader from '@/components/ServiceHeader.jsx';
import Footer from '@/components/Footer.jsx';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <ServiceHeader />
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 font-['Outfit']">Terms of Service – Buddy Tezz AI</h1>
        <p className="text-[hsl(var(--muted-foreground))] mb-12">Last Updated: 22 March 2026</p>
        
        <div className="space-y-8 text-[hsl(var(--foreground))] text-lg leading-relaxed">
          <p>By using this website, you agree to the following terms.</p>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">1. Services</h2>
            <p className="text-[hsl(var(--muted-foreground))]">Buddy Tezz AI provides AI automation, marketing, and digital services. Results may vary based on business, budget, and execution.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">2. Use of Website</h2>
            <p className="mb-2">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 text-[hsl(var(--muted-foreground))]">
              <li>Use the site for illegal purposes</li>
              <li>Copy, misuse, or exploit content</li>
              <li>Interfere with website functionality</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">3. Intellectual Property</h2>
            <p className="text-[hsl(var(--muted-foreground))]">All content, branding, and materials belong to Buddy Tezz AI and cannot be reused without permission.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">4. Payments & Results</h2>
            <ul className="list-disc pl-6 space-y-2 text-[hsl(var(--muted-foreground))]">
              <li>Any paid services will have separate agreements</li>
              <li>We do not guarantee specific results (followers, revenue, etc.)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">5. Limitation of Liability</h2>
            <p className="mb-2">We are not responsible for:</p>
            <ul className="list-disc pl-6 space-y-2 text-[hsl(var(--muted-foreground))]">
              <li>Business losses</li>
              <li>Platform changes (social media, ads, etc.)</li>
              <li>External tool failures</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">6. Third-Party Tools</h2>
            <p className="text-[hsl(var(--muted-foreground))]">We may use third-party tools. We are not responsible for their policies or performance.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">7. Changes to Terms</h2>
            <p className="text-[hsl(var(--muted-foreground))]">We may update these terms anytime. Continued use means acceptance.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">8. Contact</h2>
            <p className="text-[hsl(var(--muted-foreground))] text-white">📧 buddytezzai@gmail.com</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfServicePage;

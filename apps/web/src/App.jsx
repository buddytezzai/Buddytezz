
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import HomePage from '@/pages/HomePage.jsx';
import AIAutomationPage from '@/pages/AIAutomationPage.jsx';
import SocialMediaPage from '@/pages/SocialMediaPage.jsx';
import ContentCreationPage from '@/pages/ContentCreationPage.jsx';
import WebsiteDevelopmentPage from '@/pages/WebsiteDevelopmentPage.jsx';
import BrandingStrategyPage from '@/pages/BrandingStrategyPage.jsx';
import PerformanceMarketingPage from '@/pages/PerformanceMarketingPage.jsx';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage.jsx';
import TermsOfServicePage from '@/pages/TermsOfServicePage.jsx';
import { RegionProvider } from '@/contexts/RegionContext.jsx';
import { Toaster } from '@/components/ui/toaster.jsx';

function App() {
  return (
    <React.StrictMode>
      <RegionProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services/ai-automation" element={<AIAutomationPage />} />
            <Route path="/services/social-media" element={<SocialMediaPage />} />
            <Route path="/services/content-creation" element={<ContentCreationPage />} />
            <Route path="/services/website-development" element={<WebsiteDevelopmentPage />} />
            <Route path="/services/branding-strategy" element={<BrandingStrategyPage />} />
            <Route path="/services/performance-marketing" element={<PerformanceMarketingPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
          <Toaster />
        </Router>
      </RegionProvider>
    </React.StrictMode>
  );
}

export default App;

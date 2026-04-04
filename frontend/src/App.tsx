import { Navigation } from '@/components/Navigation';
import { PageOverlay } from '@/components/PageOverlay';
import { DashboardHero } from '@/sections/DashboardHero';
import { UploadCall } from '@/sections/UploadCall';
import { Analytics } from '@/sections/Analytics';
import { CallRecords } from '@/sections/CallRecords';
import { PaymentPreferences } from '@/sections/PaymentPreferences';
import { ComplianceOverview } from '@/sections/ComplianceOverview';
import { usePageLoad } from '@/hooks/usePageLoad';

function App() {
  const { showOverlay } = usePageLoad(500);

  return (
    <div className="min-h-screen bg-white">
      {/* Page Load Overlay */}
      <PageOverlay isVisible={showOverlay} />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main>
        <DashboardHero />
        <UploadCall />
        <Analytics />
        <CallRecords />
        <PaymentPreferences />
        <ComplianceOverview />
      </main>
      
      {/* Footer */}
      <footer className="bg-[#131313] py-8">
        <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0082F3] flex items-center justify-center">
                <span className="text-white font-semibold text-sm">CA</span>
              </div>
              <span className="text-white font-medium">Call Analytics</span>
            </div>
            <p className="text-gray-400 text-sm">
              Intelligent call center compliance monitoring for Hinglish and Tanglish
            </p>
            <p className="text-gray-500 text-sm">
              © 2024 Call Analytics Dashboard
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

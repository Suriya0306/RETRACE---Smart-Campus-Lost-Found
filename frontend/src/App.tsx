import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { FindItemsPage } from './pages/FindItemsPage';
import { ReportLostPage } from './pages/ReportLostPage';
import { ReportFoundPage } from './pages/ReportFoundPage';
import { RetracePage } from './pages/RetracePage';
import { MatchComparisonPage } from './pages/MatchComparisonPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { CampusMapPage } from './pages/CampusMapPage';
import { AuthModal } from './components/AuthModal';
import type { User, Item } from './data/mockData';
import { demoStudentUser } from './data/mockData';

export function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(demoStudentUser);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [notificationsCount] = useState<number>(2);

  // Cross-page state transfer
  const [selectedMatchItem, setSelectedMatchItem] = useState<Item | null>(null);
  const [selectedComparisonMatch, setSelectedComparisonMatch] = useState<{
    lostItem: any;
    foundItem: Item;
    matchMetrics: any;
  } | null>(null);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} />;
      case 'find':
        return (
          <FindItemsPage
            setCurrentPage={setCurrentPage}
            setSelectedMatchItem={(item) => setSelectedMatchItem(item)}
          />
        );
      case 'report-lost':
        return <ReportLostPage setCurrentPage={setCurrentPage} />;
      case 'report-found':
        return <ReportFoundPage setCurrentPage={setCurrentPage} />;
      case 'retrace':
        return (
          <RetracePage
            setCurrentPage={setCurrentPage}
            prefillFoundItem={selectedMatchItem}
            setSelectedComparisonMatch={(matchData) => setSelectedComparisonMatch(matchData)}
          />
        );
      case 'match-comparison':
        return (
          <MatchComparisonPage
            setCurrentPage={setCurrentPage}
            matchData={selectedComparisonMatch}
          />
        );
      case 'dashboard':
        return (
          <DashboardPage
            currentUser={currentUser}
            setCurrentPage={setCurrentPage}
          />
        );
      case 'admin-dashboard':
        return <AdminDashboardPage />;
      case 'campus-map':
        return (
          <CampusMapPage
            setCurrentPage={setCurrentPage}
            setSelectedMatchItem={(item) => setSelectedMatchItem(item)}
          />
        );
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 antialiased selection:bg-teal-500 selection:text-white">
      {/* Top Header Navbar */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        openAuthModal={() => setAuthModalOpen(true)}
        notificationsCount={notificationsCount}
      />

      {/* Main Page Content */}
      <main className="flex-1">{renderPage()}</main>

      {/* Bottom Footer */}
      <Footer setCurrentPage={setCurrentPage} />

      {/* Auth & Persona Switcher Modal */}
      {authModalOpen && (
        <AuthModal
          onClose={() => setAuthModalOpen(false)}
          setCurrentUser={(user) => setCurrentUser(user)}
        />
      )}
    </div>
  );
}

export default App;

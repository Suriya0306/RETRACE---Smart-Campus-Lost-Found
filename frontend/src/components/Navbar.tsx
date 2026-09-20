import React, { useState } from 'react';
import {
  Search,
  Compass,
  FilePlus,
  CheckCircle2,
  MapPin,
  Bell,
  User as UserIcon,
  Menu,
  X,
  ShieldAlert,
  Sparkles,
  LayoutDashboard,
  LogOut,
  ChevronDown
} from 'lucide-react';
import type { User } from '../data/mockData';
import { demoStudentUser, demoAdminUser } from '../data/mockData';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  openAuthModal: () => void;
  notificationsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  currentUser,
  setCurrentUser,
  openAuthModal,
  notificationsCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'find', label: 'Find Items', icon: Search },
    { id: 'retrace', label: 'Retrace', icon: Sparkles, highlight: true },
    { id: 'report-lost', label: 'Report Lost', icon: FilePlus },
    { id: 'report-found', label: 'Report Found', icon: CheckCircle2 },
    { id: 'campus-map', label: 'Campus Map', icon: MapPin },
  ];

  if (currentUser) {
    navLinks.push({ id: 'dashboard', label: 'My Reports', icon: LayoutDashboard });
    if (currentUser.role === 'admin') {
      navLinks.push({ id: 'admin-dashboard', label: 'Admin Panel', icon: ShieldAlert });
    }
  }

  const notifications = [
    { id: 1, title: '🔔 Possible Match Found', desc: '89% match score for your Black Backpack!', time: '10m ago', unread: true },
    { id: 2, title: '✅ Claim Submitted', desc: 'Claim RET-C-101 pending admin verification.', time: '1h ago', unread: true },
    { id: 3, title: '🎉 Item Marked Recovered', desc: 'Discrete Mathematics textbook returned!', time: '1d ago', unread: false }
  ];

  const handleNavClick = (pageId: string) => {
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-blue-900 via-blue-700 to-teal-600 bg-clip-text text-transparent">
                  RETRACE
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 hidden sm:inline-block">
                  Smart Campus
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium tracking-wide hidden md:block">
                Retrace. Match. Recover.
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                      : link.highlight
                      ? 'text-teal-700 hover:bg-teal-50 font-semibold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-700' : link.highlight ? 'text-teal-600' : 'text-gray-500'}`} />
                  <span>{link.label}</span>
                  {link.highlight && (
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping ml-0.5"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-gray-600 hover:text-blue-700 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {notificationsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                    {notificationsCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                    <span className="font-semibold text-sm text-gray-900">Notifications</span>
                    <span className="text-xs bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded-full">
                      {notificationsCount} New
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3.5 hover:bg-gray-50 transition-colors cursor-pointer ${
                          n.unread ? 'bg-blue-50/40' : ''
                        }`}
                        onClick={() => {
                          setNotificationsOpen(false);
                          if (n.title.includes('Match')) setCurrentPage('retrace');
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <span className="font-medium text-xs text-gray-900">{n.title}</span>
                          <span className="text-[10px] text-gray-400">{n.time}</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Auth / User Profile */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-gray-200 hover:border-blue-400 bg-gray-50/80 hover:bg-white transition-all shadow-xs"
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    currentUser.role === 'admin' ? 'bg-purple-600' : 'bg-blue-600'
                  }`}>
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-semibold text-gray-900 leading-tight">{currentUser.name}</p>
                    <p className="text-[10px] text-gray-500 capitalize leading-none">{currentUser.role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-900">{currentUser.name}</p>
                      <p className="text-xs text-gray-500">{currentUser.email}</p>
                    </div>
                    <button
                      onClick={() => { setUserDropdownOpen(false); handleNavClick('dashboard'); }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4 text-blue-600" /> My Reports & Dashboard
                    </button>
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => { setUserDropdownOpen(false); handleNavClick('admin-dashboard'); }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <ShieldAlert className="w-4 h-4 text-purple-600" /> Admin Control Panel
                      </button>
                    )}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setCurrentUser(currentUser.role === 'student' ? demoAdminUser : demoStudentUser);
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-blue-700 hover:bg-blue-50 flex items-center gap-2 font-medium"
                      >
                        <UserIcon className="w-4 h-4" /> Switch to {currentUser.role === 'student' ? 'Admin' : 'Student'} Persona
                      </button>
                      <button
                        onClick={() => {
                          setCurrentUser(null);
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={openAuthModal}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-blue-700 hover:bg-blue-50 transition-all border border-blue-200"
                >
                  Login / Sign Up
                </button>
                <button
                  onClick={() => setCurrentUser(demoStudentUser)}
                  className="hidden sm:inline-flex px-3.5 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-700 to-teal-600 text-white shadow-sm hover:opacity-95 transition-all"
                >
                  Quick Student Demo
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`} />
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

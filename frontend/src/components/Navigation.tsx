import { useState, useEffect, type MouseEvent } from 'react';
import { cn } from '../lib/utils';
import { BarChart3, Phone, CreditCard, Shield, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Analytics', href: '#analytics', icon: BarChart3 },
  { label: 'Calls', href: '#calls', icon: Phone },
  { label: 'Payments', href: '#payments', icon: CreditCard },
  { label: 'Compliance', href: '#compliance', icon: Shield },
];

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4',
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
        )}
      >
        <div className="w-full px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-500",
                isScrolled ? "bg-[#0082F3]" : "bg-white"
              )}>
                <BarChart3 className={cn(
                  "w-5 h-5 transition-colors duration-500",
                  isScrolled ? "text-white" : "text-[#131313]"
                )} />
              </div>
              <span className={cn(
                "text-xl font-semibold tracking-tight transition-colors duration-500",
                isScrolled ? "text-[#131313]" : "text-white"
              )}>
                Call Analytics
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={cn(
                      "flex items-center gap-2 text-sm font-medium transition-colors duration-500 relative group",
                      isScrolled ? "text-gray-600 hover:text-[#131313]" : "text-white/80 hover:text-white"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                    <span className={cn(
                      "absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full rounded-full",
                      isScrolled ? "bg-[#0082F3]" : "bg-white"
                    )} />
                  </a>
                );
              })}
            </div>

            {/* Status Indicator */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-green-600">System Online</span>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden relative w-8 h-8 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className={cn("w-6 h-6", isScrolled ? "text-[#131313]" : "text-white")} />
              ) : (
                <Menu className={cn("w-6 h-6", isScrolled ? "text-[#131313]" : "text-white")} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-white transition-all duration-500 lg:hidden',
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        )}
      >
        <div className="flex flex-col items-center justify-center h-full gap-6 pt-20">
          {navLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={cn(
                  'flex items-center gap-3 text-2xl font-semibold text-[#131313] transition-all duration-500',
                  isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                )}
                style={{ transitionDelay: isMenuOpen ? `${index * 100}ms` : '0ms' }}
              >
                <Icon className="w-6 h-6 text-[#0082F3]" />
                {link.label}
              </a>
            );
          })}
          <div
            className={cn(
              'mt-8 flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 transition-all duration-500',
              isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
            style={{ transitionDelay: '400ms' }}
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-green-600">System Online</span>
          </div>
        </div>
      </div>
    </>
  );
}

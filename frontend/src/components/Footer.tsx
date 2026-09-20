import React from 'react';
import { Compass, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">RETRACE</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Smart Campus Lost & Found recovery platform powered by journey-based loss analysis and transparent matching algorithms.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-teal-400 text-xs font-semibold border border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5" /> Oracle Web Dev Hackathon Project
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-white text-sm font-bold tracking-wider uppercase mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentPage('home')} className="hover:text-teal-400 transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('find')} className="hover:text-teal-400 transition-colors">
                  Find Items Directory
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('retrace')} className="hover:text-teal-400 font-semibold text-teal-300 flex items-center gap-1">
                  ★ Start Retracing Steps
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('report-lost')} className="hover:text-teal-400 transition-colors">
                  Report Lost Belonging
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('report-found')} className="hover:text-teal-400 transition-colors">
                  Report Found Belonging
                </button>
              </li>
            </ul>
          </div>

          {/* Key Features */}
          <div>
            <h4 className="text-white text-sm font-bold tracking-wider uppercase mb-4">Features</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>• Journey Loss Zone Estimation</li>
              <li>• Transparent Smart Match Score (100pt)</li>
              <li>• Side-by-Side Verification Matrix</li>
              <li>• Ownership Claim Validation</li>
              <li>• Visual Campus Map Blocks</li>
            </ul>
          </div>

          {/* Campus Contact */}
          <div>
            <h4 className="text-white text-sm font-bold tracking-wider uppercase mb-4">Campus Security Desk</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Central Security Office & Administration<br />
              Building 4, Room 102, Main Quad<br />
              Email: lostandfound@campus.edu<br />
              Hotline: +1 (555) 019-2834
            </p>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 RETTRACE Smart Campus. Built for Oracle Fundamentals of Web Development Hackathon.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" /> for Students
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

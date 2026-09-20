import React, { useState } from 'react';
import { X, User as UserIcon } from 'lucide-react';
import type { User } from '../data/mockData';
import { demoStudentUser, demoAdminUser } from '../data/mockData';

interface AuthModalProps {
  onClose: () => void;
  setCurrentUser: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, setCurrentUser }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Alex Vance',
    email: 'student@campus.edu',
    password: 'password123',
    confirmPassword: 'password123',
    department: 'Computer Science & Engineering',
    year: 'Year 3',
    phone: '+1 555-0192'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loggedUser: User = {
      id: `u-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      department: formData.department,
      year: formData.year,
      role: 'student',
      phone: formData.phone
    };
    setCurrentUser(loggedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 p-6 space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <UserIcon className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">
              {isSignUp ? 'Create Campus Account' : 'Student Login'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Persona Shortcuts */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            ⚡ Quick Hackathon Demo Switcher
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setCurrentUser(demoStudentUser);
                onClose();
              }}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
            >
              🎓 Student Demo
            </button>
            <button
              onClick={() => {
                setCurrentUser(demoAdminUser);
                onClose();
              }}
              className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors"
            >
              🛡️ Admin Demo
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Campus Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          {isSignUp && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Year</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>
            </>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md"
            >
              {isSignUp ? 'Sign Up' : 'Login'}
            </button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-blue-600 font-bold hover:underline"
          >
            {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </button>
        </div>

      </div>
    </div>
  );
};

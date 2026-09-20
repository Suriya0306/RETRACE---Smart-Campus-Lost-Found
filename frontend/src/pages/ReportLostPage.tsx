import React, { useState } from 'react';
import { FilePlus, Sparkles } from 'lucide-react';
import { api } from '../services/api';

interface ReportLostPageProps {
  setCurrentPage: (page: string) => void;
}

export const ReportLostPage: React.FC<ReportLostPageProps> = ({ setCurrentPage }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Electronics',
    brand: '',
    color: '',
    description: '',
    uniqueFeatures: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:30 AM',
    location: 'CSE Block',
    contactName: 'Alex Vance',
    contactEmail: 'student@campus.edu',
    contactPhone: '+1 555-0192',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedReport, setSubmittedReport] = useState<{ reportId: string; name: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Electronics', 'Books', 'ID Cards', 'Wallets', 'Bags', 'Keys', 'Sports', 'Accessories', 'Other'];
  const locations = ['CSE Block', 'Library', 'Canteen', 'Hostel', 'Auditorium', 'Sports Ground', 'Parking', 'Lab'];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Item name is required.';
    if (!formData.category) errs.category = 'Category is required.';
    if (!formData.date) errs.date = 'Date lost is required.';
    if (!formData.location) errs.location = 'Location lost is required.';
    if (!formData.description.trim()) errs.description = 'Please provide a short description.';
    if (!formData.contactEmail.includes('@')) errs.contactEmail = 'Valid campus email required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const res = await api.reportLost(formData);
    setSubmitting(false);

    if (res && res.success) {
      setSubmittedReport({
        reportId: res.data.reportId,
        name: formData.name
      });
    }
  };

  if (submittedReport) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 max-w-lg w-full text-center space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
            ✓
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">Lost Item Reported Successfully</h2>
            <p className="text-xs text-slate-500">Your report is now live in the central campus directory.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 font-mono text-center">
            <span className="text-[10px] text-slate-400 font-sans font-bold uppercase tracking-wider block">Generated Report ID</span>
            <span className="text-2xl font-black text-blue-700">{submittedReport.reportId}</span>
            <p className="text-xs font-sans text-slate-600">{submittedReport.name}</p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => setCurrentPage('retrace')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-teal-200" /> Start Retracing Steps Now
            </button>

            <button
              onClick={() => setCurrentPage('find')}
              className="w-full py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
            >
              View in Item Directory
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            <FilePlus className="w-3.5 h-3.5" /> Report Lost Belonging
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Report Lost Item
          </h1>
          <p className="text-xs text-slate-600">
            Fill out the details below. Our Smart Matching Engine will compare your report with found items across campus.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-8">
          
          {/* Section 1: Item Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 text-xs flex items-center justify-center">1</span>
              Item Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Item Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Black Backpack"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    errors.name ? 'border-red-500 bg-red-50' : 'border-slate-200'
                  }`}
                />
                {errors.name && <p className="text-[10px] text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Brand (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Swissgear, Apple, Hydro Flask"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Color (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Black, Blue, Silver"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description *</label>
              <textarea
                rows={3}
                placeholder="Describe the lost item in detail (e.g. Laptop bag with notebook and CSE course materials)..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`w-full p-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  errors.description ? 'border-red-500 bg-red-50' : 'border-slate-200'
                }`}
              />
              {errors.description && <p className="text-[10px] text-red-500 mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Unique Identifying Features</label>
              <input
                type="text"
                placeholder="e.g. Keychain with blue turtle, scratch on zipper..."
                value={formData.uniqueFeatures}
                onChange={(e) => setFormData({ ...formData, uniqueFeatures: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">This will be used to verify ownership claims.</p>
            </div>
          </div>

          {/* Section 2: Lost Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 text-xs flex items-center justify-center">2</span>
              Lost Time & Location
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date Lost *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Approx Time</label>
                <input
                  type="text"
                  placeholder="e.g. 09:30 AM"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primary Location *</label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                >
                  {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Image & Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 text-xs flex items-center justify-center">3</span>
              Image & Student Contact
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student Name</label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Campus Email *</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border text-xs ${
                    errors.contactEmail ? 'border-red-500 bg-red-50' : 'border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              {submitting ? 'Submitting Report...' : 'Submit Lost Report'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

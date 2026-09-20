import React, { useState } from 'react';
import { CheckCircle2, Upload, Image as ImageIcon, X } from 'lucide-react';
import { api } from '../services/api';

interface ReportFoundPageProps {
  setCurrentPage: (page: string) => void;
}

export const ReportFoundPage: React.FC<ReportFoundPageProps> = ({ setCurrentPage }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Bags',
    brand: '',
    color: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '11:15 AM',
    location: 'CSE Block',
    storageLocation: 'Campus Security Office, Admin Room 102',
    finderName: 'Officer Ryan',
    contactInformation: 'security@campus.edu',
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
    if (!formData.date) errs.date = 'Date found is required.';
    if (!formData.location) errs.location = 'Location found is required.';
    if (!formData.description.trim()) errs.description = 'Please provide a short description.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const res = await api.reportFound(formData);
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
          <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto text-3xl font-bold">
            ❤️
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">Thank you for helping someone recover their item.</h2>
            <p className="text-xs text-slate-500">Your found report has been published and matched against student journey logs.</p>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-2 font-mono text-center">
            <span className="text-[10px] text-teal-700 font-sans font-bold uppercase tracking-wider block">Generated Found Report ID</span>
            <span className="text-2xl font-black text-teal-800">{submittedReport.reportId}</span>
            <p className="text-xs font-sans text-slate-600">{submittedReport.name}</p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => setCurrentPage('find')}
              className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2"
            >
              View in Found Item Directory
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Turn In Found Belonging
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Report Found Item
          </h1>
          <p className="text-xs text-slate-600">
            Help a fellow student by reporting an item found on campus premises.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-8">
          
          {/* Section 1: Item Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-teal-100 text-teal-700 text-xs flex items-center justify-center">1</span>
              Found Item Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Item Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Black College Backpack"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none ${
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
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Brand (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Swissgear, Apple"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Color (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Black"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description *</label>
              <textarea
                rows={3}
                placeholder="Where was it found? Describe visible contents or distinguishing markers..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`w-full p-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-teal-500 ${
                  errors.description ? 'border-red-500 bg-red-50' : 'border-slate-200'
                }`}
              />
              {errors.description && <p className="text-[10px] text-red-500 mt-1">{errors.description}</p>}
            </div>
          </div>

          {/* Section 2: Time & Location */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-teal-100 text-teal-700 text-xs flex items-center justify-center">2</span>
              Location & Storage Desk
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date Found *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Time Found</label>
                <input
                  type="text"
                  placeholder="e.g. 11:15 AM"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Campus Location *</label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                >
                  {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Current Safe Storage Location *</label>
              <input
                type="text"
                placeholder="e.g. Security Office Room 102, Library Desk, Canteen Box"
                value={formData.storageLocation}
                onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          {/* Section 3: Image Upload & Finder Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-teal-100 text-teal-700 text-xs flex items-center justify-center">3</span>
              Image Upload & Finder Contact
            </h3>

            {/* Image File Upload Component */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Upload Found Item Photo</label>
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-dashed border-slate-300 rounded-2xl bg-slate-50/50">
                {formData.image ? (
                  <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0 group shadow-sm">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: '' })}
                      className="absolute top-1.5 right-1.5 bg-slate-900/80 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                      title="Remove Image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="w-28 h-28 rounded-xl border border-slate-200 bg-white flex flex-col items-center justify-center text-slate-400 text-xs flex-shrink-0">
                    <ImageIcon className="w-8 h-8 mb-1 text-slate-300" />
                    <span>No image</span>
                  </div>
                )}

                <div className="space-y-2 text-xs flex-1 w-full">
                  <div>
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs border border-teal-200 cursor-pointer transition-colors">
                      <Upload className="w-4 h-4 text-teal-600" />
                      <span>Choose Image File...</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData({ ...formData, image: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Or enter image URL:</span>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Finder Name / Staff Title</label>
                <input
                  type="text"
                  value={formData.finderName}
                  onChange={(e) => setFormData({ ...formData, finderName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Email / Extension</label>
                <input
                  type="text"
                  value={formData.contactInformation}
                  onChange={(e) => setFormData({ ...formData, contactInformation: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              {submitting ? 'Submitting Report...' : 'Submit Found Report'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

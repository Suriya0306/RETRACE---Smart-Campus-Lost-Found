import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import type { Item, Claim, User } from '../data/mockData';
import { api } from '../services/api';

interface DashboardPageProps {
  currentUser: User | null;
  setCurrentPage: (page: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ currentUser, setCurrentPage }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const itemList = await api.getItems();
    const claimList = await api.getClaims();
    setItems(itemList);
    setClaims(claimList);
  };

  const myReports = items.filter(i => i.userId === 'u1' || i.contactEmail === 'student@campus.edu');

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/20">
              Student Dashboard
            </span>
            <h1 className="text-3xl font-black text-white">
              Welcome back, {currentUser?.name || 'Alex Vance'}! 👋
            </h1>
            <p className="text-xs text-slate-300">
              {currentUser?.department || 'Computer Science & Engineering'} • {currentUser?.year || 'Year 3'}
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('retrace')}
            className="px-6 py-3 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-slate-950" /> Start Retrace Journey
          </button>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Lost Reports</span>
            <p className="text-3xl font-black text-blue-600">3</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Found Reports</span>
            <p className="text-3xl font-black text-teal-600">1</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Possible Matches</span>
            <p className="text-3xl font-black text-indigo-600">2</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Recovered Items</span>
            <p className="text-3xl font-black text-emerald-600">1</p>
          </div>
        </div>

        {/* My Reports Table */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-lg text-slate-900">My Activity & Reports</h3>
            <span className="text-xs text-slate-500">{myReports.length} Active Records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-3">Report ID</th>
                  <th className="p-3">Item Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono font-bold text-blue-700">{report.reportId}</td>
                    <td className="p-3 font-bold text-slate-900">{report.name}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        report.type === 'lost' ? 'bg-blue-100 text-blue-800' : 'bg-teal-100 text-teal-800'
                      }`}>
                        {report.type}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">{report.location}</td>
                    <td className="p-3 text-slate-500">{report.date}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        report.status === 'recovered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : report.status === 'claimed'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-50 text-blue-700'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setCurrentPage('retrace')}
                        className="px-3 py-1 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 font-bold text-[11px]"
                      >
                        Retrace
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Claims History Box */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-lg text-slate-900">Submitted Ownership Claims</h3>
          <div className="space-y-3">
            {claims.map((claim) => (
              <div key={claim.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{claim.itemName || 'Black College Backpack'}</span>
                  <span className="text-slate-500">Reason: {claim.userBeliefReason}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                  claim.status === 'approved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {claim.status === 'approved' ? 'RECOVERED ✓' : 'Pending Verification'}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

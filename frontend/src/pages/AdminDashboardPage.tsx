import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, BarChart3, PieChart, RefreshCw } from 'lucide-react';
import type { Claim } from '../data/mockData';
import { api } from '../services/api';

export const AdminDashboardPage: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [stats, setStats] = useState({
    totalReports: 1248,
    lostCount: 402,
    foundCount: 846,
    recoveredCount: 672,
    recoveryRate: 89,
    pendingClaimsCount: 1
  });
  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    const claimList = await api.getClaims();
    const dashData = await api.getDashboard();
    setClaims(claimList);
    if (dashData && dashData.stats) {
      setStats(dashData.stats);
    }
  };

  const handleClaimStatusUpdate = async (claimId: string, newStatus: 'approved' | 'rejected') => {
    await api.updateClaimStatus(claimId, newStatus);
    await loadAdminData();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-purple-800/40">
          <div className="space-y-2 text-center md:text-left">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
              Campus Security Administration
            </span>
            <h1 className="text-3xl font-black text-white">
              Admin Control Panel & Claims Verification
            </h1>
            <p className="text-xs text-slate-300">
              Review ownership verification claims, inspect campus hotspots, and manage recovery statuses.
            </p>
          </div>

          <button
            onClick={loadAdminData}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Refresh Admin Portal
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Reports</span>
            <p className="text-2xl font-black text-slate-900">{stats.totalReports}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Lost Items</span>
            <p className="text-2xl font-black text-blue-600">{stats.lostCount}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Found Items</span>
            <p className="text-2xl font-black text-teal-600">{stats.foundCount}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recovered</span>
            <p className="text-2xl font-black text-emerald-600">{stats.recoveredCount}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1 col-span-2 md:col-span-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recovery Rate</span>
            <p className="text-2xl font-black text-purple-600">{stats.recoveryRate}%</p>
          </div>
        </div>

        {/* Pending Claims Review Section */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">Pending Student Ownership Claims</h3>
              <p className="text-xs text-slate-500">Review answers to unique feature verification questions</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
              {claims.filter(c => c.status === 'pending').length} Pending Approval
            </span>
          </div>

          <div className="space-y-4">
            {claims.map((claim) => (
              <div key={claim.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <span className="font-extrabold text-sm text-slate-900">
                    Claim for: {claim.itemName || 'Black College Backpack'}
                  </span>
                  <span className="text-slate-500">Submitted by: <strong className="text-slate-800">{claim.userName || 'Alex Vance'}</strong> ({claim.userEmail || 'student@campus.edu'})</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">1. Belief Reason</span>
                    <p className="text-slate-800 mt-1">{claim.userBeliefReason}</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">2. Unique Feature Answer</span>
                    <p className="text-slate-800 mt-1">{claim.uniqueFeatureAnswer}</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">3. Last Seen Location</span>
                    <p className="text-slate-800 mt-1">{claim.lastSeenLocationAnswer}</p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                    claim.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    Status: {claim.status === 'approved' ? 'RECOVERED ✓' : 'Pending Verification'}
                  </span>

                  {claim.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleClaimStatusUpdate(claim.id, 'rejected')}
                        className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center gap-1"
                      >
                        <XCircle className="w-4 h-4" /> Reject Claim
                      </button>
                      <button
                        onClick={() => handleClaimStatusUpdate(claim.id, 'approved')}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1 shadow-md"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve & Mark Recovered
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Charts Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" /> Items Reported by Location
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>CSE Block</span>
                  <span>12 reports (91% loss zone)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full">
                  <div className="h-full bg-blue-600 rounded-full w-[85%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Canteen</span>
                  <span>15 reports</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full">
                  <div className="h-full bg-teal-500 rounded-full w-[95%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Library</span>
                  <span>8 reports</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full">
                  <div className="h-full bg-indigo-500 rounded-full w-[60%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-600" /> Items by Category
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border">
                <span className="text-slate-400 font-semibold block">Bags & Wallets</span>
                <span className="text-lg font-black text-slate-800">35%</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border">
                <span className="text-slate-400 font-semibold block">Electronics</span>
                <span className="text-lg font-black text-slate-800">28%</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border">
                <span className="text-slate-400 font-semibold block">ID Cards</span>
                <span className="text-lg font-black text-slate-800">20%</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border">
                <span className="text-slate-400 font-semibold block">Books & Others</span>
                <span className="text-lg font-black text-slate-800">17%</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

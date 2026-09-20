import React, { useState } from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';
import type { Item } from '../data/mockData';
import { ClaimModal } from '../components/ClaimModal';

interface MatchComparisonPageProps {
  setCurrentPage: (page: string) => void;
  matchData: {
    lostItem: any;
    foundItem: Item;
    matchMetrics: any;
  } | null;
}

export const MatchComparisonPage: React.FC<MatchComparisonPageProps> = ({
  setCurrentPage,
  matchData
}) => {
  const [claimModalOpen, setClaimModalOpen] = useState(false);

  if (!matchData) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 text-center">
        <p className="text-slate-500 font-medium">No comparison match selected.</p>
        <button
          onClick={() => setCurrentPage('retrace')}
          className="mt-4 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
        >
          Return to Retrace Analysis
        </button>
      </div>
    );
  }

  const { lostItem, foundItem, matchMetrics } = matchData;

  const categoryScorePct = Math.round(((matchMetrics?.categoryScore || 25) / 25) * 100);
  const locationScorePct = Math.round(((matchMetrics?.locationScore || 30) / 30) * 100);
  const dateScorePct = Math.round(((matchMetrics?.dateScore || 15) / 15) * 100);
  const descScorePct = Math.round(((matchMetrics?.descriptionScore || 12) / 15) * 100);
  const overallConfidence = matchMetrics?.score || 89;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" /> Side-by-Side Match Matrix
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Match Comparison & Verification
          </h1>
          <p className="text-xs text-slate-600">
            Compare report properties to confirm ownership before submitting your claim.
          </p>
        </div>

        {/* Overall Score Badge Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest text-teal-300">Overall Match Score</span>
            <h2 className="text-4xl font-black text-white">{overallConfidence}% Match Confidence</h2>
            <p className="text-xs text-slate-300">High probability match based on journey logs & category metrics.</p>
          </div>

          <button
            onClick={() => setClaimModalOpen(true)}
            className="px-8 py-3.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-sm shadow-lg flex items-center gap-2"
          >
            <ShieldCheck className="w-5 h-5 text-slate-950" />
            <span>Submit Claim</span>
          </button>
        </div>

        {/* Sub-Score Breakdown Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Category Match</span>
            <p className="text-2xl font-black text-blue-600">{categoryScorePct}%</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Location Match</span>
            <p className="text-2xl font-black text-teal-600">{locationScorePct}%</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Date Match</span>
            <p className="text-2xl font-black text-indigo-600">{dateScorePct}%</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Description Match</span>
            <p className="text-2xl font-black text-emerald-600">{descScorePct}%</p>
          </div>
        </div>

        {/* Side-by-Side Comparison Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Column 1: Your Lost Report */}
          <div className="bg-white rounded-3xl border border-blue-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                Your Lost Report
              </span>
              <span className="text-xs font-mono text-slate-400">RET-L-2026-001</span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">{lostItem.name}</h3>
              <p className="text-xs text-blue-600 font-semibold">{lostItem.category}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <span className="text-slate-500 font-semibold">Location Lost:</span>
                <span className="font-bold text-slate-800">{lostItem.location || 'CSE Block'}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <span className="text-slate-500 font-semibold">Date Lost:</span>
                <span className="font-bold text-slate-800">{lostItem.date || '18 Sep 2026'}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <span className="text-slate-500 font-semibold">Color / Brand:</span>
                <span className="font-bold text-slate-800">{lostItem.color} ({lostItem.brand})</span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-700 block">Description:</span>
              <p className="text-slate-600 leading-relaxed p-3 rounded-xl bg-slate-50">{lostItem.description}</p>
            </div>
          </div>

          {/* Column 2: Found Report */}
          <div className="bg-white rounded-3xl border border-teal-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold">
                Found Report
              </span>
              <span className="text-xs font-mono text-slate-400">{foundItem.reportId}</span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">{foundItem.name}</h3>
              <p className="text-xs text-teal-700 font-semibold">{foundItem.category}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <span className="text-slate-500 font-semibold">Location Found:</span>
                <span className="font-bold text-slate-800">{foundItem.location}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <span className="text-slate-500 font-semibold">Date Found:</span>
                <span className="font-bold text-slate-800">{foundItem.date}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <span className="text-slate-500 font-semibold">Color / Brand:</span>
                <span className="font-bold text-slate-800">{foundItem.color || 'N/A'} ({foundItem.brand || 'N/A'})</span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-700 block">Description:</span>
              <p className="text-slate-600 leading-relaxed p-3 rounded-xl bg-slate-50">{foundItem.description}</p>
            </div>
          </div>

        </div>

        {/* Claim CTA Footer */}
        <div className="pt-4 text-center">
          <button
            onClick={() => setClaimModalOpen(true)}
            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white font-black text-base shadow-xl flex items-center gap-2 mx-auto"
          >
            <ShieldCheck className="w-6 h-6 text-teal-200" />
            <span>Submit Ownership Claim</span>
          </button>
        </div>

      </div>

      {/* Claim Modal */}
      {claimModalOpen && (
        <ClaimModal
          foundItem={foundItem}
          onClose={() => setClaimModalOpen(false)}
          onClaimSubmitted={() => setCurrentPage('dashboard')}
        />
      )}

    </div>
  );
};

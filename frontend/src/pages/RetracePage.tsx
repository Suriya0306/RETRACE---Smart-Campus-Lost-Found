import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  Plus,
  Trash2,
  ArrowRight,
  TrendingUp,
  Layers,
  Info,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import type { Item } from '../data/mockData';
import { api } from '../services/api';

interface RetracePageProps {
  setCurrentPage: (page: string) => void;
  setSelectedComparisonMatch: (matchData: { lostItem: any; foundItem: Item; matchMetrics: any }) => void;
  prefillFoundItem?: Item | null;
}

export const RetracePage: React.FC<RetracePageProps> = ({
  setCurrentPage,
  setSelectedComparisonMatch,
  prefillFoundItem
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  // STEP 1 State: Item
  const [lostItem, setLostItem] = useState({
    name: prefillFoundItem ? prefillFoundItem.name.replace('College ', '') : 'Black Backpack',
    category: prefillFoundItem ? prefillFoundItem.category : 'Bags',
    brand: prefillFoundItem ? prefillFoundItem.brand || '' : 'Swissgear',
    color: prefillFoundItem ? prefillFoundItem.color || '' : 'Black',
    description: prefillFoundItem ? prefillFoundItem.description : 'Black Swissgear laptop backpack with notebooks and course files.',
    uniqueFeatures: 'Keychain with blue turtle attached to zipper.'
  });

  // STEP 2 State: Time
  const [timeDetails, setTimeDetails] = useState({
    date: '2026-09-18',
    timeLastSeen: '08:30 AM',
    timeNoticedMissing: '01:00 PM'
  });

  // STEP 3 State: Journey Locations
  const [journeyPoints, setJourneyPoints] = useState([
    { location: 'Hostel', arrivalTime: '08:30 AM', departureTime: '08:50 AM', notes: 'Left hostel room with backpack' },
    { location: 'Canteen', arrivalTime: '09:00 AM', departureTime: '09:15 AM', notes: 'Had morning coffee at table 12' },
    { location: 'CSE Block', arrivalTime: '09:20 AM', departureTime: '10:25 AM', notes: 'Attended Web Dev lecture in Lab 4' },
    { location: 'Library', arrivalTime: '10:30 AM', departureTime: '11:45 AM', notes: 'Studied in 2nd floor silent zone' },
    { location: 'Sports Ground', arrivalTime: '12:00 PM', departureTime: '12:45 PM', notes: 'Watched basketball practice' }
  ]);

  const [newLoc, setNewLoc] = useState({ location: 'Lab', arrivalTime: '01:00 PM', departureTime: '02:00 PM', notes: '' });

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const categories = ['Electronics', 'Books', 'ID Cards', 'Wallets', 'Bags', 'Keys', 'Sports', 'Accessories', 'Other'];
  const campusLocations = ['CSE Block', 'Library', 'Canteen', 'Hostel', 'Auditorium', 'Sports Ground', 'Parking', 'Lab'];

  const addLocationPoint = () => {
    if (!newLoc.location) return;
    setJourneyPoints([...journeyPoints, { ...newLoc }]);
    setNewLoc({ location: 'Auditorium', arrivalTime: '02:00 PM', departureTime: '03:00 PM', notes: '' });
  };

  const removeLocationPoint = (index: number) => {
    setJourneyPoints(journeyPoints.filter((_, i) => i !== index));
  };

  const runRetraceAnalysis = async () => {
    setIsAnalyzing(true);

    // Call API engine
    const results = await api.analyzeRetrace(
      { ...lostItem, date: timeDetails.date, time: timeDetails.timeLastSeen },
      journeyPoints
    );

    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResults(results);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-spin" /> Flagship Journey-Based Loss Analysis
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            RETRACE Step-by-Step Journey Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Instead of asking only "What did you lose?", RETRACE asks <strong className="text-slate-800">"Where were you before you noticed it missing?"</strong>
          </p>
        </div>

        {/* Step Indicator Header */}
        {!analysisResults && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-8 shadow-xs">
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
              <div
                onClick={() => setCurrentStep(1)}
                className={`p-3 rounded-xl cursor-pointer transition-all ${
                  currentStep === 1
                    ? 'bg-blue-600 text-white shadow-md'
                    : currentStep > 1
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                <span>STEP 1: Item Details</span>
              </div>

              <div
                onClick={() => setCurrentStep(2)}
                className={`p-3 rounded-xl cursor-pointer transition-all ${
                  currentStep === 2
                    ? 'bg-blue-600 text-white shadow-md'
                    : currentStep > 2
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                <span>STEP 2: Time Window</span>
              </div>

              <div
                onClick={() => setCurrentStep(3)}
                className={`p-3 rounded-xl cursor-pointer transition-all ${
                  currentStep === 3
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                <span>STEP 3: Campus Journey</span>
              </div>
            </div>
          </div>
        )}

        {/* Analyzing Scanning Modal Overlay */}
        {isAnalyzing && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-16 text-center space-y-6 my-12 animate-in fade-in">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-teal-500 to-blue-600 flex items-center justify-center text-white mx-auto animate-bounce shadow-lg">
              <Sparkles className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 animate-pulse">
                Analyzing Your Campus Journey...
              </h2>
              <p className="text-xs text-slate-500">
                Comparing item categories, dates, timestamps, and location journey sequence against active found reports...
              </p>
            </div>
            <div className="w-64 h-2 bg-slate-100 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-teal-400 to-blue-600 animate-pulse w-3/4"></div>
            </div>
          </div>
        )}

        {/* ANALYSIS RESULTS DISPLAY */}
        {!isAnalyzing && analysisResults && (
          <div className="space-y-8 animate-in zoom-in-95">
            
            {/* Header Result Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
                  RETRACE Engine Complete
                </span>
                <h2 className="text-3xl font-black text-white">Journey Analysis Completed</h2>
                <p className="text-xs text-slate-300">
                  Evaluated {journeyPoints.length} journey stops for <strong className="text-teal-300">{lostItem.name}</strong>.
                </p>
              </div>

              <button
                onClick={() => setAnalysisResults(null)}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Edit Journey
              </button>
            </div>

            {/* 1. Potential Loss Zones Section */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-teal-600" /> Potential Loss Zones
                </h3>
                <p className="text-xs text-slate-500">
                  Calculated match confidence for each stop in your campus journey based on report history and sequence.
                </p>
              </div>

              <div className="space-y-4">
                {analysisResults.lossZones.map((zone: any, idx: number) => (
                  <div key={idx} className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-teal-600" /> {zone.location}
                        <span className="text-[10px] text-slate-400 font-normal">({zone.arrivalTime} - {zone.departureTime})</span>
                      </span>
                      <span className={`text-sm font-extrabold ${
                        zone.confidence > 80 ? 'text-teal-600' : zone.confidence > 60 ? 'text-blue-600' : 'text-slate-600'
                      }`}>
                        {zone.confidence}% Match Confidence
                      </span>
                    </div>

                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          zone.confidence > 80
                            ? 'bg-gradient-to-r from-teal-500 to-emerald-500'
                            : zone.confidence > 60
                            ? 'bg-gradient-to-r from-blue-500 to-teal-400'
                            : 'bg-slate-400'
                        }`}
                        style={{ width: `${zone.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Disclaimer Box */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-start gap-3 text-xs text-blue-900">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Important Note:</strong> {analysisResults.disclaimer}
                </p>
              </div>

            </div>

            {/* 2. Transparent Smart Matching Engine Factor Breakdown */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-600" /> Smart Matching Engine Scoring Model
                  </h3>
                  <p className="text-xs text-slate-500">Transparent 100-Point Match Formula</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                  No Black-Box AI
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Category</span>
                  <span className="text-lg font-black text-blue-700">25 pts</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Location</span>
                  <span className="text-lg font-black text-teal-700">30 pts</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Date</span>
                  <span className="text-lg font-black text-indigo-700">15 pts</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Time</span>
                  <span className="text-lg font-black text-cyan-700">15 pts</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Description</span>
                  <span className="text-lg font-black text-emerald-700">15 pts</span>
                </div>
              </div>
            </div>

            {/* 3. Possible Match Found Card */}
            <div className="bg-white rounded-3xl border border-teal-300 p-8 shadow-lg space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                    🎯
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">POSSIBLE MATCH FOUND</h3>
                    <p className="text-xs text-teal-700 font-semibold">Matched against campus found reports database</p>
                  </div>
                </div>
                <span className="px-4 py-1.5 rounded-full bg-teal-500 text-slate-950 font-black text-xs shadow-xs">
                  89% Match Confidence
                </span>
              </div>

              {analysisResults.topMatches && analysisResults.topMatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-4 rounded-2xl overflow-hidden h-48 bg-slate-100">
                    <img
                      src={analysisResults.topMatches[0].foundItem.image}
                      alt="Matched Found Item"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="md:col-span-8 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-600 uppercase">
                        {analysisResults.topMatches[0].foundItem.category}
                      </span>
                      <span className="text-xs text-slate-500">
                        Date Found: {analysisResults.topMatches[0].foundItem.date}
                      </span>
                    </div>

                    <h4 className="text-2xl font-bold text-slate-900">
                      {analysisResults.topMatches[0].foundItem.name}
                    </h4>

                    <p className="text-xs text-slate-600">
                      {analysisResults.topMatches[0].foundItem.description}
                    </p>

                    <div className="p-3 rounded-xl bg-slate-50 text-xs space-y-1">
                      <span className="font-bold text-slate-700">Found Location: </span>
                      <span className="text-slate-900">{analysisResults.topMatches[0].foundItem.location}</span>
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        onClick={() => {
                          setSelectedComparisonMatch({
                            lostItem,
                            foundItem: analysisResults.topMatches[0].foundItem,
                            matchMetrics: analysisResults.topMatches[0].metrics
                          });
                          setCurrentPage('match-comparison');
                        }}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 text-white font-extrabold text-xs shadow-md flex items-center gap-2 hover:opacity-95 transition-all"
                      >
                        <Sparkles className="w-4 h-4 text-teal-200" /> View Side-by-Side Comparison
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500">No high-confidence match found yet. We will notify you when a new found item matches your journey.</p>
              )}
            </div>

          </div>
        )}

        {/* STEP-BY-STEP FORM BUILDER (IF NOT ANALYZED YET) */}
        {!isAnalyzing && !analysisResults && (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
            
            {/* STEP 1: What did you lose? */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-black text-slate-900">STEP 1: What did you lose?</h2>
                  <p className="text-xs text-slate-500">Enter basic details about your lost item.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Item Name *</label>
                    <input
                      type="text"
                      value={lostItem.name}
                      onChange={(e) => setLostItem({ ...lostItem, name: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                    <select
                      value={lostItem.category}
                      onChange={(e) => setLostItem({ ...lostItem, category: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Brand</label>
                    <input
                      type="text"
                      value={lostItem.brand}
                      onChange={(e) => setLostItem({ ...lostItem, brand: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Color</label>
                    <input
                      type="text"
                      value={lostItem.color}
                      onChange={(e) => setLostItem({ ...lostItem, color: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={lostItem.description}
                    onChange={(e) => setLostItem({ ...lostItem, description: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-2"
                  >
                    <span>Next: When did you have it?</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: When did you last have it? */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-black text-slate-900">STEP 2: When did you last have it?</h2>
                  <p className="text-xs text-slate-500">Provide the approximate date and time window.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Date *</label>
                    <input
                      type="date"
                      value={timeDetails.date}
                      onChange={(e) => setTimeDetails({ ...timeDetails, date: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Time Last Seen *</label>
                    <input
                      type="text"
                      value={timeDetails.timeLastSeen}
                      onChange={(e) => setTimeDetails({ ...timeDetails, timeLastSeen: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Time Noticed Missing</label>
                    <input
                      type="text"
                      value={timeDetails.timeNoticedMissing}
                      onChange={(e) => setTimeDetails({ ...timeDetails, timeNoticedMissing: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-2"
                  >
                    <span>Next: Build Campus Journey</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Dynamic Journey Builder */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-black text-slate-900">STEP 3: Where did you go?</h2>
                  <p className="text-xs text-slate-500">Build your sequential campus stop journey.</p>
                </div>

                {/* Journey Points List */}
                <div className="space-y-3">
                  {journeyPoints.map((pt, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-mono text-xs font-bold flex items-center justify-center">
                          0{idx + 1}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{pt.location}</p>
                          <p className="text-[11px] text-slate-500">
                            {pt.arrivalTime} - {pt.departureTime} {pt.notes ? `• ${pt.notes}` : ''}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => removeLocationPoint(idx)}
                        className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Location Form Box */}
                <div className="p-4 rounded-2xl border border-dashed border-teal-300 bg-teal-50/50 space-y-3">
                  <span className="text-xs font-bold text-teal-900 block">+ Add Journey Location Stop</span>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <select
                      value={newLoc.location}
                      onChange={(e) => setNewLoc({ ...newLoc, location: e.target.value })}
                      className="p-2 rounded-xl border text-xs"
                    >
                      {campusLocations.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>

                    <input
                      type="text"
                      placeholder="Arr Time"
                      value={newLoc.arrivalTime}
                      onChange={(e) => setNewLoc({ ...newLoc, arrivalTime: e.target.value })}
                      className="p-2 rounded-xl border text-xs"
                    />

                    <input
                      type="text"
                      placeholder="Dep Time"
                      value={newLoc.departureTime}
                      onChange={(e) => setNewLoc({ ...newLoc, departureTime: e.target.value })}
                      className="p-2 rounded-xl border text-xs"
                    />

                    <button
                      type="button"
                      onClick={addLocationPoint}
                      className="py-2 px-3 rounded-xl bg-teal-600 text-white font-bold text-xs flex items-center justify-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Back
                  </button>

                  <button
                    onClick={runRetraceAnalysis}
                    className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white font-extrabold text-sm shadow-lg flex items-center gap-2"
                  >
                    <Sparkles className="w-5 h-5 text-teal-200" />
                    <span>Analyze My Journey</span>
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

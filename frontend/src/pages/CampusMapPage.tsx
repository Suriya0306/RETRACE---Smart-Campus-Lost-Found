import React, { useState, useEffect } from 'react';
import { MapPin, Sparkles } from 'lucide-react';
import type { Item } from '../data/mockData';
import { api } from '../services/api';

interface CampusMapPageProps {
  setCurrentPage: (page: string) => void;
  setSelectedMatchItem?: (item: Item) => void;
}

export const CampusMapPage: React.FC<CampusMapPageProps> = ({ setCurrentPage, setSelectedMatchItem }) => {
  const [selectedLocationName, setSelectedLocationName] = useState<string | null>('CSE Block');
  const [locationItems, setLocationItems] = useState<Item[]>([]);

  useEffect(() => {
    loadLocationData();
  }, [selectedLocationName]);

  const loadLocationData = async () => {
    if (selectedLocationName) {
      const items = await api.getItems({ location: selectedLocationName });
      setLocationItems(items);
    }
  };

  const blocks = [
    { name: 'CSE Block', icon: '💻', count: 12, colSpan: 'col-span-1 md:col-span-2', bg: 'from-blue-600 to-indigo-700' },
    { name: 'Library', icon: '📚', count: 8, colSpan: 'col-span-1', bg: 'from-teal-600 to-cyan-700' },
    { name: 'Canteen', icon: '☕', count: 15, colSpan: 'col-span-1', bg: 'from-amber-600 to-orange-700' },
    { name: 'Sports Ground', icon: '⚽', count: 6, colSpan: 'col-span-1 md:col-span-2', bg: 'from-emerald-600 to-teal-700' },
    { name: 'Hostel', icon: '🏠', count: 9, colSpan: 'col-span-1', bg: 'from-purple-600 to-indigo-700' },
    { name: 'Lab', icon: '🔬', count: 7, colSpan: 'col-span-1', bg: 'from-sky-600 to-blue-700' },
    { name: 'Auditorium', icon: '🎭', count: 4, colSpan: 'col-span-1', bg: 'from-rose-600 to-pink-700' },
    { name: 'Parking', icon: '🚗', count: 3, colSpan: 'col-span-1', bg: 'from-slate-700 to-slate-900' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="mb-4 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200">
            <MapPin className="w-3.5 h-3.5" /> HTML/CSS Campus Map
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Interactive Campus Location Map
          </h1>
          <p className="text-xs text-slate-600">
            Click any campus block to view reported lost and found items at that location.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Visual Campus Map Grid */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-extrabold text-sm text-slate-900">Campus Quad Overview</span>
              <span className="text-xs text-slate-500 font-mono">Select a Block</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {blocks.map((b) => {
                const isSelected = selectedLocationName === b.name;
                return (
                  <div
                    key={b.name}
                    onClick={() => setSelectedLocationName(b.name)}
                    className={`cursor-pointer rounded-2xl p-5 border text-white transition-all transform hover:-translate-y-1 shadow-md bg-gradient-to-tr ${b.bg} ${
                      isSelected ? 'ring-4 ring-teal-400 scale-[1.02]' : 'opacity-90 hover:opacity-100'
                    } ${b.colSpan}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{b.icon}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-black/30 backdrop-blur-md text-white font-mono text-[10px] font-bold">
                        {b.count} Reports
                      </span>
                    </div>

                    <h3 className="font-black text-lg text-white">{b.name}</h3>
                    <p className="text-[11px] text-white/80 font-medium">Click to inspect reports</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Location Reports Panel */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">{selectedLocationName}</h3>
                <p className="text-xs text-slate-500">{locationItems.length} active reports recorded</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                Filtered Spot
              </span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {locationItems.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">No reports at this location.</p>
              ) : (
                locationItems.map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase text-white ${
                        item.type === 'found' ? 'bg-teal-600' : 'bg-blue-600'
                      }`}>
                        {item.type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{item.date}</span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>

                    <div className="pt-2 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-semibold">{item.category}</span>
                      <button
                        onClick={() => {
                          if (setSelectedMatchItem && item.type === 'found') setSelectedMatchItem(item);
                          setCurrentPage('retrace');
                        }}
                        className="text-teal-700 hover:text-teal-900 font-extrabold flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Retrace Match
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

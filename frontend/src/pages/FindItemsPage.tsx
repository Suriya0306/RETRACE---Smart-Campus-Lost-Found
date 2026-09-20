import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Sparkles, X, Eye } from 'lucide-react';
import type { Item } from '../data/mockData';
import { api } from '../services/api';

interface FindItemsPageProps {
  setCurrentPage: (page: string) => void;
  setSelectedMatchItem?: (item: Item) => void;
}

export const FindItemsPage: React.FC<FindItemsPageProps> = ({ setCurrentPage, setSelectedMatchItem }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const categories = ['Electronics', 'Books', 'ID Cards', 'Wallets', 'Bags', 'Keys', 'Sports', 'Accessories', 'Other'];
  const locations = ['CSE Block', 'Library', 'Canteen', 'Hostel', 'Auditorium', 'Sports Ground', 'Parking', 'Lab'];

  useEffect(() => {
    loadItems();
  }, [searchQuery, selectedType, selectedCategory, selectedLocation]);

  const loadItems = async () => {
    setLoading(true);
    const data = await api.getItems({
      query: searchQuery,
      type: selectedType,
      category: selectedCategory,
      location: selectedLocation
    });
    setItems(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            <Search className="w-3.5 h-3.5" /> Campus Directory
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Find Lost & Found Items
          </h1>
          <p className="text-sm text-slate-600">
            Search active lost reports, found belongings, and recovered campus items in real-time.
          </p>
        </div>

        {/* Search & Multi-Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8 space-y-4">
          
          {/* Main Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search items by name, category, location, brand, or unique features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-slate-50/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
            
            {/* Type Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="all">All Types (Lost & Found)</option>
                <option value="lost">Lost Reports</option>
                <option value="found">Found Items</option>
                <option value="recovered">Recovered Items</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="all">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Active Filter Badges */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-bold text-slate-700">
              {items.length} {items.length === 1 ? 'result' : 'results'} found
            </span>
            {(selectedType !== 'all' || selectedCategory !== 'all' || selectedLocation !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedType('all');
                  setSelectedCategory('all');
                  setSelectedLocation('all');
                  setSearchQuery('');
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
              >
                Reset Filters
              </button>
            )}
          </div>

        </div>

        {/* Item Cards Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-500 font-medium">Loading items...</div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 max-w-md mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No matching items found</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <button
              onClick={() => setCurrentPage('report-lost')}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors"
            >
              Report Lost Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                {/* Image & Type Badge */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md ${
                      item.type === 'found'
                        ? 'bg-teal-600'
                        : item.type === 'lost'
                        ? 'bg-blue-600'
                        : 'bg-emerald-600'
                    }`}>
                      {item.type}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-md">
                      {item.reportId}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-blue-600">{item.category}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {item.date}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Metadata Bar */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-slate-700 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-teal-600" /> {item.location}
                      </span>
                      {item.brand && (
                        <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono">
                          {item.brand}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="flex-1 py-2 px-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Details
                      </button>
                      
                      {item.type === 'found' && (
                        <button
                          onClick={() => {
                            if (setSelectedMatchItem) setSelectedMatchItem(item);
                            setCurrentPage('retrace');
                          }}
                          className="py-2 px-3 rounded-lg bg-teal-500 hover:bg-teal-600 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1 transition-all"
                        >
                          <Sparkles className="w-3.5 h-3.5" /> Retrace Match
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Item Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="relative h-64 bg-slate-900">
              <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover opacity-90" />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-extrabold text-xs uppercase">
                  {selectedItem.type} Report
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-900/90 text-white font-bold text-xs">
                  {selectedItem.reportId}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{selectedItem.name}</h2>
                <p className="text-xs text-blue-600 font-semibold">{selectedItem.category} • {selectedItem.location}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 text-xs">
                <div>
                  <span className="text-slate-400 block font-semibold uppercase">Date {selectedItem.type}</span>
                  <span className="font-bold text-slate-800">{selectedItem.date} {selectedItem.time}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold uppercase">Brand / Color</span>
                  <span className="font-bold text-slate-800">{selectedItem.brand || 'N/A'} ({selectedItem.color || 'N/A'})</span>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Description</h4>
                <p className="text-xs text-slate-700 leading-relaxed">{selectedItem.description}</p>
              </div>

              {selectedItem.uniqueFeatures && (
                <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-xs space-y-1">
                  <span className="font-bold text-teal-900 block">✨ Unique Identifying Features</span>
                  <p className="text-teal-800">{selectedItem.uniqueFeatures}</p>
                </div>
              )}

              {selectedItem.storageLocation && (
                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs space-y-1">
                  <span className="font-bold text-blue-900 block">🏢 Current Storage Location</span>
                  <p className="text-blue-800">{selectedItem.storageLocation}</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const itemToRetrace = selectedItem;
                  setSelectedItem(null);
                  if (setSelectedMatchItem) setSelectedMatchItem(itemToRetrace);
                  setCurrentPage('retrace');
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-teal-200" /> Start Retrace Analysis
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

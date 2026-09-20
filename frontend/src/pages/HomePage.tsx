import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  FilePlus,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Clock,
  Navigation as NavIcon,
  ChevronRight
} from 'lucide-react';

interface HomePageProps {
  setCurrentPage: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => {
  // Animated Counters state
  const [counts, setCounts] = useState({
    reported: 0,
    found: 0,
    recovered: 0,
    rate: 0
  });

  const targets = {
    reported: 1248,
    found: 846,
    recovered: 672,
    rate: 89
  };

  useEffect(() => {
    const duration = 1500;
    const steps = 30;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounts({
        reported: Math.floor(targets.reported * progress),
        found: Math.floor(targets.found * progress),
        recovered: Math.floor(targets.recovered * progress),
        rate: Math.floor(targets.rate * progress)
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounts(targets);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const journeySteps = [
    { title: 'HOSTEL', time: '08:30 AM', color: 'from-blue-500 to-blue-600', icon: '🏠' },
    { title: 'CANTEEN', time: '09:00 AM', color: 'from-teal-500 to-teal-600', icon: '☕' },
    { title: 'CSE BLOCK', time: '09:20 AM', color: 'from-indigo-600 to-blue-700', icon: '💻', active: true },
    { title: 'LIBRARY', time: '10:30 AM', color: 'from-cyan-600 to-blue-600', icon: '📚' },
    { title: 'SPORTS GROUND', time: '12:00 PM', color: 'from-emerald-500 to-teal-600', icon: '⚽' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-blue-900 text-white pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Copy & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-teal-300 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>Oracle Web Dev Hackathon • Journey-Based Lost & Found</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                Lost Something on Campus? <br />
                <span className="bg-gradient-to-r from-teal-300 via-sky-300 to-blue-200 bg-clip-text text-transparent">
                  Retrace Your Steps.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
                RETRACE helps students recover lost belongings by combining item details, campus locations, time and personal journey history with smart confidence scoring.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => setCurrentPage('retrace')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
                >
                  <Sparkles className="w-5 h-5 text-teal-200" />
                  <span>Start Retracing Steps</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setCurrentPage('report-found')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-md flex items-center justify-center gap-2 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4 text-teal-300" />
                  <span>Report Found Item</span>
                </button>
              </div>

              {/* Feature Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 max-w-lg mx-auto lg:mx-0 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-400" /> 100% Student Verified
                </div>
                <div className="flex items-center gap-2">
                  <NavIcon className="w-4 h-4 text-teal-400" /> Loss Zone Score
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-teal-400" /> 89% Recovery Rate
                </div>
              </div>

            </div>

            {/* Right Column: Hero Journey Visualization */}
            <div className="lg:col-span-5">
              <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-6 shadow-2xl space-y-6">
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs font-mono text-slate-400 ml-2">retrace_journey_visualizer.v1</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold tracking-wide uppercase border border-teal-500/30">
                    Live Demo Case
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Student Loss Journey: Alex V.</span>
                  <span className="text-teal-400">91% High Confidence Match</span>
                </div>

                {/* Animated Node Path */}
                <div className="space-y-3 relative">
                  <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-500 via-teal-400 to-emerald-500 z-0"></div>

                  {journeySteps.map((step, idx) => (
                    <div
                      key={idx}
                      className={`relative z-10 flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                        step.active
                          ? 'bg-gradient-to-r from-blue-900/90 to-teal-900/70 border-teal-400/60 shadow-lg shadow-teal-500/10 scale-[1.02]'
                          : 'bg-slate-800/60 border-slate-700/50 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-sm shadow-xs">
                          {step.icon}
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-white tracking-wide">{step.title}</p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" /> {step.time}
                          </p>
                        </div>
                      </div>

                      {step.active ? (
                        <span className="px-2.5 py-1 rounded-full bg-teal-400 text-slate-950 font-bold text-[10px] animate-pulse shadow-sm">
                          🎯 91% Loss Zone
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-400">
                          Checked
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-3.5 rounded-xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-between text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎒</span>
                    <div>
                      <p className="font-bold text-white">Found Match: Black College Backpack</p>
                      <p className="text-[10px] text-slate-400">Found by Campus Officer Ryan • CSE Block</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentPage('retrace')}
                    className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-[11px] transition-colors"
                  >
                    View
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Home Statistics Bar */}
      <section className="relative z-20 -mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-blue-900">{counts.reported.toLocaleString()}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Items Reported</p>
          </div>

          <div className="space-y-1 border-l border-slate-100">
            <p className="text-3xl sm:text-4xl font-black text-teal-600">{counts.found.toLocaleString()}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Items Found</p>
          </div>

          <div className="space-y-1 border-l border-slate-100">
            <p className="text-3xl sm:text-4xl font-black text-indigo-600">{counts.recovered.toLocaleString()}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Items Recovered</p>
          </div>

          <div className="space-y-1 border-l border-slate-100">
            <p className="text-3xl sm:text-4xl font-black text-emerald-600">{counts.rate}%</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Recovery Rate</p>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-teal-700 bg-teal-50 px-3 py-1 rounded-full inline-block">
              SIMPLE 4-STEP RECOVERY PROCESS
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              How RETRACE Works
            </h3>
            <p className="text-sm sm:text-base text-slate-600">
              A transparent, journey-focused approach to finding lost campus belongings in record time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Card 01 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
              <div className="text-5xl font-black text-slate-100 group-hover:text-blue-100 transition-colors absolute top-4 right-4 font-mono">
                01
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <FilePlus className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">REPORT</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tell us what you lost. Enter item details, category, brand, color, and unique identifying features.
              </p>
            </div>

            {/* Card 02 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
              <div className="text-5xl font-black text-slate-100 group-hover:text-teal-100 transition-colors absolute top-4 right-4 font-mono">
                02
              </div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <NavIcon className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">RETRACE</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter where you went. Build your campus timeline from Hostel to Canteen, CSE Block, and Library.
              </p>
            </div>

            {/* Card 03 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
              <div className="text-5xl font-black text-slate-100 group-hover:text-indigo-100 transition-colors absolute top-4 right-4 font-mono">
                03
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">MATCH</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our Smart Matching Engine compares category, date, time, description, and journey points for confidence scores.
              </p>
            </div>

            {/* Card 04 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
              <div className="text-5xl font-black text-slate-100 group-hover:text-emerald-100 transition-colors absolute top-4 right-4 font-mono">
                04
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">RECOVER</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Submit an ownership claim, verify unique features with campus admin, and collect your recovered item.
              </p>
            </div>

          </div>

          {/* Quick CTA Banner */}
          <div className="mt-16 bg-gradient-to-r from-blue-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold">Ready to find your lost item?</h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Start by typing your lost item and entering your campus journey steps.
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('retrace')}
              className="px-8 py-3.5 rounded-xl font-bold text-sm bg-teal-400 hover:bg-teal-300 text-slate-950 transition-all flex items-center gap-2 shadow-lg"
            >
              <span>Start Retracing Now</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};

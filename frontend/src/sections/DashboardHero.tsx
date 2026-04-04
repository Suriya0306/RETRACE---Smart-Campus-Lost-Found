import { useEffect, useRef, useState } from 'react';
import { Mic, CheckCircle, TrendingUp, Phone, BarChart3 } from 'lucide-react';
import { API } from '../apiConfig';

interface ApiStats {
  total_calls: number;
  compliant_calls: number;
  flagged_calls: number;
  sop_compliance_pct: number;
  languages: Record<string, number>;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  trend?: string;
  trendUp?: boolean;
  delay?: number;
}

function StatCard({ icon, label, value, subtext, trend, trendUp, delay = 0 }: StatCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className={`bg-white rounded-2xl p-6 border border-[#EFEFF2] transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-[#131313] flex items-center justify-center text-white">
          {icon}
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trendUp ? 'text-green-600' : 'text-amber-600'}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-semibold text-[#131313] mb-1">{value}</p>
      <p className="text-sm text-gray-400">{subtext}</p>
    </div>
  );
}

export function DashboardHero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [apiStats, setApiStats] = useState<ApiStats | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Fetch live stats from Flask API (refresh every 30s)
  useEffect(() => {
    const fetchStats = () => {
      fetch(`${API}/api/stats`)
        .then(r => r.json())
        .then(setApiStats)
        .catch(() => { /* backend offline — keep showing static */ });
    };
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (hero) {
        hero.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  const total = apiStats?.total_calls ?? 12847;
  const sopPct = apiStats?.sop_compliance_pct ?? 91;
  const flagged = apiStats?.flagged_calls ?? 24;
  const langCount = apiStats ? Object.keys(apiStats.languages).length : 3;

  const stats = [
    {
      icon: <Phone className="w-6 h-6" />,
      label: 'Total Calls Processed',
      value: total.toLocaleString(),
      subtext: 'All time',
      trend: apiStats ? undefined : '+12.5%',
      trendUp: true,
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      label: 'SOP Compliance',
      value: `${sopPct}%`,
      subtext: 'Average score',
      trend: apiStats ? undefined : '+3.2%',
      trendUp: true,
    },
    {
      icon: <Mic className="w-6 h-6" />,
      label: 'Languages',
      value: String(langCount),
      subtext: 'Hindi, Tamil, Mixed',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      label: 'Flagged Calls',
      value: String(flagged),
      subtext: 'Requires review',
      trend: apiStats ? undefined : '-8.1%',
      trendUp: true,
    },
  ];


  return (
    <section
      ref={heroRef}
      className="relative min-h-screen bg-[#131313] overflow-hidden pt-24 pb-16"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 130, 243, 0.15), transparent 40%)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#131313] to-[#0f0f23]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10 max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-mono text-gray-400 uppercase tracking-wider">
              Live Dashboard
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white mb-4">
            Call Center{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0082F3] to-[#4D65FF]">
              Analytics
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            Intelligent voice processing for Hinglish and Tanglish with real-time SOP validation and compliance monitoring.
          </p>
        </div>

        {/* AI Insight Banner */}
        <div className="mb-10 p-4 rounded-xl bg-gradient-to-r from-[#0082F3]/10 to-[#4D65FF]/10 border border-[#0082F3]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0082F3]/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#0082F3]" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">AI Insight</p>
              <p className="text-sm text-gray-400">
                Call sentiment positive — SOP compliance 91%. Tamil language accuracy improved by 8% this week.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              {...stat}
              delay={index * 100}
            />
          ))}
        </div>

        {/* Language Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white font-medium">Tamil (Tanglish)</span>
              <span className="text-2xl font-semibold text-[#0082F3]">68%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-[68%] bg-gradient-to-r from-[#0082F3] to-[#4D65FF] rounded-full" />
            </div>
            <p className="text-sm text-gray-400 mt-2">3,247 calls processed</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white font-medium">Hindi (Hinglish)</span>
              <span className="text-2xl font-semibold text-amber-500">52%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-[52%] bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
            </div>
            <p className="text-sm text-gray-400 mt-2">4,892 calls processed</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white font-medium">Mixed Language</span>
              <span className="text-2xl font-semibold text-green-500">80%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-[80%] bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
            </div>
            <p className="text-sm text-gray-400 mt-2">4,708 calls processed</p>
          </div>
        </div>
      </div>
    </section>
  );
}

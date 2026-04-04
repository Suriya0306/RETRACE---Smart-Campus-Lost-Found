import { useEffect, useRef, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { TrendingUp, Users, Clock, Shield } from 'lucide-react';

const callVolumeData = [
  { day: 'Mon', calls: 420, compliance: 88 },
  { day: 'Tue', calls: 380, compliance: 92 },
  { day: 'Wed', calls: 450, compliance: 89 },
  { day: 'Thu', calls: 520, compliance: 94 },
  { day: 'Fri', calls: 480, compliance: 91 },
  { day: 'Sat', calls: 350, compliance: 87 },
  { day: 'Sun', calls: 290, compliance: 90 },
];

const languageDistribution = [
  { name: 'Tamil', value: 3247, color: '#0082F3' },
  { name: 'Hindi', value: 4892, color: '#F59E0B' },
  { name: 'Mixed', value: 4708, color: '#10B981' },
];

const sopComplianceData = [
  { category: 'Greeting', score: 95, target: 90 },
  { category: 'ID Verify', score: 92, target: 95 },
  { category: 'Compliance', score: 88, target: 85 },
  { category: 'Closing', score: 91, target: 90 },
];

const sentimentTrend = [
  { time: '00:00', positive: 65, neutral: 25, negative: 10 },
  { time: '04:00', positive: 70, neutral: 22, negative: 8 },
  { time: '08:00', positive: 75, neutral: 18, negative: 7 },
  { time: '12:00', positive: 72, neutral: 20, negative: 8 },
  { time: '16:00', positive: 78, neutral: 16, negative: 6 },
  { time: '20:00', positive: 68, neutral: 24, negative: 8 },
];

interface ChartCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
}

function ChartCard({ title, icon, children, delay = 0 }: ChartCardProps) {
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
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[#131313] flex items-center justify-center text-white">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-[#131313]">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export function Analytics() {
  return (
    <section id="analytics" className="py-20 bg-[#FAFAFA]">
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <span className="text-sm font-mono text-[#0082F3] uppercase tracking-wider mb-2 block">
            Analytics
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#131313] mb-4">
            Performance Insights
          </h2>
          <p className="text-gray-600 max-w-2xl">
            Real-time analytics on call volume, language distribution, SOP compliance, and customer sentiment.
          </p>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Call Volume & Compliance */}
          <ChartCard title="Call Volume & Compliance" icon={<TrendingUp className="w-5 h-5" />} delay={0}>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={callVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EFEFF2" />
                  <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} />
                  <YAxis yAxisId="left" stroke="#9CA3AF" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" fontSize={12} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#131313',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Bar yAxisId="left" dataKey="calls" fill="#131313" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="compliance" fill="#0082F3" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#131313]" />
                <span className="text-sm text-gray-600">Calls</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#0082F3]" />
                <span className="text-sm text-gray-600">Compliance %</span>
              </div>
            </div>
          </ChartCard>

          {/* Language Distribution */}
          <ChartCard title="Language Distribution" icon={<Users className="w-5 h-5" />} delay={100}>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={languageDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {languageDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#131313',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              {languageDistribution.map((lang) => (
                <div key={lang.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: lang.color }} />
                  <span className="text-sm text-gray-600">{lang.name}</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SOP Compliance by Category */}
          <ChartCard title="SOP Compliance by Category" icon={<Shield className="w-5 h-5" />} delay={200}>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sopComplianceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#EFEFF2" horizontal={false} />
                  <XAxis type="number" stroke="#9CA3AF" fontSize={12} domain={[0, 100]} />
                  <YAxis dataKey="category" type="category" stroke="#9CA3AF" fontSize={12} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#131313',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="score" fill="#10B981" radius={[0, 4, 4, 0]} name="Actual" />
                  <Bar dataKey="target" fill="#E5E7EB" radius={[0, 4, 4, 0]} name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                <span className="text-sm text-gray-600">Actual Score</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#E5E7EB]" />
                <span className="text-sm text-gray-600">Target</span>
              </div>
            </div>
          </ChartCard>

          {/* Sentiment Analysis */}
          <ChartCard title="Sentiment Analysis (24h)" icon={<Clock className="w-5 h-5" />} delay={300}>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sentimentTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EFEFF2" />
                  <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#131313',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="positive"
                    stackId="1"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="neutral"
                    stackId="1"
                    stroke="#F59E0B"
                    fill="#F59E0B"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="negative"
                    stackId="1"
                    stroke="#EF4444"
                    fill="#EF4444"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                <span className="text-sm text-gray-600">Positive</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <span className="text-sm text-gray-600">Neutral</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                <span className="text-sm text-gray-600">Negative</span>
              </div>
            </div>
          </ChartCard>
        </div>
      </div>
    </section>
  );
}

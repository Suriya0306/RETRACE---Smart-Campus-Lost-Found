import { useEffect, useRef, useState } from 'react';
import { Shield, AlertTriangle, FileText, TrendingUp, Users, Clock, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const complianceTrend = [
  { week: 'W1', score: 82, flagged: 45 },
  { week: 'W2', score: 85, flagged: 38 },
  { week: 'W3', score: 88, flagged: 32 },
  { week: 'W4', score: 91, flagged: 24 },
];

const agentPerformance = [
  { subject: 'Greeting', A: 95, B: 88, fullMark: 100 },
  { subject: 'ID Verify', A: 92, B: 85, fullMark: 100 },
  { subject: 'Compliance', A: 88, B: 78, fullMark: 100 },
  { subject: 'Closing', A: 91, B: 82, fullMark: 100 },
  { subject: 'Tone', A: 94, B: 80, fullMark: 100 },
  { subject: 'Script', A: 89, B: 75, fullMark: 100 },
];

interface ComplianceMetric {
  label: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
  color: string;
}

const metrics: ComplianceMetric[] = [
  {
    label: 'Overall Compliance',
    value: '91%',
    subtext: '+3.2% from last month',
    icon: <Shield className="w-5 h-5" />,
    color: 'bg-green-500',
  },
  {
    label: 'Flagged Calls',
    value: '24',
    subtext: 'Requires review',
    icon: <AlertTriangle className="w-5 h-5" />,
    color: 'bg-amber-500',
  },
  {
    label: 'Avg Call Duration',
    value: '5:24',
    subtext: 'Within target range',
    icon: <Clock className="w-5 h-5" />,
    color: 'bg-[#0082F3]',
  },
  {
    label: 'Active Agents',
    value: '48',
    subtext: '12 on calls now',
    icon: <Users className="w-5 h-5" />,
    color: 'bg-purple-500',
  },
];

interface ViolationType {
  type: string;
  count: number;
  severity: 'high' | 'medium' | 'low';
}

const violations: ViolationType[] = [
  { type: 'Missing Greeting', count: 12, severity: 'low' },
  { type: 'Incomplete ID Verification', count: 8, severity: 'high' },
  { type: 'Compliance Script Skipped', count: 15, severity: 'medium' },
  { type: 'Improper Closing', count: 6, severity: 'low' },
];

function SeverityBadge({ severity }: { severity: ViolationType['severity'] }) {
  const colors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-blue-100 text-blue-700',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[severity]}`}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
}

export function ComplianceOverview() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="compliance" ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <span className="text-sm font-mono text-[#0082F3] uppercase tracking-wider mb-2 block">
            Compliance
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#131313] mb-4">
            Compliance Overview
          </h2>
          <p className="text-gray-600 max-w-2xl">
            Monitor SOP adherence, track violations, and ensure regulatory compliance across all calls.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className={`bg-[#FAFAFA] rounded-2xl p-6 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className={`w-10 h-10 rounded-lg ${metric.color} flex items-center justify-center text-white mb-4`}>
                {metric.icon}
              </div>
              <p className="text-sm text-gray-500 mb-1">{metric.label}</p>
              <p className="text-3xl font-semibold text-[#131313] mb-1">{metric.value}</p>
              <p className="text-sm text-gray-400">{metric.subtext}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compliance Trend */}
          <div
            className={`bg-white rounded-2xl p-6 border border-[#EFEFF2] transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-[#131313]">Compliance Trend</h3>
                <p className="text-sm text-gray-500">Weekly compliance score and flagged calls</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#131313] flex items-center justify-center text-white">
                <Activity className="w-5 h-5" />
              </div>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={complianceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EFEFF2" />
                  <XAxis dataKey="week" stroke="#9CA3AF" fontSize={12} />
                  <YAxis yAxisId="left" stroke="#9CA3AF" fontSize={12} domain={[70, 100]} />
                  <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#131313',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="score"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    name="Compliance Score"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="flagged"
                    stroke="#EF4444"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                    name="Flagged Calls"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                <span className="text-sm text-gray-600">Compliance Score</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                <span className="text-sm text-gray-600">Flagged Calls</span>
              </div>
            </div>
          </div>

          {/* Agent Performance Radar */}
          <div
            className={`bg-white rounded-2xl p-6 border border-[#EFEFF2] transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '500ms' }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-[#131313]">Agent Performance</h3>
                <p className="text-sm text-gray-500">Top performer vs average comparison</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#131313] flex items-center justify-center text-white">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={agentPerformance}>
                  <PolarGrid stroke="#EFEFF2" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                  <Radar
                    name="Top Performer"
                    dataKey="A"
                    stroke="#0082F3"
                    fill="#0082F3"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Average"
                    dataKey="B"
                    stroke="#9CA3AF"
                    fill="#9CA3AF"
                    fillOpacity={0.1}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#131313',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#0082F3]" />
                <span className="text-sm text-gray-600">Top Performer</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#9CA3AF]" />
                <span className="text-sm text-gray-600">Average</span>
              </div>
            </div>
          </div>
        </div>

        {/* Violations List */}
        <div
          className={`mt-6 bg-white rounded-2xl p-6 border border-[#EFEFF2] transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#131313]">Common Violations</h3>
                <p className="text-sm text-gray-500">Top SOP violations requiring attention</p>
              </div>
            </div>
            <button className="text-sm text-[#0082F3] hover:underline">
              View All Violations
            </button>
          </div>

          <div className="space-y-3">
            {violations.map((violation) => (
              <div
                key={violation.type}
                className="flex items-center justify-between p-4 bg-[#FAFAFA] rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  </div>
                  <span className="text-[#131313] font-medium">{violation.type}</span>
                </div>
                <div className="flex items-center gap-4">
                  <SeverityBadge severity={violation.severity} />
                  <span className="text-sm text-gray-500 w-16 text-right">{violation.count} cases</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

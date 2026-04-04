import { useEffect, useRef, useState } from 'react';
import { Wallet, Building2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
  percentage: number;
  trend: number;
  trendUp: boolean;
  color: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'EMI',
    name: 'EMI',
    icon: <Building2 className="w-6 h-6" />,
    count: 3842,
    percentage: 35,
    trend: 8.4,
    trendUp: true,
    color: '#0082F3',
  },
  {
    id: 'FULL_PAYMENT',
    name: 'Full Payment',
    icon: <DollarSign className="w-6 h-6" />,
    count: 2947,
    percentage: 27,
    trend: 4.2,
    trendUp: true,
    color: '#10B981',
  },
  {
    id: 'PARTIAL_PAYMENT',
    name: 'Partial Payment',
    icon: <TrendingDown className="w-6 h-6" />,
    count: 2437,
    percentage: 22,
    trend: 12.1,
    trendUp: true,
    color: '#F59E0B',
  },
  {
    id: 'DOWN_PAYMENT',
    name: 'Down Payment',
    icon: <Wallet className="w-6 h-6" />,
    count: 1737,
    percentage: 16,
    trend: -2.5,
    trendUp: false,
    color: '#8B5CF6',
  },
];

const languagePreferenceData = [
  { language: 'Tamil', EMI: 35, FULL_PAYMENT: 25, PARTIAL_PAYMENT: 25, DOWN_PAYMENT: 15 },
  { language: 'Hindi', EMI: 32, FULL_PAYMENT: 28, PARTIAL_PAYMENT: 22, DOWN_PAYMENT: 18 },
  { language: 'Mixed', EMI: 38, FULL_PAYMENT: 22, PARTIAL_PAYMENT: 25, DOWN_PAYMENT: 15 },
];

export function PaymentPreferences() {
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
    <section id="payments" ref={sectionRef} className="py-20 bg-[#FAFAFA]">
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <span className="text-sm font-mono text-[#0082F3] uppercase tracking-wider mb-2 block">
            Payment Analysis
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#131313] mb-4">
            Payment Preferences
          </h2>
          <p className="text-gray-600 max-w-2xl">
            Track customer payment method preferences across different languages and regions.
          </p>
        </div>

        {/* Payment Methods Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {paymentMethods.map((method, index) => (
            <div
              key={method.id}
              className={`bg-white rounded-2xl p-6 border border-[#EFEFF2] transition-all duration-700 hover:shadow-lg ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: method.color }}
                >
                  {method.icon}
                </div>
                <div className={`flex items-center gap-1 text-sm ${method.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  {method.trendUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{Math.abs(method.trend)}%</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-1">{method.name}</p>
              <p className="text-2xl font-semibold text-[#131313] mb-1">
                {method.count.toLocaleString()}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${method.percentage}%`, backgroundColor: method.color }}
                  />
                </div>
                <span className="text-sm text-gray-500">{method.percentage}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Language-based Payment Preferences */}
        <div
          className={`bg-white rounded-2xl p-6 border border-[#EFEFF2] transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[#131313]">Payment Methods by Language</h3>
              <p className="text-sm text-gray-500">Distribution of payment preferences across language segments</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#131313] flex items-center justify-center text-white">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={languagePreferenceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EFEFF2" vertical={false} />
                <XAxis dataKey="language" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#131313',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="EMI" name="EMI" fill="#0082F3" radius={[4, 4, 0, 0]} />
                <Bar dataKey="FULL_PAYMENT" name="Full Payment" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="PARTIAL_PAYMENT" name="Partial Payment" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="DOWN_PAYMENT" name="Down Payment" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#0082F3]" />
              <span className="text-sm text-gray-600">EMI</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#10B981]" />
              <span className="text-sm text-gray-600">Full Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
              <span className="text-sm text-gray-600">Partial Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
              <span className="text-sm text-gray-600">Down Payment</span>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gradient-to-br from-[#0082F3]/5 to-[#4D65FF]/5 rounded-xl p-5 border border-[#0082F3]/10">
            <div className="w-10 h-10 rounded-lg bg-[#0082F3]/10 flex items-center justify-center mb-3">
              <Building2 className="w-5 h-5 text-[#0082F3]" />
            </div>
            <h4 className="font-medium text-[#131313] mb-1">EMI Popularity</h4>
            <p className="text-sm text-gray-600">
              EMI plans are the most requested option, particularly for high-value recovery calls (38% in Mixed calls).
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#10B981]/5 to-[#059669]/5 rounded-xl p-5 border border-[#10B981]/10">
            <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center mb-3">
              <DollarSign className="w-5 h-5 text-[#10B981]" />
            </div>
            <h4 className="font-medium text-[#131313] mb-1">Full Settlements</h4>
            <p className="text-sm text-gray-600">
              Full payment settlements are 5% higher in Hindi-speaking segments compared to other regions.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#F59E0B]/5 to-[#D97706]/5 rounded-xl p-5 border border-[#F59E0B]/10">
            <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center mb-3">
              <TrendingDown className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <h4 className="font-medium text-[#131313] mb-1">Partial Commitments</h4>
            <p className="text-sm text-gray-600">
              "Pay some now, rest later" (Partial Payment) remains a key alternative for budget-constrained customers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

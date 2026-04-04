import { useEffect, useRef, useState } from 'react';
import { Play, Pause, CheckCircle, XCircle, AlertCircle, Mic, Clock, User, FileText, Filter } from 'lucide-react';
import { API } from '../apiConfig';

interface CallRecord {
  id: string;
  agent: string;
  customer: string;
  language: 'Tamil' | 'Hindi' | 'Mixed' | string;
  duration: string;
  date: string;
  status: 'flagged' | 'compliant' | 'review';
  sop_score: number;
  greeting: boolean;
  id_verify: boolean;
  compliance: boolean;
  transcript: string;
  summary?: string;
  payment_type?: string;
  rejection_reason?: string;
}

// Static fallback data (shown while backend is offline)
const FALLBACK_RECORDS: CallRecord[] = [
  { id: 'CALL-2024-001', agent: 'Rahul Sharma',  customer: 'Customer #4521', language: 'Hindi', duration: '4:32', date: '2024-03-28 14:23', status: 'compliant', sop_score: 95, greeting: true,  id_verify: true,  compliance: true,  transcript: 'Namaste, main Rahul bol raha hoon...', payment_type: 'FULL_PAYMENT' },
  { id: 'CALL-2024-002', agent: 'Priya Kumar',   customer: 'Customer #4522', language: 'Tamil', duration: '6:15', date: '2024-03-28 14:45', status: 'flagged',   sop_score: 68, greeting: true,  id_verify: false, compliance: false, transcript: 'Vanakkam, naan Priya pesuren...', payment_type: 'NONE' },
  { id: 'CALL-2024-003', agent: 'Amit Patel',    customer: 'Customer #4523', language: 'Mixed', duration: '3:48', date: '2024-03-28 15:12', status: 'compliant', sop_score: 92, greeting: true,  id_verify: true,  compliance: true,  transcript: 'Hello sir, kaise hain aap...', payment_type: 'EMI' },
  { id: 'CALL-2024-004', agent: 'Sneha Reddy',   customer: 'Customer #4524', language: 'Tamil', duration: '5:22', date: '2024-03-28 15:34', status: 'review',    sop_score: 78, greeting: true,  id_verify: true,  compliance: false, transcript: 'Hello, enna vishayam...', payment_type: 'PARTIAL_PAYMENT' },
  { id: 'CALL-2024-005', agent: 'Vikram Singh',  customer: 'Customer #4525', language: 'Hindi', duration: '7:05', date: '2024-03-28 16:01', status: 'compliant', sop_score: 88, greeting: true,  id_verify: true,  compliance: true,  transcript: 'Namaskar, main Vikram...', payment_type: 'DOWN_PAYMENT' },
];

function StatusBadge({ status }: { status: CallRecord['status'] }) {
  const configs = {
    compliant: { icon: CheckCircle, color: 'text-green-600 bg-green-50', label: 'Compliant' },
    flagged:   { icon: XCircle,     color: 'text-red-600 bg-red-50',     label: 'Flagged'   },
    review:    { icon: AlertCircle,  color: 'text-amber-600 bg-amber-50', label: 'Review'    },
  };
  const config = configs[status] ?? configs.review;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
      <Icon className="w-4 h-4" />
      {config.label}
    </span>
  );
}

function LanguageBadge({ language }: { language: string }) {
  const colors: Record<string, string> = {
    Tamil: 'bg-[#0082F3]/10 text-[#0082F3]',
    Hindi: 'bg-amber-500/10 text-amber-600',
    Mixed: 'bg-green-500/10 text-green-600',
  };
  const color = colors[language] ?? 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      <Mic className="w-3 h-3 mr-1" />
      {language}
    </span>
  );
}

function SOPCheck({ passed }: { passed: boolean }) {
  return passed ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />;
}

export function CallRecords() {
  const [isVisible, setIsVisible] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [records, setRecords] = useState<CallRecord[]>(FALLBACK_RECORDS);
  const [statusFilter, setStatusFilter] = useState<'all' | 'compliant' | 'flagged' | 'review'>('all');
  const sectionRef = useRef<HTMLDivElement>(null);

  // Fetch live call records
  useEffect(() => {
    const fetchCalls = () => {
      fetch(`${API}/api/calls`)
        .then(r => r.json())
        .then((data: CallRecord[]) => { if (data.length > 0) setRecords(data); })
        .catch(() => { /* stay on fallback */ });
    };
    fetchCalls();
    const interval = setInterval(fetchCalls, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const filtered = statusFilter === 'all' ? records : records.filter(c => c.status === statusFilter);

  return (
    <section id="calls" ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <span className="text-sm font-mono text-[#0082F3] uppercase tracking-wider mb-2 block">Call Records</span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#131313]">SOP Validation</h2>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            {(['all', 'compliant', 'review', 'flagged'] as const).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors
                  ${statusFilter === f ? 'bg-[#131313] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Call Records Table */}
        <div className={`bg-white rounded-2xl border border-[#EFEFF2] overflow-hidden transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#FAFAFA]">
                <tr>
                  {['Call ID', 'Agent', 'Language', 'Duration', 'SOP Score', 'Checks', 'Payment', 'Status', 'Action'].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-sm font-medium text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEFF2]">
                {filtered.map(call => (
                  <tr key={call.id} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-6 py-4"><span className="text-sm font-mono text-[#131313]">{call.id}</span></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#131313] flex items-center justify-center text-white text-xs">
                          {call.agent.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm text-[#131313]">{call.agent}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4"><LanguageBadge language={call.language} /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />{call.duration}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${call.sop_score >= 90 ? 'bg-green-500' : call.sop_score >= 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${call.sop_score}%` }} />
                        </div>
                        <span className="text-sm font-medium text-[#131313]">{call.sop_score}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {[['G', call.greeting], ['ID', call.id_verify], ['C', call.compliance]].map(([label, val]) => (
                          <div key={String(label)} className="flex flex-col items-center" title={String(label)}>
                            <span className="text-[10px] text-gray-400 mb-0.5">{label}</span>
                            <SOPCheck passed={Boolean(val)} />
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">{call.payment_type ?? '—'}</span>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={call.status} /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setPlayingId(playingId === call.id ? null : call.id)} className="w-8 h-8 rounded-lg bg-[#131313] flex items-center justify-center text-white hover:bg-[#2a2a2a] transition-colors">
                          {playingId === call.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        <button onClick={() => setSelectedCall(call)} className="w-8 h-8 rounded-lg border border-[#EFEFF2] flex items-center justify-center text-gray-600 hover:bg-[#FAFAFA] transition-colors">
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">No records for this filter.</div>
            )}
          </div>
        </div>

        {/* Call Detail Modal */}
        {selectedCall && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-auto">
              <div className="p-6 border-b border-[#EFEFF2] flex items-center justify-between">
                <h3 className="text-xl font-semibold text-[#131313]">{selectedCall.id}</h3>
                <button onClick={() => setSelectedCall(null)} className="w-8 h-8 rounded-lg hover:bg-[#FAFAFA] flex items-center justify-center text-gray-500">×</button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#FAFAFA] rounded-xl">
                    <div className="flex items-center gap-2 text-gray-500 mb-1"><User className="w-4 h-4" /><span className="text-sm">Agent</span></div>
                    <p className="text-[#131313] font-medium">{selectedCall.agent}</p>
                  </div>
                  <div className="p-4 bg-[#FAFAFA] rounded-xl">
                    <div className="flex items-center gap-2 text-gray-500 mb-1"><Mic className="w-4 h-4" /><span className="text-sm">Language</span></div>
                    <LanguageBadge language={selectedCall.language} />
                  </div>
                </div>

                {/* SOP Checks */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">SOP Compliance</h4>
                  <div className="space-y-3">
                    {[['Greeting', selectedCall.greeting], ['ID Verification', selectedCall.id_verify], ['Compliance Script', selectedCall.compliance]].map(([label, val]) => (
                      <div key={String(label)} className="flex items-center justify-between p-3 bg-[#FAFAFA] rounded-lg">
                        <span className="text-sm text-[#131313]">{label}</span>
                        <SOPCheck passed={Boolean(val)} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Summary */}
                {selectedCall.summary && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">AI Summary</h4>
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <p className="text-sm text-[#131313] leading-relaxed">{selectedCall.summary}</p>
                    </div>
                  </div>
                )}

                {/* Payment type */}
                {selectedCall.payment_type && selectedCall.payment_type !== 'Unknown' && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Payment Category</h4>
                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">{selectedCall.payment_type}</span>
                  </div>
                )}

                {/* Rejection reason */}
                {selectedCall.rejection_reason && (
                  <div>
                    <h4 className="text-sm font-medium text-red-500 mb-2">Rejection Reason</h4>
                    <div className="p-4 bg-red-50 rounded-xl">
                      <p className="text-sm text-red-700">{selectedCall.rejection_reason}</p>
                    </div>
                  </div>
                )}

                {/* Transcript */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Transcript</h4>
                  <div className="p-4 bg-[#FAFAFA] rounded-xl max-h-40 overflow-y-auto">
                    <p className="text-sm text-[#131313] leading-relaxed">{selectedCall.transcript}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

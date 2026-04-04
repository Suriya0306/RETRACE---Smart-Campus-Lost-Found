import { useState, useCallback, useRef } from 'react';
import { Upload, Mic, CheckCircle, AlertCircle, Loader2, FileAudio, X } from 'lucide-react';
import { processAudioFile, processAudioUrl } from '../services/analyticsApi';

type Stage = 'idle' | 'uploading' | 'transcribing' | 'analysing' | 'done' | 'error';

interface StageInfo {
  label: string;
  icon: React.ReactNode;
  color: string;
}

const STAGES: Record<Stage, StageInfo> = {
  idle:        { label: 'Drop an audio file to analyse',  icon: <Upload className="w-6 h-6" />,  color: 'text-gray-400' },
  uploading:   { label: 'Converting audio to Base64…',    icon: <Loader2 className="w-6 h-6 animate-spin" />, color: 'text-[#0082F3]' },
  transcribing:{ label: 'Transcribing audio (Whisper)…',  icon: <Mic className="w-6 h-6 animate-pulse" />,   color: 'text-purple-500' },
  analysing:   { label: 'Analysing with Gemini AI…',      icon: <Loader2 className="w-6 h-6 animate-spin" />, color: 'text-amber-500' },
  done:        { label: 'Analysis complete!',              icon: <CheckCircle className="w-6 h-6" />,          color: 'text-green-500' },
  error:       { label: 'An error occurred.',              icon: <AlertCircle className="w-6 h-6" />,          color: 'text-red-500' },
};

export function UploadCall() {
  const [stage, setStage] = useState<Stage>('idle');
  const [agentName, setAgentName] = useState('');
  const [fileName, setFileName] = useState('');
  const [language, setLanguage] = useState('Mixed');
  const [urlInput, setUrlInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    setFileName(file.name);
    setStage('uploading');
    setErrorMsg('');
    setResult(null);

    try {
      // Process and analyze the file directly
      setStage('uploading');
      const analysisResult = await processAudioFile(file, language, agentName || 'Agent');
      
      // Update stage display during processing
      setStage('transcribing');
      // After successful response, go to done
      setStage('done');
      setResult(analysisResult);
    } catch (err: unknown) {
      setStage('error');
      setErrorMsg(err instanceof Error ? err.message : 'Unexpected error');
    }
  }, [agentName, language]);

  const processUrl = useCallback(async (url: string) => {
    setFileName(url);
    setStage('uploading');
    setErrorMsg('');
    setResult(null);

    try {
      // Process and analyze the URL directly
      const analysisResult = await processAudioUrl(url, language, agentName || 'Agent');
      
      setStage('done');
      setResult(analysisResult);
    } catch (err: unknown) {
      setStage('error');
      setErrorMsg(err instanceof Error ? err.message : 'Unexpected error');
    }
  }, [agentName, language]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const reset = () => {
    setStage('idle');
    setFileName('');
    setResult(null);
    setErrorMsg('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const info = STAGES[stage];

  return (
    <section id="upload" className="py-20 bg-[#131313]">
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="text-sm font-mono text-[#0082F3] uppercase tracking-wider mb-2 block">
            Upload & Analyse
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
            Process a New Call
          </h2>
          <p className="text-gray-400 max-w-2xl">
            Upload a Hindi (Hinglish) or Tamil (Tanglish) call recording. The system will
            transcribe it, validate against SOP, and categorise payment preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            {/* Agent name field */}
            <div className="mb-5">
              <label className="text-sm text-gray-400 mb-1 block">Agent Name (optional)</label>
              <input
                type="text"
                value={agentName}
                onChange={e => setAgentName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                disabled={stage !== 'idle'}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-[#0082F3] transition-colors text-sm disabled:opacity-50"
              />
            </div>

            {/* Language selector */}
            <div className="mb-5">
              <label className="text-sm text-gray-400 mb-1 block">Language</label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                disabled={stage !== 'idle'}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#0082F3] transition-colors text-sm disabled:opacity-50"
              >
                <option value="Mixed">Mixed / Auto-detect</option>
                <option value="Tamil">Tamil (Tanglish)</option>
                <option value="Hindi">Hindi (Hinglish)</option>
                <option value="English">English</option>
              </select>
            </div>

            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => stage === 'idle' && fileInputRef.current?.click()}
              className={`relative rounded-xl border-2 border-dashed p-10 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer
                ${isDragging ? 'border-[#0082F3] bg-[#0082F3]/10' : 'border-white/10 hover:border-white/30'}
                ${stage !== 'idle' ? 'cursor-default pointer-events-none' : ''}
              `}
            >
              <div className={`${info.color} transition-colors`}>{info.icon}</div>
              <p className={`text-sm font-medium ${info.color}`}>{info.label}</p>
              {fileName && stage !== 'idle' && (
                <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5">
                  <FileAudio className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-400 truncate max-w-[200px]">{fileName}</span>
                </div>
              )}
              {stage === 'idle' && (
                <p className="text-xs text-gray-600">MP3, WAV, M4A · drag or click</p>
              )}
              <input ref={fileInputRef} type="file" accept=".mp3,.wav,.m4a,.ogg" onChange={onFileChange} className="hidden" />
            </div>

            {/* URL input zone */}
            <div className="mt-4">
              <label className="text-sm text-gray-400 mb-1 block">Or provide an Audio URL</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  placeholder="https://example.com/audio.mp3"
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-[#0082F3] transition-colors text-sm"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && urlInput.trim() && stage === 'idle') {
                      processUrl(urlInput.trim());
                      setUrlInput('');
                    }
                  }}
                  disabled={stage !== 'idle'}
                />
                <button
                  onClick={() => {
                    if (urlInput.trim()) {
                      processUrl(urlInput.trim());
                      setUrlInput('');
                    }
                  }}
                  disabled={!urlInput.trim() || stage !== 'idle'}
                  className="bg-[#0082F3] text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-[#0072d3] transition-colors"
                >
                  Upload
                </button>
              </div>
            </div>

            {/* Progress steps */}
            {stage !== 'idle' && (
              <div className="mt-5 space-y-2">
                {(['uploading', 'transcribing', 'analysing', 'done'] as Stage[]).map((s, i) => {
                  const stages: Stage[] = ['uploading', 'transcribing', 'analysing', 'done'];
                  const currentIdx = stages.indexOf(stage);
                  const stepIdx = i;
                  const done = stepIdx < currentIdx || (stage === 'done' && currentIdx >= 3);
                  const active = stepIdx === currentIdx && stage !== 'done' && stage !== 'error';
                  return (
                    <div key={s} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs
                        ${done ? 'bg-green-500 text-white' : active ? 'bg-[#0082F3] text-white animate-pulse' : 'bg-white/10 text-gray-600'}`}>
                        {done ? '✓' : i + 1}
                      </div>
                      <span className={`text-sm ${done ? 'text-green-400' : active ? 'text-white' : 'text-gray-600'}`}>
                        {STAGES[s].label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {stage === 'error' && (
              <p className="mt-3 text-sm text-red-400">{errorMsg}</p>
            )}

            {(stage === 'done' || stage === 'error') && (
              <button onClick={reset} className="mt-4 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                <X className="w-4 h-4" /> Upload another
              </button>
            )}
          </div>

          {/* Result Card */}
          <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-500 ${stage === 'done' && result ? 'opacity-100' : 'opacity-40'}`}>
            <h3 className="text-white font-semibold mb-5">Analysis Result</h3>
            {result ? (
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-400 mb-1">Language</p>
                    <p className="text-white font-medium">{String(result.language)}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-400 mb-1">SOP Score</p>
                    <p className={`font-bold text-lg ${Number(result.sop_score) >= 90 ? 'text-green-400' : Number(result.sop_score) >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                      {String(result.sop_score)}%
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-400 mb-1">Payment Type</p>
                    <p className="text-white font-medium">{String(result.payment_type)}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-400 mb-1">Call Status</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${result.status === 'compliant' ? 'bg-green-500/20 text-green-400' : result.status === 'flagged' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {String(result.status)}
                    </span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-gray-400 mb-2">SOP Checks</p>
                  {[['Greeting', result.greeting], ['ID Verification', result.id_verify], ['Compliance Script', result.compliance]].map(([label, val]) => (
                    <div key={String(label)} className="flex items-center justify-between py-1">
                      <span className="text-gray-300">{String(label)}</span>
                      <span className={val ? 'text-green-400' : 'text-red-400'}>{val ? '✓ Pass' : '✗ Fail'}</span>
                    </div>
                  ))}
                </div>
                {result.summary && (
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-400 mb-2">AI Summary</p>
                    <p className="text-gray-300 leading-relaxed">{String(result.summary)}</p>
                  </div>
                )}
                {result.keywords && Array.isArray(result.keywords) && result.keywords.length > 0 && (
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-400 mb-2">Keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {result.keywords.map((keyword: string, idx: number) => (
                        <span key={idx} className="bg-[#0082F3]/20 text-[#0082F3] px-3 py-1 rounded-full text-xs font-medium">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {result.transcript && (
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-400 mb-2">Transcript</p>
                    <p className="text-gray-300 text-xs leading-relaxed max-h-40 overflow-y-auto">{String(result.transcript)}</p>
                  </div>
                )}
                {result.rejection_reason && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                    <p className="text-red-400 font-medium mb-1">Rejection Reason</p>
                    <p className="text-gray-300">{String(result.rejection_reason)}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-gray-600">
                <FileAudio className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm">Results will appear here after processing</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

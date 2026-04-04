import { API } from '@/apiConfig';

// API Key for backend authentication
const API_KEY = 'sk_track3_987654321';

interface AnalyticsRequest {
  audioBase64: string;
  language: string;
  audioFormat?: string;
  agent?: string;
  filename?: string;
}

interface AnalyticsResponse {
  transcript: string;
  summary: string;
  language: string;
  sop_score: number;
  sop_validation: Record<string, any>;
  analytics: Record<string, any>;
  keywords: string[];
  payment_type?: string;
  status?: string;
  greeting?: boolean;
  id_verify?: boolean;
  compliance?: boolean;
  rejection_reason?: string;
  [key: string]: any;
}

/**
 * Convert File to Base64 string
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Extract Base64 part after the comma
      const base64String = result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Analyze a call recording directly
 * Sends Base64 audio to the backend for processing
 */
export async function analyzeCall(
  audioBase64: string,
  language: string,
  audioFormat: string = 'mp3',
  agentName: string = 'Agent',
  filename?: string
): Promise<AnalyticsResponse> {
  const payload: AnalyticsRequest = {
    audioBase64,
    language,
    audioFormat,
    agent: agentName,
    filename: filename || `capture.${audioFormat}`,
  };

  const response = await fetch(`${API}/api/call-analytics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Process a file for call analytics
 * Combines file reading and analysis
 */
export async function processAudioFile(
  file: File,
  language: string,
  agentName: string = 'Agent'
): Promise<AnalyticsResponse> {
  // Extract audio format from file extension
  const ext = file.name.split('.').pop()?.toLowerCase() || 'mp3';
  
  // Convert file to Base64
  const audioBase64 = await fileToBase64(file);

  // Send to analytics API
  return analyzeCall(audioBase64, language, ext, agentName, file.name);
}

/**
 * Process audio from URL
 */
export async function processAudioUrl(
  audioUrl: string,
  language: string,
  agentName: string = 'Agent'
): Promise<AnalyticsResponse> {
  try {
    const response = await fetch(audioUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch audio: ${response.status}`);
    }

    const blob = await response.blob();
    const audioBase64 = await fileToBase64(blob as File);
    const filename = audioUrl.split('/').pop() || 'audio.mp3';
    const ext = filename.split('.').pop()?.toLowerCase() || 'mp3';

    return analyzeCall(audioBase64, language, ext, agentName, filename);
  } catch (error) {
    throw new Error(
      `Failed to process audio URL: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

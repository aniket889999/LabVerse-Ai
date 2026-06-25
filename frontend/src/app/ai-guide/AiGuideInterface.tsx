'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { trackEvent } from '@/lib/analytics';
import { Send, Bot, User, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

interface ChatResponse {
  answer: string;
  sources: string[];
  suggestedQuestions: string[];
  mode: 'LLM' | 'FALLBACK_RETRIEVAL';
}

function AiGuideInterfaceInner() {
  const searchParams = useSearchParams();
  const initialLabId = searchParams.get('labId') || undefined;
  const initialProjectId = searchParams.get('projectId') || undefined;
  const initialEquipmentId = searchParams.get('equipmentId') || undefined;

  const [question, setQuestion] = useState('');
  const [visitorType, setVisitorType] = useState('STUDENT');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    trackEvent({ eventType: 'PAGE_VIEW', metadata: { page: 'ai-guide' } });
  }, []);

  const handleSubmit = async (q: string = question) => {
    if (!q.trim()) return;
    
    setIsLoading(true);
    setErrorMsg('');
    setResponse(null);
    setQuestion('');

    trackEvent({
      eventType: 'AI_QUESTION',
      metadata: { visitorType, labId: initialLabId }
    });

    try {
      const res = await api.askAiGuide({
        question: q,
        visitorType,
        labId: initialLabId,
        projectId: initialProjectId,
        equipmentId: initialEquipmentId
      });

      if (res.success && res.data) {
        setResponse(res.data);
      } else {
        setErrorMsg(res.error || 'Failed to get an answer from the AI Guide.');
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Top Bar Config */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">I am a:</label>
          <select 
            value={visitorType} 
            onChange={(e) => setVisitorType(e.target.value)}
            className="text-sm bg-slate-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="STUDENT">Student</option>
            <option value="RECRUITER">Recruiter</option>
            <option value="INDUSTRY_PARTNER">Industry Partner</option>
          </select>
        </div>
        <div className="flex gap-2">
           {initialLabId && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md">Context: Specific Lab</span>}
           {initialProjectId && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md">Context: Specific Project</span>}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        {/* Welcome Message */}
        {!response && !isLoading && !errorMsg && (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Hello! How can I help you explore?</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              I can answer questions about our facilities, equipment availability, ongoing research projects, and partnership opportunities.
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
              {[
                "What is LabVerse AI?", 
                "Show me student projects.", 
                "What equipment is in the Warehouse Lab?",
                "How can industry partners collaborate?"
              ].map((q, i) => (
                <button 
                  key={i}
                  onClick={() => handleSubmit(q)}
                  className="bg-white border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 text-sm text-gray-700 px-4 py-2 rounded-full transition shadow-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-indigo-600">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p className="text-sm font-medium animate-pulse">Searching knowledge base...</p>
          </div>
        )}

        {/* Error State */}
        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{errorMsg}</p>
          </div>
        )}

        {/* Response State */}
        {response && !isLoading && (
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <Bot className="w-6 h-6 text-indigo-600" />
              <h3 className="font-bold text-gray-900">LabVerse AI</h3>
              <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full ${
                response.mode === 'LLM' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {response.mode === 'LLM' ? 'AI Generated' : 'Retrieval Fallback Mode'}
              </span>
            </div>
            
            <div className="prose prose-indigo max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {response.answer}
            </div>
            
            {response.sources && response.sources.length > 0 && (
              <div className="mt-8 pt-4 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Sources</p>
                <div className="flex flex-wrap gap-2">
                  {response.sources.map((src, i) => (
                    <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md border border-slate-200">
                      {src}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {response.suggestedQuestions && response.suggestedQuestions.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-3">Suggested follow-ups:</p>
                <div className="flex flex-wrap gap-2">
                  {response.suggestedQuestions.map((q, i) => (
                    <button 
                      key={i}
                      onClick={() => handleSubmit(q)}
                      className="text-xs font-medium bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4 shrink-0">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
          className="max-w-4xl mx-auto flex items-end gap-3 bg-slate-50 border border-gray-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition"
        >
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about labs, equipment, or research projects..."
            className="flex-1 bg-transparent resize-none outline-none py-3 px-4 max-h-32 min-h-[52px]"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <button 
            type="submit" 
            disabled={!question.trim() || isLoading}
            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition shadow-sm mb-1 mr-1"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AiGuideInterface() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-500">Loading AI Guide...</div>}>
      <AiGuideInterfaceInner />
    </Suspense>
  );
}

'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { generateKreolSentences } from '@/actions/generate';
import { Loader2, CheckCircle, ThumbsUp, ThumbsDown } from 'lucide-react';

export default function LabelingPage() {
  return (
    <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
      <LabelingInterface />
    </Suspense>
  );
}

function LabelingInterface() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get('uid');

  const [sentences, setSentences] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  
  // FIX: This ref prevents the API from being called twice in Strict Mode
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    if (!userId) {
      router.push('/register');
      return;
    }

    // Stop if we already fetched
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    async function loadData() {
      try {
        const data = await generateKreolSentences();
        setSentences(data);
      } catch (error) {
        console.error("Failed to load sentences", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [userId, router]);

  const submitLabel = async (isToxic: boolean) => {
    if (!userId) return;

    // Save to Supabase
    await supabase.from('labels').insert({
      user_id: userId,
      sentence_text: sentences[currentIndex],
      is_toxic: isToxic
    });

    // Move to next or finish
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCompleted(true);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
        <h3 className="text-lg font-semibold text-slate-800">Generating Content...</h3>
        <p className="text-slate-500 text-sm mt-2 text-center px-4">
          Consulting Gemini AI (Usually takes 2-5 seconds)
        </p>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="max-w-md mx-auto text-center mt-8 md:mt-12 bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200 mx-4">
        <div className="inline-flex bg-green-100 p-4 rounded-full text-green-600 mb-6">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Mersi!</h2>
        <p className="text-slate-600 mb-8">
          Session complete. Your labels have been saved to the database.
        </p>
        <div className="flex flex-col gap-3">
            <button 
            onClick={() => window.location.reload()} 
            className="w-full py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
            >
            Label New Batch
            </button>
            <button 
            onClick={() => router.push('/')}
            className="w-full py-3 text-slate-500 hover:text-slate-800 transition"
            >
            Back to Home
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-4 md:mt-8 px-2 md:px-0">
      
      {/* Progress Bar */}
      <div className="mb-4 md:mb-6">
        <div className="flex justify-between text-sm text-slate-500 mb-2">
          <span>Sentence {currentIndex + 1} of {sentences.length}</span>
          <span>{Math.round(((currentIndex) / sentences.length) * 100)}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${((currentIndex + 1) / sentences.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Card: Mobile (p-6, text-xl) vs Desktop (p-12, text-3xl) */}
      <div className="bg-white p-6 md:p-12 rounded-2xl shadow-lg border border-slate-100 text-center mb-6 md:mb-8 min-h-[160px] md:min-h-[200px] flex items-center justify-center">
        <h3 className="text-xl md:text-3xl font-serif text-slate-800 leading-snug">
          "{sentences[currentIndex]}"
        </h3>
      </div>

      {/* Buttons: Smaller gaps on mobile */}
      <div className="grid grid-cols-2 gap-3 md:gap-6">
        <button 
          onClick={() => submitLabel(false)}
          className="group flex flex-col items-center justify-center gap-2 bg-emerald-50 text-emerald-800 py-4 md:py-6 rounded-xl border-2 border-emerald-100 hover:bg-emerald-100 hover:border-emerald-300 active:scale-95 transition"
        >
          {/* Icon size adjusts */}
          <ThumbsUp size={24} className="md:w-8 md:h-8 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-base md:text-lg">Non-Toxic</span>
        </button>

        <button 
          onClick={() => submitLabel(true)}
          className="group flex flex-col items-center justify-center gap-2 bg-red-50 text-red-800 py-4 md:py-6 rounded-xl border-2 border-red-100 hover:bg-red-100 hover:border-red-300 active:scale-95 transition"
        >
          <ThumbsDown size={24} className="md:w-8 md:h-8 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-base md:text-lg">Toxic</span>
        </button>
      </div>
    </div>
  );
}
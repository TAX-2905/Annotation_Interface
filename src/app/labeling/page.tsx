'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { fetchUnlabeledBatch, markAsLabeled } from '@/actions/fetch'; // Import new actions
import { Loader2, CheckCircle, ThumbsUp, ThumbsDown } from 'lucide-react';

export const maxDuration = 60; 

// Define the shape of our data
type SentenceData = {
  id: string;
  content: string;
};

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

  // Change state to hold Objects, not just strings
  const [batch, setBatch] = useState<SentenceData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    if (!userId) {
      router.push('/register');
      return;
    }
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    async function loadData() {
      // Call the new fetch action
      const data = await fetchUnlabeledBatch();
      if (data && data.length > 0) {
        setBatch(data);
      } else {
        alert("No more unlabeled sentences found!");
      }
      setLoading(false);
    }
    loadData();
  }, [userId, router]);

  const submitLabel = async (isToxic: boolean) => {
    if (!userId || batch.length === 0) return;

    const currentSentence = batch[currentIndex];

    // 1. Save the label
    await supabase.from('labels').insert({
      user_id: userId,
      sentence_id: currentSentence.id, // Link to ID
      sentence_text: currentSentence.content, // (Optional backup)
      is_toxic: isToxic
    });

    // 2. Mark as Labeled in the database so it disappears for others
    await markAsLabeled(currentSentence.id);

    // 3. Move to next
    if (currentIndex < batch.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCompleted(true);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
        <h3 className="text-lg font-semibold text-slate-800">Fetching Data...</h3>
      </div>
    );
  }

  // Handle empty database case
  if (batch.length === 0 && !loading) {
     return <div className="p-10 text-center">No unlabeled comments left in the database!</div>;
  }

  if (completed) {
    return (
      <div className="max-w-md mx-auto text-center mt-8 md:mt-12 bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200 mx-4">
        <div className="inline-flex bg-green-100 p-4 rounded-full text-green-600 mb-6">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Batch Complete!</h2>
        <p className="text-slate-600 mb-8">
          Thank you. Would you like to request another batch?
        </p>
        <div className="flex flex-col gap-3">
            <button 
            onClick={() => window.location.reload()} 
            className="w-full py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
            >
            Load Next 10 Comments
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
          <span>Comment {currentIndex + 1} of {batch.length}</span>
          <span>{Math.round(((currentIndex) / batch.length) * 100)}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${((currentIndex + 1) / batch.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white p-6 md:p-12 rounded-2xl shadow-lg border border-slate-100 text-center mb-6 md:mb-8 min-h-[160px] md:min-h-[200px] flex items-center justify-center">
        <h3 className="text-xl md:text-2xl font-serif text-slate-800 leading-snug">
          "{batch[currentIndex].content}"
        </h3>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-3 md:gap-6">
        <button 
          onClick={() => submitLabel(false)}
          className="group flex flex-col items-center justify-center gap-2 bg-emerald-50 text-emerald-800 py-4 md:py-6 rounded-xl border-2 border-emerald-100 hover:bg-emerald-100 active:scale-95 transition"
        >
          <ThumbsUp size={24} className="md:w-8 md:h-8" />
          <span className="font-bold text-base md:text-lg">Non-Toxic</span>
        </button>

        <button 
          onClick={() => submitLabel(true)}
          className="group flex flex-col items-center justify-center gap-2 bg-red-50 text-red-800 py-4 md:py-6 rounded-xl border-2 border-red-100 hover:bg-red-100 active:scale-95 transition"
        >
          <ThumbsDown size={24} className="md:w-8 md:h-8" />
          <span className="font-bold text-base md:text-lg">Toxic</span>
        </button>
      </div>
    </div>
  );
}
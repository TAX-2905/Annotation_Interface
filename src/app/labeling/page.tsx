'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchUnlabeledBatch, markAsLabeled } from '@/actions/fetch'; 
import { saveLabel } from '@/actions/submit'; 
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

  // Define the shape of our data
  type SentenceData = {
    id: string;
    content: string;
  };

  const [batch, setBatch] = useState<SentenceData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    if (!userId) {
      router.push('/register'); // Redirects back if no User ID
      return;
    }
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    async function loadData() {
      const data = await fetchUnlabeledBatch();
      if (data && data.length > 0) {
        setBatch(data);
      }
      setLoading(false);
    }
    loadData();
  }, [userId, router]);

  const submitLabel = async (isToxic: boolean) => {
    if (!userId || batch.length === 0) return;

    const currentSentence = batch[currentIndex];

    try {
      // 1. Save label
      await saveLabel(userId, currentSentence.id, currentSentence.content, isToxic);
      // 2. Mark done
      await markAsLabeled(currentSentence.id);

      // 3. Next
      if (currentIndex < batch.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCompleted(true);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save. Check console.");
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

  if (completed) {
    return (
      <div className="max-w-md mx-auto text-center mt-12 bg-white p-10 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-center mb-4">
            <CheckCircle size={48} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Batch Complete!</h2>
        <button onClick={() => window.location.reload()} className="mt-4 text-blue-600 font-bold hover:underline">
          Load More
        </button>
      </div>
    );
  }

  if (batch.length === 0) return <div className="p-10 text-center">No comments left!</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      <div className="mb-6 text-sm text-slate-500">
        Comment {currentIndex + 1} of {batch.length}
      </div>
      
      <div className="bg-white p-12 rounded-2xl shadow-lg border border-slate-100 text-center mb-8 min-h-[200px] flex items-center justify-center">
        <h3 className="text-2xl font-serif text-slate-800">"{batch[currentIndex].content}"</h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <button onClick={() => submitLabel(false)} className="flex flex-col items-center gap-2 bg-emerald-50 text-emerald-800 py-6 rounded-xl border-2 border-emerald-100 hover:bg-emerald-100 transition">
          <ThumbsUp size={32} /> <span className="font-bold">Non-Toxic</span>
        </button>
        <button onClick={() => submitLabel(true)} className="flex flex-col items-center gap-2 bg-red-50 text-red-800 py-6 rounded-xl border-2 border-red-100 hover:bg-red-100 transition">
          <ThumbsDown size={32} /> <span className="font-bold">Toxic</span>
        </button>
      </div>
    </div>
  );
}
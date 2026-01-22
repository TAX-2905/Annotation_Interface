'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    occupation: '',
    knowledge: 'Cultural/Linguistic',
    training: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.from('users').insert([{
      name: formData.name || null,
      age: parseInt(formData.age),
      occupation: formData.occupation,
      knowledge_area: formData.knowledge,
      training_received: formData.training
    }]).select().single();

    if (error) {
      console.error(error);
      alert('Error saving details. Please try again.');
      setLoading(false);
      return;
    }

    router.push(`/labeling?uid=${data.id}`);
  };

  return (
    // Updated container: Less padding (p-5) and margin (mt-4) on mobile. Normal on desktop (md:).
    <div className="max-w-xl mx-auto mt-4 md:mt-8 bg-white p-5 md:p-8 rounded-xl shadow-sm border border-slate-200 text-black">
      <h2 className="text-xl md:text-2xl font-bold mb-2">Contributor Profile</h2>
      <p className="text-black mb-6 text-sm">Please tell us a bit about yourself before we begin.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
        
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-black mb-1">Name (Optional)</label>
          <input 
            type="text" 
            className="w-full p-3 border border-slate-300 text-black rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. Jean"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        {/* Age & Occupation Row - Stacks on mobile (grid-cols-1), side-by-side on desktop (md:grid-cols-2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-black mb-1">Age</label>
            <input 
              type="number" required min="18" max="100"
              className="w-full p-3 border border-slate-300 text-black rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-black mb-1">Occupation</label>
            <input 
              type="text" required
              className="w-full p-3 border border-slate-300 text-black rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Teacher"
              value={formData.occupation}
              onChange={(e) => setFormData({...formData, occupation: e.target.value})}
            />
          </div>
        </div>

        {/* Knowledge Area */}
        <div>
          <label className="block text-sm font-semibold text-black mb-1">Primary Knowledge Area</label>
          <select 
            className="w-full p-3 border border-slate-300 text-black rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            value={formData.knowledge}
            onChange={(e) => setFormData({...formData, knowledge: e.target.value})}
          >
            <option value="Cultural/Linguistic">Cultural & Linguistic Knowledge</option>
            <option value="Content Moderation">Content Moderation</option>
            <option value="NLP">NLP Tasks</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Training Checkbox */}
        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-black">
          <input 
            type="checkbox" 
            id="training"
            required
            className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
            checked={formData.training}
            onChange={(e) => setFormData({...formData, training: e.target.checked})}
          />
          <label htmlFor="training" className="text-sm text-black cursor-pointer leading-tight">
            I confirm that I have received training or read the guidelines on toxicity before filling this form.
          </label>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 md:py-3.5 rounded-lg hover:bg-blue-700 transition flex justify-center items-center font-medium shadow-md text-base"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Save & Continue"}
        </button>
      </form>
    </div>
  );
}
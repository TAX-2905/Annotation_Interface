'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/actions/submit'; // Import the Server Action
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    occupation: '',
    writtenProficiency: 'Advanced', // Default
    oralProficiency: 'Advanced',    // Default
    training: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // We pass the raw formData to the server action.
      // The server action handles the DB insertion securely.
      const data = await registerUser(formData);

      // Redirect using the ID returned by the server action
      router.push(`/labeling?uid=${data.id}`);
    } catch (error: any) {
      console.error("Registration error:", error);
      // You might want to display the specific error message from submit.ts
      alert(error.message || 'Error saving details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
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

        {/* Age & Occupation Row */}
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
              placeholder="e.g. Student"
              value={formData.occupation}
              onChange={(e) => setFormData({...formData, occupation: e.target.value})}
            />
          </div>
        </div>

        {/* Language Proficiency Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Written Kreol */}
          <div>
            <label className="block text-sm font-semibold text-black mb-1">Proficiency in Written Kreol Morisien</label>
            <select 
              className="w-full p-3 border border-slate-300 text-black rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={formData.writtenProficiency}
              onChange={(e) => setFormData({...formData, writtenProficiency: e.target.value})}
            >
              <option value="Advanced">Advanced</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Beginner">Beginner</option>
            </select>
          </div>

          {/* Oral Kreol */}
          <div>
            <label className="block text-sm font-semibold text-black mb-1">Proficiency in Oral Kreol <br /> Morisien</label>
            <select 
              className="w-full p-3 border border-slate-300 text-black rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={formData.oralProficiency}
              onChange={(e) => setFormData({...formData, oralProficiency: e.target.value})}
            >
              <option value="Advanced">Advanced</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Beginner">Beginner</option>
            </select>
          </div>
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
            I confirm that I have read the guidelines on toxicity and non toxicity before filling this form.
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
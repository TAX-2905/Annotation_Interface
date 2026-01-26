import Link from "next/link";
import { AlertTriangle, ArrowRight, ShieldCheck, CheckCircle } from "lucide-react";

export default function InstructionPage() {
  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="text-blue-600" size={32} />
          <h2 className="text-3xl font-bold text-slate-900">Instructions</h2>
        </div>
        
        <p className="text-slate-600 mb-6 text-lg leading-relaxed">
          Welcome to <strong>MorisGuard</strong>. Our aim is to build a dataset to automatically detect toxicity in <em>Kreol Morisien</em>. You will be shown comments from various Facebook posts and asked to label them.
        </p>
        
        {/* Definitions Section - Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Toxic Definition */}
          <div className="bg-amber-50 p-6 rounded-lg border border-amber-100 h-full">
            <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
              <AlertTriangle size={20} />
              What is "Toxic"?
            </h3>
            <p className="text-amber-800 text-sm mb-2">
              Please label a comment as <strong>Toxic</strong> if it contains:
            </p>
            <ul className="list-disc list-inside text-amber-800 space-y-1 ml-1 text-sm">
              <li>Insults or personal attacks.</li>
              <li>Hate speech (racism, sexism).</li>
              <li>Vulgarity used aggressively.</li>
              <li>Threats or violence.</li>
            </ul>
          </div>

          {/* Non-Toxic Definition */}
          <div className="bg-green-50 p-6 rounded-lg border border-green-100 h-full">
            <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
              <CheckCircle size={20} />
              What is "Non-Toxic"?
            </h3>
            <p className="text-green-800 text-sm mb-2">
              Label a comment as <strong>Non-Toxic</strong> if it contains:
            </p>
            <ul className="list-disc list-inside text-green-800 space-y-1 ml-1 text-sm">
              <li>Debates.</li>
              <li>Constructive criticism.</li>
              <li>Jokes (without hate).</li>
              <li>General conversation.</li>
            </ul>
          </div>

        </div>

        <Link 
          href="/register" 
          className="group w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-lg hover:bg-slate-800 transition font-medium text-lg shadow-md"
        >
          I Understand, Start <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
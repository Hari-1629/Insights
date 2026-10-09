import React from 'react';
import { useNavigate } from 'react-router-dom';
import ActionItemsList from '../components/ActionItemsList';
import { ArrowLeft, Sparkles, LayoutGrid } from 'lucide-react';

const SavedActionItems = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 font-sans p-6 md:p-14 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-indigo-100/30 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-100/30 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10 space-y-16">
                {/* Minimalist Professional Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-10">
                    <div className="space-y-6">
                        <button
                            type="button"
                            onClick={() => navigate('/home')}
                            className="group flex items-center gap-3 bg-white text-slate-500 px-6 py-3 rounded-2xl hover:text-indigo-600 transition-all shadow-sm border border-slate-100 font-black text-[10px] uppercase tracking-widest cursor-pointer z-50"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Return Home
                        </button>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 text-indigo-600">
                                <LayoutGrid className="w-8 h-8" />
                                <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter">Strategic <span className="text-indigo-600">Roadmap</span></h1>
                            </div>
                            <p className="text-slate-500 text-lg font-medium max-w-xl">
                                Curated intelligence nodes transformed into prioritized engineering tasks.
                            </p>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center gap-4 px-6 py-4 bg-white rounded-3xl border border-slate-100 shadow-sm animate-fade-in">
                        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Monitoring Active</span>
                    </div>
                </div>

                {/* List Container: Premium Glass UI */}
                <div className="bg-white/40 backdrop-blur-3xl p-1 md:p-10 rounded-[4rem] border border-white shadow-2xl relative">
                    <div className="absolute top-10 right-10 flex gap-2">
                        <div className="w-2 h-2 bg-slate-200 rounded-full" />
                        <div className="w-2 h-2 bg-slate-200 rounded-full" />
                        <div className="w-2 h-2 bg-slate-200 rounded-full" />
                    </div>
                    <ActionItemsList />
                </div>
            </div>

            <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
      `}</style>
        </div>
    );
};

export default SavedActionItems;

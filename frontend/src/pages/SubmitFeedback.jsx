import React from 'react';
import { useNavigate } from 'react-router-dom';
import FeedbackSubmissionForm from '../components/FeedbackSubmissionForm';
import { ArrowLeft, BrainCircuit, Sparkles, MessageSquare } from 'lucide-react';

const SubmitFeedback = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 font-sans p-6 md:p-14 relative overflow-hidden flex flex-col items-center">
            {/* Soft Ambient Light Decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] aspect-square bg-indigo-100/30 rounded-full blur-[160px] pointer-events-none -translate-y-1/2 animate-pulse-glow" />
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-100/20 rounded-full blur-[120px] animate-blob pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-100/20 rounded-full blur-[100px] animate-blob animation-delay-2000 pointer-events-none" />

            <div className="max-w-4xl w-full relative z-10 space-y-16">
                {/* Minimal Header */}
                <div className="flex justify-between items-start">
                    <button
                        type="button"
                        onClick={() => navigate('/home')}
                        className="group flex items-center gap-3 bg-white text-slate-500 px-6 py-4 rounded-2xl hover:text-indigo-600 transition-all shadow-sm border border-slate-100 font-bold text-xs uppercase tracking-widest cursor-pointer z-50"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Cancel
                    </button>
                    <div className="flex flex-col items-end gap-2">
                        <div className="p-4 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-200 hover:scale-110 transition-transform hover-lift animate-pulse-glow">
                            <BrainCircuit className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mr-1">Neural Node 01</span>
                    </div>
                </div>

                {/* Hero Section of the Form */}
                <div className="space-y-6 text-center animate-slide-up">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-full border border-slate-100 shadow-sm mb-6 hover:shadow-md transition-all hover-lift">
                        <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse-glow" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">AI Synthesis Enabled</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none">
                        New <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 animate-gradient">Insight</span>.
                    </h1>
                    <p className="text-slate-500 text-xl font-medium max-w-xl mx-auto leading-relaxed">
                        Input raw customer feedback and let our neural engine generate an implementation strategy.
                    </p>
                </div>

                {/* Form Wrapper: Large Premium Card */}
                <div className="bg-white/70 backdrop-blur-3xl p-10 md:p-20 rounded-[4rem] border border-white shadow-2xl relative hover-lift shine overflow-hidden group">
                    {/* Decorative Elements */}
                    <div className="absolute top-10 left-10 text-indigo-100 animate-float">
                        <MessageSquare className="w-20 h-20 rotate-12 opacity-30 group-hover:opacity-50 transition-opacity" />
                    </div>
                    <div className="absolute bottom-10 right-10 text-purple-100 animate-float" style={{ animationDelay: '1s' }}>
                        <BrainCircuit className="w-16 h-16 -rotate-12 opacity-20 group-hover:opacity-40 transition-opacity" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 via-purple-50/0 to-blue-50/0 group-hover:from-indigo-50/30 group-hover:via-purple-50/20 group-hover:to-blue-50/30 transition-all duration-1000" />
                    <div className="relative z-10">
                        <FeedbackSubmissionForm onSuccess={() => navigate('/dashboard')} />
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .form-animate {
          animation: slide-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
        </div>
    );
};

export default SubmitFeedback;

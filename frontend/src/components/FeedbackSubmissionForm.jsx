import React, { useState } from 'react';
import { Send, CheckCircle2, Sparkles, MessageSquare, Bug, BrainCircuit, AlertCircle, XCircle, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

const FeedbackSubmissionForm = ({ onSuccess }) => {
    const [feedbackType, setFeedbackType] = useState('Feature Request');
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [implementedFeature, setImplementedFeature] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatingPlan, setGeneratingPlan] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleGeneratePlan = async () => {
        if (!description.trim() || description.trim().length < 10) {
            setError('Please provide a detailed description (at least 10 characters) before generating the plan.');
            return;
        }

        setGeneratingPlan(true);
        setError('');

        try {
            const response = await api.generateImplementationPlan(feedbackType, description);
            if (response.data && response.data.implementationPlan) {
                setImplementedFeature(response.data.implementationPlan);
                setError('');
            } else {
                setError('Failed to generate implementation plan. Unexpected response format.');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.response?.data?.details || err.message || 'Failed to generate implementation plan.';
            setError(errorMessage);
        } finally {
            setGeneratingPlan(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!description.trim() || !implementedFeature.trim()) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await api.submitFeedbackForm(feedbackType, description, implementedFeature, productName);
            setSuccess(true);

            setTimeout(() => {
                setDescription('');
                setImplementedFeature('');
                setProductName('');
                setSuccess(false);
                if (onSuccess) onSuccess();
            }, 2000);
        } catch (err) {
            setError('Failed to create action item. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="space-y-12">
                {/* 1. Feedback Type Selection Cards */}
                <div className="space-y-6">
                    <label className="text-[11px] font-black text-slate-800 uppercase tracking-[0.4em] ml-1">
                        Select Ingestion Type
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { id: 'Feature Request', icon: <Sparkles />, desc: 'Concept or Improvement Suggestion', color: 'sky' },
                            { id: 'Bug Report', icon: <Bug />, desc: 'Technical Anomaly or Error', color: 'rose' }
                        ].map((type) => (
                            <button
                                key={type.id}
                                type="button"
                                onClick={() => setFeedbackType(type.id)}
                                className={`group relative p-8 rounded-[2.5rem] border-2 transition-all duration-500 text-left flex items-center gap-6 ${feedbackType === type.id
                                        ? `bg-white border-sky-200 shadow-[0_20px_50px_rgba(14,165,233,0.1)] scale-[1.02]`
                                        : 'bg-white/40 border-sky-100 hover:border-sky-200 hover:bg-white/60'
                                    }`}
                            >
                                <div className={`p-4 rounded-2xl transition-all duration-500 ${feedbackType === type.id
                                        ? `bg-sky-500 text-white shadow-lg shadow-sky-500/50`
                                        : 'bg-white/5 text-slate-500 group-hover:bg-white/10 group-hover:text-slate-300'
                                    }`}>
                                    {React.cloneElement(type.icon, { className: "w-7 h-7" })}
                                </div>
                                <div>
                                    <h4 className={`font-black text-xl tracking-tight transition-colors ${feedbackType === type.id ? 'text-sky-900' : 'text-slate-500'}`}>
                                        {type.id}
                                    </h4>
                                    <p className="text-[10px] font-black text-sky-600/60 uppercase tracking-widest mt-1">{type.desc}</p>
                                </div>
                                {feedbackType === type.id && (
                                    <div className="absolute top-6 right-8 text-sky-500">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 1.5 Product Name (Optional) */}
                <div className="space-y-6 group">
                    <div className="flex items-center justify-between ml-1">
                        <label className="text-[11px] font-black text-slate-800 uppercase tracking-[0.4em]">
                            Product Name (Optional)
                        </label>
                    </div>

                    <div className="relative group/input">
                        <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder="Manually enter product name (e.g. Mouni) or leave blank for AI to infer"
                            className="w-full px-8 py-5 bg-white/60 backdrop-blur-3xl border-2 border-sky-100 rounded-full focus:outline-none focus:border-sky-400/50 focus:ring-[8px] focus:ring-sky-500/5 transition-all text-slate-900 font-bold placeholder:text-slate-400 shadow-lg group-hover/input:bg-white"
                        />
                    </div>
                </div>

                {/* 2. Description Section */}
                <div className="space-y-6 group">
                    <div className="flex items-center justify-between ml-1">
                        <label className="text-[11px] font-black text-slate-800 uppercase tracking-[0.4em]">
                            Verbatim Insight
                        </label>
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${description.length >= 10 ? 'bg-sky-500/10 text-sky-600' : 'bg-slate-100 text-slate-400'}`}>
                            {description.length} Characters
                        </span>
                    </div>

                    <div className="relative group/input">
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter the raw customer feedback here..."
                            rows={5}
                            className="w-full px-8 py-7 bg-white/60 backdrop-blur-3xl border-2 border-sky-100 rounded-[2.5rem] focus:outline-none focus:border-sky-400/50 focus:ring-[12px] focus:ring-sky-500/5 transition-all text-slate-900 font-bold placeholder:text-slate-400 resize-none shadow-xl group-hover/input:bg-white"
                            required
                        />
                        <div className="absolute top-7 right-8 text-sky-200 group-hover/input:text-sky-400 transition-colors">
                            <MessageSquare className="w-7 h-7" />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="button"
                            onClick={handleGeneratePlan}
                            disabled={!description.trim() || description.trim().length < 10 || generatingPlan}
                            className="group relative flex items-center gap-4 px-10 py-5 bg-sky-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-20 disabled:hover:scale-100 shadow-xl shadow-sky-900/20"
                        >
                            <span className="relative flex items-center gap-3">
                                {generatingPlan ? (
                                    <BrainCircuit className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                )}
                                {generatingPlan ? 'Synthesizing...' : 'Generate Implementation Strategy'}
                            </span>
                        </button>
                    </div>
                </div>

                {/* 3. AI Generated (or Manual) Plan Section */}
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <label className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] ml-1 flex items-center gap-2">
                            <BrainCircuit className="w-4 h-4" />
                            AI Synthesis: Strategic Implementation
                        </label>

                        <div className="relative group/plan">
                            <div className="absolute -inset-1 bg-gradient-to-r from-sky-400 to-indigo-400 rounded-[2.7rem] blur opacity-10 group-hover/plan:opacity-20 transition-opacity duration-1000" />
                            <textarea
                                value={implementedFeature}
                                onChange={(e) => setImplementedFeature(e.target.value)}
                                placeholder="Awaiting AI strategic output, or paste your own plan here..."
                                rows={8}
                                className={`relative w-full px-8 py-7 bg-white/80 backdrop-blur-3xl border-2 rounded-[2.5rem] focus:outline-none focus:border-sky-400/50 focus:ring-8 focus:ring-sky-500/5 transition-all text-slate-900 font-bold leading-relaxed shadow-xl ${generatingPlan ? 'border-dashed border-sky-400/30 animate-pulse' : 'border-sky-100'
                                    }`}
                                required
                                disabled={generatingPlan}
                            />
                            {!generatingPlan && (
                                <div className="absolute bottom-6 right-8 flex items-center gap-2 px-4 py-1.5 bg-sky-50 rounded-full border border-sky-200 backdrop-blur-md">
                                    <Sparkles className="w-4 h-4 text-sky-500" />
                                    <span className="text-[9px] font-black text-sky-600 uppercase tracking-[0.2em]">Verified Insight</span>
                                </div>
                            )}
                        </div>
                    </div>
                {/* Feedback Messages */}
                {error && (
                    <div className="flex items-center gap-4 p-6 bg-rose-500/10 border border-rose-500/20 rounded-[2rem] text-rose-400 animate-in shake duration-500">
                        <XCircle className="w-6 h-6 flex-shrink-0" />
                        <p className="text-sm font-black tracking-tight">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="flex items-center gap-4 p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] text-emerald-400 animate-in zoom-in duration-700 shadow-2xl shadow-emerald-500/5">
                        <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/40">
                            <CheckCircle2 className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <p className="text-lg font-black tracking-tight uppercase">Strategy Committed</p>
                            <p className="text-xs font-bold opacity-60 uppercase tracking-widest mt-1">Saved to strategic roadmap</p>
                        </div>
                    </div>
                )}

                {/* 4. Final Submit Button */}
                {!success && (
                    <button
                        type="submit"
                        disabled={loading || !description.trim() || !implementedFeature.trim()}
                        className="group relative w-full h-20 bg-gradient-to-r from-sky-600 to-blue-700 rounded-[2.5rem] overflow-hidden transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-20 disabled:hover:scale-100 shadow-2xl shadow-sky-500/20"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        <div className="relative flex items-center justify-center gap-4">
                            {loading ? (
                                <div className="w-7 h-7 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span className="text-white font-black text-lg uppercase tracking-[0.4em]">Initialize Roadmap Item</span>
                                    <ArrowRight className="w-6 h-6 text-sky-200 group-hover:translate-x-3 transition-transform duration-500" />
                                </>
                            )}
                        </div>
                    </button>
                )}
            </form>
        </div>
    );
};

export default FeedbackSubmissionForm;

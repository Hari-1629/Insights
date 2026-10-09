import React, { useState, useRef } from 'react';
import { X, Sparkles, Upload, FileText, AlertCircle, CheckCircle2, CloudLightning, MessageSquare } from 'lucide-react';

const IngestModal = ({ isOpen, onClose, onIngest, loading }) => {
    const [text, setText] = useState('');
    const [productName, setProductName] = useState('');
    const [dragging, setDragging] = useState(false);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleFile = async (file) => {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const content = e.target.result;
            let feedbacks = [];

            if (file.name.endsWith('.csv')) {
                feedbacks = content.split(/\r?\n/)
                    .map(line => line.trim())
                    .filter(line => line.length > 0);
            } else {
                feedbacks = content.split(/\n\s*\n/)
                    .map(line => line.trim())
                    .filter(line => line.length > 0);
            }

            if (feedbacks.length > 0) {
                // If its a file, we treat them as individual texts with the specified product name
                const feedbacksWithProduct = feedbacks.map(f => ({
                    text: f,
                    productName: productName || 'Not Specified'
                }));
                onIngest(feedbacksWithProduct);
                setText('');
                setProductName('');
            }
        };
        reader.readAsText(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    const handleSubmit = () => {
        if (!text.trim()) return;
        onIngest([{
            text,
            productName: productName || 'Not Specified'
        }]);
        setText('');
        setProductName('');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-300">
            {/* Backdrop with Soft light translucency */}
            <div
                className="absolute inset-0 bg-slate-100/40 backdrop-blur-xl transition-all"
                onClick={onClose}
            />

            <div className="relative w-full max-w-2xl bg-white backdrop-blur-3xl border border-sky-200 rounded-[3.5rem] shadow-[0_32px_128px_-32px_rgba(186,230,253,0.8)] overflow-hidden animate-in zoom-in-95 duration-500 max-h-[90vh] flex flex-col">
                {/* Visual Accent: Signature Sky Gradient */}
                <div className="absolute top-0 inset-x-0 h-2.5 bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 z-20" />

                <div className="flex-1 overflow-y-auto custom-scrollbar px-10 py-12 md:px-14 md:py-16 space-y-12">
                    {/* Header Section */}
                    <div className="flex justify-between items-start">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-sky-50 rounded-[1.5rem] flex items-center justify-center shadow-md border border-sky-100 group">
                                    <MessageSquare className="w-8 h-8 text-sky-600 group-hover:scale-110 transition-transform" />
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                                    Feedback <span className="text-sky-500">Submission</span> Form
                                </h2>
                            </div>
                            <p className="text-[10px] font-black text-sky-700 uppercase tracking-[0.4em] ml-1">
                                AI-Powered Insight Ingestion
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-slate-50 hover:bg-slate-100 text-slate-400 p-4 rounded-2xl transition-all hover:rotate-90 border border-slate-100 shadow-sm"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Input Sections Grid */}
                    <div className="grid grid-cols-1 gap-12">
                        {/* 1. Manual Entry */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-800 uppercase tracking-[0.4em] ml-1 flex items-center gap-3">
                                        <Sparkles className="w-4 h-4 text-sky-500" />
                                        Product / Feature Name
                                    </label>
                                    <input
                                        type="text"
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                        placeholder="e.g., Headphones X100"
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-sky-500 focus:ring-8 focus:ring-sky-500/5 transition-all text-slate-900 font-bold placeholder:text-slate-400 shadow-sm"
                                    />
                                </div>
                            </div>

                            <label className="text-[11px] font-black text-slate-800 uppercase tracking-[0.4em] ml-1 flex items-center gap-3">
                                <FileText className="w-4 h-4 text-sky-500" />
                                Manual Ingestion
                            </label>
                            <div className="group relative">
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Paste raw insight verbatim..."
                                    className="w-full h-44 px-8 py-6 bg-slate-50 border-2 border-slate-200 rounded-[2.5rem] focus:outline-none focus:border-sky-500 focus:ring-[16px] focus:ring-sky-500/5 transition-all text-slate-900 font-bold placeholder:text-slate-400 resize-none shadow-sm"
                                />
                                <div className="absolute top-6 right-8 text-sky-200 group-hover:text-sky-400 transition-colors">
                                    <Sparkles className="w-7 h-7" />
                                </div>
                                <div className="absolute bottom-6 right-8 px-4 py-1.5 bg-white rounded-full border border-sky-100 text-[9px] font-black text-sky-600 uppercase tracking-[0.2em] shadow-sm">
                                    {text.length} Verbatim characters
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="relative flex items-center justify-center">
                            <div className="absolute inset-x-0 h-px bg-slate-200" />
                            <div className="relative px-8 py-2 bg-white border border-slate-200 rounded-full text-[10px] font-black text-sky-600 uppercase tracking-[0.5em] shadow-sm">
                                Or
                            </div>
                        </div>

                        {/* 2. Batch Dropzone */}
                        <div className="space-y-6">
                            <label className="text-[11px] font-black text-slate-800 uppercase tracking-[0.4em] ml-1 flex items-center gap-3">
                                <Upload className="w-4 h-4 text-sky-500" />
                                Systemic Upload
                            </label>
                            <div
                                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`
                                    group relative border-4 border-dashed rounded-[3rem] p-16 flex flex-col items-center justify-center gap-8 transition-all duration-700 cursor-pointer overflow-hidden
                                    ${dragging
                                        ? 'border-sky-500 bg-sky-50 scale-[1.02] shadow-[0_0_80px_rgba(14,165,233,0.1)]'
                                        : 'border-slate-100 bg-slate-50/50 hover:border-sky-200 hover:bg-white'
                                    }
                                `}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={(e) => handleFile(e.target.files[0])}
                                    className="hidden"
                                    accept=".csv,.txt"
                                />

                                <div className={`
                                    w-24 h-24 rounded-[2rem] flex items-center justify-center transition-all duration-700
                                    ${dragging
                                        ? 'bg-sky-500 text-white shadow-[0_20px_60px_rgba(14,165,233,0.4)] rotate-12 scale-110'
                                        : 'bg-white text-slate-300 group-hover:text-sky-500 group-hover:bg-sky-50 border border-slate-100 shadow-sm'
                                    }
                                `}>
                                    <Upload className={`w-10 h-10 transition-transform duration-700 ${dragging ? 'animate-bounce' : 'group-hover:-translate-y-2'}`} />
                                </div>
                                <div className="text-center space-y-3 relative z-10" >
                                    <p className="text-slate-900 font-black text-2xl tracking-tighter" >
                                        {dragging ? 'Commence Intake' : 'Dragg & Drop Files'}
                                    </p>
                                    <p className="text-sky-600/60 text-[10px] font-black uppercase tracking-[0.3em]">
                                        Compatible: .CSV | .TXT
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-col sm:flex-row justify-end gap-6 pt-6" >
                        <button
                            onClick={onClose}
                            className="px-10 py-5 text-slate-400 hover:text-slate-900 font-black text-xs uppercase tracking-[0.3em] transition-all rounded-[1.5rem] hover:bg-slate-100"
                        >
                            Abort
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!text.trim() || loading}
                            className="group relative px-12 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-20 shadow-xl shadow-slate-900/10"
                        >
                            <div className="relative flex items-center gap-4">
                                {loading ? (
                                    <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Sparkles className="w-6 h-6 transition-transform group-hover:rotate-12 text-sky-400" />
                                )}
                                {loading ? 'Synthesizing...' : 'Analyze Insight'}
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .bg-radial-gradient {
                    background: radial-gradient(circle at center, var(--tw-gradient-from), transparent 70%);
                }
                @keyframes gradient-x {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient-x {
                    animation: gradient-x 3s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default IngestModal;

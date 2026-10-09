import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, ListTodo, MessageSquare, BrainCircuit, ShieldAlert, ArrowLeft, Sparkles, TrendingUp, Swords } from 'lucide-react';
import ProductTypeAnalysisModal from '../components/ProductTypeAnalysisModal';
import CommonComplaintsModal from '../components/CommonComplaintsModal';
import TrendAnalysisModal from '../components/TrendAnalysisModal';
import CompetitiveSnapshotModal from '../components/CompetitiveSnapshotModal';

const Home = () => {
    const navigate = useNavigate();
    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
    const [isComplaintsModalOpen, setIsComplaintsModalOpen] = useState(false);
    const [isTrendsModalOpen, setIsTrendsModalOpen] = useState(false);
    const [isCompetitiveModalOpen, setIsCompetitiveModalOpen] = useState(false);

    const modules = [
        {
            title: 'Intelligence Analytics',
            desc: 'Real-time sentiment telemetry and KPI tracking',
            icon: <LayoutDashboard className="w-10 h-10 text-white" />,
            action: () => navigate('/dashboard'),
            gradient: 'from-indigo-600 to-indigo-400',
            shadow: 'shadow-indigo-500/40'
        },
        {
            title: 'Critical Issue Intelligence',
            desc: 'Identify and prioritize recurring systemic friction points',
            icon: <ShieldAlert className="w-10 h-10 text-white" />,
            action: () => setIsComplaintsModalOpen(true),
            gradient: 'from-rose-600 to-orange-500',
            shadow: 'shadow-rose-500/40'
        },
        {
            title: 'Strategic Roadmap',
            desc: 'Curated implementation pipeline for analyzed feedback',
            icon: <ListTodo className="w-10 h-10 text-white" />,
            action: () => navigate('/saved-action-items'),
            gradient: 'from-blue-600 to-cyan-500',
            shadow: 'shadow-blue-500/40'
        },
        {
            title: 'Segmental Product Analysis',
            desc: 'Multi-vector classification of feedback across product lines',
            icon: <BrainCircuit className="w-10 h-10 text-white" />,
            action: () => setIsAnalysisModalOpen(true),
            gradient: 'from-fuchsia-600 to-purple-500',
            shadow: 'shadow-purple-500/40'
        },
        {
            title: 'Insight Synthesis',
            desc: 'Transform raw qualitative data into technical action items',
            icon: <MessageSquare className="w-10 h-10 text-white" />,
            action: () => navigate('/submit-feedback'),
            gradient: 'from-emerald-600 to-teal-500',
            shadow: 'shadow-emerald-500/40'
        },
        {
            title: 'Product Trends',
            desc: 'Monitor sentiment shifts and anomaly detection over time',
            icon: <TrendingUp className="w-10 h-10 text-white" />,
            action: () => setIsTrendsModalOpen(true),
            gradient: 'from-violet-600 to-purple-500',
            shadow: 'shadow-violet-500/40'
        },
        {
            title: 'Competitive Snapshot',
            desc: 'Compare feedback with competitors to identify strengths & weaknesses',
            icon: <Swords className="w-10 h-10 text-white" />,
            action: () => setIsCompetitiveModalOpen(true),
            gradient: 'from-pink-600 to-rose-400',
            shadow: 'shadow-pink-500/40'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#8b5cf6] via-[#a855f7] to-[#d946ef] p-6 md:p-12 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-[120px] animate-blob" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-300/20 rounded-full blur-[100px] animate-blob animation-delay-2000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-300/10 rounded-full blur-[140px] animate-pulse-glow" />
            </div>

            {/* Header Section */}
            <div className="max-w-7xl mx-auto mb-16 relative z-20">
                <div className="flex justify-between items-start w-full relative">
                    <button
                        onClick={() => navigate('/')}
                        className="group flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-6 py-2.5 rounded-xl border border-white/20 hover:bg-white/20 hover:scale-105 transition-all font-bold text-sm hover-lift cursor-pointer z-50"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
                    </button>

                    <div className="flex flex-col items-center text-center flex-1 pr-[100px] animate-slide-up">
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full border-2 border-white/30 flex items-center justify-center mb-8 animate-float shadow-2xl">
                            <Sparkles className="w-10 h-10 text-white animate-pulse-glow" />
                        </div>
                        <h1 className="text-7xl md:text-8xl font-black text-white tracking-tighter mb-4 drop-shadow-2xl">
                            Insightful
                        </h1>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 drop-shadow-lg text-nowrap">
                            AI-Powered Customer Feedback Analysis Platform
                        </h2>
                        <p className="text-white/80 text-lg md:text-xl max-w-2xl font-medium leading-relaxed drop-shadow">
                            Transform customer feedback into actionable insights with the power of artificial intelligence
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto w-full flex flex-wrap justify-center gap-8 relative z-10">
                {modules.map((item, idx) => (
                    <button
                        key={idx}
                        onClick={item.action}
                        className="bg-white rounded-[3rem] p-12 flex flex-col items-center text-center transition-all duration-500 hover:scale-[1.05] shadow-2xl hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.4)] group w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.5rem)] min-w-[300px] hover-lift shine relative overflow-hidden"
                        style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className={`w-20 h-20 bg-gradient-to-br ${item.gradient} rounded-[2.5rem] flex items-center justify-center mb-8 ${item.shadow} shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 relative z-10 group-hover:shadow-2xl`}>
                            {item.icon}
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight relative z-10 group-hover:text-indigo-600 transition-colors">
                            {item.title}
                        </h3>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-[220px] relative z-10 group-hover:text-slate-700 transition-colors">
                            {item.desc}
                        </p>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity transform scale-x-0 group-hover:scale-x-100 origin-center duration-500" />
                    </button>
                ))}
            </div>

            <ProductTypeAnalysisModal
                isOpen={isAnalysisModalOpen}
                onClose={() => setIsAnalysisModalOpen(false)}
            />

            <CommonComplaintsModal
                isOpen={isComplaintsModalOpen}
                onClose={() => setIsComplaintsModalOpen(false)}
            />

            <TrendAnalysisModal
                isOpen={isTrendsModalOpen}
                onClose={() => setIsTrendsModalOpen(false)}
            />

            <CompetitiveSnapshotModal
                isOpen={isCompetitiveModalOpen}
                onClose={() => setIsCompetitiveModalOpen(false)}
            />
        </div>
    );
};

export default Home;

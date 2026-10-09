import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import SearchBar from '../components/SearchBar';
import SentimentChart from '../components/SentimentChart';
import FeedbackTable from '../components/FeedbackTable';
import ActionItemModal from '../components/ActionItemModal';
import IngestModal from '../components/IngestModal';
import TrendCard from '../components/TrendCard';
import { UploadCloud, Plus, Trash2, ArrowLeft, Sparkles, MessageSquare, Zap, Activity, ShieldAlert, ArrowRight, TrendingUp } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState([]);
    const [actionItem, setActionItem] = useState(null);
    const [currentFeedback, setCurrentFeedback] = useState(null);
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [trends, setTrends] = useState([]);
    const [stats, setStats] = useState({
        totalCount: 0,
        sentiments: { Positive: 0, Neutral: 0, Negative: 0 },
        actionItemsCount: 0
    });

    useEffect(() => {
        fetchInitialData();
    }, []);


    const fetchInitialData = async () => {
        try {
            const feedbackRes = await api.getRecentFeedback();
            const rawData = feedbackRes.data;
            const recentFeedback = Array.isArray(rawData) ? rawData : rawData?.items || [];
            setFeedback(recentFeedback);

            try {
                const statsRes = await api.getFeedbackStats();
                if (statsRes.data && statsRes.data.totalCount > 0) {
                    setStats(statsRes.data);
                } else {
                    // Fallback calculation if backend stats are empty/zero
                    const localStats = calculateLocalStats(recentFeedback);
                    setStats(localStats);
                }
            } catch (statsError) {
                console.warn("Stats API failed, falling back to local calculation", statsError);
                const localStats = calculateLocalStats(recentFeedback);
                setStats(localStats);
            }

            // Fetch trends
            const trendsRes = await api.getTrendAnalysis();
            setTrends(Array.isArray(trendsRes.data) ? trendsRes.data : []);
        } catch (error) {
            console.log("Error fetching initial data", error);
        }
    };

    const calculateLocalStats = (data) => {
        const list = Array.isArray(data) ? data : data?.items || [];
        const sentimentCounts = list.reduce((acc, f) => {
            const key = f.sentiment ? f.sentiment.charAt(0).toUpperCase() + f.sentiment.slice(1).toLowerCase() : 'Neutral';
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, { Positive: 0, Neutral: 0, Negative: 0 });

        const actionItemsCount = list.filter(f => f.actionItem).length;

        return {
            totalCount: list.length,
            sentiments: sentimentCounts,
            actionItemsCount
        };
    };

    const handleSearch = async (query) => {
        if (!query || !query.trim()) {
            alert('Please enter a search query');
            return;
        }

        setLoading(true);
        try {
            const res = await api.searchFeedback(query);
            if (res.data && res.data.sources && res.data.sources.length > 0) {
                const mappedFeedback = res.data.sources.map(s => ({
                    _id: s.id,
                    text: s.text,
                    summary: s.text.substring(0, 100) + '...',
                    sentiment: s.sentiment || 'Neutral',
                    category: s.category || 'Search Result',
                    productName: s.productName || 'Not Specified'
                }));
                setFeedback(mappedFeedback);
                if (res.data.answer) {
                    alert(`AI Answer: ${res.data.answer}`);
                }
            } else {
                alert('No results found.');
            }
        } catch (error) {
            console.error("Search error", error);
        } finally {
            setLoading(false);
        }
    };

    const handleIngestMock = async () => {
        setLoading(true);
        const mockFeedbacks = [
            "The new dark mode is amazing, I love the contrast!",
            "The app crashes when I try to upload a PDF file."
        ];
        try {
            await api.ingestFeedback(mockFeedbacks);
            fetchInitialData();
        } catch (error) {
            console.error("Ingest error", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateAction = async (item) => {
        if (item.actionItem && item.actionItem.title) {
            setActionItem(item.actionItem);
            setIsActionModalOpen(true);
            return;
        }

        setLoading(true);
        try {
            const res = await api.generateActionItem(item.text);
            setActionItem(res.data);
            setCurrentFeedback(item);
            setIsActionModalOpen(true);
        } catch (error) {
            console.error("Action Item error", error);
        } finally {
            setLoading(false);
        }
    };

    const handleManualIngest = async (data) => {
        setLoading(true);
        try {
            await api.ingestFeedback(data);
            setIsIngestModalOpen(false);
            fetchInitialData();
        } catch (error) {
            console.error("Manual ingest error", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteFeedback = async (id) => {
        if (!confirm("Are you sure?")) return;
        setLoading(true);
        try {
            await api.deleteFeedback(id);
            setFeedback(prev => prev.filter(item => item._id !== id));
            fetchInitialData();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleClearData = async () => {
        if (!confirm("Clear ALL data?")) return;
        setLoading(true);
        try {
            await api.clearFeedback();
            setFeedback([]);
            setStats({ totalCount: 0, sentiments: { Positive: 0, Neutral: 0, Negative: 0 }, actionItemsCount: 0 });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadAnalysis = () => {
        try {
            const doc = new jsPDF();

            // Add Title
            doc.setFontSize(20);
            doc.setTextColor(40, 40, 40);
            doc.text("Insightful - Feedback Analysis Report", 14, 22);

            // Add Date
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 28);

            // Add Summary Stats
            doc.setFontSize(12);
            doc.setTextColor(40, 40, 40);
            doc.text(`Total Feedback Items: ${stats.totalCount}`, 14, 38);
            doc.text(`Positive: ${stats.sentiments.Positive}`, 14, 44);
            doc.text(`Neutral: ${stats.sentiments.Neutral}`, 14, 50);
            doc.text(`Negative: ${stats.sentiments.Negative}`, 14, 56);

            // Define Table Columns
            const tableColumn = ["Feedback", "Sentiment", "Product", "Analysis"];

            // Prepare Table Data
            const tableRows = [];
            feedback.forEach(item => {
                const rowData = [
                    item.text.length > 50 ? item.text.substring(0, 50) + "..." : item.text,
                    item.sentiment || 'Neutral',
                    item.productName || 'Not Specified',
                    item.summary || 'N/A'
                ];
                tableRows.push(rowData);
            });

            // Add Table to PDF
            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 66,
                theme: 'grid',
                styles: { fontSize: 8, cellPadding: 2 },
                headStyles: { fillColor: [79, 70, 229] }, // Indigo-600 color
            });

            // Save the PDF
            doc.save("Insightful_Analysis_Report.pdf");
        } catch (error) {
            console.error("PDF Generation Error:", error);
            alert("Failed to generate PDF. Please check console for details.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans relative overflow-hidden flex flex-col p-6 md:p-10">
            {/* Premium Decorative Light Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-indigo-100/40 rounded-full blur-[120px] animate-blob" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[700px] h-[700px] bg-purple-100/40 rounded-full blur-[120px] animate-blob animation-delay-2000" />
            </div>

            <div className="max-w-7xl mx-auto w-full relative z-10 space-y-12">
                {/* Refined High-Visibility Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-10">
                    <div className="space-y-6 flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100 mb-2">
                            <Sparkles className="w-3 h-3 text-indigo-600" />
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none">Intelligence Hub</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.85]">
                            Feedback <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600">Analytics</span>
                        </h1>
                        <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                            Transform raw customer sentiment into a technical strategic roadmap with AI.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/home')}
                            className="group flex items-center gap-3 bg-white text-slate-600 px-6 py-4 rounded-2xl transition-all duration-300 shadow-sm border border-slate-200 font-bold text-sm hover:text-indigo-600 hover:border-indigo-100 active:scale-95 cursor-pointer z-50"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Portal Home
                        </button>
                        <button
                            onClick={() => setIsIngestModalOpen(true)}
                            className="group relative flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl transition-all duration-300 shadow-2xl hover:bg-indigo-600 font-black text-xs uppercase tracking-widest transform hover:-translate-y-1 active:scale-95 overflow-hidden shine"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                                Ingest Data
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity animate-gradient" />
                        </button>
                    </div>
                </div>



                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { label: 'Total Feedback', value: stats.totalCount, icon: <MessageSquare />, color: 'indigo' },
                        { label: 'Positive Ratio', value: `${stats.totalCount > 0 ? Math.round((stats.sentiments.Positive / stats.totalCount) * 100) : 0}%`, icon: <Sparkles />, color: 'emerald' },
                        { label: 'Actionable Items', value: stats.actionItemsCount, icon: <Zap />, color: 'purple' },
                        { label: 'Neural Precision', value: '98.4%', icon: <Activity />, color: 'blue' }
                    ].map((metric, idx) => (
                        <div key={metric.label} className="bg-white/80 backdrop-blur-xl p-10 rounded-[3rem] border border-white shadow-2xl shadow-slate-200/50 group hover:scale-[1.05] transition-all duration-500 flex flex-col items-center text-center hover-lift shine relative overflow-hidden" style={{ animationDelay: `${idx * 0.1}s` }}>
                            <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className={`w-14 h-14 rounded-2xl mb-8 flex items-center justify-center transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 relative z-10 ${metric.color === 'indigo' ? 'bg-indigo-50 text-indigo-600 shadow-indigo-100 group-hover:bg-indigo-100 group-hover:shadow-lg group-hover:shadow-indigo-200' :
                                metric.color === 'emerald' ? 'bg-emerald-50 text-emerald-600 shadow-emerald-100 group-hover:bg-emerald-100 group-hover:shadow-lg group-hover:shadow-emerald-200' :
                                    metric.color === 'purple' ? 'bg-purple-50 text-purple-600 shadow-purple-100 group-hover:bg-purple-100 group-hover:shadow-lg group-hover:shadow-purple-200' : 'bg-blue-50 text-blue-600 shadow-blue-100 group-hover:bg-blue-100 group-hover:shadow-lg group-hover:shadow-blue-200'
                                } shadow-lg`}>
                                {React.cloneElement(metric.icon, { className: 'w-7 h-7' })}
                            </div>
                            <div className="text-5xl font-black text-slate-900 mb-2 tracking-tighter relative z-10 group-hover:text-indigo-600 transition-colors">{metric.value}</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] relative z-10">{metric.label}</div>
                        </div>
                    ))}
                </div>

                {/* Main Workspace */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    <div className="lg:col-span-8 space-y-10">
                        <div className="bg-white/90 backdrop-blur-xl rounded-[3rem] p-4 shadow-3xl border border-white hover:shadow-indigo-500/5 transition-all">
                            <SearchBar onSearch={handleSearch} loading={loading} />
                        </div>
                        <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-2 shadow-2xl shadow-slate-200/50 border border-white overflow-hidden">
                            <FeedbackTable
                                feedback={feedback}
                                onGenerateAction={handleGenerateAction}
                                onDelete={handleDeleteFeedback}
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-10">
                        <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-8 shadow-2xl shadow-slate-200/50 border border-white">
                            <SentimentChart data={stats.sentiments} />
                        </div>

                        <div className="bg-indigo-600 rounded-[3rem] p-12 text-white shadow-3xl shadow-indigo-600/30 relative overflow-hidden group hover-lift">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-150 transition-transform duration-1000 animate-pulse-glow" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full -ml-16 -mb-16 blur-2xl group-hover:scale-125 transition-transform duration-1000" />
                            <h3 className="text-3xl font-black mb-6 relative z-10 tracking-tighter group-hover:scale-105 transition-transform">Export Analysis</h3>
                            <p className="text-indigo-100 text-sm font-medium mb-10 relative z-10 leading-relaxed">
                                Generate a professional intelligence report containing all current feedback sentiment trends.
                            </p>
                            <button
                                type="button"
                                onClick={handleDownloadAnalysis}
                                className="w-full py-5 bg-white text-indigo-600 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-xl active:scale-95 relative z-10 hover-lift shine overflow-hidden group/btn"
                            >
                                <span className="relative z-10">Download Analysis PDF</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                            </button>
                        </div>

                        <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[3rem] border border-white shadow-2xl shadow-slate-200/50">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">System Controls</h3>
                                <div className="p-3 bg-slate-50 rounded-2xl">
                                    <ShieldAlert className="w-5 h-5 text-slate-400" />
                                </div>
                            </div>
                            <div className="space-y-5">
                                <button
                                    onClick={handleIngestMock}
                                    disabled={loading}
                                    className="w-full flex items-center justify-between px-8 py-5 bg-slate-50 hover:bg-indigo-600 hover:text-white rounded-[2rem] text-slate-900 font-bold text-sm transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <UploadCloud className="w-6 h-6 text-indigo-600 group-hover:text-white" />
                                        Sample Data
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:translate-x-2 transition-transform group-hover:text-white" />
                                </button>
                                <button
                                    onClick={handleClearData}
                                    disabled={loading}
                                    className="w-full flex items-center justify-between px-8 py-5 bg-rose-50 hover:bg-rose-600 hover:text-white rounded-[2rem] text-rose-600 font-bold text-sm transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <Trash2 className="w-6 h-6" />
                                        Clear History
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-rose-300 group-hover:translate-x-2 transition-transform group-hover:text-white" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ActionItemModal
                isOpen={isActionModalOpen}
                onClose={() => setIsActionModalOpen(false)}
                actionItem={actionItem}
                feedbackText={currentFeedback?.text}
                feedbackId={currentFeedback?._id}
            />

            <IngestModal
                isOpen={isIngestModalOpen}
                onClose={() => setIsIngestModalOpen(false)}
                onIngest={handleManualIngest}
                loading={loading}
            />

            <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(40px, -60px) scale(1.1); }
                    66% { transform: translate(-30px, 30px) scale(0.9); }
                }
                .animate-blob {
                    animation: blob 10s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
        </div>
    );
};

export default Dashboard;

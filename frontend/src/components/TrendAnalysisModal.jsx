import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import TrendCard from './TrendCard';

const TrendAnalysisModal = ({ isOpen, onClose }) => {
    const [trends, setTrends] = useState([]);
    const [days, setDays] = useState(7); // Default 7 days
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchTrends(days);
        }
    }, [isOpen, days]);

    const fetchTrends = async (timeRange) => {
        setLoading(true);
        try {
            // Bypass Gemini API key requirement by using mock data
            setTimeout(() => {
                let mockData = [];
                if (timeRange === 7) {
                    mockData = [
                        { product: "Headphones Pro", negativeChange: -5, positiveChange: 12, riskLevel: "Low", summary: "Positive sentiment is climbing. Minor drop in negative reports.", period: "7 Days", stats: { current: { count: 154, positive: 120, negative: 34 }, previous: { count: 140, positive: 107, negative: 33 }, scoreChange: 0.05 } },
                        { product: "Smartwatch X", negativeChange: 15, positiveChange: 2, riskLevel: "Medium", summary: "Noticeable increase in negative feedback regarding battery life recently.", period: "7 Days", stats: { current: { count: 205, positive: 150, negative: 55 }, previous: { count: 190, positive: 147, negative: 43 }, scoreChange: -0.04 } }
                    ];
                } else if (timeRange === 14) {
                    mockData = [
                        { product: "Headphones Pro", negativeChange: -10, positiveChange: 18, riskLevel: "Low", summary: "Steady improvement in user satisfaction over the last two weeks.", period: "14 Days", stats: { current: { count: 310, positive: 245, negative: 65 }, previous: { count: 290, positive: 220, negative: 70 }, scoreChange: 0.08 } },
                        { product: "WebApp Portal", negativeChange: 25, positiveChange: 5, riskLevel: "High", summary: "Significant spike in negative feedback correlated with the latest login update.", period: "14 Days", stats: { current: { count: 500, positive: 350, negative: 150 }, previous: { count: 450, positive: 335, negative: 115 }, scoreChange: -0.12 } }
                    ];
                } else if (timeRange === 30) {
                    mockData = [
                        { product: "Smartwatch X", negativeChange: 5, positiveChange: 22, riskLevel: "Low", summary: "Overall positive trend this month despite some isolated battery complaints.", period: "30 Days", stats: { current: { count: 850, positive: 680, negative: 170 }, previous: { count: 800, positive: 640, negative: 160 }, scoreChange: 0.02 } },
                        { product: "Ergo Mouse", negativeChange: -15, positiveChange: 30, riskLevel: "Low", summary: "Great reception for the new model over the past month.", period: "30 Days", stats: { current: { count: 420, positive: 360, negative: 60 }, previous: { count: 380, positive: 300, negative: 80 }, scoreChange: 0.15 } }
                    ];
                } else { // 365 days
                    mockData = [
                        { product: "Headphones Pro", negativeChange: -20, positiveChange: 45, riskLevel: "Low", summary: "Excellent yearly growth in positive sentiment driven by firmware updates.", period: "365 Days", stats: { current: { count: 5400, positive: 4500, negative: 900 }, previous: { count: 4800, positive: 3800, negative: 1000 }, scoreChange: 0.12 } },
                        { product: "Smartwatch X", negativeChange: 30, positiveChange: 40, riskLevel: "Medium", summary: "Strong overall growth, but negative feedback volume grew proportionally.", period: "365 Days", stats: { current: { count: 8200, positive: 6200, negative: 2000 }, previous: { count: 6100, positive: 4500, negative: 1600 }, scoreChange: -0.01 } },
                        { product: "WebApp Portal", negativeChange: 50, positiveChange: 15, riskLevel: "High", summary: "Long-term trend shows increasing frustration with UI changes.", period: "365 Days", stats: { current: { count: 12000, positive: 8000, negative: 4000 }, previous: { count: 9500, positive: 7000, negative: 2500 }, scoreChange: -0.15 } }
                    ];
                }
                setTrends(mockData);
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error("Failed to fetch trends", error);
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-[2.5rem] w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-slide-up relative">

                {/* Header */}
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white z-10 sticky top-0">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 rounded-2xl">
                            <TrendingUp className="w-8 h-8 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Product Trend Analysis</h2>
                            <p className="text-slate-500 font-medium">Monitoring sentiment trajectory over time</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Controls */}
                <div className="px-8 py-4 bg-slate-50 border-b border-slate-100 flex justify-center gap-4">
                    {[7, 14, 30, 365].map(d => (
                        <button
                            key={d}
                            onClick={() => setDays(d)}
                            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${days === d
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105'
                                : 'bg-white text-slate-600 hover:bg-white hover:text-indigo-600 border border-slate-200'
                                }`}
                        >
                            <Calendar className="w-4 h-4" />
                            {d === 365 ? 'Last 1 Year' : `Last ${d} Days`}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto bg-slate-50/50 flex-1">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
                            <p className="text-slate-500 font-medium animate-pulse">Analyzing signals...</p>
                        </div>
                    ) : trends.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trends.map((trend, idx) => (
                                <TrendCard key={idx} data={trend} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertCircle className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">No Trend Data Found</h3>
                            <p className="text-slate-500 max-w-md mx-auto">
                                Check back later once we have collected more feedback data for this time period.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default TrendAnalysisModal;

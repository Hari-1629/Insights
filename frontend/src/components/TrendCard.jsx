import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, ShieldCheck, AlertOctagon, Activity } from 'lucide-react';

const TrendCard = ({ data }) => {
    // data structure: 
    // {
    //   product: "AirPods Pro",
    //   negativeChange: 20, // percentage
    //   positiveChange: -5, // percentage
    //   riskLevel: "High" | "Medium" | "Low",
    //   summary: "Negative feedback has spiked due to battery issues."
    // }

    const { product, negativeChange, positiveChange, riskLevel, summary, stats } = data;

    const getRiskColor = (level) => {
        switch (level) {
            case 'High': return 'text-rose-600';
            case 'Medium': return 'text-orange-500';
            case 'Low': return 'text-emerald-600';
            default: return 'text-slate-600';
        }
    };

    const renderChange = (value, isNegativeMetric) => {
        const isIncrease = value > 0;
        const isDecrease = value < 0;

        // Default Logic for colors
        // Negative Reviews: Increase = BAD (Red), Decrease = GOOD (Green)
        // Positive Reviews: Increase = GOOD (Green), Decrease = BAD (Red)

        let colorClass = 'text-slate-500';
        let arrow = '';

        if (isNegativeMetric) {
            if (isIncrease) { colorClass = 'text-rose-600'; arrow = '↑'; }
            else if (isDecrease) { colorClass = 'text-emerald-600'; arrow = '↓'; }
            else { arrow = '-'; }
        } else {
            if (isIncrease) { colorClass = 'text-emerald-600'; arrow = '↑'; }
            else if (isDecrease) { colorClass = 'text-rose-600'; arrow = '↓'; }
            else { arrow = '-'; }
        }

        return (
            <span className={`font-bold ${colorClass}`}>
                {value > 0 ? '+' : ''}{value}% {arrow}
            </span>
        );
    };

    return (
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] border border-white shadow-xl hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1 flex flex-col h-full">
            <h3 className="text-xl font-black text-slate-800 tracking-tight mb-4 flex items-center gap-2">
                📊 Trend Card
            </h3>

            <div className="space-y-3 flex-1">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-slate-500 font-medium">Product:</span>
                    <span className="font-bold text-slate-800">{product || 'Not Specified'}</span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-slate-500 font-medium">Negative Reviews:</span>
                    {renderChange(negativeChange, true)}
                </div>

                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-slate-500 font-medium">Positive Reviews:</span>
                    {renderChange(positiveChange, false)}
                </div>

                <div className="flex justify-between items-center pt-1">
                    <span className="text-slate-500 font-medium">Risk Level:</span>
                    <span className={`font-black uppercase tracking-wider ${getRiskColor(riskLevel)}`}>
                        {riskLevel}
                    </span>
                </div>

                {/* Optional: Show Sentiment Score if available */}
                {stats && stats.scoreChange && (
                    <div className="flex justify-between items-center pt-1 text-xs">
                        <span className="text-slate-400">Sentiment Score Change:</span>
                        <span className={`font-medium ${parseFloat(stats.scoreChange) < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {stats.scoreChange > 0 ? '+' : ''}{stats.scoreChange}
                        </span>
                    </div>
                )}
            </div>

            {summary && (
                <div className="mt-6 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-500 italic leading-relaxed">
                        "{summary}"
                    </p>
                </div>
            )}
        </div>
    );
};

export default TrendCard;

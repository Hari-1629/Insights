import React from 'react';
import { TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const ThemeCard = ({ theme }) => {
    const getIcon = () => {
        if (theme.sentiment === 'Negative') return <AlertCircle className="w-5 h-5 text-red-400" />;
        if (theme.sentiment === 'Positive') return <CheckCircle className="w-5 h-5 text-green-400" />;
        return <TrendingUp className="w-5 h-5 text-blue-400" />;
    };

    return (
        <div className="bg-surface p-6 rounded-xl border border-slate-700 shadow-lg hover:border-primary transition-colors">
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-100">{theme.theme}</h3>
                {getIcon()}
            </div>
            <p className="text-slate-400 text-sm">{theme.description}</p>
            <div className="mt-4 inline-block px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
                {theme.sentiment}
            </div>
        </div>
    );
};

export default ThemeCard;

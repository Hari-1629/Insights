import React from 'react';
import { MoreHorizontal, Zap, Trash2, ShieldAlert } from 'lucide-react';

const FeedbackTable = ({ feedback = [], onGenerateAction, onDelete }) => {
    const list = Array.isArray(feedback) ? feedback : feedback?.items || [];
    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Intelligence</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Live Feed • Neural Monitoring</p>
                </div>
                <div className="flex gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Feedback Node</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Product Vector</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Taxonomy</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Vector Sentiment</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Strategic Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {list.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-8 py-20 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <ShieldAlert className="w-10 h-10 text-slate-200" />
                                        <div className="text-slate-400 text-sm font-medium tracking-tight">No intelligence nodes detected. Begin ingestion to start analysis.</div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            list.map((item) => (
                                <tr key={item._id} className="hover:bg-slate-50/80 transition-all duration-300 group">
                                    <td className="px-8 py-6 max-w-md">
                                        <div className="text-slate-900 font-bold tracking-tight mb-1 group-hover:text-indigo-600 transition-colors">
                                            {item.summary || (item.text.length > 60 ? item.text.substring(0, 60) + '...' : item.text)}
                                        </div>
                                        <div className="text-xs text-slate-400 font-medium line-clamp-2 leading-relaxed">{item.text}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                                            <span className="text-slate-900 font-bold text-[10px] tracking-widest uppercase">
                                                {item.productName || 'Not Specified'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest border border-slate-200 group-hover:bg-white transition-colors">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm inline-flex items-center gap-2
                                            ${item.sentiment === 'Positive' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' :
                                                item.sentiment === 'Negative' ? 'text-rose-700 bg-rose-50 border-rose-100' :
                                                    'text-slate-500 bg-slate-50 border-slate-200'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${item.sentiment === 'Positive' ? 'bg-emerald-500' : item.sentiment === 'Negative' ? 'bg-rose-500' : 'bg-slate-400'}`} />
                                            {item.sentiment}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end items-center gap-3">
                                            <button
                                                onClick={() => onGenerateAction(item)}
                                                className={`group/btn relative px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 shadow-xl overflow-hidden active:scale-95
                                                    ${item.actionItem
                                                        ? 'bg-slate-900 text-white hover:bg-black'
                                                        : 'bg-indigo-600 text-white hover:bg-slate-900'}`}
                                            >
                                                <span className="relative z-10 flex items-center gap-2">
                                                    {item.actionItem ? 'View Logic' : <><Zap className="w-3.5 h-3.5" /> Initialize</>}
                                                </span>
                                            </button>
                                            <button
                                                onClick={() => onDelete(item._id)}
                                                className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                title="Purge Node"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FeedbackTable;

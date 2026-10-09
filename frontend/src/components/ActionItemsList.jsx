import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CheckCircle2, Clock, AlertTriangle, Trash2, Quote, Zap, Calendar, ArrowRight } from 'lucide-react';

const ActionItemsList = () => {
    const [actionItems, setActionItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActionItems();
    }, []);

    const fetchActionItems = async () => {
        try {
            const res = await api.getAllActionItems();
            setActionItems(res.data);
        } catch (error) {
            console.error('Failed to fetch action items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.updateActionItemStatus(id, newStatus);
            fetchActionItems(); // Refresh list
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const handleTeamChange = async (id, newTeamName) => {
        try {
            await api.updateActionItemTeam(id, newTeamName);
            // Intentionally not refreshing immediately to prevent losing focus
        } catch (error) {
            console.error('Failed to update team name:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this action item?')) return;

        try {
            await api.deleteActionItem(id);
            fetchActionItems(); // Refresh list
        } catch (error) {
            console.error('Failed to delete action item:', error);
        }
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'Completed':
                return {
                    icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
                    color: 'text-emerald-700 bg-emerald-50 border-emerald-100',
                    dot: 'bg-emerald-500'
                };
            case 'In Progress':
                return {
                    icon: <Clock className="w-5 h-5 text-indigo-500" />,
                    color: 'text-indigo-700 bg-indigo-50 border-indigo-100',
                    dot: 'bg-indigo-500'
                };
            default:
                return {
                    icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
                    color: 'text-amber-700 bg-amber-50 border-amber-100',
                    dot: 'bg-amber-500'
                };
        }
    };

    const getImpactStyle = (impact) => {
        switch (impact) {
            case 'High': return 'bg-rose-100 text-rose-700 border-rose-200';
            case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 bg-white/40 backdrop-blur-md rounded-3xl border border-white/60">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                    <Zap className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <p className="text-slate-500 font-bold mt-6 tracking-wide animate-pulse">Analyzing saved items...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {actionItems.length === 0 ? (
                <div className="text-center p-16 bg-white/60 backdrop-blur-sm rounded-[2rem] border-2 border-dashed border-slate-200 group hover:border-indigo-300 transition-all">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                        <Quote className="w-10 h-10 text-slate-300 group-hover:text-indigo-400 rotate-180" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 tracking-tight">No Action Items Yet</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mt-3 font-medium leading-relaxed">
                        Start transforming customer feedback into real impact. Generate your first action item from the dashboard!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {actionItems.map((item) => {
                        const status = getStatusInfo(item.status);
                        return (
                            <div
                                key={item._id}
                                className="group relative bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl border border-white/60 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 flex flex-col"
                            >
                                {/* Header: Title & Delete */}
                                <div className="flex justify-between items-start gap-4 mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl ${status.color.split(' ')[1]} transition-colors duration-500`}>
                                            {status.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black text-slate-800 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
                                                {item.title}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Calendar className="w-3 h-3 text-slate-400" />
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                                    {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="text-slate-300 hover:text-rose-600 hover:bg-rose-50 p-3 rounded-2xl transition-all duration-300"
                                        title="Remove Item"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Main Description */}
                                <p className="text-slate-600 leading-relaxed font-medium mb-8 flex-grow">
                                    {item.description}
                                </p>

                                {/* Side-by-Side Metadata Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                                    {/* Source Section */}
                                    <div className="relative bg-slate-50/50 rounded-2xl p-5 border border-slate-100 group-hover:bg-indigo-50/30 transition-colors duration-500">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Quote className="w-3.5 h-3.5 text-indigo-400 rotate-180" />
                                            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Feedback Source</span>
                                        </div>
                                        <p className="text-xs text-slate-500 italic font-medium leading-relaxed line-clamp-3">
                                            "{item.customerFeedback}"
                                        </p>
                                    </div>

                                    {/* Implemented Section */}
                                    <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 group-hover:bg-indigo-50/30 transition-colors duration-500">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Zap className="w-3.5 h-3.5 text-indigo-500" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Implemented Solution</span>
                                        </div>
                                        <p className="text-xs font-bold text-slate-700 leading-tight">
                                            {item.implementedFeature}
                                        </p>
                                    </div>

                                </div>

                                {/* Footer: Status & Impact */}
                                <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-auto">
                                    <div className="flex items-center gap-3">
                                        <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${getImpactStyle(item.userImpact)}`}>
                                            {item.userImpact} Impact
                                        </div>
                                        <select
                                            value={item.status}
                                            onChange={(e) => handleStatusChange(item._id, e.target.value)}
                                            className={`appearance-none px-4 py-2 pr-8 rounded-xl text-xs font-black uppercase tracking-widest border border-slate-200 bg-slate-50 text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all hover:bg-white relative`}
                                            style={{
                                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'right 0.5rem center',
                                                backgroundSize: '1rem'
                                            }}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                        <input
                                            type="text"
                                            defaultValue={item.teamName || ''}
                                            onBlur={(e) => {
                                                if (e.target.value !== item.teamName) {
                                                    handleTeamChange(item._id, e.target.value);
                                                }
                                            }}
                                            placeholder="Enter Team Name"
                                            className="w-36 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-indigo-100/50 bg-indigo-50/50 text-indigo-500 placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all hover:bg-white"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 group-hover:gap-3 transition-all">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Details</span>
                                        <ArrowRight className="w-4 h-4 text-indigo-400" />
                                    </div>
                                </div>

                                {/* Glowing accent line */}
                                <div className={`absolute bottom-0 left-12 right-12 h-1 ${status.dot} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[2px] translate-y-px`}></div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ActionItemsList;

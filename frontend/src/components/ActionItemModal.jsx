import React, { useState } from 'react';
import { X, Save, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

const ActionItemModal = ({ isOpen, onClose, actionItem, feedbackText, feedbackId }) => {
    const [showForm, setShowForm] = useState(false);
    const [implementedFeature, setImplementedFeature] = useState('');
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    if (!isOpen || !actionItem) return null;

    const handleCreateActionItem = async () => {
        if (!implementedFeature.trim()) {
            alert('Please describe the implemented feature');
            return;
        }

        setLoading(true);
        try {
            const data = {
                title: actionItem.title,
                description: actionItem.description,
                customerFeedback: feedbackText || 'N/A',
                implementedFeature: implementedFeature,
                userImpact: actionItem.user_impact,
                feedbackId: feedbackId || null
            };

            await api.createActionItem(data);
            setSaved(true);
            setTimeout(() => {
                setShowForm(false);
                setSaved(false);
                setImplementedFeature('');
                onClose();
            }, 1500);
        } catch (error) {
            console.error('Failed to create action item:', error);
            alert('Failed to save action item. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-slate-900 font-heading">
                        {showForm ? 'Create Action Item' : 'Generated Action Item'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" >Title</label>
                        <div className="text-lg font-semibold text-slate-900 mt-1" >{actionItem.title}</div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" >Description</label>
                        <div className="text-slate-700 mt-1 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm shadow-inner max-h-40 overflow-y-auto" >
                            {actionItem.description}
                        </div>
                    </div>

                    {feedbackText && (
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" >Customer Feedback</label>
                            <div className="text-slate-600 mt-1 text-sm bg-slate-50 p-3 rounded-lg border border-slate-200 max-h-32 overflow-y-auto" >
                                {feedbackText}
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" >Impact</label>
                        <div className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border 
              ${actionItem.user_impact === 'High' ? 'bg-red-100 text-red-700 border-red-200' :
                                actionItem.user_impact === 'Medium' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                    'bg-blue-100 text-blue-700 border-blue-200'}`}>
                            {actionItem.user_impact} Severity
                        </div>
                    </div>

                    {showForm && (
                        <div className="pt-4 border-t border-slate-200">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Implemented Feature (AI-Powered) *
                            </label>
                            <textarea
                                value={implementedFeature}
                                onChange={(e) => setImplementedFeature(e.target.value)}
                                placeholder="Describe what feature will be implemented using AI to address this feedback..."
                                className="w-full h-32 mt-2 bg-white border border-slate-200 rounded-lg p-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all text-sm"
                            />
                        </div>
                    )}

                    {saved && (
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-medium">Action item saved successfully!</span>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white">
                    {!showForm ? (
                        <>
                            <button
                                onClick={onClose}
                                className="px-6 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => setShowForm(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Create Action Item
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setShowForm(false)}
                                disabled={loading}
                                className="px-6 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateActionItem}
                                disabled={loading || !implementedFeature.trim()}
                                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Save Action Item
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActionItemModal;

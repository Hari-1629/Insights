import React, { useState, useEffect } from 'react';
import { Search, BrainCircuit, Mic, MicOff, Waves } from 'lucide-react';

const SearchBar = ({ onSearch, loading = false }) => {
    const [query, setQuery] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recog = new SpeechRecognition();
            recog.continuous = false;
            recog.interimResults = false;
            recog.lang = 'en-US';

            recog.onstart = () => setIsListening(true);
            recog.onend = () => setIsListening(false);
            recog.onerror = () => setIsListening(false);
            recog.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setQuery(transcript);
                onSearch(transcript);
            };

            setRecognition(recog);
        }
    }, [onSearch]);

    const toggleListening = () => {
        if (!recognition) {
            alert('Speech Recognition is not supported in this browser.');
            return;
        }
        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const trimmedQuery = query.trim();
        if (trimmedQuery && !loading) {
            onSearch(trimmedQuery);
        } else if (!trimmedQuery) {
            alert('Please enter a search query');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full">
            <div className={`relative group transition-all duration-500 ${isListening ? 'scale-[1.02]' : ''}`}>
                {/* Listening Glow Effect */}
                {isListening && (
                    <div className="absolute inset-0 bg-indigo-500/20 blur-[30px] rounded-[3rem] animate-pulse pointer-events-none" />
                )}

                <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-4 z-20">
                    <Search className={`w-5 h-5 transition-colors ${isListening ? 'text-indigo-600' : 'text-slate-400 group-focus-within:text-indigo-600'}`} />
                    <div className="w-px h-6 bg-slate-200" />

                    {/* Voice Assistant Button - Prominently on the left */}
                    <button
                        type="button"
                        onClick={toggleListening}
                        disabled={loading}
                        className={`
                            p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center relative overflow-hidden group/voice
                            ${isListening
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110'
                                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100 shadow-sm'
                            }
                        `}
                        title={isListening ? "Stop Listening" : "Search with Voice"}
                    >
                        {isListening ? (
                            <Waves className="w-4 h-4 animate-pulse" />
                        ) : (
                            <Mic className="w-4 h-4 group-hover/voice:scale-110 transition-transform" />
                        )}
                        {isListening && (
                            <div className="absolute inset-0 bg-white/20 animate-ping rounded-full pointer-events-none" />
                        )}
                    </button>
                    <div className="w-px h-6 bg-slate-200" />
                </div>

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={isListening ? "Listening to your voice..." : "Query the neural feedback engine..."}
                    disabled={loading || isListening}
                    className={`
                        w-full pl-44 pr-40 py-6 bg-white border border-slate-100 rounded-[2.5rem] focus:outline-none transition-all duration-500 text-base font-bold shadow-sm disabled:bg-slate-50
                        ${isListening ? 'border-indigo-500 ring-4 ring-indigo-500/10 placeholder-indigo-400' : 'focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 text-slate-900 placeholder-slate-300'}
                    `}
                />

                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
                    <button
                        type="submit"
                        disabled={loading || isListening}
                        className="bg-slate-900 hover:bg-black disabled:bg-slate-300 text-white px-8 py-3.5 rounded-[1.8rem] transition-all duration-300 shadow-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 group/btn active:scale-95 whitespace-nowrap"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <BrainCircuit className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                                <span className="hidden sm:inline">Execute Search</span>
                                <span className="sm:hidden">Search</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default SearchBar;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Sparkles, BrainCircuit, ArrowRight } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Mock login - in a real app, this would call an API
        setTimeout(() => {
            setIsLoading(false);
            navigate('/home');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-white font-sans flex items-center justify-center p-6 relative overflow-hidden">
            {/* Premium Decorative Light Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-indigo-50 rounded-full blur-[120px] animate-blob" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[700px] h-[700px] bg-purple-50 rounded-full blur-[120px] animate-blob animation-delay-2000" />
            </div>

            {/* Back to Home */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-10 left-10 group flex items-center gap-3 bg-white text-slate-500 px-6 py-3 rounded-2xl hover:text-indigo-600 transition-all shadow-sm border border-slate-100 font-black text-[10px] uppercase tracking-widest z-50"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Site
            </button>

            <div className="max-w-[1200px] w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
                {/* Left Side: Branding & Value Prop */}
                <div className="hidden lg:block space-y-12">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-slate-200">
                            <BrainCircuit className="w-10 h-10 text-white" />
                        </div>
                        <span className="text-3xl font-black text-slate-900 tracking-tighter">Insightful.</span>
                    </div>

                    <div className="space-y-8">
                        <h1 className="text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter">
                            Access your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Intelligence</span> Hub.
                        </h1>
                        <p className="text-slate-500 text-xl font-medium max-w-md leading-relaxed">
                            Log in to manage your strategic roadmap and transform customer feedback into technical growth.
                        </p>
                    </div>

                    <div className="flex items-center gap-10 pt-10 border-t border-slate-100">
                        <div>
                            <div className="text-4xl font-black text-slate-900 mb-1 tracking-tighter">98.4%</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Precision</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-slate-900 mb-1 tracking-tighter">1.2M+</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Insights Analyzed</div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="w-full max-w-lg mx-auto">
                    <div className="bg-white/80 backdrop-blur-2xl p-10 md:p-16 rounded-[4rem] border border-white shadow-[0_32px_128px_-32px_rgba(79,70,229,0.15)] relative overflow-hidden group">
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 via-purple-50/0 to-white/0 group-hover:from-indigo-50/20 group-hover:via-purple-50/10 group-hover:to-white/20 transition-all duration-1000" />

                        <div className="relative z-10 space-y-10">
                            <div className="space-y-2">
                                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Sign In</h2>
                                <p className="text-slate-500 font-medium tracking-tight">Enter your credentials to continue</p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                                    <div className="relative group/field">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-indigo-600 transition-colors">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@company.com"
                                            className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:outline-none focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 transition-all text-slate-900 font-bold placeholder:text-slate-300 shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                                        <button type="button" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Forgot?</button>
                                    </div>
                                    <div className="relative group/field">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-indigo-600 transition-colors">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:outline-none focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 transition-all text-slate-900 font-bold placeholder:text-slate-300 shadow-sm"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="group relative w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-indigo-200"
                                >
                                    <div className="relative z-10 flex items-center justify-center gap-4">
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                Authenticate
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                            </>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity animate-gradient" />
                                </button>
                            </form>

                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-100" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase tracking-widest">
                                    <span className="bg-white px-6 text-slate-400 font-bold">Or continue with</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <button className="flex items-center justify-center gap-3 py-4 border-2 border-slate-100 rounded-[1.5rem] hover:bg-slate-50 transition-all font-bold text-xs text-slate-600">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                                    </svg>
                                    Google
                                </button>
                                <button className="flex items-center justify-center gap-3 py-4 border-2 border-slate-100 rounded-[1.5rem] hover:bg-slate-50 transition-all font-bold text-xs text-slate-600">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                    </svg>
                                    GitHub
                                </button>
                            </div>
                        </div>
                    </div>

                    <p className="text-center mt-12 text-slate-500 font-medium tracking-tight">
                        Don't have an account? <button className="text-indigo-600 font-black hover:underline uppercase tracking-widest text-[10px] ml-2">Request Access</button>
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                .animate-blob {
                    animation: blob 15s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 3s infinite;
                }
            `}</style>
        </div>
    );
};

export default Login;

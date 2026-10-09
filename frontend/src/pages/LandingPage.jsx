import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, ArrowRight, Play, Zap, MessageCircle, Star, TrendingUp, Lock, Upload, BarChart3, Lightbulb } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    // Test: Ensure component is rendering
    console.log('LandingPage component is rendering');

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden">
            {/* Navigation Bar */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100/50 hover:bg-white/90 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200 group-hover:scale-110 transition-transform">
                            <BrainCircuit className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-slate-900">FeedbackAI</span>
                    </div>

                    <div className="hidden lg:flex items-center gap-8">
                        {['Features', 'How it Works', 'Pricing', 'About'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                                className="text-sm font-medium text-slate-700 hover:text-purple-600 transition-all duration-200 relative group h-20 flex items-center"
                            >
                                {item}
                                <span className="absolute bottom-5 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
                            </a>
                        ))}
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="text-sm font-medium text-slate-700 hover:text-purple-600 transition-all duration-200 relative group h-20 flex items-center cursor-pointer"
                        >
                            Dashboard
                            <span className="absolute bottom-5 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="hidden sm:block text-sm font-medium text-slate-700 hover:text-purple-600 transition-colors"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate('/home')}
                            className="bg-purple-600 text-white px-6 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 shadow-lg shadow-purple-200 hover:bg-purple-700 transition-all hover:scale-105"
                        >
                            <Star className="w-4 h-4 fill-white" />
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1600px] aspect-video pointer-events-none opacity-20">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-200 via-pink-100 to-blue-100 blur-[120px] rounded-full" />
                </div>

                <div className="max-w-6xl mx-auto text-center relative z-10 pt-20" style={{ paddingTop: '120px' }}>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-50 rounded-full mb-8" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', backgroundColor: '#faf5ff', borderRadius: '9999px', marginBottom: '32px' }}>
                        <div className="w-2 h-2 bg-blue-500 rounded-full" style={{ width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '50%' }}></div>
                        <span className="text-xs font-semibold text-purple-700" style={{ fontSize: '12px', fontWeight: '600', color: '#7c3aed' }}>AI-Powered Feedback Intelligence</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight max-w-4xl mx-auto" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: '700', color: '#0f172a', marginBottom: '24px', lineHeight: '1.2', maxWidth: '56rem', marginLeft: 'auto', marginRight: 'auto' }}>
                        Insightful Customer <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600" style={{ background: 'linear-gradient(to right, #9333ea, #db2777)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Feedback</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600" style={{ background: 'linear-gradient(to right, #9333ea, #db2777)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Analysis</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 font-normal max-w-2xl mx-auto mb-10 leading-relaxed">
                        Unlock deep insights from every customer interaction. Combine the power of hard metrics with the nuance of human sentiment — all powered by AI.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/home')}
                            className="bg-purple-600 text-white px-8 py-4 rounded-full font-semibold text-base flex items-center gap-2 shadow-lg shadow-purple-200 hover:bg-purple-700 transition-all hover:scale-105"
                        >
                            Start Free Trial
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <button className="bg-white text-slate-700 px-8 py-4 rounded-full font-semibold text-base flex items-center gap-2 border-2 border-slate-200 hover:border-slate-300 hover:shadow-md transition-all">
                            <Play className="w-5 h-5 fill-slate-700" />
                            Watch Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="py-16 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-5xl md:text-6xl font-bold text-slate-900 mb-2">50K+</div>
                            <div className="text-sm text-slate-600">Feedback Analyzed</div>
                        </div>
                        <div>
                            <div className="text-5xl md:text-6xl font-bold text-slate-900 mb-2">98%</div>
                            <div className="text-sm text-slate-600">Accuracy Rate</div>
                        </div>
                        <div>
                            <div className="text-5xl md:text-6xl font-bold text-slate-900 mb-2">3x</div>
                            <div className="text-sm text-slate-600">Faster Insights</div>
                        </div>
                        <div>
                            <div className="text-5xl md:text-6xl font-bold text-slate-900 mb-2">500+</div>
                            <div className="text-sm text-slate-600">Companies</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 px-6 bg-white relative">
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-purple-50/50 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-block px-4 py-1.5 bg-purple-50 rounded-full mb-6">
                            <span className="text-sm font-semibold text-purple-700">Features</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                            Everything you need to understand your customers
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            From raw feedback to boardroom-ready insights in minutes, not weeks.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {[
                            {
                                title: 'AI Sentiment Analysis',
                                icon: <BrainCircuit className="w-6 h-6" />,
                                desc: 'Deep learning models decode emotion, intent, and urgency from every piece of feedback automatically.',
                                iconBg: 'bg-purple-100',
                                iconColor: 'text-purple-600'
                            },
                            {
                                title: 'Real-Time Dashboards',
                                icon: <BarChart3 className="w-6 h-6" />,
                                desc: 'Track NPS, CSAT, CES and custom KPIs with live-updating charts and anomaly detection.',
                                iconBg: 'bg-teal-100',
                                iconColor: 'text-teal-600'
                            },
                            {
                                title: 'Qualitative Decoding',
                                icon: <MessageCircle className="w-6 h-6" />,
                                desc: 'Transform open-ended responses into categorized, actionable themes with AI clustering.',
                                iconBg: 'bg-purple-100',
                                iconColor: 'text-purple-600'
                            }
                        ].map((feature, idx) => (
                            <div key={feature.title} className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1">
                                <div className={`w-12 h-12 ${feature.iconBg} ${feature.iconColor} rounded-xl flex items-center justify-center mb-6`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Trend Prediction',
                                icon: <TrendingUp className="w-6 h-6" />,
                                desc: 'Spot emerging patterns before they become problems with predictive analytics and alerts.',
                                iconBg: 'bg-teal-100',
                                iconColor: 'text-teal-600'
                            },
                            {
                                title: 'Instant Reports',
                                icon: <Zap className="w-6 h-6" />,
                                desc: 'Generate stakeholder-ready reports in seconds. Export to PDF, Slack, or your favorite tools.',
                                iconBg: 'bg-purple-100',
                                iconColor: 'text-purple-600'
                            },
                            {
                                title: 'Enterprise Security',
                                icon: <Lock className="w-6 h-6" />,
                                desc: 'SOC 2 compliant, end-to-end encryption, and GDPR-ready data handling for peace of mind.',
                                iconBg: 'bg-teal-100',
                                iconColor: 'text-teal-600'
                            }
                        ].map((feature, idx) => (
                            <div key={feature.title} className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1">
                                <div className={`w-12 h-12 ${feature.iconBg} ${feature.iconColor} rounded-xl flex items-center justify-center mb-6`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24 px-6 bg-slate-50 relative overflow-hidden">
                <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-100/30 blur-[100px] rounded-full"></div>
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-block px-4 py-1.5 bg-teal-50 rounded-full mb-6">
                            <span className="text-sm font-semibold text-teal-700">How It Works</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                            From feedback to action in four simple steps
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            {
                                num: '01',
                                icon: <Upload className="w-6 h-6" />,
                                title: 'Connect Your Sources',
                                desc: 'Import feedback from surveys, reviews, support tickets, social media, and more — all in one place.'
                            },
                            {
                                num: '02',
                                icon: <BrainCircuit className="w-6 h-6" />,
                                title: 'AI Does the Heavy Lifting',
                                desc: 'Our models categorize, score sentiment, and extract themes from thousands of responses in seconds.'
                            },
                            {
                                num: '03',
                                icon: <BarChart3 className="w-6 h-6" />,
                                title: 'Visualize & Explore',
                                desc: 'Interactive dashboards let you drill down by time, segment, product, or any dimension you need.'
                            },
                            {
                                num: '04',
                                icon: <Lightbulb className="w-6 h-6" />,
                                title: 'Act on Insights',
                                desc: 'Get prioritized recommendations and share findings with your team to drive meaningful change.'
                            }
                        ].map((step) => (
                            <div key={step.num} className="text-center group">
                                <div className="text-5xl font-bold text-slate-200 mb-2 transition-colors group-hover:text-purple-200">{step.num}</div>
                                <div className="w-12 h-0.5 bg-purple-200 mx-auto mb-6"></div>
                                <div className="w-16 h-16 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center mx-auto mb-6 text-purple-600 group-hover:scale-110 transition-transform">
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 px-6 bg-white relative overflow-hidden">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-block px-4 py-1.5 bg-purple-50 rounded-full mb-6">
                            <span className="text-sm font-semibold text-purple-700">Pricing</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                            Simple, transparent pricing
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Choose the plan that's right for your team. From startups to scale-ups.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'Starter',
                                price: '$0',
                                desc: 'Perfect for small side projects',
                                features: ['Up to 100 entries/mo', 'Basic Sentiment Analysis', '3 Dashboard views', 'Community support'],
                                button: 'Start Free Trial',
                                popular: false
                            },
                            {
                                name: 'Pro',
                                price: '$49',
                                desc: 'Best for growing startups',
                                features: ['Up to 5,000 entries/mo', 'Advanced Theme Clustering', 'Unlimited Dashboards', 'Priority email support', 'Custom Export options'],
                                button: 'Get Started',
                                popular: true
                            },
                            {
                                name: 'Enterprise',
                                price: 'Custom',
                                desc: 'For large-scale operations',
                                features: ['Unlimited everything', 'Dedicated Data Architect', 'SSO & Enterprise Security', '24/7 Phone Support', 'SLA Guarantees'],
                                button: 'Contact Sales',
                                popular: false
                            }
                        ].map((plan) => (
                            <div key={plan.name} className={`relative p-8 rounded-3xl border ${plan.popular ? 'border-purple-600 shadow-xl shadow-purple-100' : 'border-slate-100 shadow-sm'} flex flex-col`}>
                                {plan.popular && (
                                    <div className="absolute top-0 right-8 -translate-y-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        Most Popular
                                    </div>
                                )}
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                                        {plan.price !== 'Custom' && <span className="text-slate-500 font-medium">/mo</span>}
                                    </div>
                                    <p className="text-slate-600 text-sm mt-3">{plan.desc}</p>
                                </div>
                                <div className="space-y-4 mb-8 flex-grow">
                                    {plan.features.map(f => (
                                        <div key={f} className="flex items-center gap-3">
                                            <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                                                <Zap className="w-3 h-3 fill-purple-600" />
                                            </div>
                                            <span className="text-slate-700 text-sm">{f}</span>
                                        </div>
                                    ))}
                                </div>
                                <button className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${plan.popular ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-200' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}>
                                    {plan.button}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 blur-[150px] rounded-full"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600 blur-[150px] rounded-full"></div>
                </div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full mb-8">
                        <span className="text-sm font-semibold text-purple-300">Our Story</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-8">
                        We're on a mission to humanize data
                    </h2>
                    <p className="text-xl text-slate-300 mb-12 leading-relaxed">
                        At FeedbackAI, we believe that behind every data point is a human story. We started with a simple question: How can we help companies listen better? Today, we use cutting-edge AI to bridge the gap between businesses and their customers, turning millions of opinions into clear, actionable intelligence.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <div className="text-3xl font-bold text-purple-400 mb-2">2021</div>
                            <div className="text-sm text-slate-400 font-medium">Year Founded</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-purple-400 mb-2">40+</div>
                            <div className="text-sm text-slate-400 font-medium">Team Members</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-purple-400 mb-2">SFO</div>
                            <div className="text-sm text-slate-400 font-medium">Headquarters</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-purple-400 mb-2">$20M+</div>
                            <div className="text-sm text-slate-400 font-medium">Capital Raised</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 bg-gradient-to-br from-purple-600 to-purple-700">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="mb-8">
                        <Star className="w-8 h-8 text-white mx-auto mb-6" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to turn feedback into your competitive advantage?
                    </h2>
                    <p className="text-lg text-purple-100 mb-10 max-w-2xl mx-auto">
                        Join 500+ companies already using FeedbackAI to understand and delight their customers.
                    </p>
                    <button
                        onClick={() => navigate('/home')}
                        className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-base flex items-center gap-2 mx-auto shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                    >
                        Start Free — No Credit Card
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 px-6 bg-white border-t border-slate-100">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <BrainCircuit className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold text-slate-900">FeedbackAI</span>
                            </div>
                            <p className="text-slate-600 text-sm max-w-xs">
                                Empowering product teams with AI-powered customer feedback analysis.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
                            <div className="space-y-2">
                                {['Features', 'Pricing', 'Dashboard', 'API', 'Documentation'].map(f => (
                                    f === 'Dashboard' ? (
                                        <button
                                            key={f}
                                            onClick={() => navigate('/dashboard')}
                                            className="block text-sm text-slate-600 hover:text-purple-600 transition-colors text-left"
                                        >
                                            {f}
                                        </button>
                                    ) : (
                                        <a
                                            key={f}
                                            href={['Features', 'Pricing'].includes(f) ? `#${f.toLowerCase()}` : "#"}
                                            className="block text-sm text-slate-600 hover:text-purple-600 transition-colors"
                                        >
                                            {f}
                                        </a>
                                    )
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
                            <div className="space-y-2">
                                {['About', 'Blog', 'Careers', 'Contact'].map(f => (
                                    <a
                                        key={f}
                                        href={f === 'About' ? '#about' : "#"}
                                        className="block text-sm text-slate-600 hover:text-purple-600 transition-colors"
                                    >
                                        {f}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-slate-500">© 2024 FeedbackAI. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a href="#" className="text-slate-400 hover:text-purple-600 transition-colors">
                                <MessageCircle className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

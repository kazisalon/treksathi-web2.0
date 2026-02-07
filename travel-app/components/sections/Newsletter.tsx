'use client';

import { useState } from 'react';
import { Mail, Send, CheckCircle, Users, TrendingUp, Globe, Zap, Gift } from 'lucide-react';

const benefits = [
  {
    icon: TrendingUp,
    title: "Exclusive Deals",
    description: "Early access to special offers"
  },
  {
    icon: Globe,
    title: "Travel Tips",
    description: "Insider guides from experts"
  },
  {
    icon: Zap,
    title: "New Routes",
    description: "Be first to know new trails"
  },
  {
    icon: Gift,
    title: "Member Perks",
    description: "Special discounts & rewards"
  }
];

const JoinOurCommunity = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
    }, 1500);
  };


  if (isSubscribed) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-2 h-2 bg-white rounded-full animate-pulse" />
          <div className="absolute top-40 right-32 w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-32 left-40 w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-60 left-1/3 w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-40 right-20 w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20">
            {/* Success Icon */}
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-500/30 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-400 animate-pulse" />
              </div>
            </div>

            {/* Success Message */}
            <h2 className="text-4xl font-bold text-white mb-4">
              Welcome to Our Community!
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Thank you for joining us! You're now part of a global family of{' '}
              <span className="font-bold text-yellow-300">10,000+ Nepal adventurers</span>.
              Get ready for exclusive stories, insider tips, and special offers delivered to your inbox.
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-white font-semibold text-sm mb-1">{benefit.title}</div>
                    <div className="text-white/70 text-xs">{benefit.description}</div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsSubscribed(false)}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl font-medium transition-all duration-300 border border-white/30"
              >
                Subscribe Another Email
              </button>
              <button className="px-6 py-3 bg-white hover:bg-gray-100 text-blue-600 rounded-xl font-semibold transition-all duration-300 shadow-lg">
                Explore Tours Now
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-white via-blue-50/30 to-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main CTA Section */}
        <div className="text-center mb-16">
          {/* Enhanced Badge */}
          <div className="inline-block mb-6 animate-in fade-in slide-in duration-700">
            <div className="flex items-center gap-3 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 px-8 py-4 rounded-full shadow-lg border border-blue-200/50">
              <Users className="w-6 h-6 text-blue-600 animate-pulse" />
              <span className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700">Join 10,000+ Adventurers</span>
            </div>
          </div>

          <h2 className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 mb-8 font-serif leading-tight">
            Join Our Community
          </h2>

          <div className="max-w-4xl mx-auto mb-12">
            <blockquote className="text-3xl md:text-4xl font-serif text-gray-700 italic leading-relaxed mb-8">
              "The world waits, but Nepal whispers first."
            </blockquote>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Become part of a global family of adventurers, dreamers, and Nepal lovers.
              Share stories, get inspired, and plan your next journey together.
            </p>
          </div>

          {/* Enhanced Newsletter Signup Card */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-12 md:p-14 shadow-2xl border border-gray-200/50 mb-12 max-w-3xl mx-auto relative overflow-hidden">
            {/* Enhanced decorative gradient */}
            <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-3xl font-extrabold text-gray-900">Stay Connected</h3>
                <p className="text-lg text-gray-600 font-medium">Get weekly inspiration & exclusive offers</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-6 py-4 rounded-xl bg-gray-50 border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Join Community</span>
                      <Send className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              No spam, unsubscribe anytime • Your privacy is protected
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">{benefit.title}</h4>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 border-2 border-white flex items-center justify-center text-white text-sm font-bold"
                >
                  <Users className="w-5 h-5" />
                </div>
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">
              <span className="font-bold text-blue-600">10,000+</span> adventurers already joined
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
};

export default JoinOurCommunity;
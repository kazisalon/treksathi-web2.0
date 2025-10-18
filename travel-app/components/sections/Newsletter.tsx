'use client';

import { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the newsletter subscription
    setIsSubscribed(true);
    setEmail('');
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Stay Connected to Nepal
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Get exclusive Nepal travel insights, seasonal trekking updates, cultural festival alerts, 
            and special offers delivered to your inbox monthly.
          </p>

          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-6 py-4 rounded-full border-0 focus:outline-none focus:ring-4 focus:ring-white/30 bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Subscribe
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-green-500/20 border border-green-400 rounded-full px-8 py-4 max-w-md mx-auto">
              <p className="text-white font-semibold">
                🎉 Thank you for subscribing! Check your email for a welcome gift.
              </p>
            </div>
          )}

          <p className="text-white/70 text-sm mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>

          {/* Social Proof */}
          <div className="mt-8 flex justify-center items-center space-x-8 flex-wrap gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">3K+</div>
              <div className="text-white/80 text-sm">Nepal Enthusiasts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">Monthly</div>
              <div className="text-white/80 text-sm">Trek Updates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">Insider</div>
              <div className="text-white/80 text-sm">Nepal Tips</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
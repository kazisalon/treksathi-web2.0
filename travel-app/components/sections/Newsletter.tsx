'use client';

import { useState } from 'react';
import { Mail, Send, CheckCircle, Instagram, Facebook, Twitter, Youtube, Users, Heart, Globe } from 'lucide-react';

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

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-400' },
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-400' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-sky-400' },
    { icon: Youtube, href: '#', label: 'YouTube', color: 'hover:text-red-400' }
  ];

  const quickLinks = [
    'About Us', 'Our Guides', 'Safety Standards', 'Sustainability',
    'Travel Blog', 'Photo Gallery', 'Testimonials', 'Contact Us'
  ];

  if (isSubscribed) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
        {/* Stars Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-1 h-1 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-32 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-32 left-40 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-60 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-40 right-20 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Welcome to Our Community!
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Thank you for joining us! You're now part of a global family of Nepal adventurers. 
              Get ready for exclusive stories, insider tips, and special offers.
            </p>
            <button 
              onClick={() => setIsSubscribed(false)}
              className="text-blue-400 font-medium hover:text-blue-300 transition-colors duration-300"
            >
              Subscribe another email
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-blue-900 relative overflow-hidden">
      {/* Clean Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-blue-800"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main CTA Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 font-serif leading-tight">
            Join Our Community
          </h2>
          
          <div className="max-w-4xl mx-auto mb-12">
            <blockquote className="text-2xl md:text-3xl font-serif text-white/90 italic leading-relaxed mb-6">
              "The world waits, but Nepal whispers first."
            </blockquote>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Become part of a global family of adventurers, dreamers, and Nepal lovers. 
              Share stories, get inspired, and plan your next journey together.
            </p>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 mb-12 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Mail className="w-8 h-8 text-white/80 mr-3" />
              <h3 className="text-2xl font-bold text-white">Stay Connected</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-6 py-4 rounded-full bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-white/60 backdrop-blur-sm"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Join Community
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <p className="text-sm text-white/60">
              Join 10,000+ adventurers • No spam, unsubscribe anytime
            </p>
          </div>

          {/* Main CTA Button */}
          <button className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-12 py-6 rounded-full font-bold text-xl hover:from-orange-600 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-2xl mb-16">
            Plan Your Journey
          </button>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">10,000+</div>
            <div className="text-white/70">Community Members</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-red-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">5,000+</div>
            <div className="text-white/70">Adventures Shared</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">50+</div>
            <div className="text-white/70">Countries Represented</div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/20 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Social Links */}
            <div className="text-center md:text-left">
              <h4 className="text-lg font-semibold text-white mb-4">Follow Our Journey</h4>
              <div className="flex justify-center md:justify-start space-x-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      className={`w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white/70 ${social.color} transition-colors duration-300`}
                      aria-label={social.label}
                    >
                      <IconComponent className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center">
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <div className="grid grid-cols-2 gap-2">
                {quickLinks.map((link, index) => (
                  <a
                    key={index}
                    href="#"
                    className="text-white/70 hover:text-white transition-colors duration-300 text-sm"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="text-center md:text-right">
              <h4 className="text-lg font-semibold text-white mb-4">Get in Touch</h4>
              <div className="space-y-2 text-white/70 text-sm">
                <p>📧 hello@treksathi.com</p>
                <p>📞 +977-1-4567890</p>
                <p>📍 Thamel, Kathmandu, Nepal</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8 pt-8 border-t border-white/10">
            <p className="text-white/60 text-sm">
              © 2024 TrekSathi. Made with ❤️ in Nepal. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinOurCommunity;
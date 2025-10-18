'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Menu, 
  X, 
  User, 
  MapPin, 
  Plane, 
  Hotel, 
  Camera,
  Heart,
  Settings,
  LogOut,
  Globe,
  Home,
  Mountain,
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const navItems = [
    { name: 'Home', nameNp: 'गृहपृष्ठ', href: '/', icon: Home },
    { name: 'Destinations', nameNp: 'गन्तव्यहरू', href: '/destinations', icon: MapPin },
    { name: 'Trekking', nameNp: 'ट्रेकिङ', href: '/trekking', icon: Mountain },
    { name: 'Cultural Tours', nameNp: 'सांस्कृतिक भ्रमण', href: '/cultural', icon: Camera },
    { name: 'Adventure', nameNp: 'साहसिक', href: '/adventure', icon: Compass },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">ट</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">TrekSathi</span>
              <span className="text-xs text-emerald-600">ट्रेकसाथी</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center space-x-1 text-gray-700 hover:text-emerald-600 transition-colors duration-200"
              >
                <item.icon className="w-4 h-4" />
                <div className="flex flex-col">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-xs opacity-70">नेपाली</span>
                </div>
              </Link>
            ))}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="spinner" />
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-700">{session.user?.name}</span>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                    >
                      <Link
                        href="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <User className="w-4 h-4" />
                        <span>प्रोफाइल</span>
                      </Link>
                      <Link
                        href="/bookings"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <Heart className="w-4 h-4" />
                        <span>मेरो बुकिङहरू</span>
                      </Link>
                      <Link
                        href="/favorites"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <Heart className="w-4 h-4" />
                        <span>मनपर्ने</span>
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <Settings className="w-4 h-4" />
                        <span>सेटिङहरू</span>
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>लग आउट</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/signin"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  लग इन
                </Link>
                <Link
                  href="/auth/signup"
                  className="btn-primary"
                >
                  साइन अप
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-200 py-4"
            >
              <div className="space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <div className="flex flex-col">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm text-gray-500 opacity-70">नेपाली</span>
                    </div>
                  </Link>
                ))}
                
                {session ? (
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <Link
                      href="/profile"
                      className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      <User className="w-5 h-5" />
                      <span>प्रोफाइल</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>लग आउट</span>
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <Link
                      href="/auth/signin"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      लग इन
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      साइन अप
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Mountain, Users, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

interface SignInForm {
  email: string;
  password: string;
}

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors } } = useForm<SignInForm>();

  const onSubmit = async (data: SignInForm) => {
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('गलत इमेल वा पासवर्ड / Invalid email or password');
      } else {
        toast.success('सफलतापूर्वक लग इन भयो / Successfully logged in');
        router.push('/');
      }
    } catch (error) {
      toast.error('लग इन गर्न सकिएन / Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Welcome Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block space-y-8"
          >
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 via-blue-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-3xl">ट</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-800">TrekSathi</h1>
                  <p className="text-xl text-blue-600 font-semibold">ट्रेकसाथी</p>
                </div>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                स्वागत छ!
              </h2>
              <h3 className="text-2xl lg:text-3xl font-semibold text-green-600 mb-6">
                Welcome Back!
              </h3>
              <p className="text-lg text-gray-600 mb-4">
                नेपालका लुकेका खजानाहरू खोज्नुहोस्
              </p>
              <p className="text-base text-gray-500 mb-8">
                Discover Nepal's Hidden Treasures
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                { icon: Mountain, title: "हिमालयन ट्रेकिङ", subtitle: "Himalayan Trekking", color: "green" },
                { icon: Users, title: "सांस्कृतिक यात्रा", subtitle: "Cultural Tours", color: "blue" },
                { icon: Globe, title: "साहसिक अनुभव", subtitle: "Adventure Experience", color: "yellow" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className={`flex items-center space-x-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-${item.color}-200/50`}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br from-${item.color}-400 to-${item.color}-600 rounded-lg flex items-center justify-center`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.subtitle}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 lg:p-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  लग इन गर्नुहोस्
                </h2>
                <p className="text-base text-green-600 font-medium">
                  Sign In to Your Account
                </p>
              </div>
              
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <span>इमेल ठेगाना</span>
                  </div>
                  <span className="text-xs text-gray-500 font-normal">Email Address</span>
                </label>
                <input
                  {...register('email', { 
                    required: 'इमेल आवश्यक छ / Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'मान्य इमेल ठेगाना प्रविष्ट गर्नुहोस् / Enter valid email'
                    }
                  })}
                  type="email"
                  className="w-full bg-green-50 border-2 border-green-200 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-300"
                  placeholder="तपाईंको इमेल प्रविष्ट गर्नुहोस् / Enter your email"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 font-medium">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <span>पासवर्ड</span>
                  </div>
                  <span className="text-xs text-gray-500 font-normal">Password</span>
                </label>
                <div className="relative">
                  <input
                    {...register('password', { 
                      required: 'पासवर्ड आवश्यक छ / Password is required',
                      minLength: {
                        value: 6,
                        message: 'पासवर्ड कम्तिमा ६ अक्षरको हुनुपर्छ / Password must be at least 6 characters'
                      }
                    })}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full bg-blue-50 border-2 border-blue-200 rounded-xl px-4 py-3 pr-12 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
                    placeholder="तपाईंको पासवर्ड प्रविष्ट गर्नुहोस् / Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 font-medium">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-700">
                  <span className="font-medium">मलाई सम्झनुहोस्</span>
                  <br />
                  <span className="text-xs text-gray-500">Remember me</span>
                </label>
              </div>

              <div className="text-sm">
                <Link href="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  <span className="block">पासवर्ड बिर्सनुभयो?</span>
                  <span className="text-xs text-gray-500">Forgot password?</span>
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 via-blue-500 to-yellow-500 hover:from-green-600 hover:via-blue-600 hover:to-yellow-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>लग इन गर्नुहोस् / Sign In</span>
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  वा / Or
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button 
                type="button"
                onClick={() => signIn('google')}
                className="w-full flex justify-center items-center px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-medium"
              >
                <Globe className="w-5 h-5 mr-3" />
                <span>Google सँग लग इन गर्नुहोस् / Continue with Google</span>
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              <span className="block font-medium">खाता छैन?</span>
              <span className="text-xs">Don't have an account?</span>
              <br />
              <Link href="/auth/signup" className="font-semibold text-green-600 hover:text-green-500 transition-colors">
                <span className="block">दर्ता गर्नुहोस्</span>
                <span className="text-xs">Sign up here</span>
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Eye, EyeOff, User, Mail, Phone, Lock, ArrowRight, Mountain, Users, Globe, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

interface SignUpForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  phoneNumber: string;
  alias: string;
}

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<SignUpForm>();
  const password = watch('password');

  const onSubmit = async (data: SignUpForm) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/auth/register', {
        username: data.username,
        email: data.email,
        password: data.password,
        gender: data.gender,
        phoneNumber: data.phoneNumber,
        alias: data.alias,
      });

      // Handle successful registration
      if (response.data.success) {
        // Store token if provided
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);
        }
        
        toast.success(response.data.message || 'खाता सफलतापूर्वक सिर्जना भयो / Account created successfully');
        
        // Redirect to signin page
        router.push('/auth/signin');
      } else {
        toast.error(response.data.error || 'खाता सिर्जना गर्न सकिएन / Failed to create account');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'खाता सिर्जना गर्न सकिएन / Failed to create account';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
        >
          <div className="px-8 py-10">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-20 h-20 bg-gradient-to-r from-green-500 via-blue-500 to-yellow-500 rounded-full mx-auto mb-6 flex items-center justify-center"
              >
                <User className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-yellow-600 bg-clip-text text-transparent mb-2">
                दर्ता गर्नुहोस्
              </h2>
              <p className="text-base text-green-600 font-medium">
                Create Your Account
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-green-600" />
                      <span>प्रयोगकर्ता नाम</span>
                    </div>
                    <span className="text-xs text-gray-500 font-normal">Username</span>
                  </label>
                  <input
                    {...register('username', { 
                      required: 'प्रयोगकर्ता नाम आवश्यक छ / Username is required',
                      minLength: {
                        value: 3,
                        message: 'प्रयोगकर्ता नाम कम्तिमा ३ अक्षरको हुनुपर्छ / Username must be at least 3 characters'
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9_]+$/,
                        message: 'केवल अक्षर, संख्या र _ प्रयोग गर्नुहोस् / Only letters, numbers and _ allowed'
                      }
                    })}
                    type="text"
                    className="w-full bg-green-50 border-2 border-green-200 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-300"
                    placeholder="तपाईंको प्रयोगकर्ता नाम प्रविष्ट गर्नुहोस् / Enter your username"
                  />
                  {errors.username && (
                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.username.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-blue-600" />
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
                    className="w-full bg-blue-50 border-2 border-blue-200 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
                    placeholder="तपाईंको इमेल प्रविष्ट गर्नुहोस् / Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-yellow-600" />
                      <span>फोन नम्बर</span>
                    </div>
                    <span className="text-xs text-gray-500 font-normal">Phone Number</span>
                  </label>
                  <input
                    {...register('phoneNumber', { 
                      required: 'फोन नम्बर आवश्यक छ / Phone number is required',
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: '१० अंकको फोन नम्बर प्रविष्ट गर्नुहोस् / Enter 10 digit phone number'
                      }
                    })}
                    type="tel"
                    className="w-full bg-yellow-50 border-2 border-yellow-200 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300"
                    placeholder="९८XXXXXXXX / 98XXXXXXXX"
                  />
                  {errors.phoneNumber && (
                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.phoneNumber.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span>लिङ्ग</span>
                    </div>
                    <span className="text-xs text-gray-500 font-normal">Gender</span>
                  </label>
                  <select
                    {...register('gender', { 
                      required: 'लिङ्ग चयन गर्नुहोस् / Please select gender'
                    })}
                    className="w-full bg-purple-50 border-2 border-purple-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300"
                  >
                    <option value="">लिङ्ग चयन गर्नुहोस् / Select Gender</option>
                    <option value="male">पुरुष / Male</option>
                    <option value="female">महिला / Female</option>
                    <option value="other">अन्य / Other</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.gender.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="alias" className="block text-sm font-semibold text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <UserPlus className="w-4 h-4 text-indigo-600" />
                      <span>उपनाम</span>
                    </div>
                    <span className="text-xs text-gray-500 font-normal">Alias / Display Name</span>
                  </label>
                  <input
                    {...register('alias', { 
                      required: 'उपनाम आवश्यक छ / Alias is required',
                      minLength: {
                        value: 2,
                        message: 'उपनाम कम्तिमा २ अक्षरको हुनुपर्छ / Alias must be at least 2 characters'
                      }
                    })}
                    type="text"
                    className="w-full bg-indigo-50 border-2 border-indigo-200 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-300"
                    placeholder="तपाईंको उपनाम प्रविष्ट गर्नुहोस् / Enter your display name"
                  />
                  {errors.alias && (
                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.alias.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-green-600" />
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
                      className="w-full bg-green-50 border-2 border-green-200 rounded-xl px-4 py-3 pr-12 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-300"
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

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-blue-600" />
                      <span>पासवर्ड पुष्टि गर्नुहोस्</span>
                    </div>
                    <span className="text-xs text-gray-500 font-normal">Confirm Password</span>
                  </label>
                  <div className="relative">
                    <input
                      {...register('confirmPassword', { 
                        required: 'पासवर्ड पुष्टि आवश्यक छ / Password confirmation is required',
                        validate: value => value === password || 'पासवर्ड मेल खाएन / Passwords do not match'
                      })}
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="w-full bg-blue-50 border-2 border-blue-200 rounded-xl px-4 py-3 pr-12 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
                      placeholder="पासवर्ड फेरि प्रविष्ट गर्नुहोस् / Re-enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <input
                  id="agree-terms"
                  name="agree-terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
                />
                <label htmlFor="agree-terms" className="ml-3 block text-sm text-gray-700">
                  <span className="font-medium">म सहमत छु</span>
                  <br />
                  <span className="text-xs text-gray-500">I agree to the</span>
                  {' '}
                  <Link href="/terms" className="font-medium text-green-600 hover:text-green-500 transition-colors">
                    <span className="block">नियम र सर्तहरू</span>
                    <span className="text-xs">Terms & Conditions</span>
                  </Link>
                  {' र / and '}
                  <Link href="/privacy" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                    <span className="block">गोपनीयता नीति</span>
                    <span className="text-xs">Privacy Policy</span>
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 via-blue-500 to-yellow-500 hover:from-green-600 hover:via-blue-600 hover:to-yellow-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>दर्ता गर्नुहोस् / Sign Up</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                <span className="block font-medium">पहिले नै खाता छ?</span>
                <span className="text-xs">Already have an account?</span>
                {' '}
                <Link href="/auth/signin" className="font-semibold text-green-600 hover:text-green-500 transition-colors">
                  <span className="block">लग इन गर्नुहोस्</span>
                  <span className="text-xs">Sign in here</span>
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
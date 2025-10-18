'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook } from 'react-icons/fa';

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
        toast.error('गलत इमेल वा पासवर्ड');
      } else {
        toast.success('सफलतापूर्वक लग इन भयो');
        router.push('/');
      }
    } catch (error) {
      toast.error('लग इन गर्न सकिएन');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900 nepali-text">
            लग इन गर्नुहोस्
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            आफ्नो खातामा प्रवेश गर्नुहोस्
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 nepali-text">
                इमेल ठेगाना
              </label>
              <input
                {...register('email', { 
                  required: 'इमेल आवश्यक छ',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'मान्य इमेल ठेगाना प्रविष्ट गर्नुहोस्'
                  }
                })}
                type="email"
                className="input-field mt-1"
                placeholder="तपाईंको इमेल प्रविष्ट गर्नुहोस्"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 nepali-text">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 nepali-text">
                पासवर्ड
              </label>
              <div className="relative mt-1">
                <input
                  {...register('password', { 
                    required: 'पासवर्ड आवश्यक छ',
                    minLength: {
                      value: 6,
                      message: 'पासवर्ड कम्तिमा ६ अक्षरको हुनुपर्छ'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-10"
                  placeholder="तपाईंको पासवर्ड प्रविष्ट गर्नुहोस्"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 nepali-text">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 nepali-text">
                  मलाई सम्झनुहोस्
                </label>
              </div>

              <div className="text-sm">
                <Link href="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  पासवर्ड बिर्सनुभयो?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex justify-center items-center nepali-text"
            >
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                'लग इन गर्नुहोस्'
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">वा</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="btn-outline flex justify-center items-center">
                <FaGoogle className="h-5 w-5 mr-2" />
                Google
              </button>
              <button className="btn-outline flex justify-center items-center">
                <FaFacebook className="h-5 w-5 mr-2" />
                Facebook
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 nepali-text">
              खाता छैन?{' '}
              <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
                दर्ता गर्नुहोस्
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
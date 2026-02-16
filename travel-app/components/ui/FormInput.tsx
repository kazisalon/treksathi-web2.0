'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    subLabel?: string;
    icon?: LucideIcon;
    error?: string;
    iconColor?: string;
    bgColor?: string;
    borderColor?: string;
    ringColor?: string;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, subLabel, icon: Icon, error, iconColor = 'text-green-600', bgColor = 'bg-green-50', borderColor = 'border-green-200', ringColor = 'focus:ring-green-400', className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                        {Icon && <Icon className={`w-4 h-4 ${iconColor}`} />}
                        <span>{label}</span>
                    </div>
                    {subLabel && <span className="text-xs text-gray-500 font-normal">{subLabel}</span>}
                </label>
                <div className="relative">
                    <input
                        ref={ref}
                        className={`w-full ${bgColor} border-2 ${borderColor} rounded-xl px-4 py-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 ${ringColor} transition-all duration-300 ${error ? 'border-red-400 focus:ring-red-400' : ''} ${className}`}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
                )}
            </div>
        );
    }
);

FormInput.displayName = 'FormInput';

export default FormInput;

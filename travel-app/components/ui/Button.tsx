'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    icon?: LucideIcon;
    iconPlacement?: 'left' | 'right';
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    children,
    isLoading,
    variant = 'primary',
    icon: Icon,
    iconPlacement = 'right',
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = "font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2";

    const variants = {
        primary: "bg-gradient-to-r from-green-500 via-blue-500 to-yellow-500 hover:from-green-600 hover:via-blue-600 hover:to-yellow-600 text-white",
        secondary: "bg-blue-600 hover:bg-blue-700 text-white",
        outline: "border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 text-gray-700 bg-white",
        ghost: "bg-transparent hover:bg-gray-100 text-gray-700 shadow-none hover:shadow-none transform-none"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
                <>
                    {Icon && iconPlacement === 'left' && <Icon className="w-5 h-5" />}
                    <span>{children}</span>
                    {Icon && iconPlacement === 'right' && <Icon className="w-5 h-5" />}
                </>
            )}
        </button>
    );
};

export default Button;

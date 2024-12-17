'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignInForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const validateForm = () => {
        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.trim()) {
            setError('Email is required');
            return false;
        }

        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }

        if (!password) {
            setError('Password is required');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Prevent multiple submissions
        if (isSubmitting) return;

        // Validate form before submission
        if (!validateForm()) return;

        try {
            setIsSubmitting(true);

            const result = await signIn('credentials', {
                redirect: false,
                email: email.trim(),
                password
            });

            if (result?.error) {
                setError('Invalid email or password');
                setIsSubmitting(false);
            } else {
                router.push('/dashboard');
            }
        } catch {
            setIsSubmitting(false);
            setError('An unexpected error occurred');
        }
    };

    const handleForgotPassword = () => {
        // Redirect to forgot password page or open a modal
        router.push('/forgot-password');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
            {error && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-md">
                    {error}
                </div>
            )}

            <div>
                <label htmlFor="email" className="block text-white/70 mb-2">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="w-full bg-white/10 border border-white/20 text-white 
                        rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <label htmlFor="password" className="text-white/70">
                        Password
                    </label>
                    <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-sm text-cyan-400 hover:text-cyan-300 focus:outline-none"
                    >
                        Forgot Password?
                    </button>
                </div>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                        className="w-full bg-white/10 border border-white/20 text-white 
                            rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white focus:outline-none"
                    >
                        {showPassword ? '👁️' : '🙈'}
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-cyan-400 to-purple-600 
                    hover:from-cyan-500 hover:to-purple-700 text-white 
                    rounded-md py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
        </form>
    );
}

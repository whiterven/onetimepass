"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpForm() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const validateForm = () => {
        // Basic form validation
        if (!fullName.trim()) {
            setError('Full name is required');
            return false;
        }

        if (!email.trim()) {
            setError('Email is required');
            return false;
        }

        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
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

            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ // Send the fields as one object
                   name: fullName.trim(),
                    email: email.trim(),
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Signup failed');
            }

            // Redirect to the sign-in page after successful signup
            router.push('/signin');
        } catch (err) {
            setIsSubmitting(false);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        }
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
                <label htmlFor="fullName" className="block text-white/70 mb-2">
                    Full Name
                </label>
                <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                    className="w-full bg-white/10 border border-white/20 text-white 
            rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
            </div>

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
                <label htmlFor="password" className="block text-white/70 mb-2">
                    Password
                </label>
               <div className="relative">
                  <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      placeholder="Create a strong password"
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

                <p className="text-white/50 text-xs mt-1">
                    Password must be at least 8 characters long
                </p>
            </div>

            <div>
                <label htmlFor="confirmPassword" className="block text-white/70 mb-2">
                    Confirm Password
                </label>
               <div className="relative">
                   <input
                      type={showPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={8}
                      placeholder="Confirm your password"
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
                {isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </button>
        </form>
    );
}
'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, HelpCircle, Home, HelpCircle as HelpCircleIcon, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const getGreeting = () => {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 5 && hour < 12) {
    return 'Good morning';
  } else if (hour >= 12 && hour < 18) {
    return 'Good afternoon';
  } else if (hour >= 18 && hour < 23) {
    return 'Good evening';
  } else {
    return 'Happy Late Night';
  }
};

export const DashboardHeader = () => {
  const [greeting, setGreeting] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setGreeting(getGreeting());
    const intervalId = setInterval(() => {
      setGreeting(getGreeting());
    }, 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (greeting === null) {
    return null;
  }

  return (
    <header className="mb-8">
        <nav className="container mx-auto flex justify-between items-center mb-6">
             <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3">
                    {/* Custom Logo */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 50 50"
                        className="w-8 h-8 md:w-10 md:h-10"
                    >
                        <defs>
                            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: '#22d3ee', stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: '#9333ea', stopOpacity: 1 }} />
                            </linearGradient>
                        </defs>
                        <path
                            d="M25 5 L45 20 L25 35 L5 20 Z"
                            fill="url(#logoGradient)"
                        />
                        <path
                            d="M25 20 L45 35 L25 50 L5 35 Z"
                            fill="url(#logoGradient)"
                            fillOpacity="0.6"
                        />
                    </svg>
                    {/* Website Name */}
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600 md:text-2xl">
                        One Caller OTP
                    </span>
                </Link>

                {/* Desktop Navigation Links */}
                <ul className="hidden md:flex items-center space-x-4 ml-4">
                     <li>
                        <Button
                            variant="ghost"
                            className="hover:bg-white/10 transition-all duration-300 flex items-center space-x-2 w-full"
                            asChild
                        >
                            <Link href="/" className="flex items-center">
                                <Home className="w-4 h-4 mr-2" />
                                Home
                            </Link>
                        </Button>
                    </li>
                    <li>
                        <Button
                            variant="ghost"
                            className="hover:bg-white/10 transition-all duration-300 flex items-center space-x-2 w-full"
                            asChild
                        >
                            <Link href="/help" className="flex items-center">
                                <HelpCircleIcon className="w-4 h-4 mr-2" />
                                Help
                            </Link>
                        </Button>
                    </li>
                </ul>
                 {/* Mobile Hamburger Menu */}
                    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                            <SheetTrigger asChild className="md:hidden">
                                <Button variant="ghost" size="icon" className="text-white">
                                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="bg-[#112240] text-white border-l border-white/10">
                                <div className="flex flex-col space-y-4 mt-8">
                                    <ul className="space-y-2">
                                           <li>
                        <Button
                            variant="ghost"
                            className="hover:bg-white/10 transition-all duration-300 flex items-center space-x-2 w-full"
                            asChild
                        >
                            <Link href="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                                <Home className="w-4 h-4 mr-2" />
                                Home
                            </Link>
                        </Button>
                    </li>
                    <li>
                        <Button
                            variant="ghost"
                            className="hover:bg-white/10 transition-all duration-300 flex items-center space-x-2 w-full"
                            asChild
                        >
                            <Link href="/help" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                                <HelpCircleIcon className="w-4 h-4 mr-2" />
                                Help
                            </Link>
                        </Button>
                    </li>
                                    </ul>
                                </div>
                            </SheetContent>
                    </Sheet>
        </div>

            <div className="flex items-center space-x-4">
                <HelpCircle className="w-8 h-8 md:w-10 md:h-10 text-cyan-400 animate-bounce" />
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600 md:text-3xl">
                    {greeting}, User!
                </h1>
                <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-purple-400 animate-pulse" />
            </div>

        </nav>
        <p className="text-gray-300 text-lg leading-relaxed md:text-xl">
            Get insights and manage your OTP verification system seamlessly.
        </p>
    </header>
  );
};
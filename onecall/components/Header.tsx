'use client'

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Home, HelpCircle, CreditCard, LogIn, UserPlus, Menu, X } from 'lucide-react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const NavLinks = () => (
    <>
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
            <HelpCircle className="w-4 h-4 mr-2" />
            Help
          </Link>
        </Button>
      </li>
      <li>
        <Button 
          variant="ghost" 
          className="hover:bg-white/10 transition-all duration-300 flex items-center space-x-2 w-full"
          asChild
        >
          <Link href="/pricing" className="flex items-center">
            <CreditCard className="w-4 h-4 mr-2" />
            Pricing
          </Link>
        </Button>
      </li>
    </>
  );

  return (
    <header className="bg-[#112240]/50 backdrop-blur-sm text-white p-4 border-b border-white/10">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3">
          {/* Custom Logo */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 50 50" 
            className="w-10 h-10"
          >
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#22d3ee', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#9333ea', stopOpacity: 1}} />
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
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
            OneCaller
          </span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-4 items-center mr-4">
            <NavLinks />
          </ul>

          {/* Authentication Buttons */}
          <SignedOut>
            <div className="hidden md:flex space-x-2">
              <Button 
                variant="outline" 
                className="text-purple-600 border-cyan-400 hover:bg-cyan-500 hover:to-purple-700"
                asChild
              >
                <Link href="/sign-in" className="flex items-center">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Link>
              </Button>
              <Button 
                variant="default" 
                className="bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-500 hover:to-purple-700"
                asChild
              >
                <Link href="/sign-up" className="flex items-center">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign Up
                </Link>
              </Button>
            </div>
          </SignedOut>
          
          {/* User Profile Button */}
          <SignedIn>
            <UserButton 
              appearance={{
                elements: {
                  userButtonAvatarBox: 'w-10 h-10'
                }
              }}
            />
          </SignedIn>

          {/* Mobile Hamburger Menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#112240] text-white border-l border-white/10">
              <div className="flex flex-col space-y-4 mt-8">
                <SignedOut>
                  <div className="flex flex-col space-y-2">
                    <Button 
                      variant="outline" 
                      className="text-purple-600 border-cyan-400 hover:bg-cyan-500 hover:to-purple-700 w-full"
                      asChild
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link href="/sign-in" className="flex items-center">
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In
                      </Link>
                    </Button>
                    <Button 
                      variant="default" 
                      className="bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-500 hover:to-purple-700 w-full"
                      asChild
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link href="/sign-up" className="flex items-center">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                </SignedOut>

                <ul className="space-y-2">
                  <NavLinks />
                </ul>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
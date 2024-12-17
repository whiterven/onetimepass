'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, HelpCircle } from 'lucide-react';

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

    useEffect(() => {
        setGreeting(getGreeting())
        const intervalId = setInterval(() => {
            setGreeting(getGreeting());
        }, 60 * 1000);

        return () => clearInterval(intervalId)
    }, [])

    if (greeting === null) {
        return null
    }
  return (
    <header className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
                <HelpCircle className="w-10 h-10 text-cyan-400 animate-bounce" />
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
                    {greeting}, User!
                </h1>
              <ShieldCheck className="w-10 h-10 text-purple-400 animate-pulse" />
            </div>
        </div>
      <p className="text-gray-300 text-xl leading-relaxed">
            Get insights and manage your OTP verification system seamlessly.
      </p>
    </header>
  );
};
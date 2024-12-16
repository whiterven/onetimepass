import { Header } from '../components/Header'
import OneCaller from '../components/OneCaller'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Orbit, ShieldPlus, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-[#112240] to-[#0a192f] text-white overflow-hidden relative">
      {/* Animated background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_rgba(17,34,64,0.3)_0%,_rgba(10,25,47,0.6)_100%)] opacity-50"></div>
        <div className="absolute animate-pulse top-[10%] left-[20%] w-40 h-40 bg-cyan-500/20 rounded-full blur-2xl"></div>
        <div className="absolute animate-pulse top-[70%] right-[15%] w-52 h-52 bg-purple-500/20 rounded-full blur-2xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-16 relative">
          {/* Hero section */}
          <div className="text-center mb-16 space-y-6">
            <div className="flex justify-center items-center space-x-4 mb-4">
              <Orbit className="w-12 h-12 text-cyan-400 animate-spin-slow" />
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
                One Caller OTP System
              </h1>
              <ShieldPlus className="w-12 h-12 text-purple-400 animate-pulse" />
            </div>
            
            <p className="text-xl max-w-2xl mx-auto text-gray-300 leading-relaxed">
              Revolutionize your authentication with cutting-edge OTP verification via intelligent phone calls
            </p>
            
            <div className="flex justify-center space-x-4">
              <Button 
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                asChild
              >
                <Link href="#otp-form" className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Get Started
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 transition-all duration-300 transform hover:scale-105"
                asChild
              >
                <Link href="/help">Learn More</Link>
              </Button>
            </div>
          </div>

          {/* OTP Form Section */}
          <div 
            id="otp-form" 
            className="max-w-md mx-auto bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-8 transform transition-all duration-500 hover:scale-105"
          >
            <OneCaller />
          </div>
        </main>

        {/* Futuristic Footer */}
        <footer className="bg-[#112240]/50 backdrop-blur-sm py-6">
          <div className="container mx-auto text-center">
            <p className="text-gray-400">
              © 2024 One Caller OTP System. Secure Authentication Reimagined.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
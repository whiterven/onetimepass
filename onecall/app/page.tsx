//app/page.tsx

import { Header } from '../components/Header'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  Orbit, 
  ShieldPlus, 
  Zap, 
  Bitcoin, 
  CreditCard, 
  Lock, 
  Globe, 
  Clock 
} from 'lucide-react'

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType, 
  title: string, 
  description: string 
}) => (
  <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
    <div className="flex items-center mb-4 space-x-4">
      <Icon className="w-8 h-8 text-cyan-400" />
      <h3 className="text-xl font-semibold text-white">{title}</h3>
    </div>
    <p className="text-gray-300">{description}</p>
  </div>
);

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
                <Link href="/signin" className="flex items-center">
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

          {/* Features Section */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600 mb-4">
                Why Choose One Caller
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Experience secure, fast, and flexible authentication with our advanced OTP verification system
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard 
                icon={Bitcoin}
                title="Crypto Payments"
                description="We accept Bitcoin and USDT, providing you with secure and flexible payment options for our services."
              />
              <FeatureCard 
                icon={Lock}
                title="Secure Verification"
                description="Our multi-layered authentication process ensures maximum security with minimal friction for your users."
              />
              <FeatureCard 
                icon={Clock}
                title="Fast Authentication"
                description="Experience lightning-fast OTP verification with our intelligent phone call system, reducing wait times dramatically."
              />
            </div>
          </section>

          {/* Payment and Security Section */}
          <section className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 mb-16">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600 mb-4">
                  Secure Cryptocurrency Payments
                </h2>
                <p className="text-gray-300 mb-6">
                  We prioritize your financial flexibility and security. Our platform supports payments via Bitcoin and USDT, 
                  allowing you to leverage the power of blockchain technology for seamless transactions.
                </p>
                <div className="flex space-x-4">
                  <Bitcoin className="w-12 h-12 text-orange-400" />
                  <Globe className="w-12 h-12 text-green-400" />
                  <CreditCard className="w-12 h-12 text-cyan-400" />
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Payment Benefits</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center space-x-3">
                    <ShieldPlus className="w-5 h-5 text-green-400" />
                    <span>Instant cryptocurrency transactions</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Lock className="w-5 h-5 text-cyan-400" />
                    <span>Enhanced privacy and security</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-purple-400" />
                    <span>Global payment accessibility</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
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
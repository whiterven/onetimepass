'use client'

import { useState } from 'react'
import { Header } from '../../components/Header'
import { Button } from '@/components/ui/button'
import { CreditCard, Check, Bitcoin, Wallet } from 'lucide-react'
//import Link from 'next/link'
import { CryptoPaymentModal } from '@/components/CryptoPaymentModal'

// Define the type for a single plan
interface Plan {
  name: string;
  price: number;
  calls: number;
  features: string[];
}

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null); // Specify the type here
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const plans: Plan[] = [ // Specify the type here
    {
      name: 'Starter',
      price: 6,
      calls: 2,
      features: [
        '2 OTP Calls',
        'Basic Authentication',
        'Limited Support'
      ]
    },
    {
      name: 'Pro',
      price: 14,
      calls: 6,
      features: [
        '6 OTP Calls',
        'Advanced Authentication',
        'Priority Support'
      ]
    },
    {
      name: 'Enterprise',
      price: 49,
      calls: 20,
      features: [
        '20 OTP Calls',
        'Premium Authentication',
        '24/7 Dedicated Support'
      ]
    }
  ];

  const handlePurchase = (plan: Plan) => { // Specify the type here
    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
  };

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
          {/* Pricing Page Header */}
          <div className="text-center mb-16 space-y-6">
            <div className="flex justify-center items-center space-x-4 mb-4">
              <CreditCard className="w-12 h-12 text-cyan-400 animate-bounce" />
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
                Pricing Plans
              </h1>
              <Wallet className="w-12 h-12 text-purple-400 animate-pulse" />
            </div>
            
            <p className="text-xl max-w-2xl mx-auto text-gray-300 leading-relaxed">
              Flexible, transparent pricing for secure OTP authentication. Pay with Bitcoin or USDT.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan) => (
              <div 
                key={plan.name} 
                className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-6 transform transition-all duration-500 hover:scale-105"
              >
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
                    {plan.name}
                  </h2>
                  <p className="text-4xl font-extrabold mb-4">${plan.price}</p>
                  <p className="text-gray-300">{plan.calls} Calls</p>
                </div>
                
                <ul className="space-y-4 mb-8 text-gray-300">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-cyan-400 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={() => handlePurchase(plan)}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                >
                  <Bitcoin className="w-5 h-5 mr-2" />
                  Purchase Plan
                </Button>
              </div>
            ))}
          </div>

          {/* Cryptocurrency Payment Modal */}
          <CryptoPaymentModal
            plan={selectedPlan?.name || ''}
            amount={selectedPlan?.price || 0}
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
          />

          {/* Payment Information Section */}
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
              Flexible Cryptocurrency Payments
            </h2>
            <p className="text-xl max-w-2xl mx-auto text-gray-300 leading-relaxed">
              We accept Bitcoin and USDT for all our pricing plans. Secure, fast, and convenient payment methods.
            </p>
            <div className="flex justify-center space-x-4">
              <div className="flex items-center bg-white/10 backdrop-blur-lg rounded-xl p-4">
                <Bitcoin className="w-12 h-12 text-orange-500 mr-4" />
                <span className="text-white">Bitcoin</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-lg rounded-xl p-4">
                <Wallet className="w-12 h-12 text-cyan-400 mr-4" />
                <span className="text-white">USDT</span>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-[#112240]/50 backdrop-blur-sm py-6">
          <div className="container mx-auto text-center">
            <p className="text-gray-400">
              © 2024 One Caller OTP System. Secure Authentication Made Simple.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
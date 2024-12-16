import { Header } from '../../components/Header'
import { Button } from '@/components/ui/button'
import { ShieldCheck, HelpCircle, BookOpen, MessageCircleQuestion, Video, FileText, Zap } from 'lucide-react'
import Link from 'next/link'

export default function HelpPage() {
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
          {/* Help Page Header */}
          <div className="text-center mb-16 space-y-6">
            <div className="flex justify-center items-center space-x-4 mb-4">
              <HelpCircle className="w-12 h-12 text-cyan-400 animate-bounce" />
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
                Help &amp; Support
              </h1>
              <ShieldCheck className="w-12 h-12 text-purple-400 animate-pulse" />
            </div>

            <p className="text-xl max-w-2xl mx-auto text-gray-300 leading-relaxed">
              Your comprehensive guide to using the One Caller OTP System seamlessly and securely
            </p>
          </div>

          {/* Help Sections */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* How to Use */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-6 transform transition-all duration-500 hover:scale-105">
              <BookOpen className="w-12 h-12 text-cyan-400 mb-4" />
              <h2 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
                How to Use One Caller OTP
              </h2>
              <ol className="space-y-2 text-gray-300">
                <li>1. Open the One Caller OTP System</li>
                <li>2. Select your country code from the dropdown menu</li>
                <li>3. Enter the phone number you want to call</li>
                <li>4. Click the &quot;Call User&quot; button to initiate the call</li>
                <li>5. Wait for the call status updates</li>
                <li>6. If successful, the OTP will be displayed</li>
              </ol>
            </div>

            {/* Troubleshooting */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-6 transform transition-all duration-500 hover:scale-105">
              <MessageCircleQuestion className="w-12 h-12 text-purple-400 mb-4" />
              <h2 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
                Troubleshooting
              </h2>
              <ul className="space-y-2 text-gray-300">
                <li>• Ensure correct phone number entry</li>
                <li>• Verify selected country code</li>
                <li>• Check network connectivity</li>
                <li>• Verify phone is not in do not disturb mode</li>
                <li>• If call fails, wait a few minutes and retry</li>
                <li>• Contact support for persistent issues</li>
              </ul>
            </div>

            {/* FAQs */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-6 transform transition-all duration-500 hover:scale-105">
              <FileText className="w-12 h-12 text-cyan-400 mb-4" />
              <h2 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
                Frequently Asked Questions
              </h2>
              <ul className="space-y-2 text-gray-300">
                <li>• Is my data secure? Absolutely!</li>
                <li>• What is OTP? One-Time Password</li>
                <li>• How long is the OTP valid? 5 minutes</li>
                <li>• Can I use international numbers? Yes!</li>
                <li>• Is there a call cost? Check your plan</li>
                <li>• Need more help? Contact support</li>
              </ul>
            </div>
          </div>

          {/* Support Options */}
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
              Need More Assistance?
            </h2>
            <div className="flex justify-center space-x-4">
              <Button
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                asChild
              >
                <Link href="mailto:support@onecallerotp.com" className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Contact Support
                </Link>
              </Button>
              <Button
                variant="outline"
                className="border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 transition-all duration-300 transform hover:scale-105 flex items-center"
                asChild
              >
                <Link href="#" className="flex items-center">
                  <Video className="w-5 h-5 mr-2" />
                  Watch Tutorial
                </Link>
              </Button>
            </div>
          </div>
        </main>

        {/* Footer */}
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
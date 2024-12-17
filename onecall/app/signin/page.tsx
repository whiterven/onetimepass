// app/signin/page.tsx
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import SignInForm from '@/components/SignInForm'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#112240] to-[#0a192f] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 p-8">
        <Link 
          href="/" 
          className="flex items-center text-white hover:text-cyan-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600 mb-4">
            Welcome Back
          </h1>
          <p className="text-white/70">Sign in to continue</p>
        </div>

        <SignInForm />

        <div className="text-center mt-6">
          <p className="text-white/70">
            Don&apos;t have an account? {' '}
            <Link 
              href="/signup" 
              className="text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
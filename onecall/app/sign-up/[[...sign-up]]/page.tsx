import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SignUpPage() {
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
            Create an Account
          </h1>
          <p className="text-white/70">Join One Caller OTP today</p>
        </div>

        <SignUp 
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          appearance={{
            elements: {
              card: 'bg-transparent shadow-none',
              headerTitle: 'text-white',
              headerSubtitle: 'text-white/70',
              socialButtonsBlockButton: 'bg-white/10 border border-white/20 text-white hover:bg-white/20',
              socialButtonsBlockButtonText: 'text-white',
              dividerLine: 'bg-white/20',
              dividerText: 'text-white/70',
              formFieldLabel: 'text-white/70',
              formFieldInput: 'bg-white/10 border border-white/20 text-white focus:border-cyan-400 focus:ring-cyan-400',
              submitButton: 'bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-500 hover:to-purple-700 text-white',
              footerActionLink: 'text-cyan-400 hover:text-cyan-300',
              identityPreviewEditButton: 'text-cyan-400 hover:text-cyan-300'
            },
            layout: {
              socialButtonsVariant: 'blockButton',
              showOptionalFields: false
            }
          }}
        />

        <div className="text-center mt-6">
          <p className="text-white/70">
            Already have an account? {' '}
            <Link 
              href="/sign-in" 
              className="text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
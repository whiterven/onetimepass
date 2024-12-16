import { Header } from '../components/Header'
import OneCaller from '../components/OneCaller'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to One Caller OTP System</h1>
          <p className="text-xl text-white mb-8">Secure, fast, and reliable OTP verification via phone calls</p>
          <div className="flex justify-center space-x-4">
            <Button asChild>
              <Link href="#otp-form">Get Started</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/help">Learn More</Link>
            </Button>
          </div>
        </div>
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6" id="otp-form">
          <OneCaller />
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 One Caller OTP System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}


'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { Bitcoin, Wallet2 } from 'lucide-react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { z } from 'zod';
import { useSession } from 'next-auth/react'; // Using next-auth
import Link from "next/link";

const paymentSchema = z.object({
    amount: z.string().min(1, "Amount is required").refine((value) => !isNaN(Number(value)), "Amount must be a number"),
    cryptoType: z.enum(['bitcoin', 'usdt'], {
        errorMap: () => { // removed unused params
            return { message: "Invalid crypto type must be bitcoin or usdt" }
        }
    }),
});

const PurchaseCrypto = () => {
    const router = useRouter();
    const [amount, setAmount] = useState('');
    const [cryptoType, setCryptoType] = useState<'bitcoin' | 'usdt' | null>(null);
    const [paymentAddress, setPaymentAddress] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<
        'idle' | 'pending' | 'success' | 'failed' | 'confirmed'
        >('idle');
    const [paymentTimer, setPaymentTimer] = useState<NodeJS.Timeout | null>(null);
    const { data: session, status } = useSession(); // Using next-auth to get the session

    const userId = session?.user?.id; // Get userId from session

     useEffect(() => {
            // Clear the timer on component unmount
             return () => {
              if (paymentTimer) clearTimeout(paymentTimer);
           }
      }, [paymentTimer]);

    const handleBuyCredits = async () => {
        setError(null);
         const validationResult = paymentSchema.safeParse({amount, cryptoType});
        if (!validationResult.success) {
            setPaymentStatus("failed");
            setError(JSON.stringify(validationResult.error.flatten().fieldErrors));
            return;
        }
      if (status !== 'authenticated') {
           setError('User is not authenticated.');
            setPaymentStatus("failed");
          return;
       }

         if (!userId) {
          setError('User ID is not found in session. Please sign out and sign in again.');
            setPaymentStatus("failed");
          return;
        }
        setPaymentStatus('pending');
        setProcessing(true);
        try {
            const response = await fetch('/api/create-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount, cryptoType, userId }),
            });

             if (!response.ok) {
                const errorData = await response.json();
                setPaymentStatus("failed");
                throw new Error(errorData.error || 'An error occurred with your payment.');
            }


            const data = await response.json();
            setPaymentAddress(data.paymentAddress);
             setPaymentStatus('success');
            console.log("Payment address generated succesfully");
             // Set the timer every 5 minutes
             const timer = setInterval(() => {
                    handlePaymentCheck()
              }, 300000); // Check every 5 minutes

             setPaymentTimer(timer);
        } catch (err: unknown) { // Changed to unknown
           console.error('Error creating payment:', err);
            setError((err as Error).message || 'An error occurred during payment processing.');
            setPaymentStatus('failed');
        } finally {
             setProcessing(false);
        }
    };


    const handlePaymentCheck = async () => {
      if (!paymentAddress) {
          console.log("No payment address to check");
          return
      }
         try {
            const response = await fetch('/api/check-payment', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({paymentAddress}),
            });

             if (!response.ok) {
                 const errorData = await response.json();
                console.error("Error checking payment", errorData.error || 'An error occurred while checking payment status.');
                return
            }

            const data = await response.json();
            if (data.paymentStatus === 'charge:confirmed') {
                 console.log('Payment confirmed via timer check.');
                 setPaymentStatus('confirmed');
                 if (paymentTimer) clearTimeout(paymentTimer);

            } else {
                 console.log('Payment not yet confirmed via timer check.');
            }

        } catch (err: unknown) {  // Changed to unknown
             console.error('Error checking payment status:', err);
       }
    };

     const handleCompletePayment = () => {
        // You can add a timer to check every X minutes if the payment was made
        // This will be handled by the payment gateway using webhooks
         alert(`Payment successful! You have purchased ${amount} USD in ${cryptoType} credits`);
        router.push('/dashboard');
    };


    if (status === "loading") {
        return <div>Loading session...</div>
    }

    if (status === "unauthenticated") {
        return <div className="min-h-screen bg-gradient-to-br from-[#112240] to-[#0a192f] flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 p-8 text-white">
                <p>You must sign in to buy credits.</p>
                <Link
                    href="/signin"
                    className="text-cyan-400 hover:text-cyan-300 font-semibold mt-4 inline-block"
                >
                    Sign In
                </Link>
            </div>
        </div>
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-[#112240] to-[#0a192f] text-white overflow-hidden relative">
            {/* Background effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_rgba(17,34,64,0.3)_0%,_rgba(10,25,47,0.6)_100%)] opacity-50"></div>
                <div className="absolute animate-pulse top-[10%] left-[20%] w-40 h-40 bg-cyan-500/20 rounded-full blur-2xl"></div>
                <div className="absolute animate-pulse top-[70%] right-[15%] w-52 h-52 bg-purple-500/20 rounded-full blur-2xl"></div>
            </div>
            <div className="relative z-10 container mx-auto px-4 py-8">
                {/* Dashboard Header */}
                <DashboardHeader />
                <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
                    Buy Credits
                </h1>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                    <div className="mb-6">
                        <Label htmlFor="amount" className="text-white block mb-2">
                            Amount (USD)
                        </Label>
                        <Input
                            id="amount"
                            type="number"
                            placeholder="Enter amount in USD"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="bg-white/5 border border-white/20 rounded-md focus:ring-2 focus:ring-cyan-500 text-white"
                        />
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Select Crypto</h3>
                        <div className="flex flex-wrap gap-4">
                            <Button
                                onClick={() => setCryptoType('bitcoin')}
                                className={`flex items-center space-x-2 transition-all duration-300
                  ${cryptoType === 'bitcoin'
                                        ? 'bg-gradient-to-r from-cyan-500 to-purple-600'
                                        : 'bg-white/10 hover:bg-white/20'
                                    }
                `}
                            >
                                <Bitcoin className="w-5 h-5" />
                                <span>Bitcoin</span>
                            </Button>
                            <Button
                                onClick={() => setCryptoType('usdt')}
                                className={`flex items-center space-x-2 transition-all duration-300
                  ${cryptoType === 'usdt'
                                        ? 'bg-gradient-to-r from-cyan-500 to-purple-600'
                                        : 'bg-white/10 hover:bg-white/20'
                                    }
                `}
                            >
                                <Wallet2 className="w-5 h-5" />
                                <span>USDT</span>
                            </Button>
                        </div>
                    </div>
                    {error && (
                        <div
                            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                            role="alert"
                        >
                            <strong className="font-bold">Error: </strong>
                           <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    {paymentStatus === 'pending' &&
                         <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4" role="alert">
                           <strong className="font-bold">Loading: </strong>
                           <span className="block sm:inline">Generating payment address...</span>
                         </div>
                    }
                   {paymentStatus === 'success' &&
                         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                             <strong className="font-bold">Success: </strong>
                            <span className="block sm:inline">Payment address generated succesfully, waiting for confirmation...</span>
                         </div>
                    }
                    {paymentStatus === 'confirmed' &&
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Success: </strong>
                            <span className="block sm:inline">Payment confirmed, credits updated!</span>
                        </div>
                    }
                    {paymentAddress && (
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-white mb-4">
                                Send the payment to:
                            </h3>
                            <p className="text-gray-300 break-words">{paymentAddress}</p>
                        </div>
                    )}
                    <Button
                        onClick={handleBuyCredits}
                        disabled={!amount || !cryptoType || processing}
                        className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 transition-all duration-300"
                    >
                        {processing ? 'Processing...' : 'Generate Payment Address'}
                    </Button>
                    {paymentAddress && (
                        <Button
                            onClick={handleCompletePayment}
                            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 mt-2"
                        >
                            I have completed the payment
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PurchaseCrypto;
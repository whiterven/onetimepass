'use client';

import { useState, useEffect } from 'react';
import {
  BarChart2,
  Phone,
  CreditCard,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Package,
} from 'lucide-react';
import OneCaller from '@/components/OneCaller';
import { Button } from '@/components/ui/button';
import { DashboardHeader } from '../../components/DashboardHeader';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';
import Link from "next/link"

const prisma = new PrismaClient();

const DashboardCard = ({
  icon: Icon,
  title,
  value,
  trend,
  trendColor,
  trendIcon: TrendIcon,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  trend?: string;
  trendColor?: string;
  trendIcon?: React.ElementType;
}) => (
  <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
    <div className="flex justify-between items-center mb-4">
      <Icon className="w-8 h-8 text-cyan-400" />
      <div className="flex items-center space-x-1">
        {TrendIcon && <TrendIcon className={`w-4 h-4 ${trendColor}`} />}
        <span className={`text-sm font-medium ${trendColor}`}>{trend || ''}</span>
      </div>
    </div>
    <h3 className="text-gray-300 text-sm mb-2">{title}</h3>
    <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
      {value}
    </p>
  </div>
);

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState<'otp' | 'billing' | 'usage'>('otp');
  const [selectedPlan, setSelectedPlan] = useState('Pro Plan'); // Default plan
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const [paymentStatus, ] = useState<'idle' | 'pending' | 'success' | 'confirmed'>('idle');
  const [loadingCredits, setLoadingCredits] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (status === 'unauthenticated') {
        return;
    }

    const fetchUserCredits = async () => {
      if (!userId) return;
        setLoadingCredits(true);
      try {
        const user = await prisma.user.findUnique({
          where: {
            id: userId
          }
        });
        setUserCredits(user?.credits || 0);
      } catch (error) {
        console.error("Error fetching user credits", error);
        setUserCredits(0);
      } finally {
        setLoadingCredits(false);
      }
    };
      fetchUserCredits();
    }, [status, userId]);

    const handlePlanChange = (plan: string) => {
        setSelectedPlan(plan);
    };

    const handleBuyCreditClick = () => {
        router.push('/buy-credits');
    };

    const renderActiveTabContent = () => {
        switch (activeTab) {
            case 'otp':
                return <OneCaller />;
            case 'billing':
                return (
                    <div>
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4 mb-4">
                                <CreditCard className="w-8 h-8 text-cyan-400" />
                                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
                                    Billing Information
                                </h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-xl font-semibold text-white mb-4">Selected Plan</h3>
                                        <p className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600 mb-2">
                                            {selectedPlan}
                                        </p>
                                        <p className="text-gray-300 mb-4">Comprehensive features for advanced users</p>
                                    </div>
                                    <div>
                                        <div className="flex space-x-2 mb-2">
                                            <Button
                                                onClick={() => handlePlanChange('Basic Plan')}
                                                className={`w-full  hover:bg-white/20 transition-all duration-300 text-sm
                          ${selectedPlan === 'Basic Plan'
                                                        ? 'bg-gradient-to-r from-cyan-500 to-purple-600'
                                                        : 'bg-white/10'
                                                    }`}
                                            >
                                                Basic Plan
                                            </Button>
                                            <Button
                                                onClick={() => handlePlanChange('Pro Plan')}
                                                className={`w-full  hover:bg-white/20 transition-all duration-300 text-sm
                          ${selectedPlan === 'Pro Plan'
                                                        ? 'bg-gradient-to-r from-cyan-500 to-purple-600'
                                                        : 'bg-white/10'
                                                    }`}
                                            >
                                                Pro Plan
                                            </Button>
                                        </div>
                                        <Button
                                            onClick={handleBuyCreditClick}
                                            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 transition-all duration-300"
                                        >
                                            Buy Credits
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 flex justify-between items-center">
                                        <div className="flex items-center space-x-3">
                                            <Package className="w-6 h-6 text-cyan-400" />
                                            <span className="text-gray-300">Current Credits</span>
                                        </div>
                                        <span className="text-white font-medium">
                                            {loadingCredits ? 'Loading...' : userCredits}
                                        </span>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 flex justify-between items-center">
                                        <div className="flex items-center space-x-3">
                                            <CreditCard className="w-6 h-6 text-cyan-400" />
                                            <span className="text-gray-300">Payment Method</span>
                                        </div>
                                        <span className="text-white font-medium">Bitcoin / USDT</span>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 flex justify-between items-center">
                                        <div className="flex items-center space-x-3">
                                            <Users className="w-6 h-6 text-cyan-400" />
                                            <span className="text-gray-300">Active Users</span>
                                        </div>
                                        <span className="text-white font-medium">5 / 10</span>
                                    </div>
                                    {paymentStatus === 'pending' &&
                                       <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
                                          <span className="block sm:inline">Payment is pending...</span>
                                        </div>
                                    }
                                    {paymentStatus === 'success' &&
                                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                                          <span className="block sm:inline">Payment address generated successfully, waiting for confirmation...</span>
                                        </div>
                                    }
                                   {paymentStatus === 'confirmed' &&
                                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                                          <span className="block sm:inline">Payment confirmed, credits updated!</span>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'usage':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <BarChart2 className="w-8 h-8 text-cyan-400" />
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
                                Usage Statistics
                            </h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            <DashboardCard
                                icon={Phone}
                                title="Total OTP Calls"
                                value="42"
                                trend="+12%"
                                trendColor="text-green-500"
                                trendIcon={TrendingUp}
                            />
                            <DashboardCard
                                icon={Users}
                                title="Unique Users"
                                value="157"
                                trend="+8%"
                                trendColor="text-green-500"
                                trendIcon={TrendingUp}
                            />
                            <DashboardCard
                                icon={Clock}
                                title="Avg Call Duration"
                                value="27 sec"
                                trend="-5%"
                                trendColor="text-red-500"
                                trendIcon={TrendingDown}
                            />
                        </div>
                        <div className="grid md:grid-cols-2 gap-6 mt-6">
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 flex flex-col justify-center">
                                <div className="flex items-center space-x-4 mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-400" />
                                    <h3 className="text-xl font-semibold text-white">Call Success Rate</h3>
                                </div>
                                <div className="flex items-center space-x-6">
                                    <p className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
                                        92%
                                    </p>
                                    <div>
                                        <p className="text-green-400 font-medium flex items-center">
                                            <TrendingUp className="w-4 h-4 mr-1" /> Improved Performance
                                        </p>
                                        <p className="text-gray-300 text-sm">Consistent reliability</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 flex flex-col justify-center">
                                <div className="flex items-center space-x-4 mb-4">
                                    <XCircle className="w-8 h-8 text-red-400" />
                                    <h3 className="text-xl font-semibold text-white">Failed Calls</h3>
                                </div>
                                <div className="flex items-center space-x-6">
                                    <p className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
                                        8%
                                    </p>
                                    <div>
                                        <p className="text-red-400 font-medium flex items-center">
                                            <TrendingDown className="w-4 h-4 mr-1" /> Reducing Failures
                                        </p>
                                        <p className="text-gray-300 text-sm">Continuous improvement</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };
    if (status === "loading") {
        return <div>Loading session...</div>;
    }
    if (status === "unauthenticated") {
        return <div className="min-h-screen bg-gradient-to-br from-[#112240] to-[#0a192f] flex items-center justify-center">
             <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 p-8 text-white">
                  <p>You must sign in to view the dashboard.</p>
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

      {/* Main Dashboard Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <DashboardHeader />

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          {[
            { key: 'otp', label: 'OTP Verification', icon: Phone },
            { key: 'billing', label: 'Billing', icon: CreditCard },
            { key: 'usage', label: 'Usage', icon: BarChart2 },
          ].map((tab) => (
            <Button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'otp' | 'billing' | 'usage')}
              className={`
                flex items-center space-x-2
                ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600'
                    : 'bg-white/10 hover:bg-white/20'
                }
                backdrop-blur-lg
                transition-all duration-300
                md:px-4 md:py-2
                px-2 py-1 text-sm md:text-base
              `}
            >
              <tab.icon className="w-4 h-4 md:w-5 md:h-5" />
              <span>{tab.label}</span>
            </Button>
          ))}
        </div>

        {/* Active Tab Content */}
        {renderActiveTabContent()}
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CountryCodeSelector } from './CountryCodeSelector';
import { isValidPhoneNumber, CountryCode } from 'libphonenumber-js';
import { 
  Phone, 
  Loader2, 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  KeyRound, 
  Building, 
  User 
} from 'lucide-react';

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

export default function OneCaller() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [callerName, setCallerName] = useState('');
  const [countryCode, setCountryCode] = useState<CountryCode | ''>('');
  const [selectedBank, setSelectedBank] = useState('');
  const [callStatus, setCallStatus] = useState('');
  const [callStatusDescription, setCallStatusDescription] = useState('');
  const [otpCode, setOtpCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [callInitiated, setCallInitiated] = useState(false);

  const banks = [
    'JPMorgan Chase', 'Citibank', 'Goldman Sachs', 'TD Bank', 
    'Citizens Bank', 'Morgan Stanley', 'KeyBank', 
    'Bank of America Financial', 'U.S. Bank Branch', 'Truist', 
    'BMO Harris Bank', 'Fifth Third Bank', 'Huntington Bank', 
    'Ally Bank', 'Wells Fargo Bank', 'PNC Bank', 'Capital One Bank', 
    'First Citizens Bank', 'M&T Bank', 'American Express', 
    'Paypal', 'Coinbase', 'Cash App'
  ];

  const validatePhoneNumber = (number: string, country: CountryCode) => {
    try {
      return isValidPhoneNumber(number, country);
    } catch {
      return false;
    }
  };

  const initiateCall = async () => {
    setIsLoading(true);
    setError('');
    setCallStatus('');
    setCallStatusDescription('');
    setOtpCode(null);
    setCallInitiated(true);

    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    const countryCodeWithoutPlus = countryCode.replace('+', '') as CountryCode;

    if (!validatePhoneNumber(fullPhoneNumber, countryCodeWithoutPlus)) {
      setError('Invalid phone number. Please check and try again.');
      setIsLoading(false);
      setCallInitiated(false);
      return;
    }

    if (!selectedBank) {
      setError('Please select a bank for verification.');
      setIsLoading(false);
      setCallInitiated(false);
      return;
    }

    try {
      const response = await fetch('/api/make-otp-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phoneNumber: fullPhoneNumber,
          bank: selectedBank,
          // Only send callerName if it's not an empty string
          ...(callerName.trim() && { callerName: callerName.trim() })
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to initiate call');
      }

      const { callSid, status } = await response.json();
      setCallStatus(status);
      pollCallStatus(callSid);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setCallInitiated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const pollCallStatus = async (callSid: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/check-call-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ callSid }),
        });

        if (!response.ok) throw new Error('Failed to check call status');

        const { status, statusDescription, otpCode: fetchedOtpCode } = await response.json();
        setCallStatus(status);
        setCallStatusDescription(statusDescription);

        if (fetchedOtpCode) {
          setOtpCode(fetchedOtpCode);
        }

        if (['completed', 'failed', 'busy', 'no-answer', 'canceled'].includes(status)) {
          clearInterval(pollInterval);
        }
      } catch (err) {
        console.error('Error polling call status:', err);
        clearInterval(pollInterval);
      }
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-4">
        <ShieldCheck className="w-8 h-8 text-cyan-400" />
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
          OTP Verification
        </h2>
      </div>

      <div className="space-y-4">
        <div className="flex space-x-2">
          <div className="w-1/3">
            <CountryCodeSelector
              onSelect={(code) => setCountryCode(code as CountryCode)}
              className="bg-white/10 backdrop-blur-lg border border-white/20 text-white"
            />
          </div>
          <Input
            type="tel"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="flex-grow bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-gray-400 focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center space-x-2">
          <User className="w-5 h-5 text-cyan-400" />
          <Input
            type="text"
            placeholder="Your name (optional)"
            value={callerName}
            onChange={(e) => setCallerName(e.target.value)}
            className="flex-grow bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-gray-400 focus:border-cyan-400"
          />
        </div>

        <Select 
          value={selectedBank} 
          onValueChange={setSelectedBank}
        >
          <SelectTrigger 
            className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white"
          >
            <div className="flex items-center">
            <Building className="mr-2 h-4 w-4 text-cyan-400" />
              <SelectValue placeholder="Select Bank for Verification" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-white/20 text-white">
            {banks.map((bank) => (
              <SelectItem 
                key={bank} 
                value={bank}
                className="hover:bg-white/20 focus:bg-white/20"
              >
                {bank}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={initiateCall}
          disabled={isLoading || !phoneNumber || !countryCode || !selectedBank}
          className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Initiating Call...
            </>
          ) : (
            <>
              <Phone className="mr-2 h-4 w-4" />
              Call User
            </>
          )}
        </Button>

        {error && (
          <div className="flex items-center space-x-2 text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/30">
            <AlertTriangle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        {callStatus && (
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-3 border border-white/20">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
              <div>
                <p className="text-gray-300">
                  Call Status: <span className="text-white">{callStatus}</span>
                </p>
                <p className="text-gray-400 text-sm">{callStatusDescription}</p>
              </div>
            </div>
          </div>
        )}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-3 border border-white/20 flex items-center space-x-2">
          <KeyRound className="w-5 h-5 text-yellow-400" />
          <div>
            {callInitiated ? (otpCode ? (
              <p className="text-white">
                OTP Code: <span className="font-bold">{otpCode}</span>
              </p>
            ) : (
              <p className="text-gray-400">
                No OTP code received.
              </p>
            )) : (
              <p className="text-gray-400">
                Please initiate call to see OTP status.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
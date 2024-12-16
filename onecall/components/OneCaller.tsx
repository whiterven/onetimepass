'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CountryCodeSelector } from './CountryCodeSelector';
import { isValidPhoneNumber, CountryCode } from 'libphonenumber-js'; // Import CountryCode type
import { Phone, Loader2 } from 'lucide-react';

export default function OneCaller() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState<CountryCode | ''>(''); // Use CountryCode type
  const [callStatus, setCallStatus] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
    setOtpCode('');

    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    const countryCodeWithoutPlus = countryCode.replace('+', '') as CountryCode;

    if (!validatePhoneNumber(fullPhoneNumber, countryCodeWithoutPlus)) {
      setError('Invalid phone number. Please check and try again.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/make-otp-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: fullPhoneNumber }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to initiate call');
      }

      const { callSid, status } = await response.json();
      setCallStatus(status);

      // Start polling for call status
      pollCallStatus(callSid);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
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

        const { status, otpCode } = await response.json();
        setCallStatus(status);

        if (otpCode) {
          setOtpCode(otpCode);
          clearInterval(pollInterval);
        }

        if (['completed', 'failed', 'busy', 'no-answer'].includes(status)) {
          clearInterval(pollInterval);
        }
      } catch (err) {
        console.error('Error polling call status:', err);
        clearInterval(pollInterval);
      }
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Enter Phone Number</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <CountryCodeSelector onSelect={(code) => setCountryCode(code as CountryCode)} />
          <Input
            type="tel"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <Button 
          onClick={initiateCall} 
          disabled={isLoading || !phoneNumber || !countryCode}
          className="w-full"
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
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {callStatus && (
          <div className="mt-4 p-3 bg-gray-100 rounded-md">
            <p className="font-semibold">Call Status: <span className="font-normal">{callStatus}</span></p>
          </div>
        )}
        {otpCode && (
          <div className="mt-4 p-3 bg-green-100 rounded-md">
            <p className="font-semibold">OTP Code: <span className="font-normal">{otpCode}</span></p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

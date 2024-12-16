//components/CryptoPaymentModal.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { 
  Bitcoin, 
  Copy, 
  CheckCircle, 
  Wallet 
} from 'lucide-react';

interface CryptoPaymentModalProps {
  plan: string;
  amount: number;
  isOpen: boolean;
  onClose: () => void;
}

// Mock wallet addresses (replace with your actual addresses)
const WALLET_ADDRESSES = {
  BTC: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
  USDT: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
};

const cryptoOptions = [
  { 
    name: 'Bitcoin', 
    icon: Bitcoin, 
    address: WALLET_ADDRESSES.BTC 
  },
  { 
    name: 'USDT', 
    icon: Wallet, 
    address: WALLET_ADDRESSES.USDT 
  }
];

export function CryptoPaymentModal({ 
  plan, 
  amount, 
  isOpen, 
  onClose 
}: CryptoPaymentModalProps) {
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#112240] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
            Complete {plan} Plan Payment
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Choose your preferred cryptocurrency to complete the purchase
          </DialogDescription>
        </DialogHeader>

        {/* Crypto Selection */}
        <div className="space-y-4 mb-6">
          <h3 className="text-xl font-semibold">Select Cryptocurrency</h3>
          <div className="grid grid-cols-2 gap-4">
            {cryptoOptions.map((crypto) => (
              <Button
                key={crypto.name}
                variant={selectedCrypto === crypto.name ? 'default' : 'outline'}
                className={`
                  flex items-center justify-center space-x-2 
                  ${selectedCrypto === crypto.name 
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600' 
                    : 'border-white/20 text-white hover:bg-white/10'}
                `}
                onClick={() => setSelectedCrypto(crypto.name)}
              >
                <crypto.icon className="w-5 h-5" />
                <span>{crypto.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Payment Details */}
        {selectedCrypto && (
          <div className="bg-white/10 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Amount:</span>
              <span className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
                ${amount}
              </span>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Send to Address:</h4>
              <div className="flex items-center bg-white/20 p-2 rounded">
                <input
                  type="text"
                  readOnly
                  value={cryptoOptions.find(c => c.name === selectedCrypto)?.address || ''}
                  className="bg-transparent w-full text-white truncate"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopyAddress(
                    cryptoOptions.find(c => c.name === selectedCrypto)?.address || ''
                  )}
                >
                  {copied ? <CheckCircle className="text-green-400" /> : <Copy />}
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="text-sm text-gray-400 mt-4">
          <p>⚠️ Always verify the address before sending.</p>
          <p>Transactions are final and cannot be reversed.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Example Usage in Pricing Page
export function PricingCard() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  return (
    <div>
      <Button onClick={() => setIsPaymentModalOpen(true)}>
        Purchase Plan
      </Button>
      
      <CryptoPaymentModal
        plan="Pro"
        amount={14}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />
    </div>
  );
}

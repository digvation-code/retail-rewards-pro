import { X, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { mockUser } from '@/data/mockData';
import QRCode from 'react-qr-code';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QRModal = ({ isOpen, onClose }: QRModalProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(mockUser.qrCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto rounded-2xl p-0 overflow-hidden border-0">
        <div className="gradient-warm p-6 text-center">
          <DialogHeader>
            <DialogTitle className="text-primary-foreground text-xl font-bold">
              Your Loyalty QR Code
            </DialogTitle>
          </DialogHeader>
          <p className="text-primary-foreground/80 text-sm mt-1">
            Show this to the cashier to earn points
          </p>
        </div>
        
        <div className="p-6 flex flex-col items-center gap-4">
          <div className="bg-card p-4 rounded-2xl shadow-card">
            <QRCode
              value={mockUser.qrCode}
              size={200}
              bgColor="hsl(0, 0%, 100%)"
              fgColor="hsl(24, 95%, 53%)"
              level="H"
            />
          </div>
          
          <div className="flex items-center gap-2 bg-muted rounded-lg px-4 py-2">
            <span className="text-sm font-mono text-muted-foreground">
              {mockUser.qrCode}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="w-4 h-4 text-success" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Member: <span className="font-semibold text-foreground">{mockUser.name}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {mockUser.membershipTier} Member
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRModal;

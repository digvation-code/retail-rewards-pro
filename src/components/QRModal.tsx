import { Copy, Check, Award } from 'lucide-react';
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
      <DialogContent className="max-w-sm mx-auto rounded-2xl p-0 overflow-hidden border border-border">
        <div className="bg-gradient-hero p-6 text-center">
          <DialogHeader>
            <DialogTitle className="text-primary-foreground text-xl font-bold">
              Your Loyalty QR Code
            </DialogTitle>
          </DialogHeader>
          <p className="text-primary-foreground/80 text-sm mt-1">
            Show this to the cashier to earn points
          </p>
        </div>
        
        <div className="p-6 flex flex-col items-center gap-4 bg-card">
          <div className="bg-white p-4 rounded-2xl shadow-card border border-border">
            <QRCode
              value={mockUser.qrCode}
              size={180}
              bgColor="#ffffff"
              fgColor="hsl(213, 94%, 56%)"
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
          
          <div className="flex items-center gap-2 text-center">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
              <Award className="w-4 h-4 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">{mockUser.name}</p>
              <p className="text-xs text-muted-foreground">{mockUser.membershipTier} Member</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRModal;

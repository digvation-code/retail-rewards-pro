import { X, MapPin, Clock, Receipt, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Transaction } from '@/types/loyalty';
import { formatDate, formatCurrency, getCategoryColor } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

const TransactionDetailModal = ({ transaction, isOpen, onClose }: TransactionDetailModalProps) => {
  if (!transaction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto rounded-2xl p-0 overflow-hidden border-0 max-h-[85vh] overflow-y-auto">
        <div className="gradient-warm p-6">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-14 h-14 rounded-xl flex items-center justify-center text-3xl bg-primary-foreground/20'
              )}>
                {transaction.merchantLogo}
              </div>
              <div className="text-left">
                <DialogTitle className="text-primary-foreground text-xl font-bold">
                  {transaction.merchantName}
                </DialogTitle>
                <p className="text-primary-foreground/80 text-sm">{formatDate(transaction.date)}</p>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-5 space-y-5">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-success">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium capitalize">{transaction.status}</span>
            </div>
            <span className={cn(
              'px-3 py-1 rounded-full text-xs font-medium capitalize',
              getCategoryColor(transaction.category)
            )}>
              {transaction.category}
            </span>
          </div>

          {/* Points Earned Highlight */}
          <div className="bg-accent rounded-xl p-4 text-center">
            <p className="text-sm text-accent-foreground/70">Points Earned</p>
            <p className="text-3xl font-bold text-primary">+{transaction.pointsEarned} pts</p>
          </div>

          {/* Transaction Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Receipt className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Receipt:</span>
              <span className="font-medium">{transaction.receiptNumber}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">{formatDate(transaction.date)}</span>
            </div>
          </div>

          <Separator />

          {/* Items List */}
          {transaction.items && transaction.items.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Items Purchased</h4>
              <div className="space-y-3">
                {transaction.items.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{formatCurrency(item.price)}</p>
                      <p className="text-xs text-success">+{item.pointsEarned} pts</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Total */}
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">{formatCurrency(transaction.amount)}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailModal;

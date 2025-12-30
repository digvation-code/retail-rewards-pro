import { ChevronRight, CheckCircle2 } from 'lucide-react';
import { Transaction } from '@/types/loyalty';
import { formatDate, formatCurrency, getCategoryColor, merchantIcons, categoryIcons } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface TransactionCardProps {
  transaction: Transaction;
  onClick: () => void;
}

const TransactionCard = ({ transaction, onClick }: TransactionCardProps) => {
  const MerchantIcon = merchantIcons[transaction.merchantName] || categoryIcons[transaction.category];

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 bg-card rounded-xl border border-border shadow-card hover:shadow-float transition-all duration-200 active:scale-[0.99] animate-fade-in"
    >
      <div className={cn(
        'w-11 h-11 rounded-full flex items-center justify-center',
        getCategoryColor(transaction.category)
      )}>
        <MerchantIcon className="w-5 h-5" />
      </div>
      
      <div className="flex-1 text-left">
        <div className="flex items-center gap-1.5">
          <h3 className="font-medium text-foreground text-sm">{transaction.merchantName}</h3>
          <CheckCircle2 className="w-3.5 h-3.5 text-primary fill-primary/20" />
        </div>
        <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="text-right">
          <p className="text-sm font-semibold text-success">+{transaction.pointsEarned} pts</p>
          <p className="text-xs text-muted-foreground">{formatCurrency(transaction.amount)}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </button>
  );
};

export default TransactionCard;

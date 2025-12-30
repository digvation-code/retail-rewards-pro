import { ChevronRight } from 'lucide-react';
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
      className="w-full flex items-center gap-3 p-3 bg-card rounded-xl shadow-card hover:shadow-float transition-all duration-200 active:scale-[0.98] animate-fade-in"
    >
      <div className={cn(
        'w-12 h-12 rounded-xl flex items-center justify-center',
        getCategoryColor(transaction.category)
      )}>
        <MerchantIcon className="w-6 h-6" />
      </div>
      
      <div className="flex-1 text-left">
        <h3 className="font-semibold text-foreground">{transaction.merchantName}</h3>
        <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="text-right">
          <div className="flex items-center gap-1 text-success font-semibold">
            <span className="w-4 h-4 bg-success/10 rounded-full flex items-center justify-center text-xs">$</span>
            <span>+{transaction.pointsEarned} pts</span>
          </div>
          <p className="text-xs text-muted-foreground">{formatCurrency(transaction.amount)}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </button>
  );
};

export default TransactionCard;

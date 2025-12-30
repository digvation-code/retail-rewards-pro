import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PointsCard from '@/components/PointsCard';
import TransactionCard from '@/components/TransactionCard';
import TransactionDetailModal from '@/components/TransactionDetailModal';
import { mockTransactions, mockUser } from '@/data/mockData';
import { Transaction } from '@/types/loyalty';

const Index = () => {
  const navigate = useNavigate();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const recentTransactions = mockTransactions.slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="p-4 pt-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-muted-foreground text-sm">Welcome back,</p>
            <h1 className="text-xl font-bold text-foreground">{mockUser.name.split(' ')[0]} 👋</h1>
          </div>
          <button 
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl"
          >
            {mockUser.name.charAt(0)}
          </button>
        </div>
        
        <PointsCard />
      </header>

      {/* Recent Transactions */}
      <section className="px-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">Recent points gained</h2>
          <button 
            onClick={() => navigate('/transactions')}
            className="text-sm text-primary font-medium flex items-center gap-1"
          >
            See all <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-3">
          {recentTransactions.map((transaction, index) => (
            <div 
              key={transaction.id}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <TransactionCard 
                transaction={transaction}
                onClick={() => setSelectedTransaction(transaction)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Promotions Section */}
      <section className="px-4 mt-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Promotions and discounts</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          <div className="flex-shrink-0 w-64 bg-gradient-to-br from-primary/90 to-primary rounded-xl p-4 text-primary-foreground">
            <h3 className="font-bold text-lg mb-1">Refer a Friend</h3>
            <p className="text-primary-foreground/80 text-sm mb-3">Get 300 Bonus Points</p>
            <button className="bg-primary-foreground text-primary px-4 py-2 rounded-lg text-sm font-semibold">
              Refer friends
            </button>
          </div>
          <div className="flex-shrink-0 w-64 bg-gradient-to-br from-success/90 to-success rounded-xl p-4 text-success-foreground">
            <h3 className="font-bold text-lg mb-1">Earn 2x Points</h3>
            <p className="text-success-foreground/80 text-sm mb-3">Shop this weekend</p>
            <button className="bg-success-foreground text-success px-4 py-2 rounded-lg text-sm font-semibold">
              Shop now
            </button>
          </div>
        </div>
      </section>

      <TransactionDetailModal
        transaction={selectedTransaction}
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
};

export default Index;

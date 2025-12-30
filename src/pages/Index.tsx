import { useState } from 'react';
import { ChevronRight, Bell } from 'lucide-react';
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
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <header className="p-4 pt-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-muted-foreground text-sm">Welcome back,</p>
            <h1 className="text-xl font-bold text-foreground">{mockUser.name.split(' ')[0]}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center shadow-card">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center text-sm font-semibold text-primary"
            >
              {mockUser.name.charAt(0)}
            </button>
          </div>
        </div>
        
        <PointsCard />
      </header>

      {/* Stats Grid */}
      <section className="px-4 mt-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-xl p-4 border border-border shadow-card text-center">
            <p className="text-2xl font-bold text-foreground">12</p>
            <p className="text-xs text-muted-foreground mt-1">Visits</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border shadow-card text-center">
            <p className="text-2xl font-bold text-foreground">28</p>
            <p className="text-xs text-muted-foreground mt-1">Days</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border shadow-card text-center">
            <p className="text-2xl font-bold text-primary">{mockUser.totalPoints.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Points</p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-4 mt-6">
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-card rounded-xl p-4 border border-border shadow-card flex items-center gap-3 hover:bg-accent transition-colors">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
              <span className="text-lg">🎁</span>
            </div>
            <div className="text-left">
              <p className="font-medium text-sm text-foreground">Rewards</p>
              <p className="text-xs text-muted-foreground">View all</p>
            </div>
          </button>
          <button className="bg-card rounded-xl p-4 border border-border shadow-card flex items-center gap-3 hover:bg-accent transition-colors">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
              <span className="text-lg">💳</span>
            </div>
            <div className="text-left">
              <p className="font-medium text-sm text-foreground">Payment</p>
              <p className="text-xs text-muted-foreground">Methods</p>
            </div>
          </button>
        </div>
      </section>

      {/* Recent Transactions */}
      <section className="px-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">Recent Activity</h2>
          <button 
            onClick={() => navigate('/transactions')}
            className="text-sm text-primary font-medium flex items-center gap-0.5 hover:underline"
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

      <TransactionDetailModal
        transaction={selectedTransaction}
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
};

export default Index;

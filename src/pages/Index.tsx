import { useState } from 'react';
import { ChevronRight, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PointsCard from '@/components/PointsCard';
import { useProfile } from '@/hooks/useProfile';
import { useTransactions } from '@/hooks/useTransactions';
import { formatDistanceToNow } from 'date-fns';

const Index = () => {
  const navigate = useNavigate();
  const { profile, loading: profileLoading } = useProfile();
  const { transactions, loading: transactionsLoading } = useTransactions();

  const recentTransactions = transactions.slice(0, 3);

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const userName = profile?.full_name?.split(' ')[0] || 'User';

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <header className="p-4 pt-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-muted-foreground text-sm">Welcome back,</p>
            <h1 className="text-xl font-bold text-foreground">{userName}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center shadow-card">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center text-sm font-semibold text-primary"
            >
              {userName.charAt(0)}
            </button>
          </div>
        </div>
        
        <PointsCard points={profile?.points_balance || 0} />
      </header>

      {/* Stats Grid */}
      <section className="px-4 mt-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-xl p-4 border border-border shadow-card text-center">
            <p className="text-2xl font-bold text-foreground">{transactions.filter(t => t.type === 'earn').length}</p>
            <p className="text-xs text-muted-foreground mt-1">Visits</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border shadow-card text-center">
            <p className="text-2xl font-bold text-foreground">{transactions.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Trans</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border shadow-card text-center">
            <p className="text-2xl font-bold text-primary">{(profile?.points_balance || 0).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Points</p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-4 mt-6">
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => navigate('/catalog')}
            className="bg-card rounded-xl p-4 border border-border shadow-card flex items-center gap-3 hover:bg-accent transition-colors"
          >
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
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <div 
                key={transaction.id}
                className="bg-card rounded-xl p-4 border border-border shadow-card"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'earn' ? 'bg-success/10' : 'bg-destructive/10'
                    }`}>
                      <span className="text-lg">{transaction.type === 'earn' ? '💰' : '🎁'}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <p className={`font-bold text-sm ${
                    transaction.type === 'earn' ? 'text-success' : 'text-destructive'
                  }`}>
                    {transaction.type === 'earn' ? '+' : ''}{transaction.points} pts
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-card rounded-xl border border-border">
              <p className="text-muted-foreground text-sm">No transactions yet</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;

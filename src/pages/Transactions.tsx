import { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { useTransactions } from '@/hooks/useTransactions';
import { Input } from '@/components/ui/input';
import { formatDistanceToNow } from 'date-fns';

const Transactions = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { transactions, loading } = useTransactions();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const types = ['all', 'earn', 'redeem'];

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || transaction.type === selectedType;
    return matchesSearch && matchesType;
  });

  const totalEarned = transactions.filter(t => t.type === 'earn').reduce((sum, t) => sum + t.points, 0);
  const totalRedeemed = transactions.filter(t => t.type === 'redeem').reduce((sum, t) => sum + Math.abs(t.points), 0);

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <header className="sticky top-0 bg-card/95 backdrop-blur-sm z-40 border-b border-border shadow-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-accent transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-lg font-semibold text-foreground">Transaction History</h1>
          </div>
          <div className="flex items-center gap-1.5 bg-accent rounded-full px-3 py-1.5">
            <span className="text-sm font-bold text-primary">{(profile?.points_balance || 0).toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">pts</span>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted border-0 h-10"
            />
          </div>
        </div>

        {/* Type Filter */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedType === type
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </header>

      {/* Stats */}
      <div className="p-4">
        <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between shadow-card">
          <div>
            <p className="text-xs text-muted-foreground">Total Earned</p>
            <p className="text-xl font-bold text-success">+{totalEarned} pts</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total Redeemed</p>
            <p className="text-xl font-bold text-destructive">-{totalRedeemed} pts</p>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <section className="px-4">
        <h2 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
          {filteredTransactions.length} transactions
        </h2>
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            </div>
          ) : filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
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
              <p className="text-muted-foreground text-sm">No transactions found</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Transactions;

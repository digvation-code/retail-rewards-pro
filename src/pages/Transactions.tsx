import { useState } from 'react';
import { ArrowLeft, Filter, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TransactionCard from '@/components/TransactionCard';
import TransactionDetailModal from '@/components/TransactionDetailModal';
import { mockTransactions, mockUser } from '@/data/mockData';
import { Transaction } from '@/types/loyalty';
import { Input } from '@/components/ui/input';

const Transactions = () => {
  const navigate = useNavigate();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'food', 'shopping', 'grocery', 'entertainment'];

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesSearch = transaction.merchantName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || transaction.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPointsEarned = mockTransactions.reduce((sum, t) => sum + t.pointsEarned, 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm z-40 border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Transaction History</h1>
          </div>
          <div className="flex items-center gap-2 bg-accent rounded-full px-3 py-1.5">
            <span className="text-lg">$</span>
            <span className="font-bold text-primary">{mockUser.totalPoints.toLocaleString()}</span>
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
              className="pl-10 bg-muted border-0"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </header>

      {/* Stats */}
      <div className="p-4">
        <div className="bg-accent rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Points Earned</p>
            <p className="text-2xl font-bold text-primary">+{totalPointsEarned} pts</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Transactions</p>
            <p className="text-2xl font-bold text-foreground">{mockTransactions.length}</p>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <section className="px-4">
        <h2 className="text-sm font-medium text-muted-foreground mb-3">
          {filteredTransactions.length} transactions
        </h2>
        <div className="space-y-3">
          {filteredTransactions.map((transaction, index) => (
            <div 
              key={transaction.id}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TransactionCard 
                transaction={transaction}
                onClick={() => setSelectedTransaction(transaction)}
              />
            </div>
          ))}
          
          {filteredTransactions.length === 0 && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No transactions found</p>
            </div>
          )}
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

export default Transactions;

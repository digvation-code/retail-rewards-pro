import { useState } from 'react';
import { Search, Gift, Ticket, Coffee, ShoppingBag, Utensils, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface CatalogItem {
  id: string;
  name: string;
  points: number;
  category: string;
  icon: typeof Gift;
  description: string;
}

const catalogItems: CatalogItem[] = [
  { id: '1', name: 'Free Coffee', points: 500, category: 'Food & Drink', icon: Coffee, description: 'Any size coffee at partner cafes' },
  { id: '2', name: 'Shopping Voucher', points: 1000, category: 'Shopping', icon: ShoppingBag, description: 'Rp 50.000 shopping discount' },
  { id: '3', name: 'Movie Ticket', points: 800, category: 'Entertainment', icon: Ticket, description: '1 free movie ticket' },
  { id: '4', name: 'Restaurant Discount', points: 1500, category: 'Food & Drink', icon: Utensils, description: '20% off at partner restaurants' },
  { id: '5', name: 'Gift Card', points: 2000, category: 'Shopping', icon: Gift, description: 'Rp 100.000 gift card' },
  { id: '6', name: 'Premium Coffee Set', points: 3000, category: 'Food & Drink', icon: Coffee, description: 'Specialty coffee bundle' },
];

const categories = ['All', 'Food & Drink', 'Shopping', 'Entertainment'];

const Catalog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredItems = catalogItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <header className="sticky top-0 bg-card/95 backdrop-blur-sm z-40 border-b border-border">
        <div className="p-4">
          <h1 className="text-lg font-semibold text-foreground mb-4">Rewards Catalog</h1>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search rewards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary border-0 h-10"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      {/* Featured Banner */}
      <div className="p-4">
        <div className="bg-gradient-hero rounded-2xl p-5 text-primary-foreground">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 fill-current" />
            <span className="text-sm font-medium">Featured Reward</span>
          </div>
          <h2 className="text-xl font-bold mb-1">Double Points Weekend!</h2>
          <p className="text-sm opacity-90">Redeem any reward and get 2x bonus points back</p>
        </div>
      </div>

      {/* Catalog Grid */}
      <section className="px-4">
        <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
          {filteredItems.length} rewards available
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className="bg-card rounded-xl p-4 border border-border text-left hover:shadow-float transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium text-sm text-foreground mb-1">{item.name}</h3>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-primary">{item.points.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground">pts</span>
                </div>
              </button>
            );
          })}
        </div>
        
        {filteredItems.length === 0 && (
          <div className="text-center py-10 bg-card rounded-xl border border-border">
            <p className="text-muted-foreground text-sm">No rewards found</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Catalog;

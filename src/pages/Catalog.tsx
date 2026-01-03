import { useState } from 'react';
import { ArrowLeft, Search, Gift, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCatalog } from '@/hooks/useCatalog';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Catalog = () => {
  const navigate = useNavigate();
  const { items, loading } = useCatalog();
  const { profile } = useProfile();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [redeeming, setRedeeming] = useState<string | null>(null);

  const categories = ['all', ...new Set(items.map(item => item.category))];

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRedeem = async (item: any) => {
    if (!profile) return;
    
    if (profile.points_balance < item.points_cost) {
      toast({
        title: "Insufficient Points",
        description: `You need ${item.points_cost - profile.points_balance} more points to redeem this reward.`,
        variant: "destructive",
      });
      return;
    }

    setRedeeming(item.id);

    try {
      // Update points balance
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ points_balance: profile.points_balance - item.points_cost })
        .eq('id', profile.id);

      if (profileError) throw profileError;

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: profile.user_id,
          type: 'redeem',
          points: -item.points_cost,
          description: `Redeemed: ${item.name}`,
          category: item.category,
        });

      if (transactionError) throw transactionError;

      toast({
        title: "Reward Redeemed!",
        description: `You've successfully redeemed ${item.name}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to redeem reward",
        variant: "destructive",
      });
    } finally {
      setRedeeming(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'drinks': return '☕';
      case 'discounts': return '💰';
      case 'entertainment': return '🎬';
      case 'shopping': return '🛍️';
      default: return '🎁';
    }
  };

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
            <h1 className="text-lg font-semibold text-foreground">Rewards Catalog</h1>
          </div>
          <div className="flex items-center gap-1.5 bg-accent rounded-full px-3 py-1.5">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-primary">{(profile?.points_balance || 0).toLocaleString()}</span>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search rewards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted border-0 h-10"
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
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </header>

      {/* Catalog Items */}
      <section className="px-4 mt-4">
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-card rounded-xl border border-border shadow-card overflow-hidden"
              >
                <div className="aspect-video bg-accent flex items-center justify-center">
                  {item.image_url ? (
                    <img 
                      src={item.image_url} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">{getCategoryIcon(item.category)}</span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm text-foreground mb-1">{item.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Gift className="w-4 h-4 text-primary" />
                      <span className="font-bold text-sm text-primary">{item.points_cost}</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleRedeem(item)}
                      disabled={redeeming === item.id || (profile?.points_balance || 0) < item.points_cost}
                      className="text-xs h-7 px-3"
                    >
                      {redeeming === item.id ? 'Redeeming...' : 'Redeem'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-10 bg-card rounded-xl border border-border">
            <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No rewards found</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Catalog;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, LogOut, Users, Loader2, Search, Plus, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  points_balance: number;
}

const createUserSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  phone: z.string().optional(),
});

const CashierDashboard = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');
  const [isLoading, setIsLoading] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [pointsAmount, setPointsAmount] = useState('');

  // Create user form
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ email?: string; fullName?: string }>({});

  const defaultPassword = 'welcome123';

  useEffect(() => {
    if (activeTab === 'manage') {
      fetchProfiles();
    }
  }, [activeTab]);

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProfiles(data);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = createUserSchema.safeParse({ email, fullName, phone });
    if (!result.success) {
      const fieldErrors: { email?: string; fullName?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === 'email') fieldErrors.email = err.message;
        if (err.path[0] === 'fullName') fieldErrors.fullName = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Call edge function to create user
      const { data, error } = await supabase.functions.invoke('create-customer', {
        body: {
          email,
          password: defaultPassword,
          fullName,
          phone: phone || null,
        },
      });

      if (error) throw error;

      toast({
        title: "Customer Created",
        description: `Account created for ${fullName}. Default password: ${defaultPassword}`,
      });

      // Reset form
      setEmail('');
      setFullName('');
      setPhone('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create customer",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePointsTransaction = async (type: 'earn' | 'redeem') => {
    if (!selectedProfile || !pointsAmount) return;

    const points = parseInt(pointsAmount);
    if (isNaN(points) || points <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid points amount",
        variant: "destructive",
      });
      return;
    }

    if (type === 'redeem' && points > selectedProfile.points_balance) {
      toast({
        title: "Insufficient Points",
        description: "Customer doesn't have enough points",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const newBalance = type === 'earn' 
        ? selectedProfile.points_balance + points 
        : selectedProfile.points_balance - points;

      // Update profile points
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ points_balance: newBalance })
        .eq('id', selectedProfile.id);

      if (profileError) throw profileError;

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: selectedProfile.user_id,
          type,
          points: type === 'earn' ? points : -points,
          description: type === 'earn' ? 'Points earned from purchase' : 'Points redeemed',
          category: 'cashier',
        });

      if (transactionError) throw transactionError;

      toast({
        title: type === 'earn' ? "Points Added" : "Points Redeemed",
        description: `${points} points ${type === 'earn' ? 'added to' : 'redeemed from'} ${selectedProfile.full_name}'s account`,
      });

      // Refresh profiles
      fetchProfiles();
      setSelectedProfile({ ...selectedProfile, points_balance: newBalance });
      setPointsAmount('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Transaction failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/cashier-login');
  };

  const filteredProfiles = profiles.filter(p => 
    p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone?.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Cashier Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage customer accounts & points</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'create' ? 'default' : 'outline'}
            onClick={() => setActiveTab('create')}
            className="flex-1"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Create Customer
          </Button>
          <Button
            variant={activeTab === 'manage' ? 'default' : 'outline'}
            onClick={() => setActiveTab('manage')}
            className="flex-1"
          >
            <Users className="w-4 h-4 mr-2" />
            Manage Points
          </Button>
        </div>

        {activeTab === 'create' ? (
          <Card className="border border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Create New Customer</CardTitle>
              <CardDescription>
                Create an account for a new customer. Default password: {defaultPassword}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter customer name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={errors.fullName ? 'border-destructive' : ''}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-destructive">{errors.fullName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter customer email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create Customer
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Selected Profile */}
            {selectedProfile && (
              <Card className="border-2 border-primary shadow-card">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{selectedProfile.full_name}</CardTitle>
                      <CardDescription>{selectedProfile.phone || 'No phone'}</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{selectedProfile.points_balance}</p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Label htmlFor="points">Points Amount</Label>
                      <Input
                        id="points"
                        type="number"
                        placeholder="Enter points"
                        value={pointsAmount}
                        onChange={(e) => setPointsAmount(e.target.value)}
                      />
                    </div>
                    <Button 
                      onClick={() => handlePointsTransaction('earn')}
                      disabled={isLoading || !pointsAmount}
                      className="bg-success hover:bg-success/90"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                    <Button 
                      onClick={() => handlePointsTransaction('redeem')}
                      disabled={isLoading || !pointsAmount}
                      variant="destructive"
                    >
                      <Minus className="w-4 h-4 mr-1" />
                      Redeem
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Profiles List */}
            <div className="space-y-2">
              {filteredProfiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => setSelectedProfile(profile)}
                  className={`w-full p-4 rounded-xl border text-left transition-colors ${
                    selectedProfile?.id === profile.id
                      ? 'border-primary bg-accent'
                      : 'border-border bg-card hover:bg-accent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{profile.full_name}</p>
                      <p className="text-sm text-muted-foreground">{profile.phone || 'No phone'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{profile.points_balance}</p>
                      <p className="text-xs text-muted-foreground">pts</p>
                    </div>
                  </div>
                </button>
              ))}

              {filteredProfiles.length === 0 && (
                <div className="text-center py-10 bg-card rounded-xl border border-border">
                  <p className="text-muted-foreground">No customers found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CashierDashboard;

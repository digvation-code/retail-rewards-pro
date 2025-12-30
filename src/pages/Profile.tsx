import { ArrowLeft, ChevronRight, Crown, Mail, Phone, Calendar, Settings, HelpCircle, LogOut, Gift, Star, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockUser, formatDate } from '@/data/mockData';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const progressPercentage = ((mockUser.totalPoints) / (mockUser.totalPoints + mockUser.pointsToNextTier)) * 100;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    navigate('/login');
  };

  const menuItems = [
    { icon: Gift, label: 'My Rewards', description: 'View redeemed rewards' },
    { icon: Star, label: 'Points History', description: 'Track your earnings' },
    { icon: Settings, label: 'Settings', description: 'App preferences' },
    { icon: HelpCircle, label: 'Help & Support', description: 'Get assistance' },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="gradient-hero p-4 pt-6 pb-20 text-primary-foreground">
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">My Profile</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-primary-foreground/20 flex items-center justify-center text-3xl font-bold">
            {mockUser.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{mockUser.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Crown className="w-4 h-4" />
              <span className="text-sm">{mockUser.membershipTier} Member</span>
            </div>
          </div>
        </div>
      </header>

      {/* Points Card Overlay */}
      <div className="px-4 -mt-12">
        <div className="bg-card rounded-2xl p-5 shadow-float">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Points</p>
              <p className="text-3xl font-bold text-primary">{mockUser.totalPoints.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">To Platinum</p>
              <p className="text-lg font-semibold">{mockUser.pointsToNextTier} pts</p>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2 bg-muted" />
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Earn {mockUser.pointsToNextTier} more points to reach Platinum
          </p>
        </div>
      </div>

      {/* User Info */}
      <section className="p-4 mt-4">
        <h3 className="font-semibold mb-3">Account Information</h3>
        <div className="bg-card rounded-xl shadow-card p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Mail className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-medium">{mockUser.email}</p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Phone className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="font-medium">{mockUser.phone}</p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Calendar className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Member Since</p>
              <p className="font-medium">{formatDate(mockUser.memberSince)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Items */}
      <section className="px-4">
        <div className="bg-card rounded-xl shadow-card overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              className="w-full flex items-center gap-3 p-4 hover:bg-muted transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <item.icon className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </section>

      {/* Logout */}
      <section className="px-4 mt-4">
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3 p-4 bg-destructive/10 rounded-xl text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-50"
        >
          {isLoggingOut ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <LogOut className="w-5 h-5" />
          )}
          <span className="font-medium">{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
        </button>
      </section>
    </div>
  );
};

export default Profile;

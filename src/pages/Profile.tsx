import { ArrowLeft, ChevronRight, Award, Mail, Phone, Calendar, Settings, HelpCircle, LogOut, Gift, Star, Loader2, Bell, Shield, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockUser, formatDate } from '@/data/mockData';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

const Profile = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notifications, setNotifications] = useState(true);
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
    { icon: Star, label: 'Rewards & Points', description: 'Track your earnings' },
    { icon: Settings, label: 'Payment Methods', description: 'Manage payments' },
    { icon: HelpCircle, label: 'Preferences', description: 'App settings' },
  ];

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <header className="bg-gradient-hero p-4 pt-6 pb-24 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDEwIDAgTCAwIDAgMCAxMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => navigate('/')}
              className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button className="px-4 py-2 rounded-full bg-primary-foreground/20 text-sm font-medium backdrop-blur-sm">
              Edit Profile
            </button>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-primary-foreground/30 border-4 border-primary-foreground/50 flex items-center justify-center text-3xl font-bold mb-3">
              {mockUser.name.charAt(0)}
            </div>
            <div className="flex items-center gap-1.5 mb-1">
              <h2 className="text-xl font-bold">{mockUser.name}</h2>
              <CheckCircle2 className="w-5 h-5 fill-primary-foreground" />
            </div>
            <p className="text-sm text-primary-foreground/80">Marriott · Bonvoy · {mockUser.membershipTier}</p>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="px-4 -mt-10">
        <div className="bg-card rounded-2xl p-4 shadow-float border border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-foreground">12</p>
              <p className="text-xs text-muted-foreground">Stays</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">28</p>
              <p className="text-xs text-muted-foreground">Nights</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{mockUser.totalPoints.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Points</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <section className="px-4 mt-6">
        <div className="grid grid-cols-2 gap-3">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className="bg-card rounded-xl p-4 border border-border shadow-card flex flex-col items-center gap-2 hover:bg-accent transition-colors"
            >
              <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="font-medium text-sm text-foreground">{item.label}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Suggested Section */}
      <section className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">Suggested</h3>
          <button className="text-muted-foreground">
            <span className="text-lg">•••</span>
          </button>
        </div>
        
        <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">Notifications</p>
                <p className="text-xs text-muted-foreground">Push, email, SMS</p>
              </div>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
          
          <div className="border-t border-border" />
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm text-foreground">Security</p>
                <p className="text-xs text-muted-foreground">Password, 2-step verification</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </section>

      {/* Logout */}
      <section className="px-4 mt-6">
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center gap-2 p-4 bg-destructive/10 rounded-xl text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-50"
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

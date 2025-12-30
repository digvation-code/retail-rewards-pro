import { Home, Receipt, ShoppingBag, User, Plus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  onQrClick: () => void;
}

const BottomNav = ({ onQrClick }: BottomNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const leftNavItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Receipt, label: 'History', path: '/transactions' },
  ];

  const rightNavItems = [
    { icon: ShoppingBag, label: 'Catalog', path: '/chat' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-lg mx-auto relative">
        {/* Center QR Button - Floating above nav */}
        <button
          onClick={onQrClick}
          className="absolute left-1/2 -translate-x-1/2 -top-7 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg z-10 border-4 border-background"
        >
          <Plus className="w-6 h-6 text-primary-foreground" strokeWidth={2.5} />
        </button>

        {/* Navigation Bar */}
        <div className="bg-card border-t border-border rounded-t-3xl shadow-nav safe-bottom">
          <div className="flex items-center justify-around h-20 px-2">
            {/* Left Nav Items */}
            {leftNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'flex flex-col items-center gap-1 px-4 py-2 transition-all duration-200 min-w-[60px]',
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />
                  <span className="text-[11px] font-medium">{item.label}</span>
                </button>
              );
            })}

            {/* Center Spacer for QR button */}
            <div className="w-16" />

            {/* Right Nav Items */}
            {rightNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'flex flex-col items-center gap-1 px-4 py-2 transition-all duration-200 min-w-[60px]',
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />
                  <span className="text-[11px] font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;

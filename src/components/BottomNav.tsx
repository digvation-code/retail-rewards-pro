import { Home, Receipt, User, Plus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  onQrClick: () => void;
}

const BottomNav = ({ onQrClick }: BottomNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: 'Explore', path: '/' },
    { icon: Receipt, label: 'History', path: '/transactions' },
    { icon: null, label: 'QR', path: null },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card shadow-nav safe-bottom z-50 rounded-t-3xl">
      <div className="flex items-center justify-around h-20 max-w-lg mx-auto relative px-4">
        {navItems.map((item) => {
          if (item.label === 'QR') {
            return (
              <button
                key="qr"
                onClick={onQrClick}
                className="absolute left-1/2 -translate-x-1/2 -top-5 w-14 h-14 bg-nav-active rounded-full flex items-center justify-center shadow-button animate-pulse-glow"
              >
                <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
              </button>
            );
          }

          const isActive = location.pathname === item.path;
          const Icon = item.icon!;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path!)}
              className={cn(
                'flex flex-col items-center gap-1.5 px-4 py-2 transition-all duration-200',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />
              <span className="text-[11px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

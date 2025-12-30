import { Home, Receipt, User, QrCode } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  onQrClick: () => void;
}

const BottomNav = ({ onQrClick }: BottomNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Receipt, label: 'History', path: '/transactions' },
    { icon: null, label: 'QR', path: null }, // Placeholder for QR button
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-bottom z-50">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto relative">
        {navItems.map((item, index) => {
          if (item.label === 'QR') {
            return (
              <button
                key="qr"
                onClick={onQrClick}
                className="absolute left-1/2 -translate-x-1/2 -top-6 w-16 h-16 gradient-warm rounded-full flex items-center justify-center shadow-button animate-pulse-glow"
              >
                <QrCode className="w-7 h-7 text-primary-foreground" />
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
                'flex flex-col items-center gap-1 px-4 py-2 transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

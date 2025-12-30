import { Crown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockUser } from '@/data/mockData';
import { Progress } from '@/components/ui/progress';

const PointsCard = () => {
  const progressPercentage = ((mockUser.totalPoints) / (mockUser.totalPoints + mockUser.pointsToNextTier)) * 100;

  return (
    <div className="gradient-hero rounded-2xl p-5 text-primary-foreground shadow-float animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
            <Crown className="w-4 h-4" />
          </div>
          <span className="font-semibold">{mockUser.membershipTier} Member</span>
        </div>
        <button className="text-sm flex items-center gap-1 opacity-90 hover:opacity-100 transition-opacity">
          Check Benefits <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <p className="text-primary-foreground/80 text-sm mb-1">{mockUser.name}</p>
      
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-4xl font-bold">{mockUser.totalPoints.toLocaleString()}</span>
        <span className="text-lg">pts</span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5 text-primary-foreground/80">
          <span>{mockUser.pointsToNextTier} points to Platinum Member</span>
        </div>
        <Progress 
          value={progressPercentage} 
          className="h-2 bg-primary-foreground/20"
        />
      </div>

      <div className="flex gap-3">
        <Button 
          variant="secondary" 
          size="sm"
          className="flex-1 bg-primary-foreground/20 text-primary-foreground border-0 hover:bg-primary-foreground/30"
        >
          How to Earn
        </Button>
        <Button 
          size="sm"
          className="flex-1 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
        >
          Redeem Rewards
        </Button>
      </div>
    </div>
  );
};

export default PointsCard;

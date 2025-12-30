import { Crown, ChevronRight, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockUser } from '@/data/mockData';
import { Progress } from '@/components/ui/progress';

const PointsCard = () => {
  const progressPercentage = ((mockUser.totalPoints) / (mockUser.totalPoints + mockUser.pointsToNextTier)) * 100;

  return (
    <div className="bg-card rounded-2xl p-5 shadow-card border border-border animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-accent rounded-full flex items-center justify-center">
            <Award className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Membership</p>
            <p className="font-semibold text-sm text-foreground">{mockUser.membershipTier}</p>
          </div>
        </div>
        <button className="text-xs text-primary font-medium flex items-center gap-0.5 hover:underline">
          Benefits <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="bg-gradient-hero rounded-xl p-4 text-primary-foreground mb-4">
        <p className="text-primary-foreground/80 text-xs mb-1">Total Points</p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">{mockUser.totalPoints.toLocaleString()}</span>
          <span className="text-sm opacity-80">pts</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-muted-foreground">Progress to Platinum</span>
          <span className="font-medium text-foreground">{mockUser.pointsToNextTier} pts left</span>
        </div>
        <Progress 
          value={progressPercentage} 
          className="h-2 bg-muted"
        />
      </div>

      <div className="flex gap-3">
        <Button 
          variant="outline" 
          size="sm"
          className="flex-1 text-xs h-9"
        >
          How to Earn
        </Button>
        <Button 
          size="sm"
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-9"
        >
          Redeem Rewards
        </Button>
      </div>
    </div>
  );
};

export default PointsCard;

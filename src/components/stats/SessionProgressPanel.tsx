import { Trophy, Target, Clock, BookOpen, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

export function SessionProgressPanel() {
  const { sessionStats, accessibilityPrefs } = useAppStore();

  const achievements = [
    {
      id: 'multilingual',
      name: 'Multilingual Communicator',
      description: 'Used 3+ languages',
      earned: sessionStats.languagesPracticed.length >= 3,
      icon: Globe
    },
    {
      id: 'accurate',
      name: 'Precision Master',
      description: '90%+ average accuracy',
      earned: sessionStats.averageAccuracy >= 90,
      icon: Target
    },
    {
      id: 'active',
      name: 'Active Learner',
      description: '10+ signs recognized',
      earned: sessionStats.signsRecognized >= 10,
      icon: BookOpen
    }
  ];

  const stats = [
    {
      label: 'Signs Recognized',
      value: sessionStats.signsRecognized,
      icon: Trophy,
      color: 'text-primary'
    },
    {
      label: 'Average Accuracy',
      value: `${sessionStats.averageAccuracy.toFixed(1)}%`,
      icon: Target,
      color: 'text-success'
    },
    {
      label: 'Avg Response Time',
      value: `${sessionStats.avgResponseTime.toFixed(0)}ms`,
      icon: Clock,
      color: 'text-accent'
    },
    {
      label: 'New Signs Learned',
      value: sessionStats.newSignsLearned,
      icon: BookOpen,
      color: 'text-secondary'
    }
  ];

  return (
    <Card className={cn("card-elevated", accessibilityPrefs.highContrast && "high-contrast")}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-base">
          <Trophy className="h-4 w-4" />
          <span>Session Progress</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Session Statistics */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center space-y-1">
                <Icon className={cn("h-4 w-4 mx-auto", stat.color)} />
                <p className="text-lg font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground leading-tight">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Most Used Sign */}
        {sessionStats.mostUsedSign && (
          <div className="p-3 rounded-lg bg-muted/30 border">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Most Used Sign</p>
              <p className="font-bold text-primary">{sessionStats.mostUsedSign}</p>
            </div>
          </div>
        )}

        {/* Languages Practiced */}
        {sessionStats.languagesPracticed.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Languages Practiced</p>
            <div className="flex flex-wrap gap-1">
              {sessionStats.languagesPracticed.map((lang, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        <div className="pt-3 border-t space-y-2">
          <p className="text-xs text-muted-foreground">Achievements</p>
          <div className="space-y-1">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div 
                  key={achievement.id}
                  className={cn(
                    "flex items-center space-x-2 p-2 rounded text-xs transition-colors",
                    achievement.earned 
                      ? "bg-success/10 text-success border border-success/20" 
                      : "bg-muted/20 text-muted-foreground"
                  )}
                >
                  <Icon className="h-3 w-3" />
                  <div className="flex-1">
                    <p className="font-medium">{achievement.name}</p>
                    <p className="text-xs opacity-75">{achievement.description}</p>
                  </div>
                  {achievement.earned && (
                    <Badge variant="secondary" className="text-xs">
                      ✓
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAppStore } from '@/store/useAppStore';
import { mockLearningProgress } from '@/services/mockServices';
import { cn } from '@/lib/utils';

export function LearningProgressPanel() {
  const [weeklyData, setWeeklyData] = useState(mockLearningProgress());
  const { sessionStats, accessibilityPrefs } = useAppStore();

  useEffect(() => {
    // Refresh weekly data
    setWeeklyData(mockLearningProgress());
  }, [sessionStats.signsRecognized]);

  const todayData = weeklyData[weeklyData.length - 1];
  const weekTotal = weeklyData.reduce((sum, day) => sum + day.signsRecognized, 0);
  const weekAvgAccuracy = weeklyData.reduce((sum, day) => sum + day.accuracy, 0) / weeklyData.length;

  return (
    <Card className={cn("card-elevated", accessibilityPrefs.highContrast && "high-contrast")}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-base">
          <BarChart3 className="h-4 w-4" />
          <span>Learning Progress</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Today's Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Signs Recognized Today</span>
            <span className="text-lg font-bold text-primary">{todayData.signsRecognized}</span>
          </div>
          <Progress 
            value={Math.min((todayData.signsRecognized / 20) * 100, 100)} 
            className="h-2"
            aria-label={`Today's progress: ${todayData.signsRecognized} signs recognized`}
          />
        </div>

        {/* Weekly Chart */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Weekly Activity</span>
            <TrendingUp className="h-3 w-3 text-success" />
          </div>
          
          <div className="flex items-end justify-between h-16 space-x-1">
            {weeklyData.map((day, index) => {
              const maxHeight = Math.max(...weeklyData.map(d => d.signsRecognized));
              const height = maxHeight > 0 ? (day.signsRecognized / maxHeight) * 100 : 0;
              const isToday = index === weeklyData.length - 1;
              
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center space-y-1">
                  <div
                    className={cn(
                      "w-full rounded-sm transition-all duration-200 hover:opacity-80",
                      isToday ? "bg-primary" : "bg-muted-foreground/60"
                    )}
                    style={{ height: `${Math.max(height, 8)}%` }}
                    title={`${day.date}: ${day.signsRecognized} signs, ${day.accuracy.toFixed(1)}% accuracy`}
                    role="img"
                    aria-label={`${day.date}: ${day.signsRecognized} signs recognized`}
                  />
                  <span className={cn(
                    "text-xs",
                    isToday ? "font-medium text-primary" : "text-muted-foreground"
                  )}>
                    {day.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Summary */}
        <div className="pt-3 border-t grid grid-cols-2 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-lg font-bold text-secondary">{weekTotal}</p>
            <p className="text-xs text-muted-foreground">Week Total</p>
          </div>
          <div className="space-y-1">
            <p className="text-lg font-bold text-accent">{weekAvgAccuracy.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">Week Avg</p>
          </div>
        </div>

        {/* Learning Insights */}
        <div className="pt-3 border-t space-y-2">
          <div className="flex items-center space-x-2">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Learning Insights</span>
          </div>
          
          <div className="space-y-1">
            {weekTotal > 50 && (
              <p className="text-xs text-success">🎉 Great week! You're making excellent progress.</p>
            )}
            {weekAvgAccuracy > 85 && (
              <p className="text-xs text-success">🎯 Your accuracy is impressive this week!</p>
            )}
            {todayData.signsRecognized === 0 && (
              <p className="text-xs text-muted-foreground">💡 Start recognizing signs to see your progress.</p>
            )}
            {weekTotal === 0 && (
              <p className="text-xs text-muted-foreground">📈 Your weekly progress will appear here.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
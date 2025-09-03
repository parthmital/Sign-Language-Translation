import { useEffect, useState } from 'react';
import { TrendingUp, Clock, Target, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';
import { mockModelPerformance } from '@/services/mockServices';
import { cn } from '@/lib/utils';

export function ModelPerformancePanel() {
  const [performanceData, setPerformanceData] = useState(mockModelPerformance());
  const { modelStats, accessibilityPrefs } = useAppStore();

  useEffect(() => {
    // Update performance data periodically
    const interval = setInterval(() => {
      setPerformanceData(mockModelPerformance());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const metrics = [
    {
      label: 'Response Time',
      value: `${performanceData.responseTime.toFixed(0)}ms`,
      icon: Clock,
      color: 'text-primary',
      progress: Math.min((performanceData.responseTime / 2000) * 100, 100)
    },
    {
      label: 'Average Accuracy',
      value: `${performanceData.accuracy.toFixed(1)}%`,
      icon: Target,
      color: 'text-success',
      progress: performanceData.accuracy
    },
    {
      label: 'Total Predictions',
      value: modelStats.totalPredictions.toString(),
      icon: BarChart3,
      color: 'text-accent',
      progress: Math.min((modelStats.totalPredictions / 100) * 100, 100)
    }
  ];

  return (
    <Card className={cn("card-elevated", accessibilityPrefs.highContrast && "high-contrast")}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Model Performance</span>
          </span>
          <Badge variant="outline" className="text-xs">
            {performanceData.modelVersion}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Key Performance Indicators */}
        <div className="space-y-3">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className={cn("h-4 w-4", metric.color)} />
                    <span className="text-sm font-medium">{metric.label}</span>
                  </div>
                  <span className="text-sm font-bold">{metric.value}</span>
                </div>
                <Progress 
                  value={metric.progress} 
                  className="h-2"
                  aria-label={`${metric.label}: ${metric.value}`}
                />
              </div>
            );
          })}
        </div>

        {/* Model Information */}
        <div className="pt-3 border-t space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Model Size</span>
            <span className="font-medium">{performanceData.modelSize}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Status</span>
            <Badge variant="secondary" className="text-xs">
              Active
            </Badge>
          </div>
        </div>

        {/* Recent Accuracy Trend */}
        {modelStats.accuracyTrend.length > 0 && (
          <div className="pt-3 border-t">
            <p className="text-xs text-muted-foreground mb-2">Recent Accuracy Trend</p>
            <div className="flex items-end space-x-1 h-8">
              {modelStats.accuracyTrend.slice(-8).map((accuracy, index) => (
                <div
                  key={index}
                  className="bg-primary rounded-sm flex-1 opacity-60 hover:opacity-100 transition-opacity"
                  style={{ height: `${(accuracy / 100) * 100}%` }}
                  title={`${accuracy}% accuracy`}
                  role="img"
                  aria-label={`Accuracy point ${index + 1}: ${accuracy}%`}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
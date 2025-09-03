import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

export function Footer() {
  const { connectionStatus, accessibilityPrefs } = useAppStore();
  
  const getStatusInfo = () => {
    switch (connectionStatus) {
      case 'online':
        return {
          dot: 'bg-success',
          text: 'Real-time processing',
          description: 'Connected to GmTC v1.0'
        };
      case 'offline':
        return {
          dot: 'bg-warning',
          text: 'Using cached model',
          description: 'Offline mode active'
        };
      case 'error':
        return {
          dot: 'bg-error',
          text: 'Connection issue',
          description: 'Please check your internet connection'
        };
      default:
        return {
          dot: 'bg-muted',
          text: 'Unknown status',
          description: ''
        };
    }
  };

  const status = getStatusInfo();

  return (
    <footer 
      className={cn(
        "border-t bg-background",
        accessibilityPrefs.highContrast && "high-contrast"
      )}
      role="contentinfo"
    >
      <div className="container px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Status Indicator */}
          <div className="flex items-center space-x-3">
            <div 
              className={cn("w-3 h-3 rounded-full", status.dot)}
              role="status"
              aria-label={`Connection status: ${status.text}`}
            ></div>
            <div className="text-sm">
              <span className="font-medium text-foreground">{status.text}</span>
              {status.description && (
                <span className="text-muted-foreground ml-2">• {status.description}</span>
              )}
            </div>
          </div>

          {/* Model Info */}
          <div className="hidden sm:flex items-center text-xs text-muted-foreground space-x-4">
            <span>GmTC v1.0</span>
            <span>•</span>
            <span>15.2MB</span>
          </div>
        </div>

        {/* Mobile Status Description */}
        {status.description && (
          <div className="sm:hidden mt-2 text-xs text-muted-foreground">
            {status.description}
          </div>
        )}
      </div>
    </footer>
  );
}
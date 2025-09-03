import { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff, RotateCcw, Upload, Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAppStore } from '@/store/useAppStore';
import { MockCameraService, mockSignRecognition } from '@/services/mockServices';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const cameraService = new MockCameraService();

export function CameraInputArea() {
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    cameraStatus, 
    setCameraStatus, 
    processingStatus, 
    setProcessingStatus,
    addRecognizedSign,
    accessibilityPrefs
  } = useAppStore();

  const getStatusMessage = () => {
    switch (cameraStatus) {
      case 'off':
        return 'Tap to start camera';
      case 'initializing':
        return 'Starting camera...';
      case 'ready':
        return 'Position hand in frame';
      case 'processing':
        return 'Analyzing sign...';
      case 'complete':
        return 'Sign recognized!';
      case 'error':
        return 'Try again or adjust lighting';
      default:
        return 'Camera status unknown';
    }
  };

  const startCamera = async () => {
    try {
      setCameraStatus('initializing');
      
      const hasPermission = await cameraService.requestPermission();
      if (!hasPermission) {
        setCameraStatus('error');
        toast({
          title: "Camera Permission Denied",
          description: "Please allow camera access or use the upload option.",
          variant: "destructive"
        });
        return;
      }

      const mediaStream = await cameraService.startCamera();
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setCameraStatus('ready');
      toast({
        title: "Camera Started",
        description: "Position your hand in the frame to begin recognition."
      });
      
    } catch (error) {
      setCameraStatus('error');
      toast({
        title: "Camera Error",
        description: "Failed to start camera. Please try again.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = async () => {
    try {
      await cameraService.stopCamera();
      setStream(null);
      setCameraStatus('off');
      setIsRecording(false);
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      toast({
        title: "Camera Stopped",
        description: "Camera has been turned off."
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to stop camera.",
        variant: "destructive"
      });
    }
  };

  const switchCamera = async () => {
    try {
      setCameraStatus('initializing');
      const newStream = await cameraService.switchCamera();
      setStream(newStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      
      setCameraStatus('ready');
      
    } catch (error) {
      setCameraStatus('error');
      toast({
        title: "Camera Switch Failed",
        description: "Unable to switch camera.",
        variant: "destructive"
      });
    }
  };

  const captureSign = async () => {
    if (cameraStatus !== 'ready') return;
    
    try {
      setCameraStatus('processing');
      setProcessingStatus(true);
      
      // Mock sign recognition
      const recognizedSign = await mockSignRecognition();
      addRecognizedSign(recognizedSign);
      
      setCameraStatus('complete');
      setProcessingStatus(false);
      
      toast({
        title: "Sign Recognized!",
        description: `Detected "${recognizedSign.sign}" with ${recognizedSign.confidence}% confidence.`
      });
      
      // Reset to ready after a brief moment
      setTimeout(() => {
        setCameraStatus('ready');
      }, 2000);
      
    } catch (error) {
      setCameraStatus('error');
      setProcessingStatus(false);
      toast({
        title: "Recognition Failed",
        description: "Please try again or adjust lighting.",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: "File Uploaded",
        description: `Processing ${file.name}...`
      });
      
      // In a real app, this would process the uploaded file
      setTimeout(() => {
        captureSign();
      }, 500);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      captureSign();
    } else {
      setIsRecording(true);
    }
  };

  return (
    <Card className={cn("card-elevated", accessibilityPrefs.highContrast && "high-contrast")}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Camera Input</span>
          <div className="flex items-center space-x-2">
            {processingStatus && (
              <Progress value={75} className="w-20" aria-label="Processing sign recognition" />
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Camera Feed */}
        <div className="relative">
          <div 
            className={cn(
              "camera-frame aspect-video w-full bg-muted flex items-center justify-center",
              cameraStatus === 'ready' && "active",
              cameraStatus === 'processing' && "processing",
              cameraStatus === 'error' && "error"
            )}
            role="img"
            aria-label={`Camera feed: ${getStatusMessage()}`}
          >
            {stream ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                aria-label="Live camera feed for sign language recognition"
              />
            ) : (
              <div className="text-center space-y-2">
                <Camera className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{getStatusMessage()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Camera Controls */}
        <div className="flex flex-wrap gap-2 justify-center">
          {cameraStatus === 'off' || cameraStatus === 'error' ? (
            <Button 
              onClick={startCamera}
              className="btn-camera"
              aria-label="Start camera"
            >
              <Camera className="h-4 w-4 mr-2" />
              {cameraStatus === 'error' ? 'Retry Camera' : 'Start Camera'}
            </Button>
          ) : cameraStatus === 'initializing' ? (
            <Button 
              className="btn-camera"
              disabled={true}
              aria-label="Starting camera"
            >
              <Camera className="h-4 w-4 mr-2" />
              Starting...
            </Button>
          ) : (
            <>
              <Button 
                onClick={stopCamera}
                variant="outline"
                className="min-h-touch min-w-touch"
                aria-label="Stop camera"
              >
                <CameraOff className="h-4 w-4 mr-2" />
                Stop
              </Button>
              
              <Button 
                onClick={switchCamera}
                variant="outline"
                className="min-h-touch min-w-touch"
                disabled={cameraStatus === 'processing'}
                aria-label="Switch camera"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Switch
              </Button>
              
              <Button 
                onClick={toggleRecording}
                className={cn(
                  "btn-camera",
                  isRecording && "bg-error hover:bg-error text-white"
                )}
                disabled={cameraStatus !== 'ready' && !isRecording}
                aria-label={isRecording ? "Stop recording and analyze" : "Start recording"}
              >
                {isRecording ? (
                  <>
                    <Square className="h-4 w-4 mr-2" />
                    Stop & Analyze
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Capture
                  </>
                )}
              </Button>
            </>
          )}
          
          {/* Upload Button */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="hidden"
              aria-label="Upload image or video file"
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="min-h-touch min-w-touch"
              aria-label="Upload image or video file"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>

        {/* Status Message */}
        <div 
          className="text-center p-3 rounded-md bg-muted"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="text-sm font-medium">{getStatusMessage()}</p>
        </div>
      </CardContent>
    </Card>
  );
}
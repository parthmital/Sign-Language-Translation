import { useState } from 'react';
import { Volume2, Copy, Share2, Download, Play, Pause } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';
import { mockTextToSpeech } from '@/services/mockServices';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

export function ResultsPanel() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingLanguage, setPlayingLanguage] = useState<string | null>(null);
  
  const { currentSign, recognitionHistory, accessibilityPrefs } = useAppStore();

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'confidence-high';
    if (confidence >= 70) return 'confidence-medium';
    return 'confidence-low';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 90) return 'High';
    if (confidence >= 70) return 'Medium';
    return 'Low';
  };

  const handleTextToSpeech = async (text: string, languageCode: string) => {
    try {
      if (isPlaying && playingLanguage === languageCode) {
        // Stop current playback
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setPlayingLanguage(null);
        return;
      }

      setIsPlaying(true);
      setPlayingLanguage(languageCode);
      
      await mockTextToSpeech(text, languageCode);
      
      toast({
        title: "Text-to-Speech",
        description: `Playing "${text}" in ${languageCode.toUpperCase()}`
      });
      
      // Reset state after a reasonable time
      setTimeout(() => {
        setIsPlaying(false);
        setPlayingLanguage(null);
      }, 3000);
      
    } catch (error) {
      setIsPlaying(false);
      setPlayingLanguage(null);
      toast({
        title: "TTS Error",
        description: "Text-to-speech is not available.",
        variant: "destructive"
      });
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `"${text}" copied to clipboard.`
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleShare = async (sign: string, translation: string, language: string) => {
    const shareText = `Sign: ${sign}\nTranslation (${language}): ${translation}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Sign Language Translation',
          text: shareText
        });
      } catch (error) {
        // User cancelled or error occurred
        handleCopy(shareText);
      }
    } else {
      handleCopy(shareText);
    }
  };

  if (!currentSign && recognitionHistory.length === 0) {
    return (
      <Card className={cn("card-elevated", accessibilityPrefs.highContrast && "high-contrast")}>
        <CardHeader>
          <CardTitle>Recognition Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No signs recognized yet.</p>
            <p className="text-sm mt-2">Start the camera and make a sign to see results here.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Current Recognition */}
      {currentSign && (
        <Card className={cn("card-elevated", accessibilityPrefs.highContrast && "high-contrast")}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Latest Recognition</span>
              <Badge variant="secondary" className="text-xs">
                {new Date(currentSign.timestamp).toLocaleTimeString()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Sign Recognition */}
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-primary" role="heading" aria-level={3}>
                {currentSign.sign}
              </h3>
              
              {/* Confidence Meter */}
              <div className="space-y-1" role="group" aria-labelledby="confidence-label">
                <div className="flex items-center justify-between text-sm">
                  <span id="confidence-label">Confidence</span>
                  <span className="font-medium">{currentSign.confidence}%</span>
                </div>
                <div className="confidence-bar">
                  <div 
                    className={cn("confidence-fill", getConfidenceColor(currentSign.confidence))}
                    style={{ width: `${currentSign.confidence}%` }}
                    role="progressbar"
                    aria-valuenow={currentSign.confidence}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Confidence: ${currentSign.confidence}% (${getConfidenceLabel(currentSign.confidence)})`}
                  />
                </div>
              </div>
            </div>

            {/* Translations */}
            {currentSign.translations.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Translations
                </h4>
                <div className="grid gap-2">
                  {currentSign.translations.map((translation, index) => (
                    <div 
                      key={`${translation.languageCode}-${index}`}
                      className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl" role="img" aria-label={`${translation.language} flag`}>
                          {translation.flag}
                        </span>
                        <div>
                          <p className="font-medium">{translation.text}</p>
                          <p className="text-xs text-muted-foreground">{translation.language}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="btn-icon"
                          onClick={() => handleTextToSpeech(translation.text, translation.languageCode)}
                          disabled={!accessibilityPrefs.textToSpeech}
                          aria-label={`${isPlaying && playingLanguage === translation.languageCode ? 'Stop' : 'Play'} pronunciation for ${translation.text} in ${translation.language}`}
                        >
                          {isPlaying && playingLanguage === translation.languageCode ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Volume2 className="h-4 w-4" />
                          )}
                        </Button>
                        
                        <Button
                          size="icon"
                          variant="ghost"
                          className="btn-icon"
                          onClick={() => handleCopy(translation.text)}
                          aria-label={`Copy ${translation.text} to clipboard`}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          size="icon"
                          variant="ghost"
                          className="btn-icon"
                          onClick={() => handleShare(currentSign.sign, translation.text, translation.language)}
                          aria-label={`Share ${translation.text} translation`}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recognition History */}
      {recognitionHistory.length > 0 && (
        <Card className={cn("card-elevated", accessibilityPrefs.highContrast && "high-contrast")}>
          <CardHeader>
            <CardTitle>Recent Recognitions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {recognitionHistory.slice(0, 10).map((sign) => (
                <div 
                  key={sign.id}
                  className="flex items-center justify-between p-2 rounded bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">{sign.sign}</span>
                    <Badge variant="outline" className="text-xs">
                      {sign.confidence}%
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(sign.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
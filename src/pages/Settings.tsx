import { useState } from 'react';
import { 
  Eye, 
  Type, 
  Palette, 
  MousePointer, 
  Zap, 
  Volume2, 
  VolumeX,
  Gauge,
  Vibrate,
  Settings as SettingsIcon,
  Globe,
  Monitor
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/store/useAppStore';
import { AVAILABLE_LANGUAGES } from '@/services/mockServices';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

export default function Settings() {
  const { accessibilityPrefs, languagePrefs, updateAccessibilityPrefs, updateLanguagePrefs } = useAppStore();
  const [tempVolume, setTempVolume] = useState([accessibilityPrefs.volume]);

  const handleVolumeChange = (value: number[]) => {
    setTempVolume(value);
    updateAccessibilityPrefs({ volume: value[0] });
  };

  const handleHighContrastToggle = (enabled: boolean) => {
    updateAccessibilityPrefs({ highContrast: enabled });
    if (enabled) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    toast({
      title: enabled ? "High Contrast Enabled" : "High Contrast Disabled",
      description: enabled ? "Interface now uses high contrast colors" : "Interface returned to normal contrast"
    });
  };

  const handleLargeTextToggle = (enabled: boolean) => {
    updateAccessibilityPrefs({ largeText: enabled });
    if (enabled) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
    toast({
      title: enabled ? "Large Text Enabled" : "Large Text Disabled",
      description: enabled ? "Text size increased for better readability" : "Text size returned to normal"
    });
  };

  const currentLanguage = AVAILABLE_LANGUAGES.find(lang => lang.code === languagePrefs.primaryLanguage);

  const settingSections = [
    {
      title: 'Visual Settings',
      icon: Eye,
      settings: [
        {
          id: 'high-contrast',
          label: 'High Contrast Mode',
          description: 'Increase contrast for better visibility',
          type: 'switch',
          value: accessibilityPrefs.highContrast,
          onChange: handleHighContrastToggle
        },
        {
          id: 'large-text',
          label: 'Large Text',
          description: 'Increase text size for better readability',
          type: 'switch',
          value: accessibilityPrefs.largeText,
          onChange: handleLargeTextToggle
        },
        {
          id: 'color-blind-support',
          label: 'Color Blind Support',
          description: 'Enhanced color differentiation',
          type: 'switch',
          value: accessibilityPrefs.colorBlindSupport,
          onChange: (value: boolean) => updateAccessibilityPrefs({ colorBlindSupport: value })
        }
      ]
    },
    {
      title: 'Interface Settings',
      icon: MousePointer,
      settings: [
        {
          id: 'button-size',
          label: 'Button Size',
          description: 'Adjust button size for easier interaction',
          type: 'select',
          value: accessibilityPrefs.buttonSize,
          options: [
            { value: 'normal', label: 'Normal (44px minimum)' },
            { value: 'large', label: 'Large (56px minimum)' }
          ],
          onChange: (value: string) => updateAccessibilityPrefs({ buttonSize: value as 'normal' | 'large' })
        },
        {
          id: 'reduced-motion',
          label: 'Reduced Motion',
          description: 'Minimize animations and transitions',
          type: 'switch',
          value: accessibilityPrefs.reducedMotion,
          onChange: (value: boolean) => {
            updateAccessibilityPrefs({ reducedMotion: value });
            if (value) {
              document.documentElement.style.setProperty('--animation-duration', '0.01ms');
            } else {
              document.documentElement.style.removeProperty('--animation-duration');
            }
          }
        },
        {
          id: 'vibration-feedback',
          label: 'Vibration Feedback',
          description: 'Haptic feedback for touch interactions',
          type: 'switch',
          value: accessibilityPrefs.vibrationFeedback,
          onChange: (value: boolean) => updateAccessibilityPrefs({ vibrationFeedback: value })
        }
      ]
    },
    {
      title: 'Audio Settings',
      icon: Volume2,
      settings: [
        {
          id: 'text-to-speech',
          label: 'Text-to-Speech',
          description: 'Enable audio playback of translations',
          type: 'switch',
          value: accessibilityPrefs.textToSpeech,
          onChange: (value: boolean) => updateAccessibilityPrefs({ textToSpeech: value })
        },
        {
          id: 'speech-rate',
          label: 'Speech Rate',
          description: 'Speed of text-to-speech playback',
          type: 'select',
          value: accessibilityPrefs.speechRate,
          options: [
            { value: 'slow', label: 'Slow' },
            { value: 'normal', label: 'Normal' },
            { value: 'fast', label: 'Fast' }
          ],
          onChange: (value: string) => updateAccessibilityPrefs({ speechRate: value as 'slow' | 'normal' | 'fast' }),
          disabled: !accessibilityPrefs.textToSpeech
        },
        {
          id: 'volume',
          label: 'Volume',
          description: 'Audio playback volume level',
          type: 'slider',
          value: tempVolume[0],
          min: 0,
          max: 100,
          step: 5,
          onChange: handleVolumeChange,
          disabled: !accessibilityPrefs.textToSpeech
        }
      ]
    }
  ];

  return (
    <div className={cn("min-h-screen bg-background", accessibilityPrefs.highContrast && "high-contrast")}>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold flex items-center justify-center space-x-2">
            <SettingsIcon className="h-8 w-8" />
            <span>Settings</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Customize your experience with accessibility options and preferences.
          </p>
        </div>

        {/* Language Settings */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Language Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="primary-language">Primary Language</Label>
              <Select 
                value={languagePrefs.primaryLanguage} 
                onValueChange={(value) => updateLanguagePrefs({ primaryLanguage: value })}
              >
                <SelectTrigger id="primary-language" className="min-h-touch">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border shadow-medium">
                  {AVAILABLE_LANGUAGES.map((language) => (
                    <SelectItem key={language.code} value={language.code} className="min-h-touch">
                      <div className="flex items-center space-x-2">
                        <span role="img" aria-label={`${language.name} flag`}>{language.flag}</span>
                        <span>{language.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {currentLanguage && (
              <div className="p-3 rounded-lg bg-muted/30 border">
                <div className="flex items-center space-x-2">
                  <span className="text-lg" role="img" aria-label={`${currentLanguage.name} flag`}>
                    {currentLanguage.flag}
                  </span>
                  <span className="font-medium">{currentLanguage.name}</span>
                  <span className="text-sm text-muted-foreground">• Primary</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Accessibility Settings */}
        <div className="space-y-6">
          {settingSections.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.title} className="card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon className="h-5 w-5" />
                    <span>{section.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {section.settings.map((setting, index) => (
                    <div key={setting.id}>
                      <div className="flex items-start justify-between space-x-4">
                        <div className="space-y-1 flex-1">
                          <Label 
                            htmlFor={setting.id}
                            className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {setting.label}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {setting.description}
                          </p>
                        </div>
                        
                        <div className="flex-shrink-0">
                          {setting.type === 'switch' && (
                            <Switch
                              id={setting.id}
                              checked={setting.value as boolean}
                              onCheckedChange={setting.onChange}
                              disabled={setting.disabled}
                              className="min-h-touch min-w-touch"
                              aria-describedby={`${setting.id}-description`}
                            />
                          )}
                          
                          {setting.type === 'select' && (
                            <Select
                              value={setting.value as string}
                              onValueChange={setting.onChange}
                              disabled={setting.disabled}
                            >
                              <SelectTrigger id={setting.id} className="w-48 min-h-touch">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-popover border shadow-medium">
                                {setting.options?.map((option) => (
                                  <SelectItem 
                                    key={option.value} 
                                    value={option.value}
                                    className="min-h-touch"
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          
                          {setting.type === 'slider' && (
                            <div className="w-48 space-y-2">
                              <div className="flex items-center justify-between">
                                <VolumeX className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">{setting.value}%</span>
                                <Volume2 className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <Slider
                                id={setting.id}
                                min={setting.min}
                                max={setting.max}
                                step={setting.step}
                                value={[setting.value as number]}
                                onValueChange={setting.onChange}
                                disabled={setting.disabled}
                                className="w-full"
                                aria-label={`${setting.label}: ${setting.value}%`}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {index < section.settings.length - 1 && (
                        <Separator className="mt-6" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Reset Settings */}
        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-medium">Reset All Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Restore all settings to their default values
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  // Reset to defaults
                  updateAccessibilityPrefs({
                    highContrast: false,
                    largeText: false,
                    colorBlindSupport: false,
                    buttonSize: 'normal',
                    reducedMotion: false,
                    vibrationFeedback: true,
                    textToSpeech: true,
                    speechRate: 'normal',
                    volume: 70
                  });
                  updateLanguagePrefs({
                    primaryLanguage: 'en',
                    targetLanguages: ['es', 'fr', 'de']
                  });
                  setTempVolume([70]);
                  
                  // Remove any applied classes
                  document.documentElement.classList.remove('high-contrast', 'large-text');
                  document.documentElement.style.removeProperty('--animation-duration');
                  
                  toast({
                    title: "Settings Reset",
                    description: "All settings have been restored to their defaults."
                  });
                }}
                className="min-h-touch"
                aria-label="Reset all settings to defaults"
              >
                Reset Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
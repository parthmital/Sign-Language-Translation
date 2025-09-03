import { useState } from 'react';
import { Plus, X, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/store/useAppStore';
import { AVAILABLE_LANGUAGES } from '@/services/mockServices';
import { cn } from '@/lib/utils';

export function LanguageSelectionPanel() {
  const [newLanguage, setNewLanguage] = useState('');
  const [showAddInput, setShowAddInput] = useState(false);
  
  const { languagePrefs, updateLanguagePrefs, accessibilityPrefs } = useAppStore();
  
  const currentPrimary = AVAILABLE_LANGUAGES.find(lang => lang.code === languagePrefs.primaryLanguage);
  const targetLanguages = AVAILABLE_LANGUAGES.filter(lang => 
    languagePrefs.targetLanguages.includes(lang.code)
  );
  
  const availableTargets = AVAILABLE_LANGUAGES.filter(lang => 
    lang.code !== languagePrefs.primaryLanguage && 
    !languagePrefs.targetLanguages.includes(lang.code)
  );

  const handlePrimaryLanguageChange = (languageCode: string) => {
    // Remove from target languages if selected as primary
    const newTargets = languagePrefs.targetLanguages.filter(code => code !== languageCode);
    updateLanguagePrefs({
      primaryLanguage: languageCode,
      targetLanguages: newTargets
    });
  };

  const handleTargetLanguageToggle = (languageCode: string, checked: boolean) => {
    if (checked) {
      updateLanguagePrefs({
        targetLanguages: [...languagePrefs.targetLanguages, languageCode]
      });
    } else {
      updateLanguagePrefs({
        targetLanguages: languagePrefs.targetLanguages.filter(code => code !== languageCode)
      });
    }
  };

  const handleAddCustomLanguage = () => {
    if (newLanguage.trim()) {
      // In a real app, this would validate and add the custom language
      console.log('Adding custom language:', newLanguage);
      setNewLanguage('');
      setShowAddInput(false);
    }
  };

  return (
    <Card className={cn("card-elevated", accessibilityPrefs.highContrast && "high-contrast")}>
      <CardHeader>
        <CardTitle>Language Settings</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Primary Language Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="primary-language">
            Primary Language
          </label>
          <Select 
            value={languagePrefs.primaryLanguage} 
            onValueChange={handlePrimaryLanguageChange}
          >
            <SelectTrigger id="primary-language" className="min-h-touch" aria-label="Select primary language">
              <SelectValue placeholder="Select primary language" />
            </SelectTrigger>
            <SelectContent className="bg-popover border shadow-medium">
              {AVAILABLE_LANGUAGES.map((language) => (
                <SelectItem 
                  key={language.code} 
                  value={language.code}
                  className="min-h-touch"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg" role="img" aria-label={`${language.name} flag`}>
                      {language.flag}
                    </span>
                    <span>{language.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Current Primary Language Display */}
        {currentPrimary && (
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center space-x-2">
              <span className="text-lg" role="img" aria-label={`${currentPrimary.name} flag`}>
                {currentPrimary.flag}
              </span>
              <span className="font-medium">{currentPrimary.name}</span>
              <Badge variant="secondary" className="text-xs">Primary</Badge>
            </div>
          </div>
        )}

        {/* Target Languages */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              Target Languages for Translation
            </label>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAddInput(!showAddInput)}
              className="min-h-touch"
              aria-label="Add custom language"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Selected Target Languages */}
          {targetLanguages.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Selected Languages:</p>
              <div className="flex flex-wrap gap-2">
                {targetLanguages.map((language) => (
                  <Badge 
                    key={language.code} 
                    variant="secondary" 
                    className="flex items-center space-x-1 px-3 py-1"
                  >
                    <span className="text-sm" role="img" aria-label={`${language.name} flag`}>
                      {language.flag}
                    </span>
                    <span>{language.name}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => handleTargetLanguageToggle(language.code, false)}
                      aria-label={`Remove ${language.name} from target languages`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Available Target Languages */}
          {availableTargets.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Available Languages:</p>
              <div className="grid gap-2 max-h-40 overflow-y-auto">
                {availableTargets.map((language) => (
                  <div 
                    key={language.code}
                    className="flex items-center space-x-3 p-2 rounded hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      id={`lang-${language.code}`}
                      checked={false}
                      onCheckedChange={(checked) => 
                        handleTargetLanguageToggle(language.code, checked as boolean)
                      }
                      className="min-h-touch min-w-touch"
                      aria-label={`Add ${language.name} to target languages`}
                    />
                    <label 
                      htmlFor={`lang-${language.code}`}
                      className="flex items-center space-x-2 cursor-pointer flex-1"
                    >
                      <span className="text-lg" role="img" aria-label={`${language.name} flag`}>
                        {language.flag}
                      </span>
                      <span className="text-sm">{language.name}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Custom Language Input */}
          {showAddInput && (
            <div className="space-y-2 p-3 border rounded-lg bg-muted/20">
              <label htmlFor="custom-language" className="text-xs text-muted-foreground">
                Add Custom Language
              </label>
              <div className="flex space-x-2">
                <Input
                  id="custom-language"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  placeholder="Enter language name"
                  className="min-h-touch"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCustomLanguage()}
                />
                <Button
                  size="icon"
                  onClick={handleAddCustomLanguage}
                  disabled={!newLanguage.trim()}
                  className="min-h-touch min-w-touch"
                  aria-label="Add custom language"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="pt-2 border-t">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{targetLanguages.length} languages selected</span>
            {targetLanguages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateLanguagePrefs({ targetLanguages: [] })}
                className="h-6 px-2 text-xs"
                aria-label="Clear all target languages"
              >
                Clear all
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
import { useState } from 'react';
import { BookOpen, Play, Check, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

const SIGN_CATALOG = [
  {
    id: 'hello',
    sign: 'HELLO',
    description: 'A friendly greeting sign',
    difficulty: 'beginner',
    category: 'greetings',
    practiced: true,
    mastered: true
  },
  {
    id: 'thank-you',
    sign: 'THANK YOU',
    description: 'Express gratitude',
    difficulty: 'beginner',
    category: 'greetings',
    practiced: true,
    mastered: false
  },
  {
    id: 'please',
    sign: 'PLEASE',
    description: 'Polite request',
    difficulty: 'beginner',
    category: 'greetings',
    practiced: false,
    mastered: false
  },
  {
    id: 'good-morning',
    sign: 'GOOD MORNING',
    description: 'Morning greeting',
    difficulty: 'intermediate',
    category: 'greetings',
    practiced: false,
    mastered: false
  },
  {
    id: 'help',
    sign: 'HELP',
    description: 'Request assistance',
    difficulty: 'beginner',
    category: 'basic-needs',
    practiced: false,
    mastered: false
  },
  {
    id: 'water',
    sign: 'WATER',
    description: 'Basic need sign',
    difficulty: 'beginner',
    category: 'basic-needs',
    practiced: false,
    mastered: false
  }
];

const CATEGORIES = [
  { id: 'all', name: 'All Signs', count: SIGN_CATALOG.length },
  { id: 'greetings', name: 'Greetings', count: SIGN_CATALOG.filter(s => s.category === 'greetings').length },
  { id: 'basic-needs', name: 'Basic Needs', count: SIGN_CATALOG.filter(s => s.category === 'basic-needs').length }
];

export default function Learn() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [practiceMode, setPracticeMode] = useState(false);
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  
  const { accessibilityPrefs } = useAppStore();
  
  const filteredSigns = selectedCategory === 'all' 
    ? SIGN_CATALOG 
    : SIGN_CATALOG.filter(sign => sign.category === selectedCategory);
    
  const practicedSigns = SIGN_CATALOG.filter(sign => sign.practiced);
  const masteredSigns = SIGN_CATALOG.filter(sign => sign.mastered);
  const progress = (masteredSigns.length / SIGN_CATALOG.length) * 100;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-success text-white';
      case 'intermediate': return 'bg-warning text-white';
      case 'advanced': return 'bg-error text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const startPracticeMode = () => {
    setPracticeMode(true);
    setCurrentSignIndex(0);
  };

  const nextSign = () => {
    if (currentSignIndex < filteredSigns.length - 1) {
      setCurrentSignIndex(currentSignIndex + 1);
    } else {
      setPracticeMode(false);
    }
  };

  const previousSign = () => {
    if (currentSignIndex > 0) {
      setCurrentSignIndex(currentSignIndex - 1);
    }
  };

  if (practiceMode) {
    const currentSign = filteredSigns[currentSignIndex];
    
    return (
      <div className={cn("min-h-screen bg-background", accessibilityPrefs.highContrast && "high-contrast")}>
        <div className="container mx-auto px-4 py-6">
          {/* Practice Mode Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <Button 
                variant="outline" 
                onClick={() => setPracticeMode(false)}
                className="min-h-touch"
                aria-label="Exit practice mode"
              >
                ← Back to Learning
              </Button>
              <Badge variant="secondary">
                {currentSignIndex + 1} of {filteredSigns.length}
              </Badge>
            </div>
            <Progress 
              value={(currentSignIndex + 1) / filteredSigns.length * 100} 
              className="h-2"
              aria-label={`Practice progress: ${currentSignIndex + 1} of ${filteredSigns.length} signs`}
            />
          </div>

          {/* Practice Card */}
          <Card className="card-elevated max-w-2xl mx-auto">
            <CardContent className="p-8 text-center space-y-6">
              <div className="space-y-2">
                <Badge className={getDifficultyColor(currentSign.difficulty)}>
                  {currentSign.difficulty}
                </Badge>
                <h1 className="text-4xl font-bold text-primary">{currentSign.sign}</h1>
                <p className="text-muted-foreground">{currentSign.description}</p>
              </div>

              {/* Practice Area */}
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center space-y-4">
                  <BookOpen className="h-16 w-16 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Practice the sign: <strong>{currentSign.sign}</strong>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Use the camera to practice this sign
                  </p>
                </div>
              </div>

              {/* Practice Controls */}
              <div className="flex justify-center space-x-4">
                <Button 
                  variant="outline" 
                  onClick={previousSign}
                  disabled={currentSignIndex === 0}
                  className="min-h-touch"
                  aria-label="Previous sign"
                >
                  ← Previous
                </Button>
                <Button 
                  onClick={nextSign}
                  className="min-h-touch"
                  aria-label={currentSignIndex === filteredSigns.length - 1 ? "Finish practice" : "Next sign"}
                >
                  {currentSignIndex === filteredSigns.length - 1 ? 'Finish' : 'Next →'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-background", accessibilityPrefs.highContrast && "high-contrast")}>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Learn Sign Language</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Master sign language with our interactive learning system. Practice signs, track your progress, and build your vocabulary.
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <p className="text-2xl font-bold text-primary">{masteredSigns.length}</p>
                <p className="text-sm text-muted-foreground">Signs Mastered</p>
              </div>
              <div className="text-center space-y-2">
                <p className="text-2xl font-bold text-secondary">{practicedSigns.length}</p>
                <p className="text-sm text-muted-foreground">Signs Practiced</p>
              </div>
              <div className="text-center space-y-2">
                <p className="text-2xl font-bold text-accent">{progress.toFixed(0)}%</p>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={progress} className="h-3" aria-label={`Learning progress: ${progress.toFixed(0)}%`} />
            </div>
          </CardContent>
        </Card>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="min-h-touch"
              aria-label={`Filter by ${category.name} (${category.count} signs)`}
            >
              {category.name} ({category.count})
            </Button>
          ))}
        </div>

        {/* Practice Mode Button */}
        <div className="text-center">
          <Button 
            onClick={startPracticeMode}
            className="btn-hero min-h-touch"
            disabled={filteredSigns.length === 0}
            aria-label="Start practice mode"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Practice Mode
          </Button>
        </div>

        {/* Sign Catalog */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSigns.map((sign) => (
            <Card key={sign.id} className="card-elevated hover:shadow-strong transition-shadow">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg">{sign.sign}</h3>
                    <p className="text-sm text-muted-foreground">{sign.description}</p>
                  </div>
                  <div className="flex space-x-1">
                    {sign.practiced && (
                      <Badge variant="secondary" className="text-xs">
                        <Check className="h-3 w-3 mr-1" />
                      </Badge>
                    )}
                    {sign.mastered && (
                      <Badge className="bg-success text-white text-xs">
                        ✓
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge className={getDifficultyColor(sign.difficulty)}>
                    {sign.difficulty}
                  </Badge>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="min-h-touch"
                    aria-label={`Practice ${sign.sign}`}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Practice
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Learning Tips */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Learning Tips</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Practice Regularly</h4>
                <p className="text-sm text-muted-foreground">
                  Consistent daily practice is more effective than long, infrequent sessions.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Focus on Hand Position</h4>
                <p className="text-sm text-muted-foreground">
                  Pay attention to hand shape, movement, and position relative to your body.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Use the Camera</h4>
                <p className="text-sm text-muted-foreground">
                  Practice with the camera to get real-time feedback on your signing.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Build Vocabulary</h4>
                <p className="text-sm text-muted-foreground">
                  Start with basic signs and gradually work up to more complex expressions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
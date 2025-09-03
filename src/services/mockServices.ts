import { RecognizedSign, Translation } from '@/store/useAppStore';

// Mock translations data
const MOCK_TRANSLATIONS: Record<string, Translation[]> = {
  'HELLO': [
    { language: 'Spanish', languageCode: 'es', text: 'Hola', flag: '🇪🇸' },
    { language: 'French', languageCode: 'fr', text: 'Bonjour', flag: '🇫🇷' },
    { language: 'German', languageCode: 'de', text: 'Hallo', flag: '🇩🇪' },
    { language: 'Italian', languageCode: 'it', text: 'Ciao', flag: '🇮🇹' },
    { language: 'Portuguese', languageCode: 'pt', text: 'Olá', flag: '🇵🇹' },
    { language: 'Japanese', languageCode: 'ja', text: 'こんにちは', flag: '🇯🇵' }
  ],
  'THANK YOU': [
    { language: 'Spanish', languageCode: 'es', text: 'Gracias', flag: '🇪🇸' },
    { language: 'French', languageCode: 'fr', text: 'Merci', flag: '🇫🇷' },
    { language: 'German', languageCode: 'de', text: 'Danke', flag: '🇩🇪' },
    { language: 'Italian', languageCode: 'it', text: 'Grazie', flag: '🇮🇹' },
    { language: 'Portuguese', languageCode: 'pt', text: 'Obrigado', flag: '🇵🇹' },
    { language: 'Japanese', languageCode: 'ja', text: 'ありがとう', flag: '🇯🇵' }
  ],
  'PLEASE': [
    { language: 'Spanish', languageCode: 'es', text: 'Por favor', flag: '🇪🇸' },
    { language: 'French', languageCode: 'fr', text: 'S\'il vous plaît', flag: '🇫🇷' },
    { language: 'German', languageCode: 'de', text: 'Bitte', flag: '🇩🇪' },
    { language: 'Italian', languageCode: 'it', text: 'Per favore', flag: '🇮🇹' },
    { language: 'Portuguese', languageCode: 'pt', text: 'Por favor', flag: '🇵🇹' },
    { language: 'Japanese', languageCode: 'ja', text: 'お願いします', flag: '🇯🇵' }
  ],
  'GOOD MORNING': [
    { language: 'Spanish', languageCode: 'es', text: 'Buenos días', flag: '🇪🇸' },
    { language: 'French', languageCode: 'fr', text: 'Bonjour', flag: '🇫🇷' },
    { language: 'German', languageCode: 'de', text: 'Guten Morgen', flag: '🇩🇪' },
    { language: 'Italian', languageCode: 'it', text: 'Buongiorno', flag: '🇮🇹' },
    { language: 'Portuguese', languageCode: 'pt', text: 'Bom dia', flag: '🇵🇹' },
    { language: 'Japanese', languageCode: 'ja', text: 'おはようございます', flag: '🇯🇵' }
  ]
};

const MOCK_SIGNS = ['HELLO', 'THANK YOU', 'PLEASE', 'GOOD MORNING'];

// Mock sign recognition service
export const mockSignRecognition = async (): Promise<RecognizedSign> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
  
  const randomSign = MOCK_SIGNS[Math.floor(Math.random() * MOCK_SIGNS.length)];
  const confidence = 85 + Math.random() * 15; // 85-100% confidence
  
  const result: RecognizedSign = {
    id: `sign-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    sign: randomSign,
    confidence: Math.round(confidence * 10) / 10,
    timestamp: new Date(),
    translations: MOCK_TRANSLATIONS[randomSign] || []
  };
  
  return result;
};

// Mock camera service
export class MockCameraService {
  private stream: MediaStream | null = null;
  
  async requestPermission(): Promise<boolean> {
    // Simulate permission request
    await new Promise(resolve => setTimeout(resolve, 500));
    return Math.random() > 0.1; // 90% success rate
  }
  
  async startCamera(): Promise<MediaStream> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create a mock canvas stream for demo purposes
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d')!;
    
    // Draw a simple placeholder
    ctx.fillStyle = '#e5e7eb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#6b7280';
    ctx.font = '20px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Camera Feed Placeholder', canvas.width / 2, canvas.height / 2);
    ctx.fillText('Position hand in frame', canvas.width / 2, canvas.height / 2 + 30);
    
    // @ts-ignore - Mock stream for demo
    this.stream = canvas.captureStream(30);
    return this.stream;
  }
  
  async stopCamera(): Promise<void> {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
  
  async switchCamera(): Promise<MediaStream> {
    await this.stopCamera();
    return this.startCamera();
  }
}

// Mock TTS service
export const mockTextToSpeech = async (text: string, language: string = 'en'): Promise<void> => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'en' ? 'en-US' : language;
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 0.7;
    
    window.speechSynthesis.speak(utterance);
  } else {
    // Fallback: just simulate the action
    console.log(`TTS: ${text} (${language})`);
  }
};

// Mock model performance tracking
export const mockModelPerformance = () => {
  return {
    responseTime: 800 + Math.random() * 400, // 800-1200ms
    accuracy: 85 + Math.random() * 15, // 85-100%
    modelVersion: 'GmTC v1.0',
    modelSize: '15.2MB'
  };
};

// Mock learning progress data
export const mockLearningProgress = () => {
  const today = new Date();
  const weekData = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    weekData.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      signsRecognized: Math.floor(Math.random() * 20) + 5,
      accuracy: 80 + Math.random() * 20
    });
  }
  
  return weekData;
};

// Language options with flags
export const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' }
];
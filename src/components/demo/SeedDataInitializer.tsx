import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { RecognizedSign } from '@/store/useAppStore';
import { AVAILABLE_LANGUAGES } from '@/services/mockServices';

const DEMO_SIGNS: RecognizedSign[] = [
  {
    id: 'demo-hello',
    sign: 'HELLO',
    confidence: 94.2,
    timestamp: new Date(Date.now() - 120000), // 2 minutes ago
    translations: [
      { language: 'Spanish', languageCode: 'es', text: 'Hola', flag: '🇪🇸' },
      { language: 'French', languageCode: 'fr', text: 'Bonjour', flag: '🇫🇷' },
      { language: 'German', languageCode: 'de', text: 'Hallo', flag: '🇩🇪' }
    ]
  },
  {
    id: 'demo-thank-you',
    sign: 'THANK YOU',
    confidence: 96.8,
    timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    translations: [
      { language: 'Spanish', languageCode: 'es', text: 'Gracias', flag: '🇪🇸' },
      { language: 'French', languageCode: 'fr', text: 'Merci', flag: '🇫🇷' },
      { language: 'German', languageCode: 'de', text: 'Danke', flag: '🇩🇪' }
    ]
  }
];

export function SeedDataInitializer() {
  const { 
    recognitionHistory, 
    addRecognizedSign, 
    updateModelStats, 
    updateSessionStats,
    setConnectionStatus 
  } = useAppStore();

  useEffect(() => {
    // Only seed if no data exists
    if (recognitionHistory.length === 0) {
      // Add demo signs
      DEMO_SIGNS.forEach(sign => {
        setTimeout(() => {
          addRecognizedSign(sign);
        }, Math.random() * 1000);
      });

      // Initialize model stats
      updateModelStats({
        responseTime: 850,
        averageAccuracy: 95.5,
        totalPredictions: 247,
        accuracyTrend: [92, 94, 91, 95, 97, 93, 96, 95]
      });

      // Initialize session stats
      updateSessionStats({
        signsRecognized: 8,
        averageAccuracy: 93.2,
        avgResponseTime: 890,
        newSignsLearned: 3,
        languagesPracticed: ['Spanish', 'French', 'German'],
        mostUsedSign: 'HELLO'
      });

      // Set connection status
      setConnectionStatus('online');
    }
  }, [recognitionHistory.length, addRecognizedSign, updateModelStats, updateSessionStats, setConnectionStatus]);

  return null; // This component doesn't render anything
}
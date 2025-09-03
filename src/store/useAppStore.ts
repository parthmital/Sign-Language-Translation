import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface RecognizedSign {
  id: string;
  sign: string;
  confidence: number;
  timestamp: Date;
  translations: Translation[];
}

export interface Translation {
  language: string;
  languageCode: string;
  text: string;
  flag: string;
}

export interface ModelStats {
  responseTime: number;
  averageAccuracy: number;
  totalPredictions: number;
  accuracyTrend: number[];
}

export interface SessionStats {
  signsRecognized: number;
  averageAccuracy: number;
  avgResponseTime: number;
  newSignsLearned: number;
  languagesPracticed: string[];
  mostUsedSign: string;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  colorBlindSupport: boolean;
  buttonSize: 'normal' | 'large';
  reducedMotion: boolean;
  vibrationFeedback: boolean;
  textToSpeech: boolean;
  speechRate: 'slow' | 'normal' | 'fast';
  volume: number;
}

export interface LanguagePreferences {
  primaryLanguage: string;
  targetLanguages: string[];
}

export type CameraStatus = 'off' | 'initializing' | 'ready' | 'processing' | 'complete' | 'error';
export type ConnectionStatus = 'online' | 'offline' | 'error';

interface AppState {
  // Camera and Processing
  cameraStatus: CameraStatus;
  processingStatus: boolean;
  currentSign: RecognizedSign | null;
  recognitionHistory: RecognizedSign[];
  
  // Language and Preferences
  languagePrefs: LanguagePreferences;
  accessibilityPrefs: AccessibilitySettings;
  
  // Statistics
  modelStats: ModelStats;
  sessionStats: SessionStats;
  
  // Connection
  connectionStatus: ConnectionStatus;
  
  // UI State
  isHeaderCollapsed: boolean;
  activePanel: 'camera' | 'results' | 'learning';
  
  // Actions
  setCameraStatus: (status: CameraStatus) => void;
  setProcessingStatus: (processing: boolean) => void;
  addRecognizedSign: (sign: RecognizedSign) => void;
  updateLanguagePrefs: (prefs: Partial<LanguagePreferences>) => void;
  updateAccessibilityPrefs: (prefs: Partial<AccessibilitySettings>) => void;
  updateModelStats: (stats: Partial<ModelStats>) => void;
  updateSessionStats: (stats: Partial<SessionStats>) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setActivePanel: (panel: 'camera' | 'results' | 'learning') => void;
  toggleHeaderCollapsed: () => void;
  clearHistory: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      cameraStatus: 'off',
      processingStatus: false,
      currentSign: null,
      recognitionHistory: [],
      
      languagePrefs: {
        primaryLanguage: 'en',
        targetLanguages: ['es', 'fr', 'de']
      },
      
      accessibilityPrefs: {
        highContrast: false,
        largeText: false,
        colorBlindSupport: false,
        buttonSize: 'normal',
        reducedMotion: false,
        vibrationFeedback: true,
        textToSpeech: true,
        speechRate: 'normal',
        volume: 70
      },
      
      modelStats: {
        responseTime: 0,
        averageAccuracy: 0,
        totalPredictions: 0,
        accuracyTrend: []
      },
      
      sessionStats: {
        signsRecognized: 0,
        averageAccuracy: 0,
        avgResponseTime: 0,
        newSignsLearned: 0,
        languagesPracticed: [],
        mostUsedSign: ''
      },
      
      connectionStatus: 'online',
      isHeaderCollapsed: false,
      activePanel: 'camera',
      
      // Actions
      setCameraStatus: (status) => set({ cameraStatus: status }),
      
      setProcessingStatus: (processing) => set({ processingStatus: processing }),
      
      addRecognizedSign: (sign) => set((state) => {
        const newHistory = [sign, ...state.recognitionHistory].slice(0, 50); // Keep last 50
        const stats = state.sessionStats;
        const newStats = {
          ...stats,
          signsRecognized: stats.signsRecognized + 1,
          averageAccuracy: ((stats.averageAccuracy * stats.signsRecognized) + sign.confidence) / (stats.signsRecognized + 1),
          mostUsedSign: sign.sign // Simplified - in real app would track frequency
        };
        
        return {
          currentSign: sign,
          recognitionHistory: newHistory,
          sessionStats: newStats
        };
      }),
      
      updateLanguagePrefs: (prefs) => set((state) => ({
        languagePrefs: { ...state.languagePrefs, ...prefs }
      })),
      
      updateAccessibilityPrefs: (prefs) => set((state) => ({
        accessibilityPrefs: { ...state.accessibilityPrefs, ...prefs }
      })),
      
      updateModelStats: (stats) => set((state) => ({
        modelStats: { ...state.modelStats, ...stats }
      })),
      
      updateSessionStats: (stats) => set((state) => ({
        sessionStats: { ...state.sessionStats, ...stats }
      })),
      
      setConnectionStatus: (status) => set({ connectionStatus: status }),
      
      setActivePanel: (panel) => set({ activePanel: panel }),
      
      toggleHeaderCollapsed: () => set((state) => ({
        isHeaderCollapsed: !state.isHeaderCollapsed
      })),
      
      clearHistory: () => set({ recognitionHistory: [], currentSign: null })
    }),
    {
      name: 'sign-language-translator-storage',
      partialize: (state) => ({
        languagePrefs: state.languagePrefs,
        accessibilityPrefs: state.accessibilityPrefs,
        sessionStats: state.sessionStats
      })
    }
  )
);
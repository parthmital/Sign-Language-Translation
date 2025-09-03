import { CameraInputArea } from '@/components/camera/CameraInputArea';
import { ResultsPanel } from '@/components/results/ResultsPanel';
import { ModelPerformancePanel } from '@/components/stats/ModelPerformancePanel';
import { SessionProgressPanel } from '@/components/stats/SessionProgressPanel';
import { LearningProgressPanel } from '@/components/stats/LearningProgressPanel';
import { LanguageSelectionPanel } from '@/components/language/LanguageSelectionPanel';
import { SeedDataInitializer } from '@/components/demo/SeedDataInitializer';

export default function Home() {
  return (
    <>
      <SeedDataInitializer />
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Main Content Area */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Panel - Camera Input */}
          <div className="space-y-4">
            <CameraInputArea />
            <LanguageSelectionPanel />
          </div>
          
          {/* Right Panel - Results */}
          <div className="space-y-4">
            <ResultsPanel />
          </div>
        </div>
        
        {/* Statistics Panels */}
        <div className="grid md:grid-cols-3 gap-4">
          <ModelPerformancePanel />
          <SessionProgressPanel />
          <LearningProgressPanel />
        </div>
      </div>
    </>
  );
}
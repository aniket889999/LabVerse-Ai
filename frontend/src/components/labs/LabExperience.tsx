'use client';

import React, { useState } from 'react';
import { LabMapConfig, TourMode } from '../../types/lab-map';
import InteractiveLabMap from './InteractiveLabMap';
import GuidedTourPanel from './GuidedTourPanel';

interface LabExperienceProps {
  config: LabMapConfig;
}

export default function LabExperience({ config }: LabExperienceProps) {
  const [activeTourMode, setActiveTourMode] = useState<TourMode | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const activeTour = activeTourMode ? config.tours[activeTourMode] : null;
  const currentStep = activeTour ? activeTour.steps[currentStepIndex] : null;

  const handleStartTour = (mode: TourMode) => {
    setActiveTourMode(mode);
    setCurrentStepIndex(0);
  };

  const handleNextStep = () => {
    if (activeTour && currentStepIndex < activeTour.steps.length) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleEndTour = () => {
    setActiveTourMode(null);
    setCurrentStepIndex(0);
  };

  return (
    <div className="space-y-6">
      {!activeTourMode && (
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <span className="font-semibold text-gray-900">Start a Guided Tour:</span>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => handleStartTour('STUDENT')}
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-xl transition"
            >
              Student Tour
            </button>
            <button 
              onClick={() => handleStartTour('RECRUITER')}
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium rounded-xl transition"
            >
              Recruiter Tour
            </button>
            <button 
              onClick={() => handleStartTour('INDUSTRY_PARTNER')}
              className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium rounded-xl transition"
            >
              Industry Partner
            </button>
          </div>
        </div>
      )}

      <div className="relative flex flex-col xl:flex-row gap-6">
        <div className="flex-1">
          <InteractiveLabMap 
            config={config} 
            activeHotspotId={currentStep?.hotspotId}
            onStartTour={() => handleStartTour('STUDENT')}
          />
        </div>

        {activeTourMode && activeTour && (
          <div className="xl:w-96 shrink-0">
            <GuidedTourPanel 
              tour={activeTour}
              currentStepIndex={currentStepIndex}
              totalSteps={activeTour.steps.length}
              hotspots={config.hotspots}
              onNext={handleNextStep}
              onPrev={handlePrevStep}
              onExit={handleEndTour}
            />
          </div>
        )}
      </div>
    </div>
  );
}

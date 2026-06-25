'use client';

import React from 'react';
import { GuidedTour, Hotspot } from '../../types/lab-map';
import { X, ArrowRight, ArrowLeft, CheckCircle, GraduationCap, Briefcase, Building2, Calendar, FileText } from 'lucide-react';
import Link from 'next/link';

interface GuidedTourPanelProps {
  tour: GuidedTour;
  currentStepIndex: number;
  totalSteps: number;
  hotspots: Hotspot[];
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
}

export default function GuidedTourPanel({
  tour,
  currentStepIndex,
  totalSteps,
  hotspots,
  onNext,
  onPrev,
  onExit
}: GuidedTourPanelProps) {
  const isCompleted = currentStepIndex === totalSteps;
  const currentStep = !isCompleted ? tour.steps[currentStepIndex] : null;
  const currentHotspot = currentStep ? hotspots.find(h => h.id === currentStep.hotspotId) : null;

  const progressPct = ((currentStepIndex) / totalSteps) * 100;

  const getModeIcon = () => {
    switch(tour.mode) {
      case 'STUDENT': return <GraduationCap className="w-5 h-5" />;
      case 'RECRUITER': return <Briefcase className="w-5 h-5" />;
      case 'INDUSTRY_PARTNER': return <Building2 className="w-5 h-5" />;
    }
  };

  const getModeColor = () => {
    switch(tour.mode) {
      case 'STUDENT': return 'text-indigo-600 bg-indigo-50 border-indigo-100';
      case 'RECRUITER': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'INDUSTRY_PARTNER': return 'text-amber-600 bg-amber-50 border-amber-100';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500">
      
      {/* Header */}
      <div className={`p-4 border-b flex justify-between items-center ${getModeColor()}`}>
        <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-sm">
          {getModeIcon()} {tour.mode.replace('_', ' ')} TOUR
        </div>
        <button onClick={onExit} className="p-1 hover:bg-black/5 rounded-full transition">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-gray-100">
        <div 
          className="h-full bg-indigo-600 transition-all duration-500 ease-out" 
          style={{ width: `${isCompleted ? 100 : progressPct}%` }}
        />
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        {!isCompleted && currentStep && currentHotspot ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1 flex flex-col">
            <div className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">
              Step {currentStepIndex + 1} of {totalSteps}
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{currentHotspot.title}</h2>
            
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 mb-6">
              <p className="text-gray-800 text-lg leading-relaxed">{currentStep.explanation}</p>
            </div>
            
            <div className="mt-auto pt-6 flex gap-3">
              <button 
                onClick={onPrev}
                disabled={currentStepIndex === 0}
                className="px-4 py-3 border border-gray-200 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 disabled:opacity-30 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={onNext}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-md"
              >
                {currentStepIndex === totalSteps - 1 ? 'Finish Tour' : 'Next Step'} <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-in zoom-in-95 duration-500 flex-1 flex flex-col items-center justify-center text-center py-8">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Tour Completed!</h2>
            <p className="text-gray-600 mb-8 max-w-sm">
              You've successfully explored the key areas of this facility. What would you like to do next?
            </p>
            
            <div className="w-full space-y-3">
              <Link href="/projects" className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" /> View Related Projects
              </Link>
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-md">
                <Calendar className="w-5 h-5" /> Book a Visit
              </button>
              <button onClick={onExit} className="w-full mt-4 text-sm font-medium text-gray-500 hover:text-gray-900 transition">
                Close Panel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

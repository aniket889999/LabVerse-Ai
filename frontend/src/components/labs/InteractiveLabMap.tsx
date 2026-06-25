'use client';

import React, { useState } from 'react';
import { LabMapConfig, Hotspot } from '../../types/lab-map';
import { MapPin, CheckCircle, Package, GraduationCap, Presentation, ShieldAlert, Monitor, FileText, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';

interface InteractiveLabMapProps {
  config: LabMapConfig;
  activeHotspotId?: string | null;
  onHotspotSelect?: (id: string) => void;
  onStartTour?: () => void;
}

export default function InteractiveLabMap({ 
  config, 
  activeHotspotId, 
  onHotspotSelect,
  onStartTour
}: InteractiveLabMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

  const handleHotspotClick = (hotspot: Hotspot) => {
    if (onHotspotSelect) {
      onHotspotSelect(hotspot.id);
    } else {
      setSelectedHotspot(hotspot);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'EQUIPMENT': return <Monitor className="w-5 h-5" />;
      case 'PROJECT': return <FileText className="w-5 h-5" />;
      case 'LEARNING_ZONE': return <GraduationCap className="w-5 h-5" />;
      case 'DEMO_AREA': return <Presentation className="w-5 h-5" />;
      case 'SAFETY_ZONE': return <ShieldAlert className="w-5 h-5" />;
      default: return <MapPin className="w-5 h-5" />;
    }
  };

  // Determine which hotspot to show as active (from props or local state)
  const activeId = activeHotspotId || selectedHotspot?.id;

  return (
    <div className="w-full relative bg-indigo-50 rounded-3xl border border-indigo-100 overflow-hidden" style={{ minHeight: '500px' }}>
      
      {/* Background SVG Grid (Blueprint style) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      {/* Map Hotspots */}
      <div className="absolute inset-0">
        {config.hotspots.map((hotspot) => {
          const isActive = activeId === hotspot.id;
          const isHovered = hoveredId === hotspot.id;
          
          return (
            <div
              key={hotspot.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300"
              style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, zIndex: isActive ? 20 : 10 }}
              onMouseEnter={() => setHoveredId(hotspot.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleHotspotClick(hotspot)}
            >
              {/* Pulsing ring for active */}
              {isActive && (
                <span className="absolute inset-0 rounded-full animate-ping bg-indigo-400 opacity-75" style={{ transform: 'scale(1.5)' }}></span>
              )}
              
              <div className={`relative flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-colors ${
                  isActive ? 'bg-indigo-600 text-white' : 
                  isHovered ? 'bg-indigo-500 text-white' : 
                  'bg-white text-indigo-600 border-2 border-indigo-600'
                }`}
              >
                {getIconForType(hotspot.type)}
              </div>

              {/* Tooltip for hover (only if not active/selected) */}
              {isHovered && !isActive && !activeHotspotId && (
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl pointer-events-none">
                  {hotspot.title}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Local Detail Modal (Only if not controlled externally by Guided Tour) */}
      {!activeHotspotId && selectedHotspot && (
        <div className="absolute top-4 right-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-30 animate-in fade-in slide-in-from-right-4 duration-300">
          <button 
            onClick={() => setSelectedHotspot(null)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-indigo-600 mb-3">
            {getIconForType(selectedHotspot.type)}
            <span className="text-xs font-bold uppercase tracking-wider">{selectedHotspot.type.replace('_', ' ')}</span>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedHotspot.title}</h3>
          <p className="text-sm text-gray-600 mb-6">{selectedHotspot.description}</p>
          
          <div className="space-y-3">
            {selectedHotspot.type === 'EQUIPMENT' && (
              <button className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2">
                <Monitor className="w-4 h-4" /> View Equipment
              </button>
            )}
            {selectedHotspot.type === 'PROJECT' && (
              <button className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" /> View Project
              </button>
            )}
            <button 
              onClick={() => { setSelectedHotspot(null); onStartTour?.(); }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-md"
            >
               Start Tour From Here <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

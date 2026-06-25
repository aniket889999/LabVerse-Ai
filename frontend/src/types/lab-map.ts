export type TourMode = 'STUDENT' | 'RECRUITER' | 'INDUSTRY_PARTNER';

export type HotspotType = 'EQUIPMENT' | 'PROJECT' | 'LEARNING_ZONE' | 'DEMO_AREA' | 'SAFETY_ZONE';

export interface Hotspot {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  title: string;
  type: HotspotType;
  description: string;
  relatedEquipmentId?: string;
  relatedProjectId?: string;
}

export interface TourStep {
  hotspotId: string;
  explanation: string;
}

export interface GuidedTour {
  mode: TourMode;
  steps: TourStep[];
  completion: {
    recommendedProjects?: string[];
    relatedEquipment?: string[];
  };
}

export interface LabMapConfig {
  labId: string; // matches Enum in backend or short name
  labType: string;
  backgroundImageUrl?: string; // Optional real image, fallback to CSS pattern
  hotspots: Hotspot[];
  tours: Record<TourMode, GuidedTour>;
}

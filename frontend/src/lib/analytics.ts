import { api } from './api';

export type EventType = 
  | 'PAGE_VIEW' 
  | 'LAB_VIEW' 
  | 'EQUIPMENT_CLICK' 
  | 'PROJECT_VIEW' 
  | 'AI_QUESTION' 
  | 'BOOKING_SUBMITTED' 
  | 'TOUR_STARTED' 
  | 'TOUR_STEP_VIEWED' 
  | 'TOUR_COMPLETED' 
  | 'BOOK_VISIT_CLICKED' 
  | 'HOTSPOT_CLICKED';

interface TrackEventParams {
  eventType: EventType;
  pagePath?: string;
  labId?: string;
  equipmentId?: string;
  projectId?: string;
  tourMode?: string;
  metadata?: Record<string, any>;
}

export const trackEvent = (params: TrackEventParams) => {
  // We use a non-blocking background fetch
  // We don't await this so it doesn't block UI interactions
  if (typeof window !== 'undefined') {
    api.trackEvent({
      ...params,
      pagePath: params.pagePath || window.location.pathname
    }).catch((err) => {
      // Fail silently in production, warn in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Analytics] Failed to track event:', params.eventType, err);
      }
    });
  }
};

'use client';

import { useEffect } from 'react';
import { trackEvent, EventType } from '@/lib/analytics';
import { usePathname } from 'next/navigation';

interface AnalyticsTrackerProps {
  eventType: EventType;
  labId?: string;
  equipmentId?: string;
  projectId?: string;
  metadata?: Record<string, any>;
}

export default function AnalyticsTracker({ eventType, labId, equipmentId, projectId, metadata }: AnalyticsTrackerProps) {
  const pathname = usePathname();

  useEffect(() => {
    trackEvent({
      eventType,
      pagePath: pathname,
      labId,
      equipmentId,
      projectId,
      metadata
    });
  }, [eventType, labId, equipmentId, projectId, pathname]);

  // Renders nothing, it's just a lifecycle wrapper
  return null;
}

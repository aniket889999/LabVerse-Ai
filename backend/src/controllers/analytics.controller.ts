import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/prisma.js';

const eventSchema = z.object({
  eventType: z.enum([
    'PAGE_VIEW', 'LAB_VIEW', 'EQUIPMENT_CLICK', 'PROJECT_VIEW', 
    'AI_QUESTION', 'BOOKING_SUBMITTED', 'TOUR_STARTED', 
    'TOUR_STEP_VIEWED', 'TOUR_COMPLETED', 'BOOK_VISIT_CLICKED', 
    'HOTSPOT_CLICKED'
  ]),
  pagePath: z.string().optional(),
  labId: z.string().optional(),
  equipmentId: z.string().optional(),
  projectId: z.string().optional(),
  tourMode: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const trackEvent = async (req: Request, res: Response) => {
  try {
    const data = eventSchema.parse(req.body);
    
    await prisma.analyticsEvent.create({
      data: {
        eventType: data.eventType,
        metadata: {
          pagePath: data.pagePath,
          labId: data.labId,
          equipmentId: data.equipmentId,
          projectId: data.projectId,
          tourMode: data.tourMode,
          ...data.metadata,
        }
      }
    });

    res.status(201).json({ success: true });
  } catch (error) {
    // Analytics failures should not loudly crash the UI
    console.error('[Analytics Error]', error);
    res.status(400).json({ success: false, error: 'Failed to track event' });
  }
};

export const getAnalyticsSummary = async (req: Request, res: Response) => {
  try {
    const [
      totalEvents,
      pageViews,
      labViews,
      projectViews,
      equipmentClicks,
      bookingSubmissions
    ] = await Promise.all([
      prisma.analyticsEvent.count(),
      prisma.analyticsEvent.count({ where: { eventType: 'PAGE_VIEW' } }),
      prisma.analyticsEvent.count({ where: { eventType: 'LAB_VIEW' } }),
      prisma.analyticsEvent.count({ where: { eventType: 'PROJECT_VIEW' } }),
      prisma.analyticsEvent.count({ where: { eventType: 'EQUIPMENT_CLICK' } }),
      prisma.analyticsEvent.count({ where: { eventType: 'BOOKING_SUBMITTED' } })
    ]);

    res.json({
      success: true,
      data: {
        totalEvents,
        pageViews,
        labViews,
        projectViews,
        equipmentClicks,
        bookingSubmissions
      }
    });
  } catch (error) {
    console.error('[Analytics Summary Error]', error);
    res.status(500).json({ success: false, error: 'Failed to aggregate analytics' });
  }
};

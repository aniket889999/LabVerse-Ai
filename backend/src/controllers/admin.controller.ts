import { Request, Response } from 'express';
import { z } from 'zod';
import * as adminService from '../services/admin.service.js';
import { BookingStatus, RequestType } from '@prisma/client';

const querySchema = z.object({
  status: z.nativeEnum(BookingStatus).optional(),
  requestType: z.nativeEnum(RequestType).optional(),
  search: z.string().optional(),
});

const updateStatusSchema = z.object({
  status: z.nativeEnum(BookingStatus),
});

export const getAdminBookings = async (req: Request, res: Response) => {
  try {
    const normalizeQueryStr = (val: any) => typeof val === 'string' ? val : (Array.isArray(val) && typeof val[0] === 'string' ? val[0] : undefined);

    const rawFilters = {
      status: normalizeQueryStr(req.query.status),
      requestType: normalizeQueryStr(req.query.requestType),
      search: normalizeQueryStr(req.query.search),
    };

    const filters = querySchema.parse(rawFilters);
    const bookings = await adminService.getAdminBookings(filters);
    res.json({ success: true, data: bookings });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: error.issues });
    }
    console.error('[Admin Get Bookings Error]', error);
    res.status(500).json({ success: false, error: 'Failed to fetch bookings' });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status } = updateStatusSchema.parse(req.body);
    
    const updated = await adminService.updateBookingStatus(id, status);
    
    // Placeholder email notification logic
    console.log(`[Email Placeholder] Notification would be sent to ${updated.requesterEmail} regarding status change to ${status}.`);
    
    res.json({ success: true, data: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: error.issues });
    }
    console.error('[Admin Update Booking Error]', error);
    res.status(500).json({ success: false, error: 'Failed to update booking status' });
  }
};

export const getAdminAnalyticsSummary = async (req: Request, res: Response) => {
  try {
    const summary = await adminService.getAdminAnalyticsSummary();
    res.json({ success: true, data: summary });
  } catch (error) {
    console.error('[Admin Analytics Error]', error);
    res.status(500).json({ success: false, error: 'Failed to fetch admin analytics' });
  }
};

import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/prisma.js';
import { sendBookingConfirmationEmail, sendAdminNotificationEmail } from '../services/email.service.js';

const bookingSchema = z.object({
  requesterName: z.string().min(2, 'Name must be at least 2 characters'),
  requesterEmail: z.string().email('Invalid email address'),
  organizationName: z.string().optional(),
  role: z.string().optional(),
  requestType: z.enum(['PHYSICAL_VISIT', 'ONLINE_DEMO', 'PARTNERSHIP']),
  preferredDate: z.string().optional(),
  preferredTimeSlot: z.string().optional(),
  selectedLabId: z.string().uuid().optional().nullable(),
  message: z.string().optional(),
  purpose: z.string().optional(),
});

export const createBooking = async (req: Request, res: Response) => {
  try {
    const parsedData = bookingSchema.parse(req.body);
    
    // Create the booking record
    const booking = await prisma.booking.create({
      data: {
        requesterName: parsedData.requesterName,
        requesterEmail: parsedData.requesterEmail,
        organizationName: parsedData.organizationName,
        role: parsedData.role,
        requestType: parsedData.requestType,
        preferredDate: parsedData.preferredDate ? new Date(parsedData.preferredDate) : null,
        preferredTimeSlot: parsedData.preferredTimeSlot,
        labId: parsedData.selectedLabId || null,
        message: parsedData.message,
        purpose: parsedData.purpose,
      }
    });

    // Fire & forget email notifications
    sendBookingConfirmationEmail(booking.requesterEmail, booking.requesterName, booking.requestType).catch(console.error);
    sendAdminNotificationEmail(booking.requestType, booking.requesterName, booking.organizationName).catch(console.error);

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: error.issues });
    }
    console.error('[Create Booking Error]', error);
    res.status(500).json({ success: false, error: 'Internal server error while creating booking' });
  }
};

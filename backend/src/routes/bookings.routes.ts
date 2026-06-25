import { Router } from 'express';
import { createBooking } from '../controllers/bookings.controller.js';

const router = Router();

// Public route to submit a booking
router.post('/', createBooking);

export default router;

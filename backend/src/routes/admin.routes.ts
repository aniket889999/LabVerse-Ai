import { Router } from 'express';
import { getAdminBookings, updateBookingStatus, getAdminAnalyticsSummary } from '../controllers/admin.controller.js';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// Secure all admin routes
router.use(authenticate);
router.use(authorizeRoles('FACULTY_ADMIN'));

router.get('/bookings', getAdminBookings);
router.patch('/bookings/:id/status', updateBookingStatus);
router.get('/analytics/summary', getAdminAnalyticsSummary);

export default router;

import { Router } from 'express';
import { trackEvent, getAnalyticsSummary } from '../controllers/analytics.controller.js';

const router = Router();

router.post('/events', trackEvent);
router.get('/summary', getAnalyticsSummary);

export default router;

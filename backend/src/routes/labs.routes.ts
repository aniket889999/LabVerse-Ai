import { Router } from 'express';
import { getLabs, getLabById } from '../controllers/labs.controller.js';

const router = Router();

router.get('/', getLabs);
router.get('/:id', getLabById);

export default router;

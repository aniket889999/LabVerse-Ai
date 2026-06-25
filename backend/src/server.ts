import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { requestLogger } from './middlewares/logger.middleware.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import labsRoutes from './routes/labs.routes.js';
import equipmentRoutes from './routes/equipment.routes.js';
import projectsRoutes from './routes/projects.routes.js';
import bookingsRoutes from './routes/bookings.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import guidedToursRoutes from './routes/guided-tours.routes.js';
import aiGuideRoutes from './routes/ai-guide.routes.js';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
const apiRouter = express.Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', usersRoutes);
apiRouter.use('/labs', labsRoutes);
apiRouter.use('/equipment', equipmentRoutes);
apiRouter.use('/projects', projectsRoutes);
apiRouter.use('/bookings', bookingsRoutes);
apiRouter.use('/analytics', analyticsRoutes);
apiRouter.use('/guided-tours', guidedToursRoutes);
apiRouter.use('/ai-guide', aiGuideRoutes);

app.use('/api/v1', apiRouter);

// 404 Handler
app.use(notFoundHandler);

// Central Error Handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

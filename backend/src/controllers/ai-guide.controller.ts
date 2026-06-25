import { Request, Response } from 'express';
import { z } from 'zod';
import { generateAiResponse } from '../services/ai-guide.service.js';

const chatSchema = z.object({
  question: z.string().min(2, "Question is too short"),
  labId: z.string().optional(),
  projectId: z.string().optional(),
  equipmentId: z.string().optional(),
  visitorType: z.enum(['STUDENT', 'RECRUITER', 'INDUSTRY_PARTNER']).optional(),
});

export const handleChat = async (req: Request, res: Response) => {
  try {
    const parsed = chatSchema.parse(req.body);
    const response = await generateAiResponse(parsed);
    res.json({ success: true, data: response });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: error.issues });
    }
    console.error('[AI Guide Controller Error]', error);
    res.status(500).json({ success: false, error: 'Internal server error processing AI request' });
  }
};

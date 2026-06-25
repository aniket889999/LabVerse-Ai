import { Request, Response } from 'express';
import prisma from '../config/prisma.js';

export const getLabs = async (req: Request, res: Response) => {
  try {
    const labs = await prisma.lab.findMany({
      include: {
        _count: {
          select: { equipment: true, projects: true }
        }
      }
    });
    res.json({ success: true, data: labs });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch labs' });
  }
};

export const getLabById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lab = await prisma.lab.findUnique({
      where: { id: req.params.id as string },
      include: {
        equipment: true,
        projects: {
          include: { media: true }
        },
        facultyAdmin: {
          select: { id: true, firstName: true, lastName: true, email: true }
        }
      }
    });

    if (!lab) {
      return res.status(404).json({ success: false, error: 'Lab not found' });
    }

    res.json({ success: true, data: lab });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch lab details' });
  }
};

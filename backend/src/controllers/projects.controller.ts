import { Request, Response } from 'express';
import prisma from '../config/prisma.js';

export const getProjects = async (req: Request, res: Response) => {
  try {
    const { labId, search } = req.query;
    
    const projects = await prisma.project.findMany({
      where: {
        ...(labId ? { labId: String(labId) } : {}),
        ...(search ? {
          OR: [
            { title: { contains: String(search), mode: 'insensitive' } },
            { description: { contains: String(search), mode: 'insensitive' } }
          ]
        } : {})
      },
      include: {
        lab: { select: { id: true, name: true } },
        media: true
      }
    });
    
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch projects' });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id: req.params.id as string },
      include: {
        lab: { select: { id: true, name: true } },
        author: { select: { id: true, firstName: true, lastName: true } },
        media: true
      }
    });

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch project details' });
  }
};

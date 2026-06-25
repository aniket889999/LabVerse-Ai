import { Request, Response } from 'express';
import prisma from '../config/prisma.js';

export const getEquipment = async (req: Request, res: Response) => {
  try {
    const { labId } = req.query;
    
    const equipment = await prisma.equipment.findMany({
      where: labId ? { labId: String(labId) } : undefined,
      include: {
        lab: { select: { id: true, name: true } }
      }
    });
    
    res.json({ success: true, data: equipment });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch equipment' });
  }
};

export const getEquipmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const equipmentItem = await prisma.equipment.findUnique({
      where: { id: req.params.id as string },
      include: {
        lab: { select: { id: true, name: true } }
      }
    });

    if (!equipmentItem) {
      return res.status(404).json({ success: false, error: 'Equipment not found' });
    }

    res.json({ success: true, data: equipmentItem });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch equipment details' });
  }
};

import { Request, Response } from 'express';
import { RoomTypeService } from '../services/roomtype.service';

const roomTypeService = new RoomTypeService();

export class RoomTypeController {

  getAll = async (req: Request, res: Response) => {
    try {
      const types = await roomTypeService.getAllRoomTypes();
      res.json(types);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  };

  create = async (req: Request, res: Response) => {
    const { description } = req.body;

    try {
      const type = await roomTypeService.createRoomType(description);
      res.status(201).json(type);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  };
}
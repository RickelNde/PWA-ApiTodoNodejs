import { Request, Response } from 'express';
import { BedTypeService } from '../services/bedtype.service';

const bedTypeService = new BedTypeService();

export class BedTypeController {

  getAll = async (req: Request, res: Response) => {
    try {
      const types = await bedTypeService.getAllBedTypes();
      res.json(types);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  };

  create = async (req: Request, res: Response) => {
    const { description } = req.body;

    try {
      const type = await bedTypeService.createBedType(description);
      res.status(201).json(type);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  };

  update = async (req: Request, res: Response) => {
    const { description } = req.body;

    try {
      const type = await bedTypeService.updateBedType(req.params.id as string, description);
      if (!type) {
        return res.status(404).json({ message: 'Type de lit introuvable.' });
      }
      res.json(type);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const type = await bedTypeService.deleteBedType(req.params.id as string);
      if (!type) {
        return res.status(404).json({ message: 'Type de lit introuvable.' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  };
}
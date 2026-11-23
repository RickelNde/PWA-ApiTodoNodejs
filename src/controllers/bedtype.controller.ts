import { NextFunction, Request, Response } from 'express';
import { BedTypeService } from '../services/bedtype.service';

const bedTypeService = new BedTypeService();

export class BedTypeController {

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const types = await bedTypeService.getAllBedTypes();
      res.status(200).json(types);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { description } = req.body;

    try {
      const type = await bedTypeService.createBedType(description);
      res.status(201).json(type);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    const { description } = req.body;

    try {
      const id = req.params.id;
      const type = await bedTypeService.updateBedType(id, description);
      if (!type) {
        res.status(404).json({ message: 'Type de lit introuvable.' });
        return;
      }
      res.status(200).json(type);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const type = await bedTypeService.deleteBedType(id);
      if (!type) {
        res.status(404).json({ message: 'Type de lit introuvable.' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
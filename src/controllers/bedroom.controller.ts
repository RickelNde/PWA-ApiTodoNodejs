import { NextFunction, Request, Response } from 'express';
import { BedRoomService } from '../services/bedroom.service';
import { CreateBedRoomRequest, UpdateBedRoomRequest } from '../types/bedroom';

const bedRoomService = new BedRoomService();

export class BedRoomController {

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bedRooms = await bedRoomService.getAllBedRooms();
      res.status(200).json(bedRooms);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const bedRoom = await bedRoomService.getBedRoomById(id);
      if (!bedRoom) {
        res.status(404).json({ message: 'Chambre introuvable.' });
        return;
      }
      res.status(200).json(bedRoom);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const data = req.body as CreateBedRoomRequest;

    if (
      data.bedroomsNumber === undefined || !data.roomTypeId || !data.description ||
      data.nbMaxClients === undefined || data.sizeInMeterSquare === undefined ||
      data.nbBeds === undefined || !data.bed1Id || data.price === undefined || !data.nomHotel
    ) {
      res.status(400).json({ message: 'Champs obligatoires manquants.' });
      return;
    }

    if (data.nbBeds === 1) {
      data.bed2Id = null;
    }
    if (data.nbBeds === 2 && !data.bed2Id) {
      res.status(400).json({ message: 'bed2Id est requis pour 2 lits.' });
      return;
    }

    try {
      const bedRoom = await bedRoomService.createBedRoom(data);
      res.status(201).json(bedRoom);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    const data = req.body as UpdateBedRoomRequest;

    try {
      const id = req.params.id;
      const bedRoom = await bedRoomService.updateBedRoom(id, data);
      if (!bedRoom) {
        res.status(404).json({ message: 'Chambre introuvable.' });
        return;
      }
      res.status(200).json(bedRoom);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const bedRoom = await bedRoomService.deleteBedRoom(id);
      if (!bedRoom) {
        res.status(404).json({ message: 'Chambre introuvable.' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
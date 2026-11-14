import { Request, Response } from 'express';
import { BedRoomService } from '../services/bedroom.service';
import { CreateBedRoomRequest, UpdateBedRoomRequest } from '../types/bedroom';

const bedRoomService = new BedRoomService();

export class BedRoomController {

  getAll = async (req: Request, res: Response) => {
    try {
      const bedRooms = await bedRoomService.getAllBedRooms();
      res.json(bedRooms);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const bedRoom = await bedRoomService.getBedRoomById(req.params.id as string);
      if (!bedRoom) {
        return res.status(404).json({ message: 'Chambre introuvable.' });
      }
      res.json(bedRoom);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  };

  create = async (req: Request, res: Response) => {
    const data = req.body as CreateBedRoomRequest;

    if (data.nbBeds === 1) {
      data.bed2Id = null;
    }
    if (data.nbBeds === 2 && !data.bed2Id) {
      return res.status(400).json({ message: 'bed2Id est requis pour 2 lits.' });
    }

    try {
      const bedRoom = await bedRoomService.createBedRoom(data);
      res.status(201).json(bedRoom);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  };

  update = async (req: Request, res: Response) => {
    const data = req.body as UpdateBedRoomRequest;

    try {
      const bedRoom = await bedRoomService.updateBedRoom(req.params.id as string, data);
      if (!bedRoom) {
        return res.status(404).json({ message: 'Chambre introuvable.' });
      }
      res.json(bedRoom);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const bedRoom = await bedRoomService.deleteBedRoom(req.params.id as string);
      if (!bedRoom) {
        return res.status(404).json({ message: 'Chambre introuvable.' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  };
}
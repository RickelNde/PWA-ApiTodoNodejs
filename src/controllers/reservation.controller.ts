import { NextFunction, Request, Response } from 'express';
import { ReservationService } from '../services/reservation.service';
import { CreateReservationRequest, UpdateReservationRequest } from '../types/reservation';

const reservationService = new ReservationService();

export class ReservationController {

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reservations = await reservationService.getAllReservations();
      res.status(200).json(reservations);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const reservation = await reservationService.getReservationById(id);
      if (!reservation) {
        res.status(404).json({ message: 'Réservation introuvable.' });
        return;
      }
      res.status(200).json(reservation);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const data = req.body as CreateReservationRequest;

    if (!data.userId || !data.bedroomId || !data.nbPersonnes || !data.beginingAt || !data.endAt) {
      res.status(400).json({ message: 'Champs obligatoires manquants.' });
      return;
    }

    try {
      const reservation = await reservationService.createReservation(data);
      res.status(201).json(reservation);
    } catch (error: any) {
      if (error.message === 'DATES_INVALIDES') {
        res.status(400).json({ message: 'Dates invalides : la fin doit être après le début.' });
        return;
      }
      if (error.message === 'TROP_DE_PERSONNES') {
        res.status(400).json({ message: 'Trop de personnes pour cette chambre.' });
        return;
      }
      if (error.message === 'CHAMBRE_INTROUVABLE') {
        res.status(404).json({ message: 'Chambre introuvable.' });
        return;
      }
      next(error);
    }
  };

  update = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    const data = req.body as UpdateReservationRequest;

    try {
      const id = req.params.id;
      const reservation = await reservationService.updateReservation(id, data);
      if (!reservation) {
        res.status(404).json({ message: 'Réservation introuvable.' });
        return;
      }
      res.status(200).json(reservation);
    } catch (error: any) {
      if (error.message === 'RESERVATION_DEJA_PAYEE') {
        res.status(409).json({ message: 'Cette réservation est déjà payée.' });
        return;
      }
      if (error.message === 'DATES_INVALIDES') {
        res.status(400).json({ message: 'Dates invalides : la fin doit être après le début.' });
        return;
      }
      if (error.message === 'TROP_DE_PERSONNES') {
        res.status(400).json({ message: 'Trop de personnes pour cette chambre.' });
        return;
      }
      if (error.message === 'CHAMBRE_INTROUVABLE') {
        res.status(404).json({ message: 'Chambre introuvable.' });
        return;
      }
      next(error);
    }
  };

  deleteReservation = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const deleted = await reservationService.deleteReservation(id);

      if (!deleted) {
        res.status(404).json({ message: 'Réservation introuvable.' });
        return;
      }
      res.status(204).send();
    } catch (error: any) {
      if (error.message === 'RESERVATION_DEJA_PAYEE') {
        res.status(409).json({ message: 'Cette réservation est déjà payée.' });
        return;
      }
      next(error);
    }
  };

}
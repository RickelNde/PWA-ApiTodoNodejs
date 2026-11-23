import { NextFunction, Request, Response } from 'express';
import { ReservationService } from '../services/reservation.service';
import { CreateReservationRequest, UpdateReservationRequest } from '../types/reservation';

const reservationService = new ReservationService();

export class ReservationController {

  getAll = async (req: Request, res: Response) => {
    try {
      const reservations = await reservationService.getAllReservations();
      res.status(200).json(reservations);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const reservation = await reservationService.getReservationById(req.params.id as string);
      if (!reservation) {
        return res.status(404).json({ message: 'Réservation introuvable.' });
      }
      res.status(200).json(reservation);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  };

  create = async (req: Request, res: Response) => {
    const data = req.body as CreateReservationRequest;

    if (!data.userId || !data.bedroomId || !data.nbPersonnes || !data.beginingAt || !data.endAt) {
      return res.status(400).json({ message: 'Champs obligatoires manquants.' });
    }

    try {
      const reservation = await reservationService.createReservation(data);
      res.status(201).json(reservation);
    } catch (error: any) {
      if (error.message === 'DATES_INVALIDES') {
        return res.status(400).json({ message: 'Dates invalides : la fin doit être après le début.' });
      }
      if (error.message === 'TROP_DE_PERSONNES') {
        return res.status(400).json({ message: 'Trop de personnes pour cette chambre.' });
      }
      if (error.message === 'CHAMBRE_INTROUVABLE') {
        return res.status(404).json({ message: 'Chambre introuvable.' });
      }
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  };

  update = async (req: Request, res: Response) => {
    const data = req.body as UpdateReservationRequest;

    try {
      const reservation = await reservationService.updateReservation(req.params.id as string, data);
      if (!reservation) {
        return res.status(404).json({ message: 'Réservation introuvable.' });
      }
      res.status(200).json(reservation);
    } catch (error: any) {
      if (error.message === 'RESERVATION_DEJA_PAYEE') {
        return res.status(409).json({ message: 'Cette réservation est déjà payée.' });
      }
      if (error.message === 'DATES_INVALIDES') {
        return res.status(400).json({ message: 'Dates invalides : la fin doit être après le début.' });
      }
      if (error.message === 'TROP_DE_PERSONNES') {
        return res.status(400).json({ message: 'Trop de personnes pour cette chambre.' });
      }
      if (error.message === 'CHAMBRE_INTROUVABLE') {
        return res.status(404).json({ message: 'Chambre introuvable.' });
      }
      res.status(500).json({ message: 'Erreur serveur.' });
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

//   pay = async (req: Request, res: Response) => {
//     try {
//       const reservation = await reservationService.payerReservation(req.params.id as string);
//       if (!reservation) {
//         return res.status(404).json({ message: 'Réservation introuvable.' });
//       }
//       if (reservation.status === 'declined') {
//         return res.status(422).json(reservation);
//       }
//       res.status(200).json(reservation);
//     } catch (error: any) {
//       if (error.message === 'CHAMBRE_INTROUVABLE') {
//         return res.status(404).json({ message: 'Chambre introuvable.' });
//       }
//       res.status(502).json({ message: 'Erreur de communication avec la banque.' });
//     }
//   };
}
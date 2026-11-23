import { Router } from 'express';
import { ReservationController } from '../controllers/reservation.controller';
import { verifierUser } from '../middleware/user';
import { verifierAdmin } from '../middleware/admin';

export function createReservationRoutes() {
  const router = Router();
  const controller = new ReservationController();

  // Users et admins
  router.get('/reservations', verifierUser, controller.getAll);
  router.get('/reservation/:id', verifierUser, controller.getById);
  router.post('/reservation', verifierUser, controller.create);
  router.patch('/reservation/:id', verifierUser, controller.update);

  // Admin seulement
  router.delete('/reservation/:id', verifierAdmin, controller.deleteReservation );

  return router;
}
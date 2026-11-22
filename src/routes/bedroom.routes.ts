import { Router } from 'express';
import { BedRoomController } from '../controllers/bedroom.controller';
import { verifierUser } from '../middleware/user';
import { verifierAdmin } from '../middleware/admin';

export function createBedRoomRoutes() {
  const router = Router();
  const controller = new BedRoomController();

  // Users et admins : lecture
  router.get('/bedrooms', verifierUser, controller.getAll);
  router.get('/bedroom/:id', verifierUser, controller.getById);

  // Admin seulement : création, modification, suppression
  router.post('/bedroom', verifierAdmin, controller.create);
  router.patch('/bedroom/:id', verifierAdmin, controller.update);
  router.delete('/bedroom/:id', verifierAdmin, controller.delete);

  return router;
}
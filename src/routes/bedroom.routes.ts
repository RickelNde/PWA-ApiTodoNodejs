import { Router } from 'express';
import { BedRoomController } from '../controllers/bedroom.controller';

export function createBedRoomRoutes() {
  const router = Router();
  const controller = new BedRoomController();

  router.get('/bedrooms', controller.getAll);
  router.get('/bedroom/:id', controller.getById);
  router.post('/bedroom', controller.create);
  router.patch('/bedroom/:id', controller.update);
  router.delete('/bedroom/:id', controller.delete);

  return router;
}
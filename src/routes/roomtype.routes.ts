import { Router } from 'express';
import { RoomTypeController } from '../controllers/roomtype.controller';

export function createRoomTypeRoutes() {
  const router = Router();
  const controller = new RoomTypeController();

  router.get('/roomtypes', controller.getAll);
  router.post('/roomtype', controller.create);

  return router;
}
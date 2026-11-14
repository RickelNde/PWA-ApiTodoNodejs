import { Router } from 'express';
import { BedTypeController } from '../controllers/bedtype.controller';

export function createBedTypeRoutes() {
  const router = Router();
  const controller = new BedTypeController();

  router.get('/bedtypes', controller.getAll);
  router.post('/bedtype', controller.create);
  router.patch('/bedtype/:id', controller.update);
  router.delete('/bedtype/:id', controller.delete);

  return router;
}
import { Router } from 'express';
import { TodoController } from '../controllers/todo.controller';
import { verifierUser } from '../middleware/user';
import { verifierAdmin } from '../middleware/admin';

export const createTodoRoutes = (): Router => {
  const todoController = new TodoController();
  const router = Router();

  router.get('/todos', verifierAdmin, todoController.getAllTodos);
  router.get('/todo/:id', verifierUser, todoController.getTodoById);
  router.post('/todo', verifierUser, todoController.createTodo);
  router.patch('/todo/:id', verifierUser, todoController.updateTodo);
  router.delete('/todo/:id', verifierAdmin, todoController.deleteTodo);

  return router;
};
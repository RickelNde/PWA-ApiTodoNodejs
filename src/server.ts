import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { db } from './db/connection';

import { createTodoRoutes } from './routes/todo.routes';
import { createHealthRoutes } from './routes/health.routes';
import { errorHandler } from './middleware/error.middleware';
import session from 'express-session';
import { createRoomTypeRoutes } from './routes/roomtype.routes';
import { createBedTypeRoutes } from './routes/bedtype.routes';
import { createBedRoomRoutes } from './routes/bedroom.routes';
import { createAuthRoutes } from './routes/auth.routes';


dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
app.use(helmet());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.set('trust proxy', 1);

const sessionConfig = {
  name: 'userAuth',
  secret: process.env.SESSION_SECRET || 'dev-secret-a-changer',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
  },
};

app.use(session(sessionConfig));

app.use('/api/auth', createAuthRoutes());
app.use('/api', createTodoRoutes());
app.use('/', createHealthRoutes());
app.use('/api', createRoomTypeRoutes());
app.use('/api', createBedTypeRoutes());
app.use('/api', createBedRoomRoutes());

app.use(
  '/swagger',
  (req: Request, res: Response, next: NextFunction) => {
    res.set('Cache-Control', 'no-store');
    next();
  },
  swaggerUi.serve,
  (req: Request, res: Response, next: NextFunction) => {
    const swaggerDocument = yaml.load(path.join(process.cwd(), 'swagger.yml'));
    swaggerUi.setup(swaggerDocument)(req, res, next);
  }
);


app.get('/ping', (req, res) => {
  res.json({ message: 'pong', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
async function demarrer() {
  await migrate(db, { migrationsFolder: path.join(__dirname, '..', 'drizzle') });
   console.log('Migrations appliquées.');
   }
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`📚 API Documentation available at http://localhost:${port}/swagger`);
  console.log(`❤️  Health check available at http://localhost:${port}/health`);
  console.log(`🏓 Ping endpoint available at http://localhost:${port}/ping`);
});
 demarrer().catch((err) => {
   console.error('Échec des migrations :', err);
  process.exit(1);
 });

import { Request, Response, NextFunction } from 'express';

export function verifierIdentifiants(req: Request, res: Response, next: NextFunction) {
  const appId = req.headers['trivago-app-id'];
  const clientId = req.headers['trivago-client-id'];

  if (appId !== process.env.APP_ID || clientId !== process.env.CLIENT_ID) {
    return res.status(401).json({ message: 'Identifiants invalides' });
  }

  next();
}
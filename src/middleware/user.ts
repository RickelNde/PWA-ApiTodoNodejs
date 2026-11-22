import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../types/jwt';


export function verifierUser(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'Tu dois te connecter.' });
  }

  try {
    verifyToken(token);
    next();
  } catch {
    return res.status(401).json({ message: 'Ta connexion a expiré, reconnecte-toi.' });
  }
}
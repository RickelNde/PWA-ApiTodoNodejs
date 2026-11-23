import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../types/jwt';

export function verifierAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'Tu dois te connecter.' });
  }

  try {
    const utilisateur = verifyToken(token);
    if (utilisateur.role !== 'admin') {
      return res.status(403).json({ message: 'action est réservée aux admins.' });
    }

    next();
  } catch {
    return res.status(401).json({ message: 'connexion a expiré, reconnecte-toi.' });
  }
}
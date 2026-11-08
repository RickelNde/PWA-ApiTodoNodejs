import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import 'express-session';

export class AuthController {
  private authService = new AuthService();

  register = async (req: Request, res: Response) => {
    const username = String(req.body?.username ?? '').trim();
    const password = String(req.body?.password ?? '');

    if (username.length < 3) {
      return res.status(400).json({ message: 'Le nom d’utilisateur doit contenir au moins 3 caractères.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères.' });
    }

    try {
      const user = await this.authService.register(username, password);
      return res.status(201).json(user);
    } catch (error: any) {
      if (error.message === 'USERNAME_TAKEN') {
        return res.status(409).json({ message: 'Ce nom d’utilisateur est déjà pris.' });
      }
      console.error(error);
      return res.status(500).json({ message: 'Erreur interne.' });
    }
  };

  login = async (req: Request, res: Response) => {
    const username = String(req.body?.username ?? '').trim();
    const password = String(req.body?.password ?? '');

    try {
      const user = await this.authService.login(username, password);
      if (!user) {
        return res.status(401).json({ message: 'Identifiants invalides.' });
      }

      // Nouvelle session à chaque connexion
      req.session.regenerate((err) => {
        if (err) return res.status(500).json({ message: 'Erreur interne.' });
        req.session.userId = user.id;
        req.session.save((err2) => {
          if (err2) return res.status(500).json({ message: 'Erreur interne.' });
          return res.json(user);
        });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur interne.' });
    }
  };

  logout = (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: 'Erreur interne.' });
      res.clearCookie('connect.sid');
      return res.status(204).end();
    });
  };

  me = (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Non connecté.' });
    }
    return res.json({ id: req.session.userId });
  };
}
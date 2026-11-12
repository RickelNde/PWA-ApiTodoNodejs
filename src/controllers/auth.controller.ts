import { Request, Response,NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { CreateUserRequest } from '../types/user.types';
import 'express-session';

const authService = new AuthService();
export class AuthController {

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
   const userRequest: CreateUserRequest={
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    email:req.body.email,
    passWord:req.body.passeWord

   }

    if (userRequest.email.length < 3) {
       res.status(400).json({ message: 'Le nom d’utilisateur doit contenir au moins 3 caractères.' });
       return
    }
    if (userRequest.passWord.length < 8) {
     res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères.' });
     
    }

    try {
      const user = await authService.register(userRequest);
       res.status(201).json(user);
       return
    } catch (error: any) {
  if (error.message === 'userExiste') {
    res.status(409).json({ message: 'Cet email est déjà utilisé.' });
    return;
  }
  console.error('ERREUR REGISTER :', error);
  res.status(500).json({
    message: 'impossible de creer le user.',
    detail: error.message,
    code: error.code,
    sqlMessage: error.sqlMessage,
  });
  return;
}
  };

  login = async (req: Request, res: Response): Promise<void> => {
  const user = await authService.login(req.body.email, req.body.passeWord);
  if (!user) {
    res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    return;
  }

  req.session.regenerate((error) => {
    if (error) {
      res.status(500).json({ message: 'Échec de la connexion.' });
      return;
    }
    req.session.userId = user.id;
    req.session.save((saveError) => {
      if (saveError) {
        res.status(500).json({ message: 'Échec de la connexion.' });
        return;
      }
      res.status(200).json({ message: `Bienvenue ${user.firstName}`, ...user });
    });
  });
};

  logout = (req: Request, res: Response) => {
  if (!req.session) {
    return res.status(200).json({ message: 'Non connecté.' });
  }

  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({ message: 'Échec de la déconnexion.' });
    }
    res.clearCookie('userAuth');
    return res.status(200).json({ message: 'Déconnexion réussie.' });
  });
};

}
// "email": "alice@example.com",
//   "passeWord": "motdepasse123"
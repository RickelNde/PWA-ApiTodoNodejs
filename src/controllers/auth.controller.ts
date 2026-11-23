import { Request, Response,NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { CreateUserRequest } from '../types/user.types';
import { signToken,verifyToken } from '../types/jwt';

const authService = new AuthService();

const optionsCookie = {
  httpOnly: true,                               
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};
export class AuthController {

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
   const userRequest: CreateUserRequest={
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    email:req.body.email,
    passWord:req.body.passeWord

   }

    if (userRequest.email.length < 3) {
       res.status(400).json({ message: 'L email doit contenir au moins 3 caractères.' });
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
    try {
      const user = await authService.login(req.body.email, req.body.passeWord);

      if (!user) {
        res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
        return;
      }

    
      const token = signToken({ role: user.roleId });


      res.cookie('token', token, {
        ...optionsCookie,
        maxAge: 60 * 60 * 1000, 
      });

      res.status(200).json({
        message: `Bienvenue ${user.firstName}`,
        user: {
          email: user.email,
          firstName: user.firstName,
          role: user.roleId,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Échec de la connexion.' });
    }
  };

  logout = (req: Request, res: Response): void => {
    res.clearCookie('token', optionsCookie);
    res.status(200).json({ message: 'Déconnexion réussie.' });
  };


 me = (req: Request, res: Response): void => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: 'Non connecté.' });
    return;
  }

  try {
    const user = verifyToken(token);
    res.status(200).json({ user });
  } catch {
    res.status(401).json({ message: 'Connexion expirée, reconnecte-toi.' });
  }
};

}
// "email": "alice@example.com",
//   "passeWord": "motdepasse123"
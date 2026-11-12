import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/user.repository';
import { User,CreateUserRequest } from '../types/user.types';
import { v4 as uuidv4 } from 'uuid';


const SALT_ROUNDS = 10;
const DEFAULT_ROLE_ID = 'user';
const userRepository = new UserRepository();

export class AuthService {



  async register(data: CreateUserRequest):Promise<User> {

    const existant = await userRepository.findByEmail(data.email);
    if (existant) {
      throw new Error('userExiste');
    }

    const hash = await bcrypt.hash(data.passWord, SALT_ROUNDS);
     const now = new Date();
    const user:User={
      id: uuidv4(),
      firstName: data.firstName,
      lastName: data.lastName,
      passWord: hash,
      email: data.email,
      roleId: DEFAULT_ROLE_ID,
      created_At: now, 
       updated_At:now
    };

    return await userRepository.create(user)
     
  }

  async login(email: string, passWord: string): Promise<Omit<User, 'passWord'> | null> {
    const user = await userRepository.findByEmail(email);
    if (!user) return null;

    const valide = await bcrypt.compare(passWord, user.passWord);
    if (!valide) return null;

      return { 
      id: user.id,firstName:user.firstName,lastName:user.lastName, email: user.email,roleId:user.roleId,created_At:user.created_At,updated_At:user.updated_At };
  }

  
}
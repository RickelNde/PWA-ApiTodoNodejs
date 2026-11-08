import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../types/user.types';

const SALT_ROUNDS = 10;

export class AuthService {
  private userRepository = new UserRepository();

  async register(username: string, password: string): Promise<Omit<User, 'password'>> {
    const existant = await this.userRepository.findByUsername(username);
    if (existant) {
      throw new Error('USERNAME_TAKEN');
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await this.userRepository.create({
      id: crypto.randomUUID(),
      username,
      password: hash,
    });

    return { id: user.id, username: user.username };
  }

  async login(username: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) return null;

    const valide = await bcrypt.compare(password, user.password);
    if (!valide) return null;

    return { id: user.id, username: user.username };
  }
}
import { eq } from 'drizzle-orm';
import { users } from '../db/schema';
import { db } from '../db/connection';
import { User } from '../types/user.types';

export class UserRepository {

  async findByUsername(username: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    return result.length > 0 ? this.mapToUser(result[0]) : null;
  }

  async create(user: User): Promise<User> {
    await db.insert(users).values(user);

    const result = await this.findByUsername(user.username);
    if (!result) {
      throw new Error('Failed to create user');
    }
    return result;
  }

  private mapToUser(row: any): User {
    return {
      id: row.id,
      username: row.username,
      password: row.password,
    };
  }
}
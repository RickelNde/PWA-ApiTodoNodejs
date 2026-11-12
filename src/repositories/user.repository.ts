import { eq } from 'drizzle-orm';
import { users } from '../db/schema';
import { db } from '../db/connection';
import { User } from '../types/user.types';

export class UserRepository {


  async findByEmail(email: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return result.length > 0 ? this.mapToUser(result[0]) : null;
  }

 async create(user: User): Promise<User> {
    await db.insert(users).values({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      passeWord: user.passWord,
      roleId: user.roleId,
    });


    const result = await this.findByEmail(user.email);
    if (!result) {
      throw new Error('Failed to create user');
    }
    return result;
  }

  private mapToUser(row: any): User {
  return {
    id: row.id,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    passWord: row.passeWord,
    roleId: row.roleId,
    created_At: row.created_At,
    updated_At: row.updated_At,
  };
}
}
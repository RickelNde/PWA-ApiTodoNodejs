import { eq } from 'drizzle-orm';
import { roomType } from '../db/schema';
import { db } from '../db/connection';
import { RoomType } from '../types/roomType';

export class RoomTypeRepository {

  async findAll(): Promise<RoomType[]> {
    const result = await db.select().from(roomType).orderBy(roomType.description);
    return result.map(this.mapToRoomType);
  }

  async findById(id: string): Promise<RoomType | null> {
    const result = await db.select().from(roomType).where(eq(roomType.id, id)).limit(1);
    return result.length > 0 ? this.mapToRoomType(result[0]) : null;
  }

  async create(type: RoomType): Promise<RoomType> {
    await db.insert(roomType).values({
      id: type.id,
      description: type.description,
      created_At: type.createdAt,
      updated_At: type.updatedAt,
    });

    const result = await this.findById(type.id);
    if (!result) {
      throw new Error('Failed to create room type');
    }
    return result;
  }

  async update(id: string, description: string): Promise<RoomType | null> {
    await db.update(roomType).set({ description }).where(eq(roomType.id, id));
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await db.delete(roomType).where(eq(roomType.id, id));
  }

  private mapToRoomType(row: typeof roomType.$inferSelect): RoomType {
    return {
      id: row.id,
      description: row.description,
      createdAt: row.created_At,
      updatedAt: row.updated_At,
    };
  }
}
import { eq } from 'drizzle-orm';
import { bedType } from '../db/schema';
import { db } from '../db/connection';
import { BedType } from '../types/bedtype';

export class BedTypeRepository {

  async findAll(): Promise<BedType[]> {
    const result = await db.select().from(bedType).orderBy(bedType.description);
    return result.map(this.mapToBedType);
  }

  async findById(id: string): Promise<BedType | null> {
    const result = await db.select().from(bedType).where(eq(bedType.id, id)).limit(1);
    return result.length > 0 ? this.mapToBedType(result[0]) : null;
  }

  async create(type: BedType): Promise<BedType> {
    await db.insert(bedType).values({
      id: type.id,
      description: type.description,
      created_At: type.createdAt,
      updated_At: type.updatedAt,
    });

    const result = await this.findById(type.id);
    if (!result) {
      throw new Error('Failed to create bed type');
    }
    return result;
  }

  async update(id: string, description: string): Promise<BedType | null> {
    await db.update(bedType).set({ description }).where(eq(bedType.id, id));
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await db.delete(bedType).where(eq(bedType.id, id));
  }

  private mapToBedType(row: typeof bedType.$inferSelect): BedType {
    return {
      id: row.id,
      description: row.description,
      createdAt: row.created_At,
      updatedAt: row.updated_At,
    };
  }
}
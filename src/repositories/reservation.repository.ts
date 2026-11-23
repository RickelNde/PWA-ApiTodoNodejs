import { eq } from 'drizzle-orm';
import { reservation } from '../db/schema';
import { db } from '../db/connection';
import { Reservation, UpdateReservationRequest } from '../types/reservation';

export class ReservationRepository {

  async findAll(): Promise<Reservation[]> {
    const result = await db.select().from(reservation);
    return result.map(this.mapToReservation);
  }

  async findById(id: string): Promise<Reservation | null> {
    const result = await db.select().from(reservation).where(eq(reservation.id, id)).limit(1);
    return result.length > 0 ? this.mapToReservation(result[0]) : null;
  }

  async create(data: {
    id: string;
    userId: string;
    bedroomId: string;
    nbPersonnes: number;
    beginingAt: Date;
    endAt: Date;
  }): Promise<Reservation> {
    await db.insert(reservation).values({ ...data, status: 'pending' });

    const result = await this.findById(data.id);
    if (!result) {
      throw new Error('Erreur de creation');
    }
    return result;
  }

  async update(id: string, data: UpdateReservationRequest & {
    beginingAt?: Date;
    endAt?: Date;
  }): Promise<Reservation | null> {
    await db.update(reservation).set(data).where(eq(reservation.id, id));
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await db.delete(reservation).where(eq(reservation.id, id));
  }

  async updateTransaction(id: string, transactionId: string, status: string): Promise<Reservation | null> {
    await db.update(reservation).set({ transactionId, status }).where(eq(reservation.id, id));
    return this.findById(id);
  }

  private mapToReservation(row: typeof reservation.$inferSelect): Reservation {
    return {
      id: row.id,
      beginingAt: row.beginingAt,
      endAt: row.endAt,
      userId: row.userId,
      bedroomId: row.bedroomId,
      nbPersonnes: row.nbPersonnes,
      transactionId: row.transactionId,
      status: row.status,
      createdAt: row.created_At,
      updatedAt: row.updated_At,
    };
  }
}
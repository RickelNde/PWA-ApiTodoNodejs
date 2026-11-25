import { eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/mysql-core';
import { bedRooms, bedType, reservation } from '../db/schema';
import { db } from '../db/connection';
import { BedRoom, UpdateBedRoomRequest } from '../types/bedroom';
import type { HotelRoomResponse } from '../types/bedroom';

const bed1 = alias(bedType, 'bed1');
const bed2 = alias(bedType, 'bed2');

export class BedRoomRepository {

  async findAll(): Promise<BedRoom[]> {
    const result = await db.select().from(bedRooms).orderBy(bedRooms.bedroomsNumber);
    return result.map(this.mapToBedRoom);
  }

  async findById(id: string): Promise<BedRoom | null> {
    const result = await db.select().from(bedRooms).where(eq(bedRooms.id, id)).limit(1);
    return result.length > 0 ? this.mapToBedRoom(result[0]) : null;
  }

  async create(bedRoom: BedRoom): Promise<BedRoom> {
    await db.insert(bedRooms).values({
      id: bedRoom.id,
      bedroomsNumber: bedRoom.bedroomsNumber,
      roomTypeId: bedRoom.roomTypeId,
      description: bedRoom.description,
      nbMaxClients: bedRoom.nbMaxClients,
      sizeInMeterSquare: String(bedRoom.sizeInMeterSquare),
      nbBeds: bedRoom.nbBeds,
      bed1Id: bedRoom.bed1Id,
      bed2Id: bedRoom.bed2Id,
      price: String(bedRoom.price),
      nomHotel: bedRoom.nomHotel,
      created_At: bedRoom.createdAt,
      updated_At: bedRoom.updatedAt,
    });

    const result = await this.findById(bedRoom.id);
    if (!result) {
      throw new Error('Failed to create bed room');
    }
    return result;
  }

  async update(id: string, data: UpdateBedRoomRequest): Promise<BedRoom | null> {
    await db.update(bedRooms).set({
      bedroomsNumber: data.bedroomsNumber,
    }).where(eq(bedRooms.id, id));

    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await db.delete(bedRooms).where(eq(bedRooms.id, id));
  }

  async findHotelRooms(): Promise<HotelRoomResponse[]> {
    const rows = await db
      .select({
        noChamber: bedRooms.bedroomsNumber,
        size: bedRooms.sizeInMeterSquare,
        bedType1: bed1.description,
        bedType2: bed2.description,
        price: bedRooms.price,
        dateAvailableStart: reservation.beginingAt,
        dateAvailableEnd: reservation.endAt,
      })
      .from(bedRooms)
      .innerJoin(bed1, eq(bedRooms.bed1Id, bed1.id))
      .leftJoin(bed2, eq(bedRooms.bed2Id, bed2.id))
      .leftJoin(reservation, eq(reservation.bedroomId, bedRooms.id));

    return rows.map((row) => ({
      noChamber: String(row.noChamber),
      size: row.size,
      bedType1: row.bedType1,
      bedType2: row.bedType2 ?? undefined,
      price: row.price,
      dateAvailableStart: row.dateAvailableStart!,
      dateAvailableEnd: row.dateAvailableEnd!,
    }));
  }

  private mapToBedRoom(row: any): BedRoom {
    return {
      id: row.id,
      bedroomsNumber: row.bedroomsNumber,
      roomTypeId: row.roomTypeId,
      description: row.description,
      nbMaxClients: row.nbMaxClients,
      sizeInMeterSquare: Number(row.sizeInMeterSquare),
      nbBeds: row.nbBeds,
      bed1Id: row.bed1Id,
      bed2Id: row.bed2Id ?? null,
      price: Number(row.price),
      nomHotel: row.nomHotel,
      createdAt: row.created_At,
      updatedAt: row.updated_At,
    };
  }
}
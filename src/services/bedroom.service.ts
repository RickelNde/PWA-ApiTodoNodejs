import { v4 as uuidv4 } from 'uuid';
import { BedRoomRepository } from '../repositories/bedroom.repository';
import { BedRoom, CreateBedRoomRequest, UpdateBedRoomRequest } from '../types/bedroom';

const bedRoomRepository = new BedRoomRepository();

export class BedRoomService {

  async getAllBedRooms(): Promise<BedRoom[]> {
    return await bedRoomRepository.findAll();
  }

  async getBedRoomById(id: string): Promise<BedRoom | null> {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid bed room ID');
    }
    return await bedRoomRepository.findById(id);
  }

  async createBedRoom(data: CreateBedRoomRequest): Promise<BedRoom> {
    const now = new Date();

    const bedRoom: BedRoom = {
      id: uuidv4(),
      bedroomsNumber: data.bedroomsNumber,
      roomTypeId: data.roomTypeId,
      description: data.description,
      nbMaxClients: data.nbMaxClients,
      sizeInMeterSquare: data.sizeInMeterSquare,
      nbBeds: data.nbBeds,
      bed1Id: data.bed1Id,
      bed2Id: data.bed2Id ?? null,
      price: data.price,
      nomHotel: data.nomHotel,
      createdAt: now,
      updatedAt: now,
    };

    return await bedRoomRepository.create(bedRoom);
  }

  async updateBedRoom(id: string, data: UpdateBedRoomRequest): Promise<BedRoom | null> {
    const existing = await this.getBedRoomById(id);
    if (!existing) {
      return null;
    }
    return await bedRoomRepository.update(id, data);
  }

  async deleteBedRoom(id: string): Promise<BedRoom | null> {
    const existing = await this.getBedRoomById(id);
    if (!existing) {
      return null;
    }
    await bedRoomRepository.delete(id);
    return existing;
  }
}
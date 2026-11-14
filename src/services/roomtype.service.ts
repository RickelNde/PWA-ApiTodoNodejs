import { v4 as uuidv4 } from 'uuid';
import { RoomTypeRepository } from '../repositories/roomtype.repository';
import { RoomType } from '../types/roomType';

const roomTypeRepository = new RoomTypeRepository();

export class RoomTypeService {

  async getAllRoomTypes(): Promise<RoomType[]> {
    return await roomTypeRepository.findAll();
  }

  async getRoomTypeById(id: string): Promise<RoomType | null> {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid room type ID');
    }
    return await roomTypeRepository.findById(id);
  }

  async createRoomType(description: string): Promise<RoomType> {
    const now = new Date();
    const roomType: RoomType = {
      id: uuidv4(),
      description,
      createdAt: now,
      updatedAt: now,
    };
    return await roomTypeRepository.create(roomType);
  }

}
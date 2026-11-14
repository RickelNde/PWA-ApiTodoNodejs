import { v4 as uuidv4 } from 'uuid';
import { BedTypeRepository } from '../repositories/bedtype.repository';
import { BedType } from '../types/bedtype';

const bedTypeRepository = new BedTypeRepository();

export class BedTypeService {

  async getAllBedTypes(): Promise<BedType[]> {
    return await bedTypeRepository.findAll();
  }

  async getBedTypeById(id: string): Promise<BedType | null> {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid bed type ID');
    }
    return await bedTypeRepository.findById(id);
  }

  async createBedType(description: string): Promise<BedType> {
    const now = new Date();
    return await bedTypeRepository.create({
      id: uuidv4(),
      description,
      createdAt: now,
      updatedAt: now,
    });
  }

  async updateBedType(id: string, description: string): Promise<BedType | null> {
    const existing = await this.getBedTypeById(id);
    if (!existing) {
      return null;
    }
    return await bedTypeRepository.update(id, description);
  }

  async deleteBedType(id: string): Promise<BedType | null> {
    const existing = await this.getBedTypeById(id);
    if (!existing) {
      return null;
    }
    await bedTypeRepository.delete(id);
    return existing;
  }
}

export interface BedRoom {
  id: string;
  bedroomsNumber: number;
  roomTypeId: string;
  description: string;
  nbMaxClients: number;
  sizeInMeterSquare: number;
  nbBeds: number;
  bed1Id: string;
  bed2Id: string | null;
  price: number;
  nomHotel: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBedRoomRequest {
  bedroomsNumber: number;
  roomTypeId: string;
  description: string;
  nbMaxClients: number;
  sizeInMeterSquare: number;
  nbBeds: number;
  bed1Id: string;
  bed2Id?: string | null;
  price: number;
  nomHotel: string;
}

export interface UpdateBedRoomRequest {
  bedroomsNumber?: number;
  roomTypeId?: string;
  description?: string;
  nbMaxClients?: number;
  sizeInMeterSquare?: number;
  nbBeds?: number;
  bed1Id?: string;
  bed2Id?: string | null;
  price?: number;
  nomHotel?: string;
}
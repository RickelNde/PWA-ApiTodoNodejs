export interface Reservation {
  id: string;
  beginingAt: Date;
  endAt: Date;
  userId: string;
  bedroomId: string;
  nbPersonnes: number;
  transactionId: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReservationRequest {
  userId: string;
  bedroomId: string;
  nbPersonnes: number;
  beginingAt: Date;
  endAt: Date;
}

export interface UpdateReservationRequest {
  bedroomId?: string;
  nbPersonnes?: number;
  beginingAt?: Date;
  endAt?: Date;
}
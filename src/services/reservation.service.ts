import { v4 as uuidv4 } from 'uuid';
import { ReservationRepository } from '../repositories/reservation.repository';
import { BedRoomService } from './bedroom.service';
//import { demanderTransactionId, confirmerTransaction } from './bank.service';
import { CreateReservationRequest, Reservation, UpdateReservationRequest } from '../types/reservation';

const reservationRepository = new ReservationRepository();
const bedRoomService = new BedRoomService();

export class ReservationService {

  async getAllReservations() {
    return reservationRepository.findAll();
  }

  async getReservationById(id: string) {
    return reservationRepository.findById(id);
  }

 
  async createReservation(data: CreateReservationRequest) {
    const debut = new Date(data.beginingAt);
    const fin = new Date(data.endAt);

    if (fin <= debut) {
      throw new Error('DATES_INVALIDES');
    }

    const chambre = await bedRoomService.getBedRoomById(data.bedroomId);
    if (!chambre) {
      throw new Error('CHAMBRE_INTROUVABLE');
    }

    if (data.nbPersonnes > chambre.nbMaxClients) {
      throw new Error('TROP_DE_PERSONNES');
    }

    return reservationRepository.create({
      id: uuidv4(),
      userId: data.userId,
      bedroomId: data.bedroomId,
      nbPersonnes: data.nbPersonnes,
      beginingAt: debut,
      endAt: fin,
    });
  }


  async updateReservation(id: string, data: UpdateReservationRequest) {
    const existante = await reservationRepository.findById(id);
    if (!existante) {
      throw new Error('RESERVATION_INTROUVABLE');
    }

    if (existante.status === 'approved') {
      throw new Error('RESERVATION_DEJA_PAYEE');
    }

let bedroomId = existante.bedroomId;
if (data.bedroomId) {
  bedroomId = data.bedroomId;
}

let nbPersonnes = existante.nbPersonnes;
if (data.nbPersonnes) {
  nbPersonnes = data.nbPersonnes;
}

let debut = existante.beginingAt;
if (data.beginingAt) {
  debut = new Date(data.beginingAt);
}

let fin = existante.endAt;
if (data.endAt) {
  fin = new Date(data.endAt);
}

    if (fin <= debut) {
      throw new Error('DATES_INVALIDES');
    }

    const chambre = await bedRoomService.getBedRoomById(bedroomId);
    if (!chambre) {
      throw new Error('CHAMBRE_INTROUVABLE');
    }

    if (nbPersonnes > chambre.nbMaxClients) {
      throw new Error('TROP_DE_PERSONNES');
    }

    return reservationRepository.update(id, {
      bedroomId,
      nbPersonnes,
      beginingAt: debut,
      endAt: fin,
    });
  }

 async deleteReservation(id: string): Promise<Reservation | null> {
  const existant = await this.getReservationById(id);
  if (!existant) {
    return null;
  }

  if (existant.status === 'approved') {
    throw new Error('RESERVATION_DEJA_PAYEE');
  }

  await reservationRepository.delete(id);
  return existant;
}

}
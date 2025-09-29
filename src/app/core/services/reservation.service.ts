import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from './auth';
import { Observable } from 'rxjs';
import { availableRoom, CreateReservationPayload, CreateReservationResponse } from '../models/reservations.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private authService: Auth,
  ) {}

  availableRoom(dateStr: string, selectedHour: number): Observable<availableRoom[]> {
    return this.http.get<availableRoom[]>(`${this.apiUrl}/room/available-room?date=${dateStr}&hour=${selectedHour}`, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }

  createReservation(reservationData: CreateReservationPayload): Observable<CreateReservationResponse> {
    return this.http.post<CreateReservationResponse>(`${this.apiUrl}/room/create-reservation`, reservationData, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }
}

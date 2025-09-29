import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReservationList } from '../models/reservations.model';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root'
})
export class dashboardService {
  private readonly apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private authService: Auth,
  ) {}

  listReservations(dateFirst: string, dateEnd: string): Observable<ReservationList[]> {
    return this.http.get<ReservationList[]>(`${this.apiUrl}/room/list-reservations?date-first=${dateFirst}&date-end=${dateEnd}`, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }
}

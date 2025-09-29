import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { addDays, startOfWeek, endOfWeek, format, isBefore, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { ReservationList } from '../../../core/models/reservations.model';
import { dashboardService } from '../../../core/services/dashboard.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule, 
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  user: { id: string; name: string; email: string } | null = null;
  reservations: ReservationList[] = [];

  startOfWeek: Date = this.getStartOfWeek(new Date());
  // weekDays: Date[] = [];
  weekDays: { date: Date; label: string }[] = [];
  hours: number[] = Array.from({ length: 12 }, (_, i) => i + 8); // 8 → 19

  today: Date = new Date();

  constructor(
    private router: Router,
    private authService: Auth,
    private dashboardService: dashboardService,
  ) {}
  
  getStartOfWeek(date: Date): Date {
    return startOfWeek(date, { weekStartsOn: 1 }); // lunes
  }

  logout() {
    localStorage.removeItem('access_token');

    this.router.navigate(['/login']);
  }

  ngOnInit() {
    // Call the me() method from the Auth service to get user info
    this.authService.getMe().subscribe({
      next: (data) => (this.user = data),
      error:() => {
        this.user = null
        console.log('Error fetching user data', this.user);
        localStorage.removeItem('access_token'); // Remove invalid token
        this.router.navigate(['/login']);
      },
    });

    // 🔹 Generar días de la semana actual
    this.generateWeekDays();

    // 🔹 Cargar reservas para esa semana
    const start = format(this.startOfWeek, 'yyyy-M-d');
    const end = format(endOfWeek(this.startOfWeek, { weekStartsOn: 1 }), 'yyyy-M-d');

    this.dashboardService.listReservations(start, end).subscribe({
      next: (data) => (this.reservations = data),
      error: () => (this.reservations = []),
    });
  }

  navigateToReservations() {
    this.router.navigate(['/reservation']);
  }


  generateWeekDays() {
    this.weekDays = Array.from({ length: 7 }, (_, i) => {
      // addDays(this.startOfWeek, i)
      const d = addDays(this.startOfWeek, i);
      return {
        date: d,
        label: format(d, "EEEE dd/MM", { locale: es }),
      };
    });
  }

  prevWeek() {
    this.startOfWeek = addDays(this.startOfWeek, -7);
    this.generateWeekDays();
    this.loadReservations();
  }

  nextWeek() {
    this.startOfWeek = addDays(this.startOfWeek, 7);
    this.generateWeekDays();
    this.loadReservations();
  }

  loadReservations() {
    const start = format(this.startOfWeek, 'yyyy-M-d');
    const end = format(endOfWeek(this.startOfWeek, { weekStartsOn: 1 }), 'yyyy-M-d');

    this.dashboardService.listReservations(start, end).subscribe({
      next: (data) => this.reservations = data,
      error: (err) => console.error('Error cargando reservas', err)
    });
  }

  getReservationsFor(day: Date, hour: number): ReservationList[] {
    const dayStr = day.toISOString().split('T')[0];
    return this.reservations.filter(r => r.date.split('T')[0] === dayStr && r.hour === hour);
  }

  isPast(day: Date): boolean {
    // const todayStr = this.today.toISOString().split('T')[0];
    // const dayStr = day.toISOString().split('T')[0];
    // return dayStr < todayStr;
    return isBefore(startOfDay(day), startOfDay(this.today));
  }

}

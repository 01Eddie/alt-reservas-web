import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { ReservationService } from '../../../core/services/reservation.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialog } from './confirm-dialog/confirm-dialog';
import { SuccessDialog } from './success-dialog/success-dialog';

@Component({
  selector: 'app-reservations',
  imports: [
    CommonModule, 
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatDialogModule
  ],
  templateUrl: './reservations.html',
  styleUrl: './reservations.scss'
})
export class Reservations implements OnInit {
  user: { id: string; name: string; email: string } | null = null;

  today: Date = new Date();

  selectedDate: Date | null = null;
  selectedHour: number | null = null;
  selectedRoom: number | null = null;

  rooms: any[] = [];

  hours = [
    { value: 8, label: '8:00 am - 9:00 am' },
    { value: 9, label: '9:00 am - 10:00 am' },
    { value: 10, label: '10:00 am - 11:00 am' },
    { value: 11, label: '11:00 am - 12:00 pm' },
    { value: 12, label: '12:00 pm - 13:00 pm' },
    { value: 13, label: '13:00 pm - 14:00 pm' },
    { value: 14, label: '14:00 pm - 15:00 pm' },
    { value: 15, label: '15:00 pm - 16:00 pm' },
    { value: 16, label: '16:00 pm - 17:00 pm' },
    { value: 17, label: '17:00 pm - 18:00 pm' },
    { value: 18, label: '18:00 pm - 19:00 pm' },
    { value: 19, label: '19:00 pm - 20:00 pm' },
  ];


  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authService: Auth,
    private reservationService: ReservationService,
  ) { }

  ngOnInit() {
    this.authService.getMe().subscribe({
      next: (data) => (this.user = data),
      error:() => {
        this.user = null
        console.log('Error fetching user data', this.user);
        localStorage.removeItem('access_token'); // Remove invalid token
        this.router.navigate(['/login']);
      },
    });
  }


  cancelReservation() {
    // this.resetForm();
    this.router.navigate(['/dashboard']);
  }

  onDateOrHourChange() {
    this.selectedRoom = null; // limpiar selección previa
    this.rooms = [];

    if (this.selectedDate && this.selectedHour !== null) {
      const dateStr = this.selectedDate.toISOString().split('T')[0]; // yyyy-mm-dd

      this.reservationService.availableRoom(dateStr, this.selectedHour).subscribe({
        next: (data) => {
          this.rooms = data;
        },
        error: (err) => {
          console.error('Error cargando salas', err);
        }
      });
    }}

    // roomSelectedReservation() {
    //   if (!this.user) {
    //     alert('Usuario no autenticado');
    //     return;
    //   }
  
    //   if (this.selectedDate && this.selectedHour !== null && this.selectedRoom !== null) {
    //     const dateStr = this.selectedDate.toISOString().split('T')[0]; // yyyy-mm-dd
  
    //     const reservationData = {
    //       date: dateStr,
    //       hour: this.selectedHour,
    //       roomId: this.selectedRoom,
    //       userId: parseInt(this.user.id, 10),
    //     };
  
    //     this.reservationService.createReservation(reservationData).subscribe({
    //       next: (data) => {
    //         alert('Reservacion creada con exito!');
    //         this.router.navigate(['/dashboard']);
    //       },
    //       error: (err) => {
    //         console.error('Error creando reservacion', err);
    //         alert('Error creando reservacion. Intente nuevamente.');
    //       }
    //     });
    //   } else {
    //     alert('Por favor seleccione fecha, hora y sala.');
    //   }
    // }
    openConfirmDialog() {
      const dateStr = this.selectedDate?.toISOString().split('T')[0];
      const roomName = this.rooms.find(r => r.id === this.selectedRoom)?.name;
  
      const dialogRef = this.dialog.open(ConfirmDialog, {
        data: { date: dateStr, hour: this.selectedHour, roomName }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.registerReservation(dateStr!, this.selectedHour!, this.selectedRoom!);
        }
      });
    }

    registerReservation(date: string, hour: number, roomId: number) {
      this.reservationService.createReservation({
          date,
          hour,
          roomId,
          userId: parseInt(this.user!.id, 10),
        }).subscribe({
        next: () => {
          const dialogRef = this.dialog.open(SuccessDialog, { disableClose: true });
  
          dialogRef.afterClosed().subscribe(res => {
            if (res === 'otra') {
              this.resetForm();
            }
          });
        },
        error: (err) => console.error('Error reservando sala', err)
      });
    }


    resetForm() {
      this.selectedDate = null;
      this.selectedHour = null;
      this.selectedRoom = null;
      this.rooms = [];
    }
}

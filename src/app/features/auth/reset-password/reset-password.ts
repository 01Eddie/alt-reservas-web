import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Header } from '../../../shared/components/header/header';

@Component({
  selector: 'app-reset-password',
  imports: [
    CommonModule, 
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    Header
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPassword {
  email: string = '';
  message: string | null = null;
  error: string | null = null;

  constructor(
    // private http: HttpClient, 
    private router: Router,
    private authService: Auth,
  ) {}

  onSubmit() {
    this.authService.forgotPassword({
        email: this.email,
      }).subscribe({
        next: (response) => {
          this.message = (response as any).message;
          this.error = null;
          console.log('response --> ',response);

          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.error = 'Error al enviar la solicitud. Intenta nuevamente.';
          this.message = null;
          console.error(err);
        },
      });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}

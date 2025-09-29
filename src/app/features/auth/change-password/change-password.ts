import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-change-password',
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss'
})
export class ChangePassword {
  password: string = '';
  confirmPassword: string = '';
  error: string | null = null;
  message: string | null = null;
  token: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private auth: Auth
  ) {}

  ngOnInit() {
    // 👇 capturamos el token desde la URL
    // this.token = this.route.snapshot.paramMap.get('token') ?? '';
    this.route.queryParamMap.subscribe((params) => {
      this.token = params.get('token') ?? '';
    });
  }

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      this.message = null;
      return;
    }

    this.auth.changePassword({
        token: this.token,
        newPassword: this.password,
      })
      .subscribe({
        next: () => {
          this.message = 'Contraseña actualizada con éxito';
          this.error = null;

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: () => {
          this.error = 'Error al resetear la contraseña. Intenta nuevamente.';
          this.message = null;
        },
      });
    }


    goToLogin() {
      this.router.navigate(['/login']);
    }
}

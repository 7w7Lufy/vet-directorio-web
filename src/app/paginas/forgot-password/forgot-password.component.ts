import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router'; // Importa RouterLink
import { MaterialModule } from '../../material/material.module'; // Importa MaterialModule
import { AuthService } from '../../servicios/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar'; // Importa MatSnackBar

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, RouterLink], // Añade RouterLink
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css' // Apunta al CSS
})
export class ForgotPasswordComponent {
  email: string = '';
  isLoading: boolean = false;
  message: string = ''; // Para mostrar mensajes al usuario

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar // Inyecta MatSnackBar
  ) {}

  onRequestReset() {
    this.isLoading = true;
    this.message = ''; // Limpia mensajes anteriores
    this.authService.requestPasswordReset(this.email).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.message = 'Si tu correo está registrado, recibirás un enlace para restablecer tu contraseña.';
        this.snackBar.open(this.message, 'Cerrar', { duration: 5000 });
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al solicitar restablecimiento:', error);
        // Mensaje genérico por seguridad
        this.message = 'Ocurrió un error. Por favor, intenta de nuevo más tarde.';
        this.snackBar.open(this.message, 'Cerrar', { duration: 5000, panelClass: ['error-snackbar'] });
      }
    });
  }
}
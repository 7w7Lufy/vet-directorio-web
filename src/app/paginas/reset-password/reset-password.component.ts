import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; // Importa ActivatedRoute y Router
import { MaterialModule } from '../../material/material.module';
import { AuthService } from '../../servicios/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  token: string | null = null;
  newPassword = '';
  confirmPassword = '';
  isLoading = false;
  message = '';
  passwordsMatch = true;

  constructor(
    private route: ActivatedRoute, // Para leer parámetros de la URL
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router // Para redirigir después del éxito
  ) {}

  ngOnInit(): void {
    // Lee el token del parámetro 'token' en la URL
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.message = 'Token inválido o faltante.';
      this.snackBar.open(this.message, 'Cerrar', { duration: 5000, panelClass: ['error-snackbar'] });
    }
  }

  checkPasswordsMatch() {
    this.passwordsMatch = this.newPassword === this.confirmPassword;
  }

  onResetPassword() {
    if (!this.token || this.newPassword !== this.confirmPassword) {
        this.passwordsMatch = false;
        return;
    }
    this.isLoading = true;
    this.message = '';

    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.message = '¡Contraseña actualizada con éxito!';
        this.snackBar.open(this.message, 'Cerrar', { duration: 5000 });
        // Redirige al login después de un breve momento
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al restablecer contraseña:', error);
        this.message = error.error.message || 'Error al restablecer. El token puede ser inválido o haber expirado.';
        this.snackBar.open(this.message, 'Cerrar', { duration: 5000, panelClass: ['error-snackbar'] });
      }
    });
  }
}
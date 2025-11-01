import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // Para redirigir al usuario
import { AuthService } from '../../servicios/auth.service';
import { MaterialModule } from '../../material/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
  onLogin() {
    this.authService.login(this.credentials).subscribe({ // Usa la sintaxis de objeto para next/error
      next: () => {
        // Éxito en el login, AHORA revisamos el rol ANTES de redirigir
        const userRole = this.authService.getUserRole(); // Obtiene el rol del token recién guardado
        if (userRole === 'admin') {
          this.router.navigate(['/admin']); // Los admins van al panel
        } else {
          this.router.navigate(['/']); // Otros usuarios (veterinarios) van al directorio principal
          // O si prefieres que vayan directo a su perfil:
          // this.router.navigate(['/perfil']); 
        }
      },
      error: (error) => {
        console.error('Error en el login:', error);
        alert('Credenciales inválidas. Por favor, intenta de nuevo.'); // O usa MatSnackBar
      }
    });
  }
}
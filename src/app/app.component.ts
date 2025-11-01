// src/app/app.component.ts
import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './componentes/navbar/navbar.component';
import { AuthService } from './servicios/auth.service'; // <-- IMPORTA AuthService

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'directorio-web';

  // INYECTA AuthService
  constructor(private authService: AuthService) {}

  // Este decorador escucha eventos en toda la ventana del navegador
  @HostListener('window:mousemove')
  @HostListener('window:keypress')
  @HostListener('window:click')
  onUserActivity() {
    this.authService.notifyUserActivity(); // Notifica al servicio que hubo actividad
  }
}

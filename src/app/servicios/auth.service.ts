import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, Subject } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; // <-- 1. IMPORTA jwt-decode
import { Router } from '@angular/router'; // <-- IMPORTA Router
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Usuario {
  id: number;
  email: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = `${environment.apiUrl}/login`;
  private readonly TOKEN_KEY = 'auth_token';
  private inactivityTimer: any; // <-- Propiedad para guardar el temporizador
  private userActivity = new Subject<void>(); // <-- Observable para detectar actividad
  private forgotPasswordUrl = `${environment.apiUrl}/forgot-password`;
  private resetPasswordUrl = `${environment.apiUrl}/reset-password`;
  private usuariosSinPerfilUrl = `${environment.apiUrl}/usuarios-sin-perfil`;
  //
  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) {
    this.userActivity.subscribe(() => this.resetInactivityTimer());
  }
  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post(this.resetPasswordUrl, { token, password });
  }
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(this.forgotPasswordUrl, { email });
  }
  startInactivityTimer() {
    this.resetInactivityTimer(); // Inicia o reinicia el timer al comenzar
  }
// Método para reiniciar el temporizador
  resetInactivityTimer() {
    clearTimeout(this.inactivityTimer); // Limpia el timer anterior
    const timeoutDuration = 15 * 60 * 1000; // 15 minutos en milisegundos
    this.inactivityTimer = setTimeout(() => {
      if (this.isLoggedIn()) {
          this.snackBar.open('Tu sesión ha expirado por inactividad.', 'Cerrar', { duration: 3000 });
          this.logoutAndRedirect(); // Cierra sesión si el tiempo se cumple
      }
    }, timeoutDuration);
  }
  // Método para detener el temporizador (llamado al hacer logout manual)
  clearInactivityTimer() {
    clearTimeout(this.inactivityTimer);
  }
  getUsuariosSinPerfil(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.usuariosSinPerfilUrl);
  }
  // Notifica que hubo actividad (será llamado desde AppComponent)
  notifyUserActivity() {
    this.userActivity.next();
  }
  // Nueva función para logout y redirección segura
  logoutAndRedirect(): void {
    this.logout();
    this.router.navigate(['/login']); // Redirige a la página de login
  }


  // Envía las credenciales a la API
  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials).pipe(
      tap(response => {
        // Si el login es exitoso, guarda el token
        if (response && response.token) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          this.startInactivityTimer();
        }
      })
    );
  }
      // --- AÑADE ESTE NUEVO MÉTODO ---
    getUserEmail(): string | null {
        const token = this.getToken();
        if (token) {
            try {
                const decodedToken: any = jwtDecode(token);
                return decodedToken.email; // Asegúrate que tu token guarde el email
            } catch (error) {
                return null;
            }
        }
        return null;
    }
  // Cierra la sesión eliminando el token
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.clearInactivityTimer(); // <-- LIMPIA EL TIMER AL CERRAR SESIÓN
  }
  // Revisa si hay un token guardado (si el usuario está logueado)
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
  // Obtiene el token guardado
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  // --- AÑADE ESTE NUEVO MÉTODO ---
  getUserRole(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.rol; // Devuelve el rol (ej: 'admin' o 'veterinario')
      } catch (error) {
        console.error('Error al decodificar el token', error);
        return null;
      }
    }
    return null;
  }
  getUserId(): number | null {
    const token = this.getToken(); // Obtiene el token de localStorage
    if (token) {
      try {
        // Decodifica el token para acceder a su contenido (payload)
        const decodedToken: any = jwtDecode(token);
        // Asume que el ID se guarda como 'userId' en el payload del token
        return decodedToken.userId || null;
      } catch (error) {
        console.error('Error al decodificar el token para obtener UserID:', error);
        return null; // Retorna null si el token es inválido
      }
    }
    return null; // Retorna null si no hay token
  }

}
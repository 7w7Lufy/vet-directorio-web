import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Ubicacion {
  id: number;
  nombre_clinica: string;
  calle_numero: string;
  colonia?: string | null;
  codigo_postal?: string | null;
  ciudad: string;
  estado: string;
  telefono_contacto?: string | null; // Teléfono (opcional)
  latitud?: number | string | null;    // Latitud (opcional, puede ser num o string)
  longitud?: number | string | null;   // Longitud (opcional, puede ser num o string)
  servicios_texto?: string | null;   // Texto de servicios (opcional)
  capacidades_texto?: string | null; // Texto de capacidades (opcional)
  horarios_texto?: string | null;    // Texto de horarios (opcional)
  map_url?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {
  
  // --- URLs ACTUALIZADAS ---
  private apiUrl = `${environment.apiUrl}/ubicaciones`;
  private coloniasUrl = `${environment.apiUrl}/colonias`;
  // -------------------------

  constructor(private http: HttpClient) { }

  getUbicaciones(): Observable<Ubicacion[]> {
    return this.http.get<Ubicacion[]>(this.apiUrl);
  }

  createUbicacion(ubicacion: any): Observable<Ubicacion> {
    return this.http.post<Ubicacion>(this.apiUrl, ubicacion);
  }

  updateUbicacion(id: number, ubicacion: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, ubicacion);
  }

  deleteUbicacion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
  getColonias(): Observable<string[]> {
    return this.http.get<string[]>(this.coloniasUrl);
  }
}
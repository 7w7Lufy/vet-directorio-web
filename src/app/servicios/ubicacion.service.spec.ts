import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Ubicacion {
  id: number;
  nombre_clinica: string;
  calle_numero: string;
  colonia?: string;
  codigo_postal?: string;
  ciudad: string;
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {
  private apiUrl = 'http://localhost:3000/api/ubicaciones';

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

}
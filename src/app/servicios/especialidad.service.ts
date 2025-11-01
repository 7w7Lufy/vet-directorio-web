import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Especialidad {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {
  
  // --- URL ACTUALIZADA ---
  private apiUrl = `${environment.apiUrl}/especialidades`;
  // -------------------------

  constructor(private http: HttpClient) { }

  getEspecialidades(): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(this.apiUrl);
  }

  createEspecialidad(especialidad: { nombre: string }): Observable<Especialidad> {
    return this.http.post<Especialidad>(this.apiUrl, especialidad);
  }

  updateEspecialidad(id: number, especialidad: { nombre: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, especialidad);
  }

  deleteEspecialidad(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
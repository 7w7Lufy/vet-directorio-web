import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ubicacion } from './ubicacion.service'; // <-- IMPORTA EL MODELO DE UBICACIÓN
import { Especialidad } from './especialidad.service'; // <-- 1. IMPORTA
import { HttpParams } from '@angular/common/http';

// 1. CREA LA NUEVA INTERFAZ PARA ESTUDIOS
export interface Estudio {
  id: number;
  nivel_estudio: string;
  institucion: string;
  titulo_obtenido: string;
  ano_graduacion: number | null;
}
export interface NivelEstudio {
  id: number;
  nombre: string;
}

// --- AÑADE ESTA INTERFAZ ---
export interface Imagen {
  id: number;
  imagen_url: string;
  descripcion?: string | null;
}

// (Opcional pero recomendado) Definimos la "forma" de nuestros datos
export interface Veterinario {
  id: number;
  nombre_completo: string;
  cedula_profesional: string;
  descripcion: string;
  foto_perfil_url: string;
  costo_consulta: number | null;
  acepta_urgencias : boolean;
  ubicaciones: Ubicacion[]; // <-- 2. AÑADE ESTA LÍNEA
  especialidades: Especialidad[];
  estudios: Estudio[]; // <-- 3. AÑADE ESTA LÍNEA
  usuario_id: number; // Asegúrate de que este campo exista (lo necesitaremos para permisos)
  imagenes: Imagen[];
}

@Injectable({
  providedIn: 'root'
})
export class VeterinarioService {

  // --- URLs ACTUALIZADAS ---
  private apiUrl = `${environment.apiUrl}/veterinarios`;
  private estudiosApiUrl = `${environment.apiUrl}/estudios`;
  private nivelesEstudioUrl = `${environment.apiUrl}/niveles-estudio`;
  private imagenesApiUrl = `${environment.apiUrl}/imagenes`;
  private perfilApiUrl = `${environment.apiUrl}/perfil`; // <-- URL para Mi Perfil
  // -------------------------

  constructor(private http: HttpClient) { }

  // Este método pide la lista de veterinarios a la API
  getVeterinarios(
    searchTerm: string = '',
    especialidadId?: number | null, // <-- Nuevo parámetro
    colonia?: string | null,         // <-- Nuevo parámetro
    aceptaUrgencias?: boolean | null // <-- Nuevo parámetro
  ): Observable<Veterinario[]> {
    // Construye los parámetros de la URL dinámicamente
    let params = new HttpParams();
    if (searchTerm) {
      params = params.set('search', searchTerm);
    }
    if (especialidadId) {
      params = params.set('especialidad', especialidadId.toString());
    }
    if (colonia) {
      params = params.set('colonia', colonia);
    }
    if (aceptaUrgencias !== null && aceptaUrgencias !== undefined) {
      params = params.set('urgencias', aceptaUrgencias ? 'true' : 'false'); // Envía 'true' o 'false' como string
    }
    // Envía la petición con los parámetros
    return this.http.get<Veterinario[]>(this.apiUrl, { params: params });
  }

  createVeterinario(veterinario: any): Observable<any> {
    return this.http.post(this.apiUrl, veterinario);
  }

  deleteVeterinario(id: number): Observable<any> {
    // La URL incluye el ID del veterinario a eliminar. Ej: /api/veterinarios/5
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // --- AÑADE ESTE NUEVO MÉTODO ---
  updateVeterinario(id: number, veterinario: any): Observable<any> {
    // Envía la petición PUT a la URL específica del veterinario, ej: /api/veterinarios/5
    return this.http.put(`${this.apiUrl}/${id}`, veterinario);
  }

  // --- AÑADE ESTE NUEVO MÉTODO ---
  asignarUbicacion(vetId: number, ubicacionId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${vetId}/ubicaciones`, { ubicacionId });
  }

  // --- AÑADE ESTOS DOS NUEVOS MÉTODOS ---
  getUbicacionesDeVeterinario(vetId: number): Observable<Ubicacion[]> {
    return this.http.get<Ubicacion[]>(`${this.apiUrl}/${vetId}/ubicaciones`);
  }

  quitarUbicacion(vetId: number, ubicacionId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${vetId}/ubicaciones/${ubicacionId}`);
  }

  // --- AÑADE ESTE NUEVO MÉTODO ---
  getVeterinarioById(id: number): Observable<Veterinario> {
    return this.http.get<Veterinario>(`${this.apiUrl}/${id}`);
  }

  getEspecialidadesDeVeterinario(vetId: number): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(`${this.apiUrl}/${vetId}/especialidades`);
  }
  
  asignarEspecialidad(vetId: number, especialidadId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${vetId}/especialidades`, { especialidadId });
  }

  quitarEspecialidad(vetId: number, especialidadId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${vetId}/especialidades/${especialidadId}`);
  }

  // --- MÉTODOS DE "MI PERFIL" (CORREGIDOS) ---
  getMiPerfil(): Observable<Veterinario> {
    return this.http.get<Veterinario>(this.perfilApiUrl); // <-- CORREGIDO
  }

  updateMiPerfil(perfil: any): Observable<any> {
    return this.http.put(this.perfilApiUrl, perfil); // <-- CORREGIDO
  }
  // -------------------------------------------

  getNivelesEstudio(): Observable<NivelEstudio[]> {
    return this.http.get<NivelEstudio[]>(this.nivelesEstudioUrl);
  }

  agregarEstudio(vetId: number, estudio: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${vetId}/estudios`, estudio);
  }

  eliminarEstudio(estudioId: number): Observable<any> {
    // Nota: El endpoint es /api/estudios/:estudioId, no depende del vetId
    return this.http.delete(`${this.estudiosApiUrl}/${estudioId}`); // <-- CORREGIDO
  }

  uploadProfilePhoto(vetId: number, file: File): Observable<any> {
    // Creamos un objeto FormData para enviar el archivo
    const formData = new FormData();
    // 'profilePic' debe coincidir con el nombre usado en upload.single() en la API
    formData.append('profilePic', file, file.name);
    // Hacemos la petición POST al endpoint específico
    return this.http.post(`${this.apiUrl}/${vetId}/upload-photo`, formData);
  }

  // --- AÑADE ESTOS MÉTODOS ---
  getImagenesVet(vetId: number): Observable<Imagen[]> {
    return this.http.get<Imagen[]>(`${this.apiUrl}/${vetId}/imagenes`);
  }

  /** Sube una nueva imagen a la galería de un veterinario */
  addImagenVet(vetId: number, file: File, descripcion?: string): Observable<Imagen> {
    const formData = new FormData();
    formData.append('additionalImage', file, file.name);
    if (descripcion) { formData.append('descripcion', descripcion); }
    return this.http.post<Imagen>(`${this.apiUrl}/${vetId}/imagenes`, formData);
  }

  /** Elimina una imagen específica de la galería por su ID */
  deleteImagenVet(imageId: number): Observable<any> {
    return this.http.delete(`${this.imagenesApiUrl}/${imageId}`);
  }
}
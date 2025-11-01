// src/app/paginas/home/home.component.ts

import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VeterinarioService, Veterinario } from '../../servicios/veterinario.service';
import { AuthService } from '../../servicios/auth.service';
import { UbicacionService, Ubicacion } from '../../servicios/ubicacion.service';
import { EspecialidadService, Especialidad } from '../../servicios/especialidad.service';
import { MaterialModule } from '../../material/material.module'; // <-- 1. IMPORTA MATERIAL MODULE
import { Usuario } from '../../servicios/auth.service';
import { Estudio, NivelEstudio } from '../../servicios/veterinario.service'; // Asegúrate de importar las interfaces
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    // FormularioVeterinarioComponent, <-- 2. YA NO SE USA, ASÍ QUE LO QUITAMOS
    RouterLink,
    MaterialModule // <-- 3. AÑADE MATERIAL MODULE A LOS IMPORTS
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})




export class HomeComponent implements OnInit {
  veterinarios: Veterinario[] = [];
  vetParaEditar: Veterinario | null = null;
  isAdmin: boolean = false;
  userEmail: string | null = null;
  todasLasUbicaciones: Ubicacion[] = [];
  ubicacionesAsignadas: Ubicacion[] = [];
  ubicacionSeleccionadaId: number | null = null;
  todasLasEspecialidades: Especialidad[] = [];
  especialidadesAsignadas: Especialidad[] = [];
  especialidadSeleccionadaId: number | null = null;
  usuariosDisponibles: Usuario[] = [];
  estudiosAsignados: Estudio[] = []; // <-- Lista de estudios del vet editado
  nivelesEstudio: NivelEstudio[] = []; // <-- Lista para el dropdown
  previewImageUrl: string | ArrayBuffer | null = null; 
  selectedFile: File | null = null;
  uploadingPhotoVetId: number | null = null; // Para saber a quién subirle la foto
  
  isSaving = false;

  // --- 4. AÑADE ESTA PROPIEDAD QUE FALTABA ---
  nuevoVeterinario = {
    usuario_id: null as number | null, // <-- Cambia a null e indica el tipo
    nombre_completo: '',
    cedula_profesional: ''
  };

  nuevoEstudio = { // <-- Objeto para el formulario de agregar
    nivel_estudio_id: null as number | null,
    institucion: '',
    titulo_obtenido: '',
    ano_graduacion: null as number | null
  };

  constructor(
    private veterinarioService: VeterinarioService,
    private authService: AuthService,
    private router: Router,
    private ubicacionService: UbicacionService,
    private especialidadService: EspecialidadService,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit() {
    this.cargarVeterinarios();
    const userRole = this.authService.getUserRole();
    this.isAdmin = userRole === 'admin';
    this.userEmail = this.authService.getUserEmail(); 
    this.cargarTodasLasUbicaciones();
    this.cargarTodasLasEspecialidades();
    this.cargarUsuariosDisponibles();
    this.cargarNivelesEstudio(); // <-- Carga los niveles
  }
  // --- 5. AÑADE ESTE MÉTODO QUE FALTABA ---
  // --- AÑADE ESTA FUNCIÓN (SIMULADA POR AHORA) ---
  cargarUsuariosDisponibles() {
        this.authService.getUsuariosSinPerfil().subscribe({
            next: (data) => {
                this.usuariosDisponibles = data;
            },
            error: (err) => {
                console.error('Error al cargar usuarios disponibles:', err);
                // Podrías mostrar un mensaje al usuario aquí
            }
        });
    }
  agregarVeterinario() {
    if (!this.nuevoVeterinario.usuario_id) {
        this.snackBar.open('Por favor, selecciona un usuario para asociar el perfil.', 'Cerrar', { duration: 3000 });
        return;
    }
    this.isSaving = true;
    this.veterinarioService.createVeterinario(this.nuevoVeterinario)
      .subscribe({
        next: (respuesta) => {
          this.snackBar.open('¡Veterinario agregado!', 'Cerrar', { duration: 3000 });
          this.cargarVeterinarios();
          this.nuevoVeterinario.nombre_completo = '';
          this.nuevoVeterinario.cedula_profesional = '';
          this.nuevoVeterinario.usuario_id = null; // Resetea el select
          this.isSaving = false; // <-- 3. Poner en false cuando la operación TERMINA (éxito)
        },
        error: (error) => {
          console.error('Error al crear veterinario:', error);
          this.snackBar.open(error.error.message || 'Hubo un error...', 'Cerrar', { 
              duration: 5000, 
              panelClass: ['error-snackbar'] // Clase CSS para estilizar errores (opcional)
          });
          this.isSaving = false;
        }
      });
  }

  // --- 6. AÑADE ESTE MÉTODO QUE FALTABA ---
  onFileSelected(event: any, vetId: number) { // Recibe el ID del veterinario
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadingPhotoVetId = vetId; // Guarda el ID para la subida
      // Crear vista previa
      const reader = new FileReader();
      reader.onload = e => this.previewImageUrl = reader.result;
      reader.readAsDataURL(file);
      // Llama inmediatamente a la función de subida
      this.uploadPhoto(); 
    }
  }

  // --- AÑADE ESTA FUNCIÓN ---
  uploadPhoto() {
    if (!this.selectedFile || this.uploadingPhotoVetId === null) {
      this.snackBar.open('No hay archivo seleccionado o veterinario especificado.', 'Cerrar', { duration: 3000 });
      return;
    }

    this.veterinarioService.uploadProfilePhoto(this.uploadingPhotoVetId, this.selectedFile).subscribe({
      next: (response) => {
        this.snackBar.open('Foto subida con éxito!', 'Cerrar', { duration: 3000 });
        // Actualiza la URL de la foto en la lista local para verla al instante
        const vetIndex = this.veterinarios.findIndex(v => v.id === this.uploadingPhotoVetId);
        if (vetIndex !== -1) {
          this.veterinarios[vetIndex].foto_perfil_url = response.foto_perfil_url;
        }
        // Limpia la selección
        this.previewImageUrl = null;
        this.selectedFile = null;
        this.uploadingPhotoVetId = null;
      },
      error: (error) => {
        console.error('Error al subir foto:', error);
        this.snackBar.open(error.error.message || 'Error al subir la foto.', 'Cerrar', { duration: 5000, panelClass: ['error-snackbar'] });
        // Limpia la selección en caso de error también
        this.previewImageUrl = null;
        this.selectedFile = null;
        this.uploadingPhotoVetId = null;
      }
    });
  }


  // --- El resto de tus métodos (cargarVeterinarios, logout, etc.) van aquí ---
  cargarVeterinarios() {
    this.veterinarioService.getVeterinarios().subscribe(data => {
      this.veterinarios = data;
    });
  }

  cargarTodasLasUbicaciones() {
    this.ubicacionService.getUbicaciones().subscribe(data => {
      this.todasLasUbicaciones = data;
    });
  }

  cargarTodasLasEspecialidades() {
    this.especialidadService.getEspecialidades().subscribe(data => this.todasLasEspecialidades = data);
  }
  
  seleccionarParaEditar(vet: Veterinario) {
    this.vetParaEditar = { ...vet }; 
    this.cargarUbicacionesAsignadas(vet.id);
    this.especialidadesAsignadas = vet.especialidades || [];
    this.estudiosAsignados = vet.estudios || [];
   // this.cargarEstudiosAsignados(vet.id);
  }

  actualizarVeterinario() {
    if (!this.vetParaEditar) return;
    this.veterinarioService.updateVeterinario(this.vetParaEditar.id, this.vetParaEditar)
      .subscribe(() => {
        this.snackBar.open('Veterinario actualizado con éxito.', 'Cerrar', { duration: 3000 }); // Dura 3 segundos
        this.vetParaEditar = null;
        this.cargarVeterinarios();
      });
  }

  eliminarVeterinario(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar a este veterinario?')) {
      this.veterinarioService.deleteVeterinario(id).subscribe(() => {
        this.snackBar.open('Veterinario eliminado con éxito.', 'Cerrar', { duration: 3000 });
        this.cargarVeterinarios();
      });
    }
  }

  cargarEstudiosAsignados(vetId: number) {
     // Nota: Necesitamos que la API devuelva los estudios en getVeterinarioById o tener un endpoint específico
     // Por ahora, asumimos que vetParaEditar ya los tiene (lo arreglamos en la API antes)
      this.estudiosAsignados = this.vetParaEditar?.estudios || [];
  }

  cargarUbicacionesAsignadas(vetId: number) {
    this.veterinarioService.getUbicacionesDeVeterinario(vetId).subscribe(data => {
      this.ubicacionesAsignadas = data;
    });
  }

  onAsignarUbicacion() {
    if (!this.vetParaEditar || !this.ubicacionSeleccionadaId) return;
    this.veterinarioService.asignarUbicacion(this.vetParaEditar.id, this.ubicacionSeleccionadaId)
      .subscribe(() => {
        this.snackBar.open('Ubicación asignada con éxito.', 'Cerrar', { duration: 3000 });
        this.cargarUbicacionesAsignadas(this.vetParaEditar!.id);
        this.ubicacionSeleccionadaId = null; 
      }, error => {
        this.snackBar.open(error.error.message || 'Error al asignar la ubicación.', 'Cerrar', { 
            duration: 5000, 
            panelClass: ['error-snackbar'] // Clase CSS para estilizar errores (opcional)
        });
      });
  }

  onQuitarUbicacion(ubicacionId: number) {
    if (!this.vetParaEditar) return;
    if (confirm('¿Estás seguro de que quieres quitar esta ubicación del veterinario?')) {
      this.veterinarioService.quitarUbicacion(this.vetParaEditar.id, ubicacionId)
        .subscribe(() => {
          this.snackBar.open('Ubicación quitada con éxito.', 'Cerrar', { duration: 3000 });
          this.cargarUbicacionesAsignadas(this.vetParaEditar!.id);
        });
    }
  }

cargarEspecialidadesAsignadas(vetId: number) {
  this.veterinarioService.getEspecialidadesDeVeterinario(vetId).subscribe(data => {
    this.especialidadesAsignadas = data; 
    console.log('Especialidades asignadas cargadas:', this.especialidadesAsignadas);
  });
}

  onAsignarEspecialidad() {
    if (!this.vetParaEditar || !this.especialidadSeleccionadaId) return;
    this.veterinarioService.asignarEspecialidad(this.vetParaEditar.id, this.especialidadSeleccionadaId)
      .subscribe(() => {
        this.snackBar.open('Especialidad asignada con éxito.', 'Cerrar', { duration: 3000 });
        this.cargarEspecialidadesAsignadas(this.vetParaEditar!.id);
        this.especialidadSeleccionadaId = null; 
      }, error => {
        this.snackBar.open(error.error.message || 'Error al asignar la especialidad.', 'Cerrar', { 
    duration: 5000, 
    panelClass: ['error-snackbar'] // Clase CSS para estilizar errores (opcional)
});
      });
  }

  onQuitarEspecialidad(especialidadId: number) {
    if (!this.vetParaEditar) return;
    if (confirm('¿Quitar esta especialidad del veterinario?')) {
      this.veterinarioService.quitarEspecialidad(this.vetParaEditar.id, especialidadId)
        .subscribe(() => {
          this.snackBar.open('Especialidad quitada con éxito.', 'Cerrar', { duration: 3000 });
          this.cargarEspecialidadesAsignadas(this.vetParaEditar!.id);
        });
    }
  }
  onAgregarEstudio() {
    if (!this.vetParaEditar || !this.nuevoEstudio.nivel_estudio_id || !this.nuevoEstudio.institucion || !this.nuevoEstudio.titulo_obtenido) {
      this.snackBar.open('Por favor completa los campos obligatorios del estudio.', 'Cerrar', { duration: 3000 });
      return;
    }
    this.veterinarioService.agregarEstudio(this.vetParaEditar.id, this.nuevoEstudio)
      .subscribe(() => {
        this.snackBar.open('Estudio agregado.', 'Cerrar', { duration: 3000 });
        // Actualizamos la lista localmente (o volvemos a pedirla a la API)
        this.cargarEstudiosAsignados(this.vetParaEditar!.id); // Recargar
        // Limpiar formulario
        this.nuevoEstudio = { nivel_estudio_id: null, institucion: '', titulo_obtenido: '', ano_graduacion: null };
      });
  }
  onEliminarEstudio(estudioId: number) {
    if (confirm('¿Eliminar este estudio?')) {
      this.veterinarioService.eliminarEstudio(estudioId)
        .subscribe(() => {
          this.snackBar.open('Estudio eliminado.', 'Cerrar', { duration: 3000 });
          this.cargarEstudiosAsignados(this.vetParaEditar!.id); // Recargar
        });
    }
  }
  cargarNivelesEstudio() {
    this.veterinarioService.getNivelesEstudio().subscribe(data => this.nivelesEstudio = data);
  }

  logout() {
    this.authService.logoutAndRedirect();
  }
}
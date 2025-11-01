// src/app/paginas/admin/manage-ubicaciones/manage-ubicaciones.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // Importa RouterLink
import { UbicacionService, Ubicacion } from '../../../servicios/ubicacion.service';
import { AuthService } from '../../../servicios/auth.service';
import { MaterialModule } from '../../../material/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-manage-ubicaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MaterialModule], // Añade RouterLink a los imports
  templateUrl: './manage-ubicaciones.component.html',
  styleUrl: './manage-ubicaciones.component.css'
})
export class ManageUbicacionesComponent implements OnInit {

  ubicaciones: Ubicacion[] = [];
  isAdmin: boolean = false;
  ubicacionParaEditar: Ubicacion | null = null;
  nuevaUbicacion = {
    nombre_clinica: '',
    calle_numero: '',
    colonia: '',
    codigo_postal: '',
    ciudad: 'Oaxaca de Juárez', // O déjalo vacío: ''
    estado: 'Oaxaca',          // O déjalo vacío: ''
    telefono_contacto: null as string | null, // <-- AÑADIDO
    latitud: null as number | string | null,    // <-- AÑADIDO
    longitud: null as number | string | null,   // <-- AÑADIDO
    servicios_texto: '',
    capacidades_texto: '',
    horarios_texto: ''
  };

  constructor(
    private ubicacionService: UbicacionService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.getUserRole() === 'admin';
    // Si no es admin, lo sacamos de aquí por seguridad
    if (!this.isAdmin) {
      this.router.navigate(['/']);
      return;
    }
    this.cargarUbicaciones();
  }

  cargarUbicaciones(): void {
    this.ubicacionService.getUbicaciones().subscribe(data => this.ubicaciones = data);
  }

  agregarUbicacion(): void {
    this.ubicacionService.createUbicacion(this.nuevaUbicacion).subscribe(() => {
      this.snackBar.open('Ubicación agregada con éxito.', 'Cerrar', { duration: 3000 });
      this.cargarUbicaciones();
      // Limpiar formulario
      this.nuevaUbicacion.nombre_clinica = '';
      this.nuevaUbicacion.calle_numero = '';
      this.nuevaUbicacion.colonia = '';
      this.nuevaUbicacion.codigo_postal = '';
    });
  }

  seleccionarParaEditar(ubicacion: Ubicacion): void {
    this.ubicacionParaEditar = { ...ubicacion };
  }

  actualizarUbicacion(): void {
    if (!this.ubicacionParaEditar) return;
    this.ubicacionService.updateUbicacion(this.ubicacionParaEditar.id, this.ubicacionParaEditar).subscribe(() => {
      this.snackBar.open('Ubicación actualizada con éxito.', 'Cerrar', { duration: 3000 });
      this.ubicacionParaEditar = null;
      this.cargarUbicaciones();
    });
  }

  eliminarUbicacion(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta ubicación?')) {
      this.ubicacionService.deleteUbicacion(id).subscribe(() => {
        this.snackBar.open('Ubicación eliminada con éxito.', 'Cerrar', { duration: 3000 });
        this.cargarUbicaciones();
      });
    }
  }
}
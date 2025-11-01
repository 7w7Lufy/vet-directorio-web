import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EspecialidadService, Especialidad } from '../../../servicios/especialidad.service';
import { AuthService } from '../../../servicios/auth.service';
import { MaterialModule } from '../../../material/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-manage-especialidades',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MaterialModule],
  templateUrl: './manage-especialidades.component.html',
  styleUrl: './manage-especialidades.component.css'
})
export class ManageEspecialidadesComponent implements OnInit {

  especialidades: Especialidad[] = [];
  isAdmin: boolean = false;
  especialidadParaEditar: Especialidad | null = null;
  nuevaEspecialidad = { nombre: '' };

  constructor(
    private especialidadService: EspecialidadService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.getUserRole() === 'admin';
    if (!this.isAdmin) {
      this.router.navigate(['/']);
      return;
    }
    this.cargarEspecialidades();
  }

  cargarEspecialidades(): void {
    this.especialidadService.getEspecialidades().subscribe(data => this.especialidades = data);
  }

  agregarEspecialidad(): void {
    if (!this.nuevaEspecialidad.nombre.trim()) return; // Evita nombres vacíos
    this.especialidadService.createEspecialidad(this.nuevaEspecialidad).subscribe(() => {
      this.snackBar.open('Especialidad agregada con éxito.', 'Cerrar', { duration: 3000 });
      this.cargarEspecialidades();
      this.nuevaEspecialidad.nombre = ''; // Limpiar formulario
    }, error => {
      this.snackBar.open(error.error.message || 'Error al crear la especialidad.', 'Cerrar', { 
      duration: 5000, 
      panelClass: ['error-snackbar'] // Clase CSS para estilizar errores (opcional)
      });
    });
  }

  seleccionarParaEditar(especialidad: Especialidad): void {
    this.especialidadParaEditar = { ...especialidad };
  }

  actualizarEspecialidad(): void {
    if (!this.especialidadParaEditar || !this.especialidadParaEditar.nombre.trim()) return;
    this.especialidadService.updateEspecialidad(this.especialidadParaEditar.id, this.especialidadParaEditar).subscribe(() => {
      this.snackBar.open('Especialidad actualizada con éxito.', 'Cerrar', { duration: 3000 });
      this.especialidadParaEditar = null;
      this.cargarEspecialidades();
    }, error => {
      this.snackBar.open(error.error.message || 'Error al actualizar la especialidad.', 'Cerrar', { 
        duration: 5000, 
        panelClass: ['error-snackbar'] // Clase CSS para estilizar errores (opcional)
      });
    });
  }

  eliminarEspecialidad(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta especialidad?')) {
      this.especialidadService.deleteEspecialidad(id).subscribe(() => {
        this.snackBar.open('Especialidad eliminada con éxito.', 'Cerrar', { duration: 3000 });
        this.cargarEspecialidades();
      });
    }
  }
}
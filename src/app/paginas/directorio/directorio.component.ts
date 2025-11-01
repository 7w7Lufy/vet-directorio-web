// src/app/paginas/directorio/directorio.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VeterinarioService, Veterinario } from '../../servicios/veterinario.service';
import { Especialidad, EspecialidadService } from '../../servicios/especialidad.service'; // <-- IMPORTA
import { MaterialModule } from '../../material/material.module'; // <-- IMPORTA
import { MatDialog } from '@angular/material/dialog'; // <-- IMPORTA MatDialog
import { VetDetailModalComponent } from '../../componentes/vet-detail-modal/vet-detail-modal.component'; // <-- IMPORTA el modal
import { UbicacionService } from '../../servicios/ubicacion.service';


@Component({
  selector: 'app-directorio',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './directorio.component.html',
  styleUrl: './directorio.component.css' // <-- Apunta al CSS
})
export class DirectorioComponent implements OnInit {
  
  veterinarios: Veterinario[] = [];
  terminoDeBusqueda: string = '';
  isLoading: boolean = true;
  filtroUrgencias: boolean | null = null; // null = sin filtro, true = solo urgencias, false = solo sin urgencias
  

  especialidades: Especialidad[] = [];
  colonias: string[] = []; 


  selectedEspecialidadId: number | null = null;
  selectedColonia: string | null = null;

  constructor(
    private veterinarioService: VeterinarioService,
    private especialidadService: EspecialidadService, // <-- INYECTA
    private dialog: MatDialog, // <-- INYECTA MatDialog
    private ubicacionService: UbicacionService
  ) {}

  ngOnInit(): void {
    this.buscar();
    this.cargarFiltros(); // Carga los datos para los dropdowns
  }

  cargarFiltros(): void {
    this.especialidadService.getEspecialidades().subscribe(data => {
      this.especialidades = data;
    });
    // Carga colonias desde la API
    this.ubicacionService.getColonias().subscribe(data => {
      this.colonias = data;
    });
    
  }

  buscar(): void {
    this.isLoading = true;
    this.veterinarioService.getVeterinarios(
      this.terminoDeBusqueda,
      this.selectedEspecialidadId, // <-- Pasa el ID de especialidad
      this.selectedColonia,    // <-- Pasa la colonia
      this.filtroUrgencias
    ).subscribe({
      next: (data) => {
        this.veterinarios = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error al buscar veterinarios:", err);
        this.isLoading = false;
      }
    });
  }
  onFilterChange(): void {
      this.buscar(); // Llama a buscar cada vez que cambia un filtro
  }

  openVetDetailModal(vetId: number): void {
    this.dialog.open(VetDetailModalComponent, {
      width: '90%', // Ancho del modal
      maxWidth: '1000px', // Ancho máximo
      data: { vetId: vetId } // Pasa el ID del veterinario al modal
    });
  }
}
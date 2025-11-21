// src/app/paginas/perfil-veterinario/perfil-veterinario.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router'; // Importa ActivatedRoute y RouterLink
import { VeterinarioService, Veterinario } from '../../servicios/veterinario.service';
import { MaterialModule } from '../../material/material.module';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-perfil-veterinario',
  standalone: true,
  imports: [CommonModule, RouterLink, MaterialModule], // Añade RouterLink
  templateUrl: './perfil-veterinario.component.html',
  styleUrl: './perfil-veterinario.component.css'
})
export class PerfilVeterinarioComponent implements OnInit {

  veterinario: Veterinario | null = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private veterinarioService: VeterinarioService,
    private titleService: Title, // <-- NUEVO
    private metaService: Meta
  ) {}

ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.isLoading = true; // Inicia carga
      this.veterinarioService.getVeterinarioById(id).subscribe({
        next: (data) => {
            this.veterinario = data;

            // --- SEO: ACTUALIZAR TÍTULO Y DESCRIPCIÓN ---
            if (this.veterinario) {
                // 1. Cambiar Título de la pestaña
                this.titleService.setTitle(`MVZ. ${this.veterinario.nombre_completo} - Veterinario en Oaxaca`);

                // 2. Preparar datos para la descripción (usando ? para seguridad)
                const especialidad = this.veterinario.especialidades?.[0]?.nombre || 'Atención general';
                const ubicacion = this.veterinario.ubicaciones?.[0]?.colonia || 'Oaxaca';

                // 3. Actualizar Meta Descripción
                this.metaService.updateTag({
                    name: 'description',
                    content: `Consulta veterinaria con MVZ. ${this.veterinario.nombre_completo}. Especialista en ${especialidad}. Ubicado en ${ubicacion}. ¡Contacta ahora!`
                });
            }
            // -------------------------------------------
            this.isLoading = false; // <-- Termina carga (éxito)
        },
        error: (err) => {
            console.error("Error al cargar perfil:", err);
            this.isLoading = false; // <-- Termina carga (error)
        }
      });
    } else {
        this.isLoading = false; // No hay ID
    }
  }
}
// src/app/paginas/perfil-veterinario/perfil-veterinario.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router'; // Importa ActivatedRoute y RouterLink
import { VeterinarioService, Veterinario } from '../../servicios/veterinario.service';
import { MaterialModule } from '../../material/material.module';

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
    private veterinarioService: VeterinarioService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.isLoading = true; // Inicia carga
      this.veterinarioService.getVeterinarioById(id).subscribe({
        next: (data) => {
            this.veterinario = data;
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
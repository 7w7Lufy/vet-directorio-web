import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';
import { VeterinarioService } from '../../servicios/veterinario.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-perfil-vet',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './perfil-vet.component.html'
})
export class PerfilVetComponent implements OnInit {
  perfil: any = null;

  constructor(
    private vetService: VeterinarioService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.vetService.getMiPerfil().subscribe(data => {
      this.perfil = data;
    });
  }

  guardarCambios() {
    this.vetService.updateMiPerfil(this.perfil).subscribe(() => {
      this.snackBar.open('Perfil guardado con éxito', 'Cerrar', { duration: 3000 });
    });
  }
}
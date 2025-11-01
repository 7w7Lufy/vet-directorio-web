// formulario-veterinario.component.ts
import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- 1. IMPORTA FormsModule
import { VeterinarioService } from '../../servicios/veterinario.service';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-formulario-veterinario',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule], // <-- 2. AÑÁDELO A LOS IMPORTS
  templateUrl: './formulario-veterinario.component.html',
  styleUrl: './formulario-veterinario.component.css'
})
export class FormularioVeterinarioComponent {

  @Output() veterinarioAgregado = new EventEmitter<void>(); // <-- 2. CREA EL AVISADOR

  // 3. Define un objeto para guardar los datos del formulario
  nuevoVeterinario = {
    usuario_id: 2, // Por ahora, lo dejamos fijo. ¡Recuerda tener un usuario con id=1!
    nombre_completo: '',
    cedula_profesional: ''
  };

  // 4. Inyecta el servicio
  constructor(private veterinarioService: VeterinarioService) { }

  // 5. Este método se llamará al enviar el formulario
  agregarVeterinario() {
    this.veterinarioService.createVeterinario(this.nuevoVeterinario)
      .subscribe(respuesta => {
        console.log('Veterinario creado con éxito:', respuesta);
        alert('¡Veterinario agregado!');
        this.veterinarioAgregado.emit();
        // Opcional: limpiar el formulario después de agregar
        this.nuevoVeterinario.nombre_completo = '';
        this.nuevoVeterinario.cedula_profesional = '';
      }, error => {
        console.error('Error al crear veterinario:', error);
        alert('Hubo un error al agregar el veterinario.');
      });
  }
}
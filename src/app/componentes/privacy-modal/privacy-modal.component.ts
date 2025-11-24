import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog'; // Para mat-dialog-close y directivas
import { MaterialModule } from '../../material/material.module'; // Para botones e íconos (MatButton, MatIcon)

@Component({
  selector: 'app-privacy-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MaterialModule],
  templateUrl: './privacy-modal.component.html',
  styleUrl: './privacy-modal.component.css'
})
export class PrivacyModalComponent {
  // No requiere lógica adicional por ahora
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module'; // <-- IMPORTA ESTO
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-privacy-modal',
  standalone: true,
  imports: [CommonModule, MaterialModule, MatDialogModule], // <-- AÑADELOS AQUÍ
  templateUrl: './privacy-modal.component.html',
  styleUrl: './privacy-modal.component.css'
})
export class PrivacyModalComponent {}
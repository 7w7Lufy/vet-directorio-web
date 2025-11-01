import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module'; // <-- IMPORTA
import { MatDialogModule } from '@angular/material/dialog'; // Necesario para mat-dialog-close


@Component({
  selector: 'app-contact-modal',
  standalone: true,
  imports: [CommonModule, MaterialModule, MatDialogModule], // <-- AÑADE
  templateUrl: './contact-modal.component.html',
  styleUrl: './contact-modal.component.css'
})
export class ContactModalComponent { }
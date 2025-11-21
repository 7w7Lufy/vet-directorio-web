import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ContactModalComponent } from '../contact-modal/contact-modal.component'; // Importa tu modal

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  constructor(private dialog: MatDialog) {}

  openContactModal(): void {
    this.dialog.open(ContactModalComponent, {
      width: '500px',
    });
  }
}
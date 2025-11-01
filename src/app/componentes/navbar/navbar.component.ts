// src/app/componentes/navbar/navbar.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../../material/material.module';
import { AuthService } from '../../servicios/auth.service';
import { MatDialog } from '@angular/material/dialog'; // <-- IMPORTA MatDialog
import { ContactModalComponent } from '../contact-modal/contact-modal.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  
  constructor(
    public authService: AuthService, 
    private router: Router,
    private dialog: MatDialog
  ) {}

  esAdmin(): boolean {
    return this.authService.getUserRole() === 'admin';
  }

  openContactModal(): void {
    this.dialog.open(ContactModalComponent, {
      width: '500px', // Ancho del modal
    });
  }

  logout() {
    this.authService.logoutAndRedirect();
  }
}
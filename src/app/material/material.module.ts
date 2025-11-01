// src/app/material.module.ts

import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card'; // <-- AÑADE ESTO
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field'; // <-- AÑADE ESTO
import { MatInputModule } from '@angular/material/input';       // <-- AÑADE ESTO
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatSelectModule} from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  exports: [
    MatCardModule, 
    MatChipsModule,
    MatButtonModule,
    MatFormFieldModule, 
    MatInputModule,     
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatSelectModule,
    MatDialogModule,
    MatSlideToggleModule
  ]
})
export class MaterialModule { }
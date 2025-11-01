// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './paginas/login/login.component';
import { HomeComponent } from './paginas/home/home.component';
import { DirectorioComponent } from './paginas/directorio/directorio.component'; // <-- 1. IMPORTA
import { ManageUbicacionesComponent } from './paginas/admin/manage-ubicaciones/manage-ubicaciones.component';
import { authGuard } from './guards/auth.guard';
import { PerfilVeterinarioComponent } from './paginas/perfil-veterinario/perfil-veterinario.component'; // <-- 1. IMPORTA
import { ManageEspecialidadesComponent } from './paginas/admin/manage-especialidades/manage-especialidades.component'; // <-- 1. IMPORTA
import { PerfilVetComponent } from './paginas/perfil-vet/perfil-vet.component'; // <-- IMPORTA
import { ForgotPasswordComponent } from './paginas/forgot-password/forgot-password.component'; // <-- IMPORTA
import { ResetPasswordComponent } from './paginas/reset-password/reset-password.component'; // <-- IMPORTA

export const routes: Routes = [
  // RUTAS PÚBLICAS
  { path: '', component: DirectorioComponent }, // <-- 2. LA PÁGINA PRINCIPAL AHORA ES EL DIRECTORIO
  { path: 'login', component: LoginComponent },

  // RUTAS DE ADMINISTRACIÓN (PROTEGIDAS)
  { path: 'admin', component: HomeComponent, canActivate: [authGuard] }, // <-- 3. EL PANEL AHORA ESTÁ EN /admin
  { path: 'admin/ubicaciones', component: ManageUbicacionesComponent, canActivate: [authGuard] },

  { path: 'veterinario/:id', component: PerfilVeterinarioComponent }, // <-- 2. AÑADE LA RUTA DINÁMICA
  { path: 'admin/especialidades', component: ManageEspecialidadesComponent, canActivate: [authGuard] },

  { path: 'perfil', component: PerfilVetComponent, canActivate: [authGuard] }, // <-- AÑADE
  { path: 'forgot-password', component: ForgotPasswordComponent }, // <-- AÑADE
  { path: 'reset-password', component: ResetPasswordComponent } // <-- AÑADE
];

    import { Component, Inject, OnInit } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'; // Para modal
    import { MaterialModule } from '../../material/material.module';                  // Para componentes de Material
    import { VeterinarioService, Veterinario, Imagen } from '../../servicios/veterinario.service'; // Para datos
    import { AuthService } from '../../servicios/auth.service';             // Para permisos
    import { MatSnackBar } from '@angular/material/snack-bar';         // Para notificaciones
    import { Lightbox, LightboxConfig, IAlbum } from 'ngx-lightbox'; // Para galería
    import { LightboxModule } from 'ngx-lightbox';                  // Para importar módulo galería

    @Component({
    selector: 'app-vet-detail-modal',
    standalone: true,
    imports: [
        CommonModule,
        MaterialModule,
        LightboxModule // Módulo para la galería
        ],
    templateUrl: './vet-detail-modal.component.html',
    styleUrl: './vet-detail-modal.component.css'
    })
    export class VetDetailModalComponent implements OnInit {

    veterinario: Veterinario | null = null;
    imagenes: Imagen[] = []; // Lista separada para la galería
    lightboxImages: Array<IAlbum> = []; // Para ngx-lightbox
    isLoading = true;
    canManagePhotos = false; // Permiso para gestionar fotos

    constructor(
        public dialogRef: MatDialogRef<VetDetailModalComponent>,     // Para cerrar el modal
        @Inject(MAT_DIALOG_DATA) public data: { vetId: number }, // Para recibir el ID del vet
        private veterinarioService: VeterinarioService,           // Para buscar datos
        private authService: AuthService,                       // Para verificar permisos
        private snackBar: MatSnackBar,                          // Para mostrar notificaciones
        private _lightbox: Lightbox,                            // Para abrir galería
        private _lightboxConfig: LightboxConfig                 // Para configurar galería
    ) {
        // Configuración opcional del lightbox
        _lightboxConfig.fadeDuration = 0.2;
        _lightboxConfig.resizeDuration = 0.2;
        _lightboxConfig.wrapAround = true;
        _lightboxConfig.showImageNumberLabel = true;
    }

    ngOnInit(): void {
        if (this.data.vetId) {
        this.loadVetDetails();
        } else {
        this.isLoading = false;
        this.snackBar.open('Error: No se recibió ID de veterinario.', 'Cerrar', { duration: 5000 });
        }
    }

    /**
     * Carga los detalles completos del veterinario desde la API.
     */
    loadVetDetails(): void {
        this.isLoading = true;
        this.veterinarioService.getVeterinarioById(this.data.vetId).subscribe({
        next: (vetData) => {
            this.veterinario = vetData;
            this.imagenes = vetData.imagenes || [];
            this.prepareLightboxImages(); // Prepara imágenes para la galería
            this.checkPermissions();
            this.isLoading = false;
        },
        error: (err) => {
            console.error("Error al cargar detalles del veterinario:", err);
            this.snackBar.open('Error al cargar la información.', 'Cerrar', { duration: 5000 });
            this.isLoading = false;
            this.closeDialog();
        }
        });
    }

    /**
     * Verifica si el usuario actual (admin o dueño) puede añadir/borrar fotos.
     */
    checkPermissions(): void {
        const currentUserRole = this.authService.getUserRole();
        const currentUserId = this.authService.getUserId();

        if (currentUserRole === 'admin') {
        this.canManagePhotos = true;
        } else if (this.veterinario && currentUserId && currentUserId === this.veterinario.usuario_id) {
        this.canManagePhotos = true;
        } else {
        this.canManagePhotos = false;
        }
    }

    /** Prepara el array de imágenes para ngx-lightbox */
    prepareLightboxImages(): void {
        this.lightboxImages = this.imagenes.map((img, index) => ({
            src: img.imagen_url,
            caption: img.descripcion || `Imagen ${index + 1}`,
            thumb: img.imagen_url // O una URL de miniatura si Cloudinary la genera
        }));
    }

    /** Abre el lightbox en la imagen seleccionada */
    openLightbox(index: number): void {
        this._lightbox.open(this.lightboxImages, index);
    }


    /**
     * Maneja la selección de un archivo y llama al servicio para subirlo.
     */
    onFileSelected(event: any): void {
        const file = event.target.files?.[0];
        if (file && this.veterinario) {
        this.isLoading = true;
        this.veterinarioService.addImagenVet(this.veterinario.id, file).subscribe({
            next: (newImage) => {
            this.imagenes.unshift(newImage); // Añade al principio
            this.prepareLightboxImages(); // Actualiza el array del lightbox
            this.snackBar.open('Imagen subida con éxito', 'Cerrar', { duration: 3000 });
            this.isLoading = false;
            },
            error: (err) => {
            console.error("Error al subir imagen:", err);
            this.snackBar.open(err.error?.message || 'Error al subir la imagen', 'Cerrar', { duration: 5000, panelClass: ['error-snackbar'] });
            this.isLoading = false;
            }
        });
        }
        if (event.target) {
            event.target.value = null;
        }
    }

    /**
     * Llama al servicio para eliminar una imagen de la galería.
     */
    onDeleteImage(imageId: number): void {
        if (confirm('¿Estás seguro de eliminar esta imagen?')) {
        this.isLoading = true;
        this.veterinarioService.deleteImagenVet(imageId).subscribe({
            next: () => {
            this.imagenes = this.imagenes.filter(img => img.id !== imageId);
            this.prepareLightboxImages(); // Actualiza el array del lightbox
            this.snackBar.open('Imagen eliminada', 'Cerrar', { duration: 3000 });
            this.isLoading = false;
            },
            error: (err) => {
            console.error("Error al eliminar imagen:", err);
            this.snackBar.open(err.error?.message || 'Error al eliminar la imagen', 'Cerrar', { duration: 5000, panelClass: ['error-snackbar'] });
            this.isLoading = false;
            }
        });
        }
    }

    /**
     * Cierra el diálogo modal.
     */
    closeDialog(): void {
        this.dialogRef.close();
    }
    }
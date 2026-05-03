import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloudinaryService } from './cloudinary.service';

interface UploadedFile {
  url: string;
  publicId: string;
  thumbnail?: string;
}

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="uploader-container">
      <div class="upload-area" (dragover)="onDragOver($event)" (drop)="onDrop($event)">
        <input
          #fileInput
          type="file"
          accept="image/*"
          (change)="onFileSelected($event)"
          hidden
        />
        <button (click)="fileInput.click()" [disabled]="isUploading">
          {{ isUploading ? 'Subiendo...' : 'Seleccionar Imagen' }}
        </button>
        <p>o arrastra una imagen aquí</p>
      </div>

      <div *ngIf="uploadedFiles.length > 0" class="uploaded-files">
        <h4>Imágenes Subidas:</h4>
        <div class="file-list">
          <div *ngFor="let file of uploadedFiles" class="file-item">
            <img *ngIf="file.thumbnail" [src]="file.thumbnail" alt="Thumbnail" />
            <div class="file-actions">
              <a [href]="file.url" target="_blank">Ver</a>
              <button (click)="removeFile(file)">Eliminar</button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styles: [`
    .uploader-container {
      padding: 20px;
    }

    .upload-area {
      border: 2px dashed #ccc;
      border-radius: 8px;
      padding: 40px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        border-color: #667eea;
        background-color: #f8f9ff;
      }

      &.drag-over {
        border-color: #667eea;
        background-color: #f0f4ff;
      }

      button {
        background-color: #667eea;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;

        &:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        &:hover:not(:disabled) {
          background-color: #5568d3;
        }
      }

      p {
        margin: 10px 0 0 0;
        color: #999;
      }
    }

    .uploaded-files {
      margin-top: 30px;

      h4 {
        margin-bottom: 15px;
        color: #333;
      }

      .file-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 15px;
      }

      .file-item {
        border: 1px solid #eee;
        border-radius: 8px;
        overflow: hidden;
        transition: all 0.3s ease;

        &:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        img {
          width: 100%;
          height: 120px;
          object-fit: cover;
          display: block;
        }

        .file-actions {
          display: flex;
          gap: 5px;
          padding: 10px;
          background-color: #f5f5f5;

          a, button {
            flex: 1;
            padding: 5px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            text-align: center;
            text-decoration: none;
          }

          a {
            background-color: #4caf50;
            color: white;

            &:hover {
              background-color: #45a049;
            }
          }

          button {
            background-color: #f44336;
            color: white;

            &:hover {
              background-color: #da190b;
            }
          }
        }
      }
    }

    .error-message {
      margin-top: 15px;
      padding: 15px;
      background-color: #fee;
      color: #c33;
      border-radius: 4px;
      border: 1px solid #fcc;
    }
  `]
})
export class ImageUploaderComponent {
  @Input() type: 'producto' | 'categoria' | 'usuario' | 'otro' = 'otro';
  @Output() filesUploaded = new EventEmitter<UploadedFile[]>();

  uploadedFiles: UploadedFile[] = [];
  isUploading = false;
  errorMessage = '';
  isDragOver = false;

  constructor(private cloudinaryService: CloudinaryService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadFiles(Array.from(input.files));
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;

    if (event.dataTransfer && event.dataTransfer.files) {
      this.uploadFiles(Array.from(event.dataTransfer.files));
    }
  }

  uploadFiles(files: File[]): void {
    this.errorMessage = '';

    for (const file of files) {
      if (!this.cloudinaryService.isValidImage(file)) {
        this.errorMessage = `Archivo inválido: ${file.name}. Solo se permiten imágenes menores a 10MB.`;
        continue;
      }

      this.isUploading = true;

      // Recomendado: Subir via backend
      this.cloudinaryService
        .uploadImageViaBackend(file, this.type)
        .subscribe({
          next: (response: any) => {
            this.uploadedFiles.push({
              url: response.data.url,
              publicId: response.data.publicId,
              thumbnail: response.data.thumbnail,
            });
            this.filesUploaded.emit(this.uploadedFiles);
            this.isUploading = false;
          },
          error: (error: any) => {
            console.error('Error uploading file:', error);
            this.errorMessage = 'Error al subir la imagen. Intenta de nuevo.';
            this.isUploading = false;
          },
        });
    }
  }

  removeFile(file: UploadedFile): void {
    this.isUploading = true;

    this.cloudinaryService.deleteFile(file.publicId).subscribe({
      next: () => {
        this.uploadedFiles = this.uploadedFiles.filter(
          (f) => f.publicId !== file.publicId,
        );
        this.filesUploaded.emit(this.uploadedFiles);
        this.isUploading = false;
      },
      error: (error: any) => {
        console.error('Error deleting file:', error);
        this.errorMessage = 'Error al eliminar la imagen.';
        this.isUploading = false;
      },
    });
  }
}

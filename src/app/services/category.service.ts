import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Categoria } from '../types/database.types';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/categorias`;

  readonly categorias = signal<Categoria[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  async loadAll(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const data = await firstValueFrom(
        this.http.get<Categoria[]>(this.base, { params: { activa: 'true' } }),
      );
      this.categorias.set(data ?? []);
    } catch (err) {
      this.error.set('No se pudieron cargar las categorías.');
      console.error('[CategoryService]', err);
    } finally {
      this.loading.set(false);
    }
  }

  async getById(id: number): Promise<Categoria> {
    return firstValueFrom(this.http.get<Categoria>(`${this.base}/${id}`));
  }
}

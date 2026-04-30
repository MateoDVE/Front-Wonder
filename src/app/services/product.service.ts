import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Producto } from '../types/database.types';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/productos`;

  readonly productos = signal<Producto[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  async loadAll(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const data = await firstValueFrom(
        this.http.get<Producto[]>(this.base, { params: { activo: 'true' } }),
      );
      this.productos.set(data ?? []);
    } catch (err) {
      this.error.set('No se pudieron cargar los productos.');
      console.error('[ProductService]', err);
    } finally {
      this.loading.set(false);
    }
  }

  filterByTerm(term: string): Producto[] {
    const t = term.toLowerCase().trim();
    if (!t) return this.productos();
    return this.productos().filter(
      p =>
        p.nombre.toLowerCase().includes(t) ||
        (p.marca ?? '').toLowerCase().includes(t) ||
        (p.tipo_bebida ?? '').toLowerCase().includes(t) ||
        (p.categoria?.nombre ?? '').toLowerCase().includes(t),
    );
  }

  getCategorias(): string[] {
    const nombres = this.productos()
      .map(p => p.categoria?.nombre ?? p.tipo_bebida ?? '')
      .filter(Boolean);
    return [...new Set(nombres)];
  }
}

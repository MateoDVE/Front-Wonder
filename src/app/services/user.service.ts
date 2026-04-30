import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly STORAGE_KEY = 'wonder_user_id';

  readonly userId = signal<number | null>(null);

  constructor() {
    this.initUser();
  }

  private async initUser(): Promise<void> {
    if (typeof localStorage === 'undefined') return;

    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const storedId = parseInt(stored, 10);
      // Verificar que el ID sigue existiendo en la BD
      const existe = await this.verificarUsuario(storedId);
      if (existe) {
        this.userId.set(storedId);
        return;
      }
      localStorage.removeItem(this.STORAGE_KEY);
    }

    await this.createGuestUser();
  }

  private async verificarUsuario(id: number): Promise<boolean> {
    try {
      const res = await fetch(`${environment.apiUrl}/usuarios/${id}/existe`);
      const data = await res.json();
      return data.existe === true;
    } catch {
      return false;
    }
  }

  private async createGuestUser(): Promise<void> {
    if (typeof localStorage === 'undefined') return;
    try {
      const res = await fetch(`${environment.apiUrl}/usuarios/invitado`, {
        method: 'POST',
      });
      const data = await res.json();
      localStorage.setItem(this.STORAGE_KEY, data.id.toString());
      this.userId.set(data.id);
    } catch (err) {
      console.error('[UserService] No se pudo crear usuario invitado:', err);
    }
  }

  setUserId(id: number): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, id.toString());
    }
    this.userId.set(id);
  }

  clearUser(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
    this.userId.set(null);
    this.createGuestUser();
  }
}

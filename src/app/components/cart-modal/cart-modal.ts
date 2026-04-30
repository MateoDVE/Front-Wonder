import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { CheckoutService, CheckoutRequest } from '../../services/checkout.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.html',
  styleUrl: './cart-modal.scss',
  imports: [CurrencyPipe],
})
export class CartModalComponent {
  readonly cart = inject(CartService);
  private readonly checkoutService = inject(CheckoutService);
  private readonly userService = inject(UserService);

  readonly isCheckingOut = signal(false);
  readonly checkoutError = signal<string | null>(null);

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.cart.close();
    }
  }

  async onUpdateQuantity(itemId: number, cantidad: number): Promise<void> {
    await this.cart.updateQuantity(itemId, cantidad);
  }

  async onRemoveItem(itemId: number): Promise<void> {
    await this.cart.removeItem(itemId);
  }

  async onCheckout(): Promise<void> {
    const userId = this.userService.userId();
    if (!userId || this.cart.items().length === 0) return;

    this.isCheckingOut.set(true);
    this.checkoutError.set(null);

    try {
      const request: CheckoutRequest = {
        usuarioId: userId,
        total: this.cart.total(),
        items: this.cart.items().map(item => ({
          productoId: item.producto_id,
          cantidad: item.cantidad,
          precio: item.precio,
        })),
      };

      const response = await this.checkoutService.createOrder(request);

      // Vaciar carrito y cerrar modal
      await this.cart.clearCart();
      this.cart.close();

      // Mostrar mensaje de éxito
      alert(`Pedido #${response.id} creado exitosamente!`);
    } catch (err) {
      this.checkoutError.set('Error al procesar el pedido. Intenta de nuevo.');
      console.error('[CartModal] Checkout error:', err);
    } finally {
      this.isCheckingOut.set(false);
    }
  }
}

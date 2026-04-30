import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Producto } from '../../types/database.types';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
  imports: [CurrencyPipe],
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Producto;
  @Output() addToCart = new EventEmitter<Producto>();

  imgError = false;

  get categoryLabel(): string {
    return this.product.categoria?.nombre ?? this.product.tipo_bebida ?? 'Licor';
  }

  get inStock(): boolean {
    return this.product.stock > 0;
  }

  onImgError(): void {
    this.imgError = true;
  }

  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }
}

import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { CartModalComponent } from './components/cart-modal/cart-modal';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, CartModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly cart = inject(CartService);
}

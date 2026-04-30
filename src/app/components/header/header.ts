import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
  imports: [],
})
export class HeaderComponent {
  readonly cart = inject(CartService);
  readonly theme = inject(ThemeService);
}

import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { Producto } from '../../types/database.types';
import { ProductCardComponent } from '../../components/product-card/product-card';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss',
  imports: [ProductCardComponent],
})
export class CatalogPage implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly cartService = inject(CartService);

  readonly loading = computed(() =>
    this.productService.loading() || this.categoryService.loading(),
  );
  readonly error = computed(() => this.productService.error() || this.categoryService.error());
  readonly productos = this.productService.productos;
  readonly categorias = this.categoryService.categorias;
  readonly categoriasNames = computed(() =>
    this.categorias().map(cat => cat.nombre),
  );


  readonly searchTerm = signal('');
  readonly activeCategory = signal('');
  readonly addingToCart = signal(false);

  readonly filteredProducts = computed(() => {
    let list = this.productService.filterByTerm(this.searchTerm());
    const cat = this.activeCategory();
    if (cat) {
      list = list.filter(p => p.categoria_id?.toString() === cat || p.categoria?.nombre === cat);
    }
    return list;
  });

  ngOnInit(): void {
    this.productService.loadAll();
    this.categoryService.loadAll();
  }

  onSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  onCategoryToggle(cat: string): void {
    this.activeCategory.update(c => (c === cat ? '' : cat));
  }

  async onAddToCart(producto: Producto): Promise<void> {
    this.addingToCart.set(true);
    try {
      await this.cartService.addItem(producto);
    } catch (err) {
      console.error('Error al agregar al carrito:', err);
    } finally {
      this.addingToCart.set(false);
    }
  }
}

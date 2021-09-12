import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Product } from '../product.model';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  private productsSub!: Subscription;
  isLoading = false;

  constructor(public productsService: ProductsService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.productsService.getProducts();
    this.productsSub = this.productsService
      .getProductUpdateListener()
      .subscribe((products: Product[]) => {
        this.isLoading = false;
        this.products = products;
      });
  }

  onDelete(productId: any) {
    this.productsService.deleteProduct(productId);
  }

  ngOnDestroy() {
    this.productsSub.unsubscribe();
  }
}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Product } from './product.model';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private apiUrl = 'https://still-garden-90747.herokuapp.com/api/products';

  private products: Product[] = [];
  private productsUpdated = new Subject<Product[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getProducts() {
    this.http.get<Product[]>(this.apiUrl).subscribe((data) => {
      this.products = data;
      this.productsUpdated.next([...this.products]);
    });
  }

  getProductUpdateListener() {
    return this.productsUpdated.asObservable();
  }

  getProduct(id: string) {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  addProduct(name: string, description: string, price: string) {
    const product: Product = {
      name: name,
      description: description,
      price: price,
    };
    this.http
      .post<{ id: string }>(this.apiUrl, product, httpOptions)
      .subscribe((data) => {
        const productId = data.id;
        product.id = productId;
        this.products.push(product);
        this.productsUpdated.next([...this.products]);
        this.router.navigate(['/']);
      });
  }

  updateProduct(id: string, name: string, description: string, price: string) {
    const product: Product = {
      id: id,
      name: name,
      description: description,
      price: price,
    };
    this.http
      .put(`${this.apiUrl}/${id}`, product, httpOptions)
      .subscribe(() => {
        const updatedProducts = [...this.products];
        const oldProductIndex = updatedProducts.findIndex(
          (p) => p.id === product.id
        );
        updatedProducts[oldProductIndex] = product;
        this.products = updatedProducts;
        this.productsUpdated.next([...this.products]);
        this.router.navigate(['/']);
      });
  }

  deleteProduct(productId: string) {
    this.http.delete(`${this.apiUrl}/${productId}`).subscribe(() => {
      const updatedProducts = this.products.filter(
        (product) => product.id !== productId
      );
      this.products = updatedProducts;
      this.productsUpdated.next([...this.products]);
    });
  }
}

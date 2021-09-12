import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Product } from '../product.model';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
})
export class CreateProductComponent implements OnInit {
  private mode = 'create';
  private id: any;
  product!: Product;
  isLoading = false;
  form!: FormGroup;

  constructor(
    public productsService: ProductsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, { validators: Validators.required }),
      description: new FormControl(null, { validators: Validators.required }),
      price: new FormControl(null, { validators: [Validators.required] }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.id = paramMap.get('id');
        this.isLoading = true;
        this.productsService.getProduct(this.id).subscribe((data) => {
          this.isLoading = false;
          this.product = {
            id: data.id,
            name: data.name,
            description: data.description,
            price: data.price,
          };
          this.form.setValue({
            name: this.product.name,
            description: this.product.description,
            price: this.product.price,
          });
        });
      } else {
        this.mode = 'create';
        this.id = null;
      }
    });
  }

  onSaveProduct() {
    if (this.form.invalid) {
      alert('Please enter all fields.');
      return;
    }

    if (this.form.value.price.includes(',')) {
      alert('Invalid decimal format.');
      return;
    }

    if (parseInt(this.form.value.price) > 999) {
      alert('Please enter correct value.');
      return;
    }

    this.isLoading = true;
    if (this.mode === 'create') {
      this.productsService.addProduct(
        this.form.value.name,
        this.form.value.description,
        this.form.value.price
      );
    } else {
      this.productsService.updateProduct(
        this.id,
        this.form.value.name,
        this.form.value.description,
        this.form.value.price
      );
    }
    this.form.reset();
  }
}

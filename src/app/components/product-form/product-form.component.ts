import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  product!: any;
  productForm!: FormGroup;
  isEdit: boolean = false;
  selectedFileName!: String;
  productCategories: ProductCategory[] = [];
  selectedCategory?: ProductCategory;
  isLoading: boolean = false;
  productId!: number;
  buttonText!: string;
  successMessage!: string;
  errorMessage!: string;

  constructor(private formBuilder: FormBuilder, private productService: ProductService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      sku: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      unitPrice: ['', [Validators.required, Validators.pattern(/^\d*\.?\d*$/)]],
      unitsInStock: ['', [Validators.required, Validators.pattern(/^\d*\.?\d*$/)]],
      image: ['', Validators.required],
      category: ['', Validators.required]
    });

    this.productService.getProductCategories().subscribe(
      data =>{
        this.productCategories = data;
      }
    );

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.productId = +params['id'];
        this.buttonText = "Update";
        this.getProductDetails(this.productId);
        this.getProductCategory(this.productId);
      } else {
        this.isEdit = false;
        this.buttonText = "Add";
      }
    });

    if (this.isEdit) {
      this.productForm.get('image')?.clearValidators();
    }

  }

  get sku() { return this.productForm.get('sku'); }
  get name() { return this.productForm.get('name'); }
  get description() { return this.productForm.get('description'); }
  get unitPrice() { return this.productForm.get('unitPrice'); }
  get unitsInStock() { return this.productForm.get('unitsInStock'); }
  get image() { return this.productForm.get('image'); }
  get category() { return this.productForm.get('category'); }

  getProductDetails(id: number) {
    this.productService.getProduct(id).subscribe(
      data => {
        this.product = data;
        this.productForm.patchValue({
          sku: this.product.sku,
          name: this.product.name,
          description: this.product.description,
          unitPrice: this.product.unitPrice,
          unitsInStock: this.product.unitsInStock,
        })
      }
    )
  }

  getProductCategory(id: number) {
    this.productService.getCategoryForProduct(id).subscribe(
      data => {
        this.selectedCategory = data;
        this.productForm.patchValue({
          category: this.selectedCategory
        })
      }
    )
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name
    }
  }
 
  onSubmit() {
    this.product = {
      category: "/api/product-category/" + this.selectedCategory?.id,
      sku: this.sku?.value,
      name: this.name?.value,
      description: this.description?.value,
      unitPrice: Number(this.unitPrice?.value),
      active: true,
      unitsInStock: Number(this.unitsInStock?.value),
      dateCreated: null,
      lastUpdated: null
    }
    this.isLoading = true;

    if (this.image) {
      this.product.imageUrl = 'assets/images/products/' + this.selectedCategory?.categoryName.trim().toLowerCase() + "/" + this.selectedFileName;
    }

    if (this.isEdit) {
      this.product.lastUpdated = new Date();

      this.productService.updateProduct(this.product, this.productId).subscribe(
        data => {
          this.successMessage = "Product updated succesfully";
          this.isLoading = false;
          console.log(this.successMessage)
        },
        err => {
          this.errorMessage = "Failed to update product. Please try again"
          this.isLoading = false;
          console.log(this.errorMessage)
        }
      )

    } else {
      this.product.dateCreated = new Date();
      
      this.productService.postProduct(this.product).subscribe(
        data => {
          this.successMessage = "Product added succesfully";
          this.isLoading = false;
          this.productForm.reset();
          console.log(this.successMessage)
        },
        err => {
          this.errorMessage = "Failed to add product. Please try again"
          this.isLoading = false;
          console.log(this.errorMessage)
        }
      )
    }
  }

  compareCategoryObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id === object2.id;
  }

  onCategoryChange() {
    this.selectedCategory = this.category?.value
  }
}

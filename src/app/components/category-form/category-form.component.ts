import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {

  categoryForm!: FormGroup;
  isEdit!: boolean;
  categoryId!: any;
  successMessage!: string;
  errorMessage!: string;
  buttonText!: string;
  isLoading: boolean = false

  constructor(private formBuilder: FormBuilder, private productService: ProductService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required]
    })
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.categoryId = +params['id'];
        this.buttonText = "Update";
        this.getProductCategoryDetails(this.categoryId);
      } else {
        this.isEdit = false;
        this.buttonText = "Add";
        this.categoryId = null;
      }
    });
  }

  get name() { return this.categoryForm.get('name'); }

  getProductCategoryDetails(id:any) {
    this.productService.getProductCategory(id).subscribe(
      data => {
        this.categoryForm.patchValue({
          name: data.categoryName
        })
      },
      err => {
        console.log("An error occurred")
      }
    )
  }

  onSubmit() {
    const category = {
      categoryName: this.name?.value
    };
    this.successMessage = "";
    this.errorMessage = "";

    this.isLoading = true;
    if (this.isEdit) {
      this.productService.updateCategory(category, this.categoryId).subscribe(
        data => {
          this.successMessage = "Category updated succesfully";
          this.isLoading = false;
          console.log(this.successMessage);
        },
        err => {
          this.errorMessage = "Failed to update category. Please try again"
          this.isLoading = false;
          console.log(this.errorMessage);
        }
      )
    }
    else {
      this.productService.postCategory(category).subscribe(
        data => {
          this.successMessage = "Category added succesfully";
          this.isLoading = false;
          this.categoryForm.reset();
          console.log(this.successMessage);
        },
        err => {
          this.errorMessage = "Failed to add category. Please try again"
          this.isLoading = false;
          console.log(this.errorMessage);
        }
      )
    }
  }
}

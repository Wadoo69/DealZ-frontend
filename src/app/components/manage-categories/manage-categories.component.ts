import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-manage-categories',
  templateUrl: './manage-categories.component.html',
  styleUrls: ['./manage-categories.component.css']
})
export class ManageCategoriesComponent implements OnInit {

  productCategories: ProductCategory[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.listProductCategories();
  }
  listProductCategories() {
    this.productService.getProductCategories().subscribe(
      data =>{
        console.log('Product Categories=' +JSON.stringify(data));
        this.productCategories = data;
      }
    );
  }

  deleteCategory(id: number) {
    const result = window.confirm("This will delete all products in category. Are you sure you want to delete category?");
    if (result) {
      this.productService.deleteCategory(id).subscribe(
        data => {
          this.productCategories = this.productCategories.filter(category => category.id !== id);
          alert("Category deleted successfully")
          console.log("Category deleted successfully");
        },
        err => {
          alert("Error deleteing category")
        }
      )
    }
  }

}

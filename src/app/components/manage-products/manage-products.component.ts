import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.css']
})
export class ManageProductsComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  productCategories: ProductCategory[] = []

  //new proprieties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 12;
  theTotalElements: number = 0;

  previousKeyword: string = "";
  router: any;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.listProducts();
    
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

  onCategoryChange(event: any) {
    this.currentCategoryId = event.target.value;
    this.listProducts();
  }

  listProducts(){
    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    // now get the products for the given category id
    this.productService.getProductListPaginate(this.thePageNumber - 1,
                                               this.thePageSize,
                                               this.currentCategoryId)
                                               .subscribe(this.processResult());
  }
  updatePageSize(pageSize: string){
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  processResult(){
    return (data: any) => {
      this.products = data._embedded.products;
      console.log(this.products)
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

  deleteProduct(id: number) {
    const result = window.confirm("Are you sure you want to delete product?");
    if (result) {
      this.productService.deleteProduct(id).subscribe(
        data => {
          this.products = this.products.filter(product => product.id !== id);
          alert("Product deleted successfully")
          console.log("Product deleted successfully");
        },
        err => {
          alert("Error deleteing product")
        }
      )
    }
  }

}

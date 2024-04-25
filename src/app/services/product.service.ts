import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) { }

  getProduct(theProductId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);
  }
  getProductListPaginate(thePage: number, 
                         thePageSize: number, 
                         theCategoryId: number): Observable<GetResponseProducts> {

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                    + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }
  getProductList(theCategoryId: number): Observable<Product[]> {

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.getProducts(searchUrl);
  }
  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }
  getProductCategory(categoryId: number): Observable<ProductCategory> {
    const url = `${this.categoryUrl}/${categoryId}`;
    return this.httpClient.get<ProductCategory>(url)
  }
  postCategory(category: any): Observable<ProductCategory> {
    return this.httpClient.post<ProductCategory>(this.categoryUrl, category);
  }
  updateCategory(category: any, id: any): Observable<ProductCategory> {
    const url = `${this.categoryUrl}/${id}`;
    return this.httpClient.put<ProductCategory>(url, category);
  }
  deleteCategory(id: number) {
    const url = `${this.categoryUrl}/${id}`;
    return this.httpClient.delete<ProductCategory>(url);
  }
  searchProducts(theKeyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
    return this.getProducts(searchUrl);
  }
  getCategoryForProduct(productId: number): Observable<ProductCategory> {
    const url = `${this.baseUrl}/${productId}/category`;
    return this.httpClient.get<ProductCategory>(url);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
  searchProductsPaginate(thePage: number, 
                            thePageSize: number, 
                            theKeyword: string): Observable<GetResponseProducts> {

const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
                + `&page=${thePage}&size=${thePageSize}`;
return this.httpClient.get<GetResponseProducts>(searchUrl);
}

postProduct(product: Product): Observable<Product> {
  return this.httpClient.post<Product>(this.baseUrl, product)
}
updateProduct(product:Product, id: number): Observable<Product> {
  const url = `${this.baseUrl}/${id}`;
  return this.httpClient.put<Product>(url, product);
}
deleteProduct(id: number): Observable<Product> {
  const url = `${this.baseUrl}/${id}`;
  return this.httpClient.delete<Product>(url);
}
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  }
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}
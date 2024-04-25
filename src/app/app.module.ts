import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product.service';
import {Routes, RouterModule, Router} from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component'
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminOptionsComponent } from './components/admin-options/admin-options.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { ManageProductsComponent } from './components/manage-products/manage-products.component';
import { ManageCategoriesComponent } from './components/manage-categories/manage-categories.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';
import { OktaAuthOptions } from '@okta/okta-auth-js';

import {
  OktaAuthModule,
  OktaCallbackComponent,
  OKTA_CONFIG,
  OktaAuthGuard
} from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

import { MyAppConfig } from './config/my-app-config';
import { LoginComponent } from './components/login/login.component';
import { MembersPageComponent } from './components/members-page/members-page.component';

const oktaConfig: OktaAuthOptions = {
  clientId: '0oagcdq9h6n2MFysG5d7',
  issuer: 'https://dev-47514590.okta.com/oauth2/default',
  redirectUri: 'http://localhost:4200/login/callback',
  scopes: ['openid', 'profile', 'email']
};

const oktaAuth = new OktaAuth(oktaConfig);

function sendToLoginPage(oktaAuth:OktaAuth, injector: Injector){
 const router = injector.get(Router);
 router.navigate(['/login']);
}

const routes: Routes = [
 {path: 'signup', redirectTo: 'https://okta-dev-47514590.okta.com/oauth2/default/v1/authorize?client_id=0oagcdq9h6n2MFysG5d7&response_type=code&scope=openid profile email&redirect_uri=http://localhost:4200/login/callback&state=STATE&nonce=NONCE&response_mode=query' },
 {path: 'members', component: MembersPageComponent, canActivate: [OktaAuthGuard],
                   data: {onAuthRequired: sendToLoginPage}},
 {path: 'login/callback', component: OktaCallbackComponent},
 {path: 'login', component: LoginComponent},
 {path: 'products/:id', component: ProductDetailsComponent},
 {path: 'search/:keyword', component: ProductListComponent},
 {path: 'checkout', component: CheckoutComponent},
 {path: 'category/:id', component: ProductListComponent},
 {path: 'category', component: ProductListComponent},
 {path: 'products', component: ProductListComponent},
 {path: 'cart-details', component: CartDetailsComponent},
 {path: 'manage-products', component: ManageProductsComponent},
 {path: 'add-product', component: ProductFormComponent},
 {path: 'edit-product/:id', component: ProductFormComponent},
 {path: 'manage-categories', component: ManageCategoriesComponent},
 {path: 'add-category', component: CategoryFormComponent},
 {path: 'edit-category/:id', component: CategoryFormComponent},
 {path: '', redirectTo: '/products', pathMatch: 'full'},
 {path: '**', redirectTo: '/products', pathMatch: 'full'}
];
@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    AdminOptionsComponent,
    ProductFormComponent,
    CategoryFormComponent,
    ManageProductsComponent,
    ManageCategoriesComponent,
    LoginStatusComponent,
    MembersPageComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    OktaAuthModule
  ],
  providers: [ProductService, {provide: OKTA_CONFIG, useValue: {oktaAuth}}],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { DealZFormService } from 'src/app/services/deal-zform.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;
  
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  showBillingAddress: boolean = true;
  
  constructor(private formBuilder: FormBuilder,
              private dealzFormService: DealZFormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router) { }

  ngOnInit(): void {

    this.reviewCartDetails();


    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        phoneNumber: ['', [Validators.required, Validators.pattern('^\\+[1-9]{1}[0-9]{3,14}$')]]
      }),
      shippingAddress: this.formBuilder.group({
        street: ['', Validators.required],
        state: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        zipCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]]
      }),
      billingAddress: this.formBuilder.group({
        street: ['', Validators.required],
        state: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        zipCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]]
      }),
      creditCard: this.formBuilder.group({
        cardType: ['', Validators.required],
        nameOnCard: ['', Validators.required],
        cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
        securityCode: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
        expirationMonth: ['', Validators.required],
        expirationYear: ['', Validators.required]
      }),
    });

    // Fetch countries
    this.dealzFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries:" + JSON.stringify(data));
        this.countries = data;
      }
    );

    // Fetch credit card months
    const startMonth: number = new Date().getMonth(); 
    this.dealzFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    );

    // Fetch credit card years
    this.dealzFormService.getCreditCardYears().subscribe(
      data => {
        this.creditCardYears = data;
      }
    );
  }
  reviewCartDetails() {
    // Subscribe to cartService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );
    // Subscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
  }

  onSubmit() {
    console.log("Handling the submit button");
    
    if (this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    //set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;
    // get cart items
    const cartItems = this.cartService.cartItems;
    // create orderItems from cartItems
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));
    // set up purchase
    let purchase = new Purchase();
    // populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;
    // populate purchase - shipping address 
    if (purchase.shippingAddress) {
      const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
      const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
      purchase.shippingAddress.state = shippingState.name;
      purchase.shippingAddress.country = shippingCountry.name;
    }
    // populate purchase - billing address
    if (purchase.billingAddress) {
      const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
      const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
      purchase.billingAddress.state = billingState.name;
      purchase.billingAddress.country = billingCountry.name;
    }
    // populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;
    // call REST API via the CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response => {
          alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);
          // reset cart
          this.resetCart();
        },
        error: err => {
          alert(`There was an error: ${err.message}`);
        }
      }
    )
  }
  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    // reset the form
    this.checkoutFormGroup.reset();
    // navigate back to the products page
    this.router.navigateByUrl("/products");
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }
  get phoneNumber() { return this.checkoutFormGroup.get('customer.phoneNumber'); }

  get sStreet() { return this.checkoutFormGroup.get('shippingAddress.street')}
  get sState() { return this.checkoutFormGroup.get('shippingAddress.state')}
  get sCity() { return this.checkoutFormGroup.get('shippingAddress.city')}
  get sCountry() { return this.checkoutFormGroup.get('shippingAddress.country')}
  get sZip() { return this.checkoutFormGroup.get('shippingAddress.zipCode')}

  get bStreet() { return this.checkoutFormGroup.get('billingAddress.street')}
  get bState() { return this.checkoutFormGroup.get('billingAddress.state')}
  get bCity() { return this.checkoutFormGroup.get('billingAddress.city')}
  get bCountry() { return this.checkoutFormGroup.get('billingAddress.country')}
  get bZip() { return this.checkoutFormGroup.get('billingAddress.zipCode')}
  
  get cardType() { return this.checkoutFormGroup.get('creditCard.cardType')}
  get nameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard')}
  get cardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber')}
  get securityCode() { return this.checkoutFormGroup.get('creditCard.securityCode')}
  get expirationMonth() { return this.checkoutFormGroup.get('creditCard.expirationMonth')}
  get expirationYear() { return this.checkoutFormGroup.get('creditCard.expirationYear')}

  copyShippingAddressToBillingAddress(event: any) {
    const shippingAddress = this.checkoutFormGroup.get('shippingAddress');
    const billingAddress = this.checkoutFormGroup.get('billingAddress');
  
    if (event.target.checked && shippingAddress && billingAddress) {
      const shippingAddressValue = shippingAddress.value;
      billingAddress.setValue(shippingAddressValue);
      billingAddress.get('state')?.setValue(shippingAddressValue.state);
      this.billingAddressStates = this.shippingAddressStates;
      this.showBillingAddress = false;
    } else {
      billingAddress?.reset();
      this.billingAddressStates = [];
      this.showBillingAddress = true;
    }
  }

  handleMonthsAndYears() {
    const creditCardFormgGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear:number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormgGroup?.value.expirationYear);

    let startMonth: number;

    if(currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1;
    }
    else{
      startMonth = 1;
    }

    this.dealzFormService.getCreditCardMonths(startMonth).subscribe(
      data =>{
        console.log("Retrieved credit card months:" + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`{formGroupName} country code: ${countryCode}`);
    console.log(`{formGroupName} country name: ${countryName}`);

    this.dealzFormService.getStates(countryCode).subscribe(
      data => {
        if(formGroupName === 'shippingAddress'){
          this.shippingAddressStates = data;
        }
        else{
          this.billingAddressStates = data;
        }
      }
    );
  }
}

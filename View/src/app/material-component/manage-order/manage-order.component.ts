import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BillService } from 'src/app/services/bill.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit {
  displayedColumns: string[] = ['name', 'category', 'price', 'quantity', 'total', 'edit'];
  dataSource: any = [];
  manageOrderForm: any = FormGroup;
  categories: any = [];
  products: any = [];
  price: any;
  totalAmount: number = 0;
  responseMessage: any;

  constructor(private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private snackbarService: SnackbarService,
    private billService: BillService) { }

  ngOnInit(): void {
    this.getCategories();
    this.manageOrderForm = this.formBuilder.group({
      name: [null, [Validators.required], [Validators.pattern(GlobalConstants.nameRegEx)]],
      email: [null, [Validators.required], [Validators.pattern(GlobalConstants.emailRegEx)]],
      contact_number: [null, [Validators.required], [Validators.pattern(GlobalConstants.contact_numberRegEx)]],
      paymentMethod: [null, [Validators.required]],
      product: [null, [Validators.required]],
      category: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      price: [null, [Validators.required]],
      total: [0, [Validators.required]],
    })
  }

  getCategories() {
    this.categoryService.getCategories().subscribe((response: any) => {
      this.categories = response;
    }, (error: any) => {
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error);
    });
  }

  getProductsBycategory(value: any) {
    this.productService.getProductsByCategoryId(value.id).subscribe((response: any) => {
      this.products = response;
      this.manageOrderForm.controls['price'].setValue('');
      this.manageOrderForm.controls['quantity'].setValue('');
      this.manageOrderForm.controls['total'].setValue(0);

    }, (error: any) => {
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error);
    });
  }

  getProductDetails(value: any) {
    this.productService.getById(value.id).subscribe((response: any) => {
      this.price = response.price;
      this.manageOrderForm.controls['price'].setValue(response.price);
      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(this.price);
    }, (error: any) => {
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error);
    })
  }

  setQuantity(value: any) {
    var temp = this.manageOrderForm.controls['quantity'].value;
    if (temp > 0) {
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value + this.manageOrderForm.controls['price'].value);
    }
    else if (temp != '') {
      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value + this.manageOrderForm.controls['price'].value);

    }
  }

  validateProductAddButton() {
    if (this.manageOrderForm.controls['total'].value === 0 || this.manageOrderForm.controls['total'].value === null || this.manageOrderForm.control['quantity'].value <= 0) {
      return true;
    }
    else {
      return false;
    }
  }

  validateSubmit() {
    if (this.totalAmount === 0 || this.manageOrderForm.controls['name'].value === null || this.manageOrderForm.controls['email'].value === null || this.manageOrderForm.controls['contact_number'].value === null || this.manageOrderForm.controls['paymentMethod'].value === null || !(this.manageOrderForm.controls['contact_number'].valid) || !(this.manageOrderForm.controls['email'].valid)) {
      return true;
    }
    else {
      return false;
    }
  }

  add() {
    var formData = this.manageOrderForm.value;
    var productName = this.dataSource.find((e: { id: number; }) => e.id == formData.product.id);
    if (productName === undefined) {
      this.totalAmount = this.totalAmount + formData.total;
      this.dataSource.push({ id: formData.product.id, name: formData.product.name, category: formData.category.name, quantity: formData.quantity, price: formData.price, total: formData.total });
      this.dataSource = [...this.dataSource];
      this.snackbarService.openSnackbar(GlobalConstants.productAdded,"success");
    }
    else {
      this.snackbarService.openSnackbar(GlobalConstants.productExistError, GlobalConstants.error);
    }
  }

  handleDeleteAction(value:any,element:any){
    this.totalAmount = this.totalAmount - element.total;
    this.dataSource.splice(value,1);
    this.dataSource = [...this.dataSource];
  }

  submitAction(){
    var formData = this.manageOrderForm.value;
    var data = {
      name:formData.name,
      email:formData.email,
      contact_number:formData.contact_number,
      paymentMethod:formData.paymentMethod,
      totalAmount:this.totalAmount,
      productDetails: JSON.stringify(this.dataSource)
    }
    this.billService.generateReport(data).subscribe((response:any)=>{
      this.downloadFile(response?.uuid);
      this.manageOrderForm.reset();
      this.dataSource = [];
      this.totalAmount = 0;
    },(error:any)=>{
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error);
    })
  }

  downloadFile(fileName:any){
    var data ={
      uuid:fileName
    }
    this.billService.getPdf(data).subscribe((response:any)=>{
      saveAs(response,fileName+'.pdf');
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm:any = FormGroup;
  responseMessage:any;

  constructor(private formBuilder: FormBuilder,
    private router:Router,
    private userServic:UserService,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<SignupComponent>) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name:[null,[Validators.required,Validators.pattern(GlobalConstants.nameRegEx)]],
      email:[null,[Validators.required,Validators.pattern(GlobalConstants.emailRegEx)]],
      contact_number:[null,[Validators.required,Validators.pattern(GlobalConstants.contact_numberRegEx)]],
      password:[null,[Validators.required]]
    });
  }

  handleSubmit(){
    var formData = this.signupForm.value;
    var data = {
      name: formData.name,
      email: formData.email,
      contact_number: formData.contact_number,
      password: formData.password
    }
    this.userServic.signup(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackbar(this.responseMessage,"");
      this.router.navigate(['/']);
    },(error) =>{
      // this.ngxService.stop();
      if(error.error?.message)
      {
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error);
    });

  }

}

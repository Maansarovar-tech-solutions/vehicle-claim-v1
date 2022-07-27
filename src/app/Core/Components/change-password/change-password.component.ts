import { AddVehicleService } from './../../../Modules/add-vehicle/add-vehicle.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/Auth/auth.service';
import * as Mydatas from '../../../../assets/app-config.json';
import * as CryptoJS from 'crypto-js';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import {ToastrService} from 'ngx-toastr'
import { Toaster } from 'ngx-toast-notifications';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;
  public CryKey: any = this.AppConfig.CryKey;

  public loginForm!: FormGroup;
  public insuranceCompany:any[]=[];
  public insuranceId:any='';

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    public authService:AuthService,
    private router:Router,
    private addVehicleService:AddVehicleService,
    private toaster: Toaster
  ) {
    

   }

  ngOnInit(): void {
    this.onCreateFormControl();
    //this.onGetInsuranceTypList();
    let userName = sessionStorage.getItem('userName');
    if(userName){
      this.f.username.setValue(userName);
    }

  }

  onCreateFormControl() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      InsuranceId:[''],
    });
  }


  get f() { return this.loginForm.controls; };

  onGetInsuranceTypList() {
    let UrlLink = `${this.ApiUrl1}basicauth/insurancecompanies`
    this.addVehicleService.onGetMethodSyncBasicToken(UrlLink).subscribe(
      (data: any) => {
        console.log(data);
        this.insuranceCompany=data?.Result;
      },
      (err) => { }
    );
  }



  onSubmit() {
    if(this.loginForm.valid){
      let newPass = this.f.newPassword.value, confirmPassword = this.f.confirmPassword.value;
      if(newPass == confirmPassword){
          let UrlLink = `${this.ApiUrl1}basicauth/changepassword`;
          let ReqObj = {
            "NewPassword": this.f.newPassword.value,
            "OldPassword": this.f.password.value,
            "UserId": this.f.username.value
          }
          this.loginService.onPostMethodBasicSync(UrlLink, ReqObj).subscribe(
            (data: any) => {
              let res = data;
              // if(res?.Errors.length!=0){
              //   for(let error of res.Errors){
              //     this.toaster.open({
              //       text: error.Message,
              //       caption: error.Field,
              //       type: 'danger',
              //     });
              //   }
                
              // }
              // else{
                  if(data?.Message=='Success'){
                    this.toaster.open({
                      text: "Password Updated Successfully",
                      caption: "Change Password",
                      type: 'success',
                    });
                    this.router.navigate(['/Login']);
                  }
              //}
            },
    
        (err: any) => { console.log(err)}
          );
      }
      else{
        this.toaster.open({
          text: "New Passwords Not Matching",
          caption: "Confirm Password",
          type: 'danger',
        });
      }
    }



  }

  decryptData(data:any) {
    try {
      const bytes = CryptoJS.AES.decrypt(data, this.CryKey);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
      console.log(e);
    }
  }

  encryptData(data:any):any {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), this.CryKey).toString();
    } catch (e) {
      console.log(e);
    }
  }

}

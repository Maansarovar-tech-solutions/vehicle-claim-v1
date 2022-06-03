import { AddVehicleService } from './../../../Modules/add-vehicle/add-vehicle.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/Auth/auth.service';
import * as Mydatas from '../../../app-config.json';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;
  public loginForm!: FormGroup;
  public insuranceCompany:any[]=[];
  public insuranceId:any='';

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    public authService:AuthService,
    private router:Router,
    private addVehicleService:AddVehicleService
  ) { }

  ngOnInit(): void {
    this.onCreateFormControl();
    this.onGetInsuranceTypList();


  }

  onCreateFormControl() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
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
      let UrlLink = `${this.ApiUrl1}authentication/login`;
      let ReqObj = {
        "InsuranceId":  this.f.InsuranceId.value,
        "UserId": this.f.username.value,
        "Password": this.f.password.value,
      }
      this.loginService.onPostMethodSync(UrlLink, ReqObj).subscribe(
        (data: any) => {
          console.log("LoginData", data);
          if(data?.LoginResponse?.Token != null){
            let Token = data?.LoginResponse?.Token;
            this.authService.login(data);
            this.authService.UserToken(Token);
            sessionStorage.setItem("UserToken",Token);
            sessionStorage.setItem("Userdetails", JSON.stringify(data));
            let userType = data?.LoginResponse?.UserType;

             sessionStorage.setItem('claimType','Receivable')

            this.router.navigate(['/Home/Receivable']);

            //}

          }
        },
        (err: any) => { }
      );
    }

  }

}

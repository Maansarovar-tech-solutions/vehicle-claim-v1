import { AddVehicleService } from './../../../Modules/add-vehicle/add-vehicle.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/Auth/auth.service';
import * as Mydatas from '../../../../assets/app-config.json';
import { LoginService } from './login.service';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
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
    private addVehicleService:AddVehicleService
  ) { }

  ngOnInit(): void {
    this.onCreateFormControl();
    //this.onGetInsuranceTypList();


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

          if(data?.LoginResponse?.Token != null){
            let Token = data?.LoginResponse?.Token;
            this.authService.login(data);
            this.authService.UserToken(Token);
            sessionStorage.setItem("Userdetails", JSON.stringify(data));
            sessionStorage.setItem("UserToken",Token);

            if(data?.LoginResponse?.ParticipantYn == "N"){
              sessionStorage.setItem('claimType','Payable')
              this.router.navigate(['/Home/Payable']);
            }else{
              sessionStorage.setItem('claimType','Receivable')
              this.router.navigate(['/Home/Receivable']);
            }
          }
        },

    (err: any) => { console.log(err)}
      );
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



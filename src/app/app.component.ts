import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './Auth/auth.service';
import * as Mydatas from '../assets/app-config.json';
import * as CryptoJS from 'crypto-js';
export let browserRefresh = false;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  name = 'Angular 6';
  public loginData: any;
  public showIframe: any = false;
  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1=this.AppConfig.ApiUrl1;
  public CryKey=this.AppConfig.CryKey;
  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {

    // this.load();

    let Userdetails = JSON.parse(sessionStorage.getItem("Userdetails") || '{}');
    console.log(Userdetails)
    if (Userdetails !=null && Object.keys(Userdetails).length != 0) {
    console.log(Userdetails)

      this.loginData = JSON.parse(sessionStorage.getItem("Userdetails") || '{}');
      this.authService.login(this.loginData);
      console.log(this.loginData);
    }
  }
  load() {
    const jsonFile = `../assets/app-config.json`;
    return new Promise<void>((resolve, reject) => {
      this.http.get(jsonFile).toPromise().then((response: any) => {
        console.log(response);
        this.AppConfig = <any>response;
        this.ApiUrl1 = this.AppConfig.ApiUrl1;
        this.CryKey = this.AppConfig.CryKey;
        resolve();
      }).catch((response: any) => {
        reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
      });
    });
  }
  ngOnInit(): void {

  }

  decryptData(data: any) {
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

  encryptData(data: any): any {
    console.log(data)
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), this.CryKey).toString();
    } catch (e) {
      console.log(e);
    }
  }



}

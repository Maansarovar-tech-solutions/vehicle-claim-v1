import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, retry, take } from 'rxjs/operators';
import { AuthService } from 'src/app/Auth/auth.service';
import * as Mydatas from '../../../../assets/app-config.json';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
    public CryKey:any='MaaN';
  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;
  public Token:any;
  public username='motor';
  public password='motor123#';
  constructor(
    private http: HttpClient,
    private authService:AuthService
    ) { }

    getToken() {
      this.authService.isloggedToken.subscribe((event: any) => {
        if (event != undefined && event != '' && event != null) {
          this.Token = event;
        } else {
          this.Token = sessionStorage.getItem("UserToken");
        }
      });
      return this.Token;
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





  async onPostMethodAsync(UrlLink: any, ReqObj: any): Promise<Observable<any[]>> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Basic ' + this.getToken());
    return await this.http
      .post<any>(UrlLink, ReqObj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }
  async onGetMethodAsync(UrlLink: any): Promise<Observable<any[]>> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Basic ' + this.getToken());
    return await this.http
      .get<any>(UrlLink, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  onPostMethodSync(UrlLink: string, ReqObj: any): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Basic ' + this.getToken());
    return this.http
      .post<any>(UrlLink, ReqObj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }
  onPostMethodBasicSync(UrlLink: string, ReqObj: any): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Basic ' + window.btoa(this.username+':'+this.password));
    return this.http
      .post<any>(UrlLink, ReqObj, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }
  onGetMethodSync(UrlLink: string, ReqObj: any): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Basic ' + this.getToken());
    return this.http
      .get<any>(UrlLink, { headers: headers })
      .pipe(retry(1), catchError(this.handleError));
  }



  // Error handling
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}

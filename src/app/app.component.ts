import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './Auth/auth.service';
export let browserRefresh = false;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  name = 'Angular 6';
  public loginData:any;
  public showIframe:any = false;
  constructor(
    private router: Router,
     private authService: AuthService,

     ) {
    let Userdetails = JSON.parse(sessionStorage.getItem('Userdetails') || '{}')
    if(Object.keys(Userdetails).length !=0) {
      this.loginData = JSON.parse(sessionStorage.getItem('Userdetails') || '{}');
      this.authService.login(this.loginData);
      console.log(this.loginData);
    }
  }
  ngOnInit(): void {

  }



}

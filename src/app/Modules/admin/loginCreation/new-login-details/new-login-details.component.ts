import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-login-details',
  templateUrl: './new-login-details.component.html',
  styleUrls: ['./new-login-details.component.css']
})
export class NewLoginDetailsComponent implements OnInit {

  editSection:boolean = false;
  changePassword:boolean = false;
  userName:any="";emailId:any;mobileNo:any;
  statusValue:any="Y";remarks:any="";
  constructor() { }

  ngOnInit(): void {
  }

}

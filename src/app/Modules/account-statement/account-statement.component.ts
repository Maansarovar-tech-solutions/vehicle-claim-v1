import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-account-statement',
  templateUrl: './account-statement.component.html',
  styleUrls: ['./account-statement.component.css']
})
export class AccountStatementComponent implements OnInit {
  public check1:boolean=true;
  public check2:boolean=false;
  public check3:boolean=false;
  claimType: any;
  userDetails: any;
  companyType: any;
  constructor(private router:Router,
    public app:AppComponent
    ) {
        let currentUrl = this.router.url;
        console.log("Url Received",currentUrl);
        if(currentUrl){
          let urlList = currentUrl.split('/');
          if(urlList){
            console.log("Url List",urlList)
            if(urlList[2] == 'payable-AccountStatement'){
                this.claimType = 'Payable';
            }
            else{
              this.claimType = 'Receivable';
            }
            console.log("Final ClaimType ",this.claimType)
          }
        }

   }

  ngOnInit(): void {
    this.userDetails = this.app.decryptData(sessionStorage.getItem("Userdetails"));
        if(this.userDetails && this.claimType == 'Receivable'){
            let insValue = this.userDetails.LoginResponse.InsuranceId;
            if(insValue == 'OMAN') this.companyType = '1';
            else if(insValue == 'NIC') this.companyType = '2';
            else if(insValue == 'OUIC') this.companyType = '3';
            else if(insValue == 'QIC') this.companyType = '4';
            else if(insValue == 'TC') this.companyType = '5';
         }
         else{
           this.companyType = '';
         }
         console.log("Claim Type",this.companyType)
  }

}

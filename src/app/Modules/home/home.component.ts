import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,

  ) { }

  ngOnInit(): void {
  }

  onNavigation(val:any){
    console.log("Received Val",val)
    sessionStorage.removeItem("claimEditReq");
    sessionStorage.removeItem("policyEditReq");
    sessionStorage.setItem('claimType',val)
    if(val === 1 || val == 4){
      this.router.navigate(['/Home/New-Claim/Policy-Form']);
    }
    else if(val == 12 ){
      sessionStorage.setItem('claimType',String(val));
    // this.router.navigate(['Home/Add-Vehicle/Existing-Claim']);
    this.router.navigate(['/Home/New-Claim/Existing-Claim']);
    }
    else if(val == 11){
      sessionStorage.removeItem("claimEditReq");
      sessionStorage.removeItem("policyEditReq");
      sessionStorage.setItem('searchType','policyOrChassis');
      sessionStorage.setItem('claimType',String(val))
      this.router.navigate(['/Home/New-Claim/vehicleSearch']);
    }
    else if(val == 6){
      this.router.navigate(['/Home/receivable-AccountStatement']);
    }
    else if(val == 7){
      this.router.navigate(['/Home/payable-AccountStatement']);
    }
    else if(val === 'Receivable'){
      this.router.navigate(['/Home/Receivable']);
    }
    if(val === 'Payable'){
      this.router.navigate(['/Home/Payable']);
    }
  }


}

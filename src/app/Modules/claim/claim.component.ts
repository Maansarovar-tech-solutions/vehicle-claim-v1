import { Component, OnInit } from '@angular/core';
import { ClaimService } from './claim.service';
import * as Mydatas from '../../../assets/app-config.json';

@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.css']
})
export class ClaimComponent implements OnInit {
  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;
  public LoginDetails:any;
  public totalRecoveryClaimCounts:any
  public totalTPLlaimCounts:any
  constructor(
    private claimService:ClaimService
  ) {
    this.LoginDetails = JSON.parse(sessionStorage.getItem("Userdetails") || '{}');

   }

  ngOnInit(): void {
    this.onGetTotalClaimsGraph();
  }

  onGetTotalClaimsGraph() {
    let UrlLink = `${this.ApiUrl1}api/companywiseclaim/count`;
    let userDetails = this.LoginDetails?.LoginResponse;
    let ReqObj = {
      "InsuranceId": userDetails?.InsuranceId,

    }
    this.claimService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        if (data?.Message == "Success") {
          console.log(data)
          this.totalRecoveryClaimCounts = data?.Result?.RecveryClaims;
          this.totalTPLlaimCounts = data?.Result?.TotalLossClaims;

        }
      },
      (err) => { }
    );
  }

}

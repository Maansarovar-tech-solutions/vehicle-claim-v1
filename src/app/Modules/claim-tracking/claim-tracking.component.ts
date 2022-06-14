import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddVehicleService } from '../add-vehicle/add-vehicle.service';
import * as Mydatas from '../../../assets/app-config.json';

@Component({
  selector: 'app-claim-tracking',
  templateUrl: './claim-tracking.component.html',
  styleUrls: ['./claim-tracking.component.css']
})
export class ClaimTrackingComponent implements OnInit {
  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;
  public trackingDetails:any;
  public trackingConversation:any;
  totalTrackList: any[]=[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private addVehicleService: AddVehicleService,
    private router:Router

  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(
      params => {
        this.trackingDetails=params;
        console.log(params);
        this.onGeTrackingDetail(params)
      }
    )
  }

  onGeTrackingDetail(params:any) {
    let UrlLink = `${this.ApiUrl1}api/track/claim`;

    let ReqObj = {
      "ClaimReferenceNumber":params?.ClaimReferenceNumber

    }
    this.addVehicleService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
          console.log(data)
            this.trackingConversation = data?.Result;
            let res = data?.Result;
            if(res?.TotalCompaniesTrack){
              this.totalTrackList = res?.TotalCompaniesTrack;
             }
      },
      (err) => { }
    );
  }
  onEditClaim(){
    sessionStorage.setItem('claimEditReq',JSON.stringify(this.trackingDetails));
    this.router.navigate(['Home/recovery-claim-form'],{queryParams:event});
  }
}

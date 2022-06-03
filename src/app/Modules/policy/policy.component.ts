import { Component, OnInit } from '@angular/core';
import { PolicyService } from './policy.service';
import * as Mydatas from '../../app-config.json';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.css']
})
export class PolicyComponent implements OnInit {
  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;
  constructor(
    private policyService:PolicyService
  ) { }

  ngOnInit(): void {
    this.onGetVehicleMakeCount();
  }



  onGetVehicleMakeCount(){
    let UrlLink =`${this.ApiUrl1}api/vehiclemake/count`;
    let ReqObj =
    {
      "StartDate":"01/01/2022",
      "EndDate":"28/12/2022"
    };
    this.policyService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
         console.log(data)
      },
      (err) => { }
    );
  }
  onGetVehiclebodyTypeCount(){
    let UrlLink =`${this.ApiUrl1}api/vehiclebodytype/count`;
    let ReqObj =
    {
      "StartDate":"01/01/2022",
      "EndDate":"28/12/2022"
    };
    this.policyService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
         console.log(data)
      },
      (err) => { }
    );
  }



}

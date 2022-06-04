import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as Mydatas from '../../app-config.json';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { AddVehicleService } from '../add-vehicle/add-vehicle.service';
import { DatePipe } from '@angular/common';
export interface PeriodicElement {
  "InsuranceId": "OMAN",
  "BranchCode": "01",
  "RegionCode": "01",
  "CreatedBy": "gulf1",
  "UserType": null,
  "VehicleCode": "10034",
  "VehicleChassisNumber": "5968i5675",
  "PlateNumber": "6696",
  "PlateCode": "5",
  "PlateCharacter": "AW",
  "LicenceNumber": "56865986",
  "DriverDateOfBirth": "14/02/1994",
  "LicenceValidUpto": "02/01/2023",
  "Gender": "1",
  "AccidentNumber": "10011",
  "ClaimNumber": "1234567",
  "AccidentDate": "01/04/2022",
  "AccidentDescription": null,
  "AccidentLocation": "Chennai",
  "ClaimTypeId": "6",
  "ClaimTypeDesc": "Bodily Injury",
  "ReserveAmount": null
}
@Component({
  selector: 'app-existing-claim',
  templateUrl: './existing-claim.component.html',
  styleUrls: ['./existing-claim.component.css']
})
export class ExistingClaimComponent implements OnInit {
  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;
  public userDetails: any;
  public claimList: PeriodicElement[] = [];
  public columnHeader: any[] = [];
  public claimType:any='';

  public FilterByInsuranceId = 'OMAN';
  public startDate:any='01/01/2022';
  public endDate:any='30/05/2022';
  public step: any = '0';
  companySearch = new FormControl('');
  public insuranceList: any[] = [];
  public insuranceListfiltered!: Observable<any[]>;
  constructor(
    private addVehicleService: AddVehicleService,
    private router:Router,
    private datePipe: DatePipe,

  ) {
    this.endDate = this.datePipe.transform(new Date(),"dd/MM/yyyy");

    this.userDetails = JSON.parse(sessionStorage.getItem("Userdetails") || '{}');
    this.claimType = sessionStorage.getItem("claimType") || '';
    console.log(this.ApiUrl1)
  }
  ngOnInit(): void {
    this.onGetCompanyListCount();

  }
  daysFilter(event:any){
    event = Number(event);
    var enDate = new Date();
    var startDate = new Date();
    startDate.setDate(startDate.getDate() - 10);

    var endDD = String(enDate.getDate()).padStart(2, '0');
    var endMM = String(enDate.getMonth() + 1).padStart(2, '0');
    var endYYYY = enDate.getFullYear();

    var startDD = String(startDate.getDate()).padStart(2, '0');
    var startMM = String(startDate.getMonth() + 1).padStart(2, '0');
    var startYYYY = startDate.getFullYear();


    this.startDate = startDD + '/' + startMM + '/' + startYYYY;
    this.endDate = endDD + '/' + endMM + '/' + endYYYY;
    console.log(this.startDate,this.endDate);
    if(event ==0){
      this.startDate='01/01/2022';
      this.endDate=this.datePipe.transform(new Date(),"dd/MM/yyyy");;

    }
    this.onGetClaimList();
    this.onGetCompanyListCount();
  }

  companyFilter(id: any, insuredId: any) {
    this.step = id;
    this.FilterByInsuranceId = insuredId;
    this.onGetClaimList();
  }

  onGetClaimList() {
    let userDetails = this.userDetails?.LoginResponse;
    let UrlLink='';
    // if(this.claimType == '11'){
      // UrlLink = `${this.ApiUrl1}api/claiminfo/datewise`;
    // }
    // if(this.claimType == '12'){
      UrlLink = `${this.ApiUrl1}api/company/totalloss/datewise`;
    // }

    let ReqObj = {
      "BranchCode": userDetails?.BranchCode,
      "InsuranceId": userDetails?.InsuranceId,
      "StartDate": this.startDate,
      "EndDate": this.endDate,
      "FilterByInsuranceId":this.FilterByInsuranceId,
      // "Limit":"0",
      // "Offset":"10"

    }
    this.addVehicleService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        console.log(data)
        this.columnHeader = [
          { key: "ClaimNumber", display: "Claim Number" },
          { key: "CivilId", display: "Civil Id" },
          {
            key: "PlateCode", display: "Plate Number/Plate Char",
            config: {
              isCodeChar: true,
            },
          },
          {
            key: "VehicleChassisNumber", display: "Chassis Number",

          },
          { key: "ClaimIntimatedDate", display: "Claimintimate Date" },

          {
            key: "actions", display: "Edit",
            config: {
              isEditActions: true,
            },
          },
        ];
        this.claimList = data?.Result;
      },
      (err) => { }
    );
  }

 onGetCompanyListCount() {
    let UrlLink = `${this.ApiUrl1}api/companies/totalloss/count/datewise`;
    let userDetails = this.userDetails?.LoginResponse;
    let ReqObj = {
      "InsuranceId": userDetails?.InsuranceId,
      "StartDate": this.startDate,
      "EndDate": this.endDate,

    }
    this.addVehicleService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        if (data?.Message == "Success") {
          console.log("companyCount",data)
          this.insuranceList = data?.Result;
          this.FilterByInsuranceId = this.insuranceList[0].InsuranceId;
          this.onGetClaimList();

          this.insuranceListfiltered = this.companySearch.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value,this.insuranceList)),
          );
        }
      },
      (err) => { }
    );
  }


  onEditClaim(event:any){
    sessionStorage.setItem('claimEditReq',JSON.stringify(event));
    this.router.navigate(['Home/New-Claim'],{queryParams:event});
  }

  private _filter(value: any,data:any):any[] {
    const filterValue = value.toLowerCase();

    return data.filter((option: any) => option.InsuranceCompnayName.toLowerCase().includes(filterValue));
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as Mydatas from '../../app-config.json';
import { Router } from '@angular/router';
import { VehicleSearchService } from './vehicle-search.service';

@Component({
  selector: 'app-vehicle-search',
  templateUrl: './vehicle-search.component.html',
  styleUrls: ['./vehicle-search.component.css']
})
export class VehicleSearchComponent implements OnInit {
  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;
  public chassisForm!: FormGroup;
  public civilForm!: FormGroup;
  public selectedTab: string = 'Chassis Number';
  public LoginDetails: any;
  public searchedDetails:any;chassisSection = false;
  item: any;
  policyNo: any;
  civilId: any;
  insuranceStartDate: any;
  insuranceEndDate: any;
  insuranceType: any;
  claimDetails: any;
  isClaimDetails: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private vehicleSearchService: VehicleSearchService,
    private router:Router
  ) {
    this.LoginDetails = JSON.parse(sessionStorage.getItem("Userdetails") || '{}');
    console.log("Login Details",this.LoginDetails);
    let searchData = JSON.parse(sessionStorage.getItem("searchList") || '{}');
    if(searchData){
      this.chassisSection = true;
        this.onSearchDetails(searchData);
    }
  }

  ngOnInit(): void {
    this.onCreateFormControl();
  }

  onCreateFormControl() {
    this.chassisForm = this.formBuilder.group({
      chassisno: ['', Validators.required],
    });
    this.civilForm = this.formBuilder.group({
      civilno: ['', Validators.required],
    });
  }

  get f() { return this.chassisForm.controls; };
  get f1() { return this.civilForm.controls; };


  onTabChanged(event: any) {
    console.log(event.tab.textLabel)
    this.selectedTab = event.tab.textLabel;
    this.searchedDetails=[];
  }


  onSearchDetails(searchData:any) {
    // var UrlLink = '';
    // var ReqObj = {};

    // if (this.selectedTab == 'Chassis Number') {
    //   this.chassisSection = false;
    //   if (this.chassisForm.valid) {
    //     // UrlLink = `${this.ApiUrl1}totalloss/vehicleIinfo/bychassisno`;
    //     // ReqObj = {
    //     //   "ChassisNo": this.chassisForm.controls['chassisno'].value
    //     // }
    //     UrlLink = `${this.ApiUrl1}api/searchvehicleinfo`;
    //     ReqObj = {
    //       "VehicleChassisNumber": this.chassisForm.controls['chassisno'].value
    //     }
    //   }

    // }
    // if (this.selectedTab == 'Civil Id') {
    //   if (this.civilForm.valid) {
    //     UrlLink = `${this.ApiUrl1}totalloss/vehicleInfo/bycivilid`;
    //     ReqObj = {
    //       "CivilId": this.civilForm.controls['civilno'].value
    //     }
    //   }

    // }

    // return this.vehicleSearchService.onPostMethodSync(UrlLink, ReqObj).subscribe((data: any) => {

       this.searchedDetails = searchData;
       if (this.selectedTab == 'Chassis Number') {
        this.chassisSection = true;
        this.policyNo = this.searchedDetails.PolicyInformation.PolicyNumber;
        this.civilId = this.searchedDetails.PolicyInformation.CivilId;
        this.insuranceStartDate = this.searchedDetails.PolicyInformation.InsuranceStartDate;
        this.insuranceEndDate = this.searchedDetails.PolicyInformation.InsuranceEndDate;
        this.insuranceType = this.searchedDetails.PolicyInformation.InsuranceTypeDesc;
        this.onGetClaimDetails(this.searchedDetails?.VehicleDetails?.VehicleChassisNumber);
       }
      //  this.item = data?.Result;

    //}, (err) => { })
  }
  onGetClaimDetails(chassis: any) {
    let UrlLink = `${this.ApiUrl1}api/vehicle/claims`;
    let ReqObj = {
      "VehicleChassisNumber": chassis

    }
    this.vehicleSearchService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        console.log("claimDetails", data);
        if (data?.Message == "Success") {
          this.claimDetails = data?.Result?.ClaimInformations
          if (data?.Result?.ClaimInformations.length > 0) {
            this.isClaimDetails = true;
          }

        }

      },
      (err) => { }
    );
  }
  getBack(){
    sessionStorage.removeItem("searchList");
    this.router.navigate(['/Home']);
  }
  onViewClaimData( rowData:any) {
    console.log(rowData)
    this.router.navigate(['Home/Vehicle-Search/Claim-Details'],{queryParams:rowData});
  }

  onMoveClaimInfo(){

  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as Mydatas from '../../app-config.json';
import { Router } from '@angular/router';
import { VehicleSearchService } from './vehicle-search.service';
import { DatePipe } from '@angular/common';

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
  item: any;claimType:any="";
  policyNo: any;
  civilId: any;
  insuranceStartDate: any;
  insuranceEndDate: any;
  insuranceType: any;
  claimDetails: any;
  isClaimDetails: boolean = false;insuranceList:any[]=[];
  columnHeader: any;
  startDate: any;
  endDate: any;
  claimList: any[]=[];
  columnHeader1:any;
  constructor(
    private formBuilder: FormBuilder,
    private vehicleSearchService: VehicleSearchService,
    private router:Router,
    private datePipe: DatePipe,
  ) {
    this.LoginDetails = JSON.parse(sessionStorage.getItem("Userdetails") || '{}');
    console.log("Login Details",this.LoginDetails);
    let searchData = JSON.parse(sessionStorage.getItem("searchList") || '{}');
    this.claimType = null;
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
        this.insuranceList = this.searchedDetails.PolicyInformation;
        if(this.insuranceList.length!=0){
          this.columnHeader = [
            { key: "PolicyNumber", display: "Policy No" },
            { key: "CivilId", display: "Civil Id" },
            {
              key: "InsuranceTypeDesc", display: "Insurance Type",
            },
            {
              key: "InsuranceStartDate", display: "Start Date",
  
            },
            { key: "InsuranceEndDate", display: "End Date" },
  
            {
              key: "ClaimCount", display: "Claim Count",
              config: {
                isClaimCount: true,
              },
            },
          ];
        }
        //this.onGetClaimDetails(this.searchedDetails?.VehicleDetails?.VehicleChassisNumber);
       }
      //  this.item = data?.Result;

    //}, (err) => { })
  }
  onGetClaimDetails(event: any) {
    let UrlLink = `${this.ApiUrl1}api/vehicle/claims`;
    let ReqObj = {
      "VehicleChassisNumber": event.VehicleChassisNumber

    }
    console.log("Event",event)
    this.vehicleSearchService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        console.log("claimDetails", data);
        if (data?.Result?.ClaimInformations.length!=0) {
          this.isClaimDetails = true;
          this.claimList = data?.Result?.ClaimInformations;
          this.columnHeader1 = [
            { key: "ClaimNumber", display: "Claim No" },
            { key: "ClaimTypeDesc", display: "Claim Type" },
            {
              key: "ClaimIntimatedDate", display: "Intimated Date",
            },
            {
              key: "StatusDesc", display: "Claim Status",
  
            },
            {
              key: "actions", display: "View",
              config: {
                isViewClaim: true,
              },
            },
          ];
        }
        else{
          this.isClaimDetails=false;
        }
        // if (data?.Message == "Success") {
        //   this.claimDetails = data?.Result?.ClaimInformations
        //   if (data?.Result?.ClaimInformations.length > 0) {
        //     this.isClaimDetails = true;
        //   }

        // }
        

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

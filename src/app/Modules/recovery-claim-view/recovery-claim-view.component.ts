import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Toaster } from 'ngx-toast-notifications';
import { AddVehicleService } from '../add-vehicle/add-vehicle.service';
import * as Mydatas from '../../../assets/app-config.json';

@Component({
  selector: 'app-recovery-claim-view',
  templateUrl: './recovery-claim-view.component.html',
  styleUrls: ['./recovery-claim-view.component.css']
})
export class RecoveryClaimViewComponent implements OnInit {
  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;

  public tableData: any[] = [];
  public columnHeader: any[] = [];
  public choosedList: any;
  public userDetails: any;
  public FilterByInsuranceId = 'NIC';
  public insuranceList: any[] = [];

  statusType: any;
  public step: any = '0';
  public startDate:any='01/01/2022';
  public endDate:any='30/05/2022';
  public recoveryType: any = '';
  constructor(
    private activatedRoute: ActivatedRoute,
    private addVehicleService: AddVehicleService,
    private datePipe: DatePipe,
    private toaster: Toaster,
    private router: Router

  ) {

    this.endDate = this.datePipe.transform(new Date(),"dd/MM/yyyy");
    this.recoveryType = sessionStorage.getItem("claimType");

    this.userDetails = JSON.parse(sessionStorage.getItem("Userdetails") || '{}');
    this.activatedRoute.queryParams.subscribe(
      params => {
        console.log(params);
        this.choosedList = params;
      }
    )
  }
  ngOnInit(): void {
    this.onGetCompanyListCount();
  }

  companyFilter(id: any, insuredId: any) {
    this.step = id;
    this.FilterByInsuranceId = insuredId;
    this.onGetExistClaim();
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
    if(event == 0){
      this.startDate='01/01/2022';
      this.endDate=this.datePipe.transform(new Date(),"dd/MM/yyyy");

    }
    this.onGetExistClaim();
    this.onGetCompanyListCount();
  }

  onGetCompanyListCount() {
    let UrlLink = `${this.ApiUrl1}api/companies/count/datewise`;
    let userDetails = this.userDetails?.LoginResponse;
    let ReqObj = {
      "InsuranceId": userDetails?.InsuranceId,
      "StatusCode": this.choosedList?.StatusCode,
      "Claim": this.recoveryType,
      "StartDate": this.startDate,
      "EndDate": this.endDate

    }
    this.addVehicleService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        if (data?.Message == "Success") {
          console.log(data)
          this.insuranceList = data?.Result;
          this.FilterByInsuranceId = this.insuranceList[0].InsuranceId;
          this.onGetExistClaim();
        }
      },
      (err) => { }
    );
  }





  onGetExistClaim() {

    let UrlLink = `${this.ApiUrl1}api/company/datewise`;
    let userDetails = this.userDetails?.LoginResponse;
    let ReqObj = {
      "InsuranceId": userDetails?.InsuranceId,
      "StatusCode": this.choosedList?.StatusCode,
      "Claim": this.recoveryType,
      "FilterByInsuranceId": this.FilterByInsuranceId,
      "StartDate": this.startDate,
      "EndDate": this.endDate

    }
    this.addVehicleService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        if (data?.Message == "Success") {
          console.log(data)
          this.onLoadData(data.Result)

        }
      },
      (err) => { }
    );
  }

  onLoadData(data: any[]) {
    if (this.recoveryType == 'Receivable') {
      this.columnHeader = [
        {
          key: "actions", display: "Actions",
          config: {
            isEdit: true,
          },
        },
        { key: "ClaimNumber", display: "Claim Number" },
        { key: "CivilId", display: "Civil Id" },
        { key: "PolicyNumber", display: "Policy Number" },
        { key: "VehicleChassisNumber", display: "Chassis Number" },
        { key: "RecoveryCompanyName", display: "Insured Company" },
        { key: "AccidentDate", display: "Accident Date" },
        { key: "ClaimIntimatedDate", display: "Intimate Date" },
        // {
        //   key: "edit", display: "Edit",
        //   config: {
        //     isTplEdit: true,
        //   },
        // },
      ];
      this.tableData = data;

    }
    if (this.recoveryType == 'Payable') {
      this.columnHeader = [
        {
          key: "actions", display: "Actions",
          config: {
            isEdit: true,
          },
        },
        { key: "ClaimNumber", display: "Claim Number" },
        { key: "CivilId", display: "Civil Id" },
        { key: "PolicyNumber", display: "Policy Number" },
        { key: "VehicleChassisNumber", display: "Chassis Number" },
        { key: "InsuranceCompanyName", display: "Insured Company" },
        { key: "AccidentDate", display: "Accident Date" },
        { key: "ClaimIntimatedDate", display: "Intimate Date" },
        // {
        //   key: "edit", display: "Edit",
        //   config: {
        //     isTplEdit: true,
        //   },
        // },

      ];
      this.tableData = data;




    }
  }
  onTrack(event: any) {
    this.router.navigate([`Home/${this.recoveryType}/recovery-claim-grid/Claim-Tracking`], { queryParams: event });

  }


  onTplEdit(event: any) {
    sessionStorage.setItem('claimEditReq', JSON.stringify(event));
    this.router.navigate(['/Home/recovery-claim-form']);
  }

  onProcced(event: any) {
    console.log(event)
    this.router.navigate([`Home/${this.recoveryType}/recovery-claim-grid/Claim-Details`],{queryParams:event});
  }
}

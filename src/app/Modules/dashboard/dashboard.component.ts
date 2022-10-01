import { AppComponent } from './../../app.component';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as Mydatas from '../../../assets/app-config.json';
import { getInstanceByDom, connect } from 'echarts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexNonAxisChartSeries,
} from 'ng-apexcharts';
import { DashboardService } from './dashboard.service';
import { forkJoin, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
export type ChartOptions = {

  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};
export type VehicleChartOptions = {

  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;
  public LoginDetails: any;
  public DashboardDetails: any;
  public statusList: any[] = [];
  public statusName: any = 'Receivable';
  public insuranceCompanyList: any = [];
  public filterinsuranceCompanyList!: Observable<any[]>;
  public insuranceId = new FormControl();
  public chooseClaimType = new FormControl('');
  public receivOrPay = new FormControl('1')

  public claimCounts: any;
  public totalClaimCounts: any;
  public totalGraphClaimCounts: any;
  public recoveryType: any = '';
  public daysDropdown:any[]=[];
  public selectedDays:any={
    startDay:0,
    endDay:5,
  };
  public selectedDays2={
    startDay:21,
    endDay:365,
  };
  public followUpChart:any;
  public topcompanyRecoveryChart:any;
  public topAgecompanyRecoveryChart:any;


  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    public app:AppComponent
  ) {
    this.LoginDetails = JSON.parse(sessionStorage.getItem("Userdetails") || '{}');
    this.recoveryType = sessionStorage.getItem("claimType");
    console.log(this.recoveryType)
    if(this.LoginDetails?.LoginResponse?.ParticipantYn == "N"){
      this.statusName = 'Payable';
    }
    this.daysDropdown=[
      {
        startDay:0,
        endDay:5,
      },
      {
        startDay:6,
        endDay:10,
      },
      {
        startDay:11,
        endDay:20,
      },
      {
        startDay:21,
        endDay:365,
      }
    ]

  }

  ngOnInit(): void {
    this.onGetTplClaimRecoveryList();
    this.onGetInsuranceCompyList();
    this.onGetTotalNumberOfClaims();
    this.onGetStatusWithFollowCount();
    this.onGetCompanyWiesCount();
    this.onGetAgeCompanyWiesCount();
  }


  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.startDay === c2.startDay : c1 === c2;
  }

  onStatusView(view: any) {
    let status = {
      ...view,
      'statusType':this.recoveryType
    }
    console.log(status)
    sessionStorage.setItem("selectStatusDetails",JSON.stringify(status))
    this.router.navigate([`/Home/${this.recoveryType}/recovery-claim-grid`]);
  }

  onGetInsuranceCompyList() {
    let UrlLink = `${this.ApiUrl1}basicauth/insurancecompanies`
    this.dashboardService.onGetMethodSyncBasicToken(UrlLink).subscribe(
      (data: any) => {
        console.log(data);
        this.insuranceCompanyList = data?.Result;
        this.filterinsuranceCompanyList = this.insuranceId.valueChanges.pipe(
          startWith(''),
          map((value) => this._filter(value, this.insuranceCompanyList)),
        );
      },
      (err) => { }
    );
  }
  leftMenuIcon:any = {
    "PED": "./assets/images/open.png",
    "REJ" : "./assets/images/rejected.png",
    "ACP" : "./assets/images/temporary.png",
    "CREQ" : "./assets/images/clarification-requested.png",
    "SETL" : "./assets/images/settlement.png",
    "CRES" : "./assets/images/clarified.png",
    "ATP":"./assets/images/accept.png",
    "DFT":"./assets/images/drafts.png",
    "DNT":"./assets/images/debit-note.png",
    "CNT":"./assets/images/credit-note.png",
    "PAC":"./assets/images/partially-approved.png",


  }
  onGetTplClaimRecoveryList() {
    let UrlLink = `${this.ApiUrl1}api/dashboard/recovery/statuscount`;
    let UrlLink1 = `${this.ApiUrl1}api/dashboard/recovery/watchcount`;

    let userDetails = this.LoginDetails?.LoginResponse;
    let ReqObj = {
      "InsuranceId": userDetails?.InsuranceId,
      "CreatedBy": userDetails?.LoginId
    }
    const otherStatusCountList = this.dashboardService.onPostMethodSync(UrlLink, ReqObj);
    const watchStatusCountList = this.dashboardService.onPostMethodSync(UrlLink1, ReqObj);
    const apiList = [
      otherStatusCountList,
      watchStatusCountList,
    ];

    const parallel = forkJoin(apiList);
    parallel.subscribe(
      (data: any) => {
        console.log(data)
          let othersData = data[0].Result;
          let watchData = data[1].Result;
          othersData.ClaimPayable

          let obj ={
            ClaimPayable:[...othersData.ClaimPayable,watchData.ClaimPayable],
            ClaimReceivable:[...othersData.ClaimReceivable,watchData.ClaimReceivable]

          }
           console.log(obj)
        if (data[0]?.Message == "Success"|| data[1]?.Message == "Success") {
          this.DashboardDetails = obj;
          this.statusName = this.recoveryType;
          if (this.statusName == 'Receivable') {
            this.statusList = this.DashboardDetails?.ClaimReceivable;
          }
          if (this.statusName == 'Payable') {
            this.statusList = this.DashboardDetails?.ClaimPayable;
          }
          this.onGetTotalClaims();
          this.onGetTotalClaimsGraph();
        }
      },
      (err) => { }
    );
  }



  onGetTotalNumberOfClaims() {
    let UrlLink = `${this.ApiUrl1}api/registered/count`;
    let userDetails = this.LoginDetails?.LoginResponse;
    let ReqObj = {
      "InsuranceId": userDetails?.InsuranceId,
    }
    this.dashboardService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        if (data?.Message == "Success") {
          console.log(data)
          this.claimCounts = data?.Result;
        }
      },
      (err) => { }
    );
  }

  onGetTotalClaims() {
    let UrlLink = `${this.ApiUrl1}api/count/datewise`;
    let userDetails = this.LoginDetails?.LoginResponse;
    let ReqObj = {
      "InsuranceId": userDetails?.InsuranceId,
      "StartDate": "12/03/2022",
      "EndDate": "30/05/2022",
      "Claim": this.recoveryType
    }
    this.dashboardService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        if (data?.Message == "Success") {
          console.log(data)
          this.totalClaimCounts = data?.Result;
        }
      },
      (err) => { }
    );
  }

  onGetTotalClaimsGraph() {
    let UrlLink = `${this.ApiUrl1}api/graph/dayswise`;
    let userDetails = this.LoginDetails?.LoginResponse;
    let ReqObj = {
      "InsuranceId": userDetails?.InsuranceId,
      // "StartDate": "12/03/2022",
      // "EndDate": "30/05/2022",
      "StartDay":this.selectedDays.startDay,
      "EndDay": this.selectedDays.endDay,
      "Claim": this.recoveryType
    }
    this.dashboardService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        if (data?.Message == "Success") {
          console.log(data)
          this.totalGraphClaimCounts = data?.Result;
        }
      },
      (err) => { }
    );
  }


  onGetStatusWithFollowCount(){
    let UrlLink = `${this.ApiUrl1}api/dashboard/statuscount`;

    let userDetails = this.LoginDetails?.LoginResponse;
    let ReqObj = {
      "InsuranceId": userDetails?.InsuranceId,
      "ClaimType": this.recoveryType
    }
    this.dashboardService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        if (data?.Message == "Success") {
          console.log(data)
         this.followUpChart = data?.Result;
        }
      },
      (err) => { }
    );
  }

  onGetCompanyWiesCount(){
    let UrlLink = `${this.ApiUrl1}api/top/companies/recoverycount`;
    let userDetails = this.LoginDetails?.LoginResponse;
    let ReqObj = {
      "InsuranceId": userDetails?.InsuranceId,
      "ClaimType": this.recoveryType,
      "TopCount" :"5"
    }
    this.dashboardService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        if (data?.Message == "Success") {
          console.log(data)
          this.topcompanyRecoveryChart = data?.Result;
        }
      },
      (err) => { }
    );
  }
  onChangeDropdown(){
    this.onGetAgeCompanyWiesCount();
  }
  onGetAgeCompanyWiesCount(){
    let UrlLink = `${this.ApiUrl1}api/top/companies/recoverycount/datewise`;

    let userDetails = this.LoginDetails?.LoginResponse;
    let ReqObj = {
      "InsuranceId": userDetails?.InsuranceId,
      "ClaimType": this.recoveryType,
      "TopCount" :"5",
      "StartDay":this.selectedDays2.startDay,
      "EndDay": this.selectedDays2.endDay,
    }
    this.dashboardService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        if (data?.Message == "Success") {
          console.log(data)
          this.topAgecompanyRecoveryChart = data?.Result;
        }
      },
      (err) => { }
    );
  }

  private _filter(value: any, data: any[]): any[] {
    if (value == null) {
      value = '';
    }
    const filterValue = value.toLowerCase();
    return data.filter((option) => option?.CodeDescription?.toLowerCase().includes(filterValue));
  }



}

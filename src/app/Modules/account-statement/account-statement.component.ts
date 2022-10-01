import { SharedService } from './../../Shared/Services/shared.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { _filter } from '../recovery-claim-form/recovery-claim-form.component';
import { NewClaimService } from '../new-claim/new-claim.service';
import * as Mydatas from '../../../assets/app-config.json';
import { MatDialog } from '@angular/material/dialog';
import { StatementUploadComponent } from '../statement-upload/statement-upload.component';
import * as moment from 'moment';

@Component({
  selector: 'app-account-statement',
  templateUrl: './account-statement.component.html',
  styleUrls: ['./account-statement.component.css']
})
export class AccountStatementComponent implements OnInit {
  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;
  public ApiUrl2: any = this.AppConfig.ApiUrl2;
  public userDetails: any;
  public claimForm!: FormGroup;
  public monthList: any[] = [];
  public yearList: any[] = [];
  public selectedYear: any='';
  public selectedMonth: any='';
  public ClaimType: any = 'Receivable'
  public statementList: any;
  public columnHeader: any;
  public claimList: any[] = [];
  public insurCompanyList: any;
  public filterinsurCompanyLis!: Observable<any[]>;
  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private sharedService: SharedService
  ) {
    this.onCreateFormControl();
    this.getAllYears();

  }
  onCreateFormControl() {
    this.claimForm = this._formBuilder.group({
      InsuranceId: ['', Validators.required],
    });

  }

  get f() {
    return this.claimForm.controls;
  }







  ngOnInit() {
    this.userDetails = JSON.parse(sessionStorage.getItem("Userdetails") || '{}');
  }


  onChangeTab(val: string) {
    this.ClaimType = val;
    this.selectedYear = '';
    this.selectedMonth = '';
    this.statementList=undefined;
  }
  getAllYears() {
    var NowYear = new Date().getFullYear();
    var Years = [];
    for (var Y = NowYear; Y >= NowYear - 19; Y--) {
      Years.push(Y);
    }
    this.yearList = Years;
  }
  getAllMonths(year: any) {
    const date = new Date();
    const currentYear = date.getFullYear();
    for (let index = 1; index <= 12; index++) {
      const daysInMonth = this.getDaysInMonth(year, index);
      this.monthList.push(daysInMonth)
    }
  }

  getDaysInMonth(year: any, month: any) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    var date = new Date(`${year}-${month}-1`);
    var firstDay = moment(new Date(date.getFullYear(), date.getMonth(), 1)).format("DD/MM/YYYY");
    var lastDay = moment(new Date(date.getFullYear(), date.getMonth() + 1, 0)).format("DD/MM/YYYY");

    return {
      Days: new Date(year, month, 0).getDate(),
      Month: monthNames[new Date(year, month, 0).getMonth()],
      Dates: `${firstDay}-${lastDay}`
    };
  }

  onGetStatementAccount() {
    let userDetails = this.userDetails?.LoginResponse;
    let date = this.selectedMonth.split('-');
    let UrlLink = `${this.ApiUrl1}api/companies/statement/datewise`
    let ReqObj = {
      "InsuranceId": userDetails?.InsuranceId,
      "ClaimType": this.ClaimType,
      "StartDate": date[0],
      "EndDate": date[1]
    }
    this.sharedService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        if (data?.Message == "Success") {
          console.log(data)
          this.statementList = data.Result;
        }
      },
      (err) => { }
    );
  }



  openDialog(item:any) {
    let date = this.selectedMonth.split('-');
    console.log(date)
    let obj ={...item,startDate: date[0],endDate:date[1],claimType:this.ClaimType}
    const dialogRef = this.dialog.open(StatementUploadComponent,{
      width: '100%',
      panelClass: 'full-screen-modal',
      autoFocus: true,
      restoreFocus: false,
      data:obj,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

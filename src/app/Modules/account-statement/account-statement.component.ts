import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { _filter } from '../recovery-claim-form/recovery-claim-form.component';
import { NewClaimService } from '../new-claim/new-claim.service';
import * as Mydatas from '../../../assets/app-config.json';

@Component({
  selector: 'app-account-statement',
  templateUrl: './account-statement.component.html',
  styleUrls: ['./account-statement.component.css']
})
export class AccountStatementComponent implements OnInit {
  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;
  public ApiUrl2: any = this.AppConfig.ApiUrl2;
  public check1:boolean=true;
  public check2:boolean=false;
  public check3:boolean=false;
  claimType: any;
  userDetails: any;
  companyType: any;
  claimForm: any;columnHeader:any;claimList:any[]=[];
  public insurCompanyList: any;
  public filterinsurCompanyLis!: Observable<any[]>;
  constructor(private router:Router,private _formBuilder:FormBuilder,
    public app:AppComponent,private newClaimService: NewClaimService,
    ) {
        // let currentUrl = this.router.url;
        // console.log("Url Received",currentUrl);
        // if(currentUrl){
        //   let urlList = currentUrl.split('/');
        //   if(urlList){
        //     console.log("Url List",urlList)
        //     if(urlList[2] == 'payable-AccountStatement'){
        //         this.claimType = 'Payable';
        //     }
        //     else{
        //       this.claimType = 'Receivable';
        //     }
        //     console.log("Final ClaimType ",this.claimType)
        //   }
        // }
      this.onCreateFormControl();
   }
   onCreateFormControl() {
    this.claimForm = this._formBuilder.group({
      InsuranceId: ['', Validators.required],
    });
    this.claimList = [
      {
        "InsuranceCompany":"Qatar Islamic Statement",
        "PayableYN":"Y",
        "ReceivableYN":"Y"
      },
      {
        "InsuranceCompany":"Qatar Insurance Statement",
        "PayableYN":"Y",
        "ReceivableYN":"Y"
      },
      {
        "InsuranceCompany":"Gulf Insurance Statement",
        "PayableYN":"Y",
        "ReceivableYN":"Y"
      }
    ]
    this.columnHeader = [
      { key: "InsuranceCompany", display: "InsuranceCompany" },
      { key: "Payable", display: "Payable",
        config: {
          isReportsPayable: true,
        },
      },
      {
        key: "Receivable", display: "Receiveable",
        config: {
          isReportsReceivable: true,
        },
      },
    ];
  }
  onDisplayInsurComp = (code: any) => {
    if (!code) return '';
   let  insurCompanyList = [...this.insurCompanyList[0].names,...this.insurCompanyList[1].names]
    let index = insurCompanyList.findIndex((obj: any) => obj.Code == code);
    return insurCompanyList[index].CodeDescription;
  };
  get f() {
    return this.claimForm.controls;
  }
  async ngOnInit(): Promise<void> {
    this.userDetails = JSON.parse(sessionStorage.getItem("Userdetails") || '{}');
    this.insurCompanyList = (await this.onGetInsuranceCompList());
    console.log('insurance-company',this.insurCompanyList);
    let companyGroup:any = [
      {
        letter: 'Participants',
        names: this.insurCompanyList.Participants,
      },
      {
        letter: 'Non Participants',
        names: this.insurCompanyList.NonParticipants,
      },

    ];
    this.insurCompanyList = companyGroup;

    this.filterinsurCompanyLis = this.f.InsuranceId.valueChanges.pipe(
      startWith(''),
      map(value => this._filterGroup(value || '')),
    );
        // if(this.userDetails && this.claimType == 'Receivable'){
        //     let insValue = this.userDetails.LoginResponse.InsuranceId;
        //     if(insValue == 'OMAN') this.companyType = '1';
        //     else if(insValue == 'NIC') this.companyType = '2';
        //     else if(insValue == 'OUIC') this.companyType = '3';
        //     else if(insValue == 'QIC') this.companyType = '4';
        //     else if(insValue == 'TC') this.companyType = '5';
        //  }
        //  else{
        //    this.companyType = '';
        //  }
         console.log("Claim Type",this.companyType)
  }
  async onGetInsuranceCompList() {
    let UrlLink = `${this.ApiUrl1}api/groupof/insurancecompanies`;
    let response = (
      await this.newClaimService.onGetMethodAsync(UrlLink)
    )
      .toPromise()
      .then((res: any) => {
        return res?.Result;
      })
      .catch((err) => {});
    return response;
  }
  private _filterGroup(value: any): any[] {
    if (value) {
      return this.insurCompanyList
        .map((group:any) => ({letter: group.letter, names: _filter(group.names, value)}))
        .filter((group:any) => group.names.length > 0);
    }

    return this.insurCompanyList;
  }
}

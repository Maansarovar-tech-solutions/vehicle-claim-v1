import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Toaster } from 'ngx-toast-notifications';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AddVehicleService } from 'src/app/Modules/add-vehicle/add-vehicle.service';
import * as Mydatas from '../../../../app-config.json';

@Component({
  selector: 'app-claim-form',
  templateUrl: './claim-form.component.html',
  styleUrls: ['./claim-form.component.css']
})
export class ClaimFormComponent implements OnInit,OnChanges {
  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;
  public claimForm!: FormGroup;
  public userDetails: any;
  public searchValue: any = '';

  public claimTypeList: any[] = [];
  public filterclaimTypeList!: Observable<any[]>;
  public plateCodeList: any = [];
  public filterPlateCodeList!: Observable<any[]>;
  public insurCompanyList: any[] = [];
  public filterinsurCompanyLis!: Observable<any[]>;
  public claimEditReq: any;
  public AccidentNumber: any = '';
  public ClaimReferenceNumber='';
  public PolicyReferenceNumber='';
  public VehicleChassisNumber='';
  public VehicleCode='';
  public claimType:any='';
  public claimTypeId:any='';

  @Input('vehicleResponseData') vehicleResponseData:any;
  @Output('moveNext') moveNext = new EventEmitter();

  constructor(
    private _formBuilder: FormBuilder,
    private addVehicleService: AddVehicleService,
    private datePipe: DatePipe,
    private toaster: Toaster,
    private activatedRoute: ActivatedRoute,
    private router: Router

  ) {
    this.userDetails = JSON.parse(sessionStorage.getItem("Userdetails") || '{}');
    this.claimEditReq = JSON.parse(sessionStorage.getItem("claimEditReq") || '{}');
    console.log(this.claimEditReq)

  }

  ngOnInit(): void {
    console.log('Vehicle-Response Data',this.vehicleResponseData)
    if(this.vehicleResponseData){
      this.PolicyReferenceNumber=this.vehicleResponseData?.PolicyReferenceNumber;
      this.VehicleChassisNumber=this.vehicleResponseData.VehicleChassisNumber;
      this.VehicleCode=this.vehicleResponseData?.VehicleCode;
      this.claimType=this.vehicleResponseData?.claimType;
      this.claimTypeId=this.vehicleResponseData?.claimTypeId;
    }
    this.onInitialFetchData();
  }
  ngOnChanges(changes: SimpleChanges): void {

  }



  onCreateFormControl() {
    this.claimForm = this._formBuilder.group({
      AccidentDate: ['', Validators.required],
      AccidentLocation: ['', Validators.required],
      AccidentDescription: ['', Validators.required],
      ClaimTypeId: ['', Validators.required],
      ReserveAmount: ['', Validators.required],
      ClaimNumber: ['', Validators.required],
      SalvageAmount: [''],
      SalvagePortal: [true],


      LicenceNumber: ['', Validators.required],
      DriverDateOfBirth: ['', Validators.required],
      LicenceValidUpto: ['', Validators.required],
      Gender: ['1', Validators.required],

      PlateCode: ['', Validators.required],
      PlateNumber: ['', Validators.required],
      CivilId: ['', Validators.required],
      VehicleChassisNumber: ['', Validators.required],
      InsuranceId: ['', Validators.required]

    });
  }
  get f() { return this.claimForm.controls; };


  async onInitialFetchData() {
    this.onCreateFormControl();

    this.claimTypeList = await this.onGetClaimTypeList() || [];
    this.filterclaimTypeList = this.f.ClaimTypeId.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, this.claimTypeList)),
    );

    this.plateCodeList = await this.onGetPlateCodeList() || [];
    console.log(this.plateCodeList);
    this.filterPlateCodeList = this.f.PlateCode.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, this.plateCodeList)),
    );

    this.insurCompanyList = await this.onGetInsuranceCompList() || []
    console.log(this.insurCompanyList);
    this.filterinsurCompanyLis = this.f.InsuranceId.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, this.insurCompanyList)),
    );

    if (Object.keys(this.claimEditReq).length !== 0) {
      console.log(this.claimEditReq);
      this.searchValue = this.claimEditReq?.VehicleChassisNumber
      await this.onClaimEdit(this.claimEditReq)
    }

    this.f.ClaimTypeId.setValue(this.claimTypeId);
    const ctrl = this.claimForm.get('ClaimTypeId')!;
    if(this.claimTypeId == '11'){
      ctrl.disable();
    }

  }

  async onGetClaimTypeList() {
    let UrlLink = `${this.ApiUrl1}dropdown/claimtypes`
    let response = (await this.addVehicleService.onGetMethodAsync(UrlLink)).toPromise()
      .then((res: any) => {
        return res?.Result;
      })
      .catch((err) => { });
    return response;

  }
  async onGetPlateCodeList() {
    let UrlLink = `${this.ApiUrl1}dropdown/platecodes`;
    let response = (await this.addVehicleService.onGetMethodAsync(UrlLink)).toPromise()
      .then((res: any) => {
        return res?.Result;
      })
      .catch((err) => { });
    return response;

  }
  async onGetInsuranceCompList() {
    let UrlLink = `${this.ApiUrl1}basicauth/insurancecompanies`
    let response = (await this.addVehicleService.onGetMethodAsyncBasicToken(UrlLink)).toPromise()
      .then((res: any) => {
        return res?.Result;
      })
      .catch((err) => { });
    return response;

  }


  claimTypeText = (option: any) => {
    if (!option) return '';
    let index = this.claimTypeList.findIndex((make: any) => make.Code == option);
    return this.claimTypeList[index].CodeDescription;
  }
  onDisplayPlateCode = (code: any) => {
    if (!code) return '';
    let index = this.plateCodeList.findIndex((obj: any) => obj.Code == code);
    return this.plateCodeList[index].CodeDescription;
  }
  onDisplayInsurComp = (code: any) => {
    if (!code) return '';
    let index = this.insurCompanyList.findIndex((obj: any) => obj.Code == code);
    return this.insurCompanyList[index].CodeDescription;
  }
  private _filter(value: any, data: any[]): any[] {
    if (value == null) {
      value = '';
    }
    const filterValue = value.toLowerCase();
    return data.filter((option) => option?.CodeDescription?.toLowerCase().includes(filterValue));
  }


  onGetPolicyInformation(){

  }



  onDateFormatt(data: any) {
    var formattDate = data;
    var date: any = moment(formattDate, 'DD-MM-YYYY');
    return new Date(date.format('YYYY-MM-DD'));
  }

  async onClaimEdit(claim: any) {
    let UrlLink = `${this.ApiUrl1}api/claiminfo/get`;

    let ReqObj = {
      "InsuranceId": claim?.InsuranceId,
      "BranchCode": claim?.BranchCode,
      "RegionCode": claim?.RegionCode,
      "ClaimNumber": claim?.ClaimNumber,
      "AccidentNumber": claim?.AccidentNumber,
      "ClaimReferenceNumber": claim?.ClaimReferenceNumber,

    };
    (await this.addVehicleService.onPostMethodAsync(UrlLink, ReqObj)).subscribe(
      (data: any) => {
        console.log(data)
        if (data?.Message == "Success") {

          let AccidentInformation = data?.Result?.AccidentInformation;
          let DriverInformation = data?.Result?.DriverInformation;
          let RecoveryInformation = data?.Result?.RecoveryInformation;
          this.f.AccidentDate.setValue(this.onDateFormatt(AccidentInformation?.AccidentDate));
          this.f.AccidentLocation.setValue(AccidentInformation?.AccidentLocation);
          this.f.AccidentDescription.setValue(AccidentInformation?.AccidentDescription);
          this.f.ClaimTypeId.setValue(AccidentInformation?.ClaimTypeId);
          this.f.ReserveAmount.setValue(AccidentInformation?.ReserveAmount);
          this.f.ClaimNumber.setValue(AccidentInformation?.ClaimNumber);

          this.f.LicenceNumber.setValue(DriverInformation?.LicenceNumber);
          this.f.DriverDateOfBirth.setValue(this.onDateFormatt(DriverInformation?.DriverDateOfBirth));
          this.f.LicenceValidUpto.setValue(this.onDateFormatt(DriverInformation?.LicenceValidUpto));
          this.f.Gender.setValue(DriverInformation?.Gender);
          this.AccidentNumber = AccidentInformation?.AccidentNumber;
          this.ClaimReferenceNumber=claim?.ClaimReferenceNumber;
          this.PolicyReferenceNumber=claim?.PolicyReferenceNumber;

          this.f.CivilId.setValue(RecoveryInformation?.CivilId);
          this.f.PlateCode.setValue(RecoveryInformation?.PlateCode);
          this.f.PlateNumber.setValue(RecoveryInformation?.PlateNumber);
          this.f.VehicleChassisNumber.setValue(RecoveryInformation?.VehicleChassisNumber);
          this.f.InsuranceId.setValue(RecoveryInformation?.InsuranceId);

        }
      },
      (err) => { }
    );
  }


  onSaveClaimInfo() {
    let userDetails = this.userDetails?.LoginResponse;
    let UrlLink = '';
    if (this.claimEditReq?.AccidentNumber != '' && this.claimEditReq?.AccidentNumber != null) {
      UrlLink = `${this.ApiUrl1}api/update/claim`;
    } else {
      UrlLink = `${this.ApiUrl1}api/create/claim`;
    }
    let ReqObj = {
      "AccidentInformation": {
        "AccidentDate": this.datePipe.transform(this.f.AccidentDate.value, "dd/MM/yyyy"),
        "AccidentDescription": this.f.AccidentDescription.value,
        "AccidentLocation": this.f.AccidentLocation.value,
        "ClaimNumber": this.f.ClaimNumber.value,
        "ReserveAmount": this.f.ReserveAmount.value,
        "ClaimTypeId": this.f.ClaimTypeId.value,
        "PolicyReferenceNumber": this.PolicyReferenceNumber
      },
      "CommonInformation": {
        "ClaimReferenceNumber": this.ClaimReferenceNumber,
        "PolicyReferenceNumber": this.PolicyReferenceNumber,
        "AccidentNumber": this.AccidentNumber,
        "BranchCode": userDetails?.BranchCode,
        "CreatedBy": userDetails?.LoginId,
        "InsuranceId": userDetails?.InsuranceId,
        "RegionCode": userDetails?.RegionCode,
        "VehicleChassisNumber": this.VehicleChassisNumber,
        "VehicleCode": this.VehicleCode
      },
      "DriverInformation": {
        "DriverDateOfBirth": this.datePipe.transform(this.f.DriverDateOfBirth.value, "dd/MM/yyyy"),
        "Gender": this.f.Gender.value,
        "LicenceNumber": this.f.LicenceNumber.value,
        "LicenceValidUpto": this.datePipe.transform(this.f.LicenceValidUpto.value, "dd/MM/yyyy"),
      },
      "RecoveryInformation": {
        "CivilId": this.f.CivilId.value,
        "PlateCode": this.f.PlateCode.value,
        "PlateNumber": this.f.PlateNumber.value,
        "VehicleChassisNumber": this.f.VehicleChassisNumber.value,
        "InsuranceId": this.f.InsuranceId.value,
      }
    }
    console.log(ReqObj)
    this.addVehicleService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        if (data?.Message == 'Success') {
          console.log(data)
          sessionStorage.removeItem("claimEditReq");
          if (data?.Result?.Response == 'Saved Successfully') {
            console.log(data?.Result?.Response)
            this.toaster.open({
              text: 'Claim Intimated Successfully',
              caption: 'Submitted',
              type: 'success',
            });
          }
          if (data?.Result?.Response == 'Updated Succesfully') {
            console.log(data?.Result?.Response)
            this.toaster.open({
              text: 'Claim Updated Successfully',
              caption: 'Submitted',
              type: 'success',
            });
          }
          this.moveNext.emit();
        }
      },
      (err) => { }
    );
  }

}

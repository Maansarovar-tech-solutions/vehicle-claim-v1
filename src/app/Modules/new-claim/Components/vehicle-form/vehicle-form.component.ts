import { AppComponent } from './../../../../app.component';
import { DatePipe } from '@angular/common';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Toaster } from 'ngx-toast-notifications';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as Mydatas from '../../../../../assets/app-config.json';
import { NewClaimService } from '../../new-claim.service';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit {
  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;

  public searchValue: any = '';
  public isVehicleData: boolean = false;
  public vehicleData: any;
  public insuranceTypeId: any = '';
  public insuranceTypeList: any = [];
  public filterinsuranceTypeList!: Observable<any[]>;
  public vehicleMakeId: any = '';
  public makeList: any[] = [];
  public filterMakeList!: Observable<any[]>;
  public vehicleModelId: any = '';
  public modelList: any[] = [];
  public filterModelList!: Observable<any[]>;
  public vehicleBodyId: any = '';
  public vehicleBodyList: any[] = [];
  public filterVehicleBodyList!: Observable<any[]>;
  public registrationTypeId: any = '';
  public registrationTypeList: any[] = [];
  public filterRegistrationTypeList!: Observable<any[]>;
  public colorId: any = '';
  public colorList: any;
  public filterColorCodeList!: Observable<any[]>;
  public plateCodeId: any = '';
  public plateCodeList: any = [];
  public filterPlateCodeList!: Observable<any[]>;
  public yearList: any[] = [];
  public filterYearList!: Observable<any[]>;


  public policyForm!: FormGroup;
  public insuranceForm!: FormGroup;
  public userDetails: any;
  public bodyId: any = '';
  public PolicyReferenceNumber: any = '';
  public VehicleCode: any = '';
  public EditReq: any = {};
  public isVehicleModel: boolean = true;
  public isPolicyForm:boolean=false;
  public claimDetails: any;
  public isClaimDetails: boolean = false;
  public claimType:any='';
  public claimTypeId:any='';
  public minDate!: Date;
  @Output('moveNext') moveNext = new EventEmitter();
  public InsuranceEndDate: any;
  constructor(
    private newClaimService: NewClaimService,
    private _formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private toaster: Toaster,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public app:AppComponent

  ) {
    this.minDate = new Date();
    this.userDetails = this.app.decryptData(sessionStorage.getItem("Userdetails"));
    this.claimType = sessionStorage.getItem("claimType") || '';
    this.claimTypeId = sessionStorage.getItem("claimTypeId") || '';

    this.activatedRoute.queryParams.subscribe(
      (params: any) => {

        if(params?.isPolicyForm || params?.isClaimForm){
          this.isPolicyForm = params?.isPolicyForm;
          console.log(params)
        }else{
          this.EditReq = params;
          this.PolicyReferenceNumber = params?.PolicyReferenceNumber;
          this.VehicleCode = params?.VehicleCode;
        }

      }
    );
    this.onInitialFetchData();

  }

  ngOnInit(): void {

  }

  async onInitialFetchData() {
    this.onCreateFormControl();

    this.insuranceTypeList = await this.onGetInsuranceTypList() || [];
    console.log("InsuranceList", this.insuranceTypeList)
    this.filterinsuranceTypeList = this.f.InsuranceTypeId.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, this.insuranceTypeList)),
    );

    this.makeList = await this.onGetVehicleMakeList();
    console.log("MakeList", this.insuranceTypeList)
    this.filterMakeList = this.f.VehicleMakeId.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, this.makeList)),
    );

    this.registrationTypeList = await this.onGetRegistrationTypList() || [];
    this.filterRegistrationTypeList = this.f.RegistrationTypeId.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, this.registrationTypeList)),
    );

    this.colorList = await this.onGetColorList() || [];
    this.filterColorCodeList = this.f.ColorId.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, this.colorList)),
    );

    this.plateCodeList = await this.onGetPlateCodeList() || [];
    this.filterPlateCodeList = this.f.PlateCode.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, this.plateCodeList)),
    );
    this.onGetYears();
    if (Object.keys(this.EditReq).length != 0) {
      await this.onPolicyEdit(this.EditReq);
      this.onGetClaimDetails(this.EditReq?.VehicleChassisNumber);

    }


  }

  onSearchVehicle() {
    this.isClaimDetails = false;

    let UrlLink = `${this.ApiUrl1}api/searchvehicleinfo`;
    let ReqObj = {
      "VehicleChassisNumber": this.searchValue
    }
    this.newClaimService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        if (data?.Message == "Success") {
          this.vehicleData = data?.Result;
          let obj = {
            InsuranceId: this.vehicleData?.CommonInformation?.InsuranceId,
            PolicyNumber: this.vehicleData?.PolicyInformation?.PolicyNumber,
            VehicleChassisNumber: this.vehicleData?.VehicleDetails?.VehicleChassisNumber,
            PolicyReferenceNumber: this.vehicleData?.PolicyInformation?.PolicyReferenceNumber,
            VehicleCode: this.vehicleData?.VehicleDetails?.VehicleCode
          }
          this.onGetClaimDetails(this.vehicleData?.VehicleDetails?.VehicleChassisNumber);
          this.onPolicyEdit(obj);
        }
      },
      (err) => { }
    );
  }

  onCreateFormControl() {

    this.policyForm = this._formBuilder.group({
      PolicyNumber: ['', Validators.required],
      CivilId: ['', Validators.required],
      InsuranceStartDate: ['', Validators.required],
      InsuranceEndDate: ['', Validators.required],
      InsuranceTypeId: ['', Validators.required],

      VehicleMakeId: ['', Validators.required],
      VehicleModelId: ['', Validators.required],
      RegistrationTypeId: ['', Validators.required],
      VehicleBodyId: ['', Validators.required],
      ManufactureYear: ['', Validators.required],
      ColorId: ['', Validators.required],
      PlateCode: ['', Validators.required],
      PlateNumber: ['', Validators.required],
      VehicleChassisNumber: ['', Validators.required],
      VehicleEngineNumber: ['', Validators.required],

    });
  }

  get f() { return this.policyForm.controls; };

  async onGetInsuranceTypList() {
    let UrlLink = `${this.ApiUrl1}dropdown/insurancetypes`
    let response = (await this.newClaimService.onGetMethodAsync(UrlLink)).toPromise()
      .then((res: any) => {
        return res?.Result;
      })
      .catch((err) => { });
    return response;

  }

  async onGetVehicleMakeList() {
    let UrlLink = `${this.ApiUrl1}dropdown/vehiclemake`
    let response = (await this.newClaimService.onGetMethodAsync(UrlLink)).toPromise()
      .then((res: any) => {
        return res?.Result;
      })
      .catch((err) => { });
    return response;

  }

  async onChangeVehicleMake(Code: any) {
    this.modelList = await this.onGetVehicleModelList(Code);
    this.filterModelList = this.f.VehicleModelId.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterModelList(value, this.modelList)),
    );
  }
  async onChangeVehicleModel(Code: any) {
    let index = this.modelList.findIndex((obj: any) => obj.ModelId == Code);

    this.f.VehicleBodyId.setValue(this.modelList[index].BodyDescription);
    this.vehicleBodyId = this.modelList[index].BodyId
  }

  async onGetVehicleModelList(makeId: any) {
    this.isVehicleModel = true;
    let UrlLink = `${this.ApiUrl1}dropdown/makemodelbodytypes/${makeId}`;
    let response = (await this.newClaimService.onGetMethodAsync(UrlLink)).toPromise()
      .then((res: any) => {
        this.isVehicleModel = false;

        return res?.Result;

      })
      .catch((err) => { });
    return response;
  }
  async onGetRegistrationTypList() {
    let UrlLink = `${this.ApiUrl1}dropdown/registrationtypes`
    let response = (await this.newClaimService.onGetMethodAsync(UrlLink)).toPromise()
      .then((res: any) => {
        return res?.Result;
      })
      .catch((err) => { });
    return response;

  }

  async onGetColorList() {
    let UrlLink = `${this.ApiUrl1}dropdown/colors`;
    let response = (await this.newClaimService.onGetMethodAsync(UrlLink)).toPromise()
      .then((res: any) => {
        return res?.Result;
      })
      .catch((err) => { });
    return response;

  }
  async onGetPlateCodeList() {
    let UrlLink = `${this.ApiUrl1}dropdown/platecodes`;
    let response = (await this.newClaimService.onGetMethodAsync(UrlLink)).toPromise()
      .then((res: any) => {
        return res?.Result;
      })
      .catch((err) => { });
    return response;

  }
  onGetYears() {
    var NowYear = new Date().getFullYear();
    var Years = [];
    for (var Y = NowYear; Y >= NowYear - 19; Y--) {
      Years.push(Y.toString());
    }
    this.yearList = Years;
    this.filterYearList = this.f.ManufactureYear.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterYear(value)),
    );
  }

  onDisplayInsuranceComp = (option: any) => {
    if (!option) return '';
    let index = this.insuranceTypeList.findIndex((obj: any) => obj.Code == option);
    return this.insuranceTypeList[index].CodeDescription;
  }

  onDisplayVehicleMake = (code: any) => {
    if (!code) return '';
    let index = this.makeList.findIndex((obj: any) => obj.Code == code);
    return this.makeList[index].CodeDescription;
  }

  onDisplayVehicleModel = (code: any) => {
    if (!code) return '';
    let index = this.modelList.findIndex((obj: any) => obj.ModelId == code);
    return this.modelList[index].ModelDescription;
  }
  onDisplayRegistrationType = (code: any) => {
    if (!code) return '';
    let index = this.registrationTypeList.findIndex((obj: any) => obj.Code == code);
    return this.registrationTypeList[index].CodeDescription;
  }
  onDisplayColorName = (code: any) => {
    if (!code) return '';
    let index = this.colorList.findIndex((obj: any) => obj.Code == code);
    return this.colorList[index].CodeDescription;
  }
  onDisplayPlateCode = (code: any) => {
    if (!code) return '';
    let index = this.plateCodeList.findIndex((obj: any) => obj.Code == code);
    return this.plateCodeList[index].CodeDescription;
  }


  private _filterYear(value: any): any[] {
    if (value == null) {
      value = '';
    }
    const filterValue = value.toLowerCase();
    return this.yearList.filter((option) => option.toLowerCase().includes(filterValue));
  }

  private _filterModelList(value: any, data: any[]): any[] {
    console.log(value)
    if (value == null) {
      value = '';
    }
    const filterValue = value.toLowerCase();
    return data.filter((option) => option?.ModelDescription?.toLowerCase().includes(filterValue));
  }

  private _filter(value: any, data: any[]): any[] {
    if (value == null) {
      value = '';
    }
    const filterValue = value.toLowerCase();
    return data.filter((option) => option?.CodeDescription?.toLowerCase().includes(filterValue));
  }


  onDateFormatt(data: any) {
    var formattDate = data;
    var date: any = moment(formattDate, 'DD-MM-YYYY');
    return new Date(date.format('YYYY-MM-DD'));
  }

  onDateChange(startdate:any) {
    console.log(startdate);
   let date = startdate.value;
   let addedDate = date.setDate(date.getDate() + 364);
  //  this.InsuranceEndDate = new Date(addedDate)
  }


  async onPolicyEdit(edit: any) {
    console.log(edit)
    let UrlLink = `${this.ApiUrl1}api/policyinfo/get`;
    let userDetails = this.userDetails?.LoginResponse;
    let ReqObj = {
      "InsuranceId": edit?.InsuranceId,
      "BranchCode": userDetails?.BranchCode,
      "RegionCode": userDetails?.RegionCode,
      "PolicyNumber": edit?.PolicyNumber,
      "VehicleChassisNumber": edit?.VehicleChassisNumber
    };

    let response = (await this.newClaimService.onPostMethodAsync(UrlLink, ReqObj)).toPromise()
      .then(async (res: any) => {
        console.log(res)
        if (res?.Message == "Success") {
          let PolicyInformation = res?.Result?.PolicyInformation;
          let VehicleDetails = res?.Result?.VehicleDetails;
          this.f.PolicyNumber.setValue(PolicyInformation?.PolicyNumber);
          this.f.CivilId.setValue(PolicyInformation?.CivilId);
          this.f.InsuranceStartDate.setValue(this.onDateFormatt(PolicyInformation?.InsuranceStartDate));
          this.f.InsuranceEndDate.setValue(this.onDateFormatt(PolicyInformation?.InsuranceEndDate));

          this.f.InsuranceTypeId.setValue(PolicyInformation?.InsuranceTypeId);
          this.f.VehicleMakeId.setValue(VehicleDetails?.VehicleMakeId);
          this.modelList = await this.onGetVehicleModelList(VehicleDetails?.VehicleMakeId);
          if (this.modelList.length > 0) {
            this.f.VehicleModelId.setValue(VehicleDetails?.VehicleModelId);
            this.onChangeVehicleModel(VehicleDetails?.VehicleModelId);
          }
          this.f.RegistrationTypeId.setValue(VehicleDetails.RegistrationTypeId);
          this.f.ManufactureYear.setValue(VehicleDetails?.ManufactureYear);
          this.f.ColorId.setValue(VehicleDetails?.ColorId);
          this.f.PlateCode.setValue(VehicleDetails?.PlateCode);
          this.f.PlateNumber.setValue(VehicleDetails?.PlateNumber);

          this.f.VehicleChassisNumber.setValue(VehicleDetails?.VehicleChassisNumber);
          this.f.VehicleEngineNumber.setValue(VehicleDetails?.VehicleEngineNumber);

        }

      })
      .catch((err) => { });
    return response;

  }

  onSavePolicyInfo() {
    let userDetails = this.userDetails?.LoginResponse;
    let UrlLink = `${this.ApiUrl1}api/pushpolicyinfo`;

    if (this.PolicyReferenceNumber != '' && this.PolicyReferenceNumber != undefined) {
      UrlLink = `${this.ApiUrl1}api/update/policyinfo`;
    }
    console.log(
      "Start",this.f.InsuranceStartDate.value,
      "End",this.InsuranceEndDate
    )
    let ReqObj = {
      "CommonInformation": {
        "BranchCode": userDetails?.BranchCode,
        "CreatedBy": userDetails?.LoginId,
        "InsuranceId": userDetails?.InsuranceId,
        "RegionCode": userDetails?.RegionCode,
      },
      "PolicyInformation": {
        "PolicyNumber": this.f.PolicyNumber.value,
        "CivilId": this.f.CivilId.value,
        "InsuranceStartDate":moment(this.f.InsuranceStartDate.value).format("DD/MM/YYYY"),
        "InsuranceEndDate":moment(this.f.InsuranceEndDate.value).format("DD/MM/YYYY"),
        "InsuranceTypeId": this.f.InsuranceTypeId.value,
        "PolicyReferenceNumber": this.PolicyReferenceNumber
      },
      "VehicleDetails": [
        {
          "VehicleMakeId": this.f.VehicleMakeId.value,
          "VehicleModelId": this.f.VehicleModelId.value,
          "VehicleBodyId": this.vehicleBodyId,
          "RegistrationTypeId": this.f.RegistrationTypeId.value,
          "ManufactureYear": this.f.ManufactureYear.value,
          "ColorId": this.f.ColorId.value,
          "PlateCode": this.f.PlateCode.value,
          "PlateNumber": this.f.PlateNumber.value,
          "VehicleChassisNumber": this.f.VehicleChassisNumber.value,
          "VehicleEngineNumber": this.f.VehicleEngineNumber.value,
          "VehicleCode": this.VehicleCode,
        }
      ]
    }
    this.newClaimService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        console.log(data);
        if (data?.Message == 'Success') {
          if (data?.Result?.Response == 'Saved Successfully') {
            this.toaster.open({
              text: 'Policy Created Successfully',
              caption: 'Submitted',
              type: 'success',
            });

          }
          if (data?.Result?.Response == 'Updated Successfully') {
            this.toaster.open({
              text: 'Policy Updated Successfully',
              caption: 'Submitted',
              type: 'success',
            });
          }
          this.moveNext.emit({VehicleChassisNumber:data?.Result?.VehicleChassisNumber,PolicyNumber:this.f.PolicyNumber.value});
        }

      },
      (err) => { }
    );
  }

  onGetClaimDetails(chassis: any) {
    let UrlLink = `${this.ApiUrl1}api/vehicle/claims`;
    let ReqObj = {
      "VehicleChassisNumber": chassis

    }
    this.newClaimService.onPostMethodSync(UrlLink, ReqObj).subscribe(
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
  onViewClaimData(ClaimReferenceNumber:any) {
    this.router.navigate(['Home/Vehicle-Search/Claim-Details'],{queryParams:ClaimReferenceNumber});
  }

}

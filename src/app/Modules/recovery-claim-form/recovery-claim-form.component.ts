import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Toaster } from 'ngx-toast-notifications';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as Mydatas from '../../app-config.json';
import { NewClaimService } from '../new-claim/new-claim.service';

@Component({
  selector: 'app-recovery-claim-form',
  templateUrl: './recovery-claim-form.component.html',
  styleUrls: ['./recovery-claim-form.component.css'],
})
export class RecoveryClaimFormComponent implements OnInit {
  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;
  public claimForm!: FormGroup;

  public userDetails: any;
  public searchValue: any = '';

  public plateCodeList: any = [];
  public filterPlateCodeListOur!: Observable<any[]>;
  public filterPlateCodeListOther!: Observable<any[]>;
  public makeList: any[] = [];
  public filterMakeListOur!: Observable<any[]>;
  public filterMakeListOther!: Observable<any[]>;
  public modelList: any[] = [];
  public filterModelListOur!: Observable<any[]>;
  public filterModelListOther!: Observable<any[]>;

  public claimTypeList: any[] = [];
  public filterclaimTypeList!: Observable<any[]>;
  public insurCompanyList: any[] = [];
  public filterinsurCompanyLis!: Observable<any[]>;
  public claimEditReq: any;
  public AccidentNumber: any = '';
  public ClaimReferenceNumber = '';
  public PolicyReferenceNumber = '';
  public VehicleChassisNumber: any;
  public VehicleCode = '';
  public claimTypeId: any = '';
  public policyAndVehicle: any;
  @Input('VehicleChassisNumber') VehicleDetails: any = '';
  @Output('moveNext') moveNext = new EventEmitter();

  public isVehicleData: boolean = false;
  public vehicleData: any;
  public insuranceTypeId: any = '';
  public insuranceTypeList: any = [];
  public filterinsuranceTypeList!: Observable<any[]>;
  public vehicleMakeId: any = '';
  public vehicleModelId: any = '';
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
  public yearList: any[] = [];
  public filterYearList!: Observable<any[]>;

  public bodyId: any = '';
  public EditReq: any = {};
  public isVehicleModel: boolean = true;
  public isPolicyForm: boolean = false;
  public claimDetails: any;
  public isClaimDetails: boolean = false;
  public claimType: any = '';
  public minDate!: Date;
  public InsuranceEndDate: any;

  constructor(
    private _formBuilder: FormBuilder,
    private newClaimService: NewClaimService,
    private toaster: Toaster,
    private router: Router
  ) {
    this.userDetails = JSON.parse(
      sessionStorage.getItem('Userdetails') || '{}'
    );
    this.claimEditReq = JSON.parse(
      sessionStorage.getItem('claimEditReq') || '{}'
    );
  }

  ngOnInit(): void {
    this.onCreateFormControl();
    // this.onGetPolicyInformation();
    this.onInitialFetchData();

    combineLatest([
      this.f.VehicleValue.valueChanges.pipe(startWith(0)),
      this.f.RepairCost.valueChanges.pipe(startWith(0)),
      this.f.NoOfDays.valueChanges.pipe(startWith(0)),
      this.f.PerDayCost.valueChanges.pipe(startWith(0)),
    ]).subscribe(([VehicleValue, RepairCost, NoOfDays, PerDayCost]) => {
      const dataList = [VehicleValue, RepairCost, NoOfDays, PerDayCost];
      let vehicleAndRepair = dataList[0] + dataList[1];
      let noDaysAndPerDay = dataList[2] * dataList[3];
      let totalValue = vehicleAndRepair + noDaysAndPerDay;
      this.f.TotalValue.setValue(totalValue);
    });
  }

  onCreateFormControl() {
    this.claimForm = this._formBuilder.group({
      AccidentDate: ['', Validators.required],
      AccidentLocation: ['', Validators.required],
      AccidentDescription: ['', Validators.required],
      ClaimTypeId: ['', Validators.required],
      PoliceReferenceNo: ['', Validators.required],
      ClaimNumber: ['', Validators.required],
      SalvageAmount: [''],
      SalvagePortal: [true],

      LicenceNumber: [''],
      DriverDateOfBirth: [''],
      LicenceValidUpto: [''],
      Gender: ['1'],
      VehicleValue: [0, Validators.required],
      RepairCost: [0, Validators.required],
      NoOfDays: [0, Validators.required],
      PerDayCost: [0, Validators.required],
      TotalValue: [0, Validators.required],

      OtherPlateCode: ['', Validators.required],
      OtherPlateNumber: ['', Validators.required],
      OtherCivilId: ['', Validators.required],
      OtherVehicleChassisNumber: ['', Validators.required],
      InsuranceId: ['', Validators.required],

      PolicyNumber: ['', Validators.required],
      OurCivilId: ['', Validators.required],
      InsuranceStartDate: ['', Validators.required],
      InsuranceEndDate: ['', Validators.required],
      InsuranceTypeId: ['', Validators.required],

      VehicleMakeIdOur: ['', Validators.required],
      VehicleMakeIdOther: ['', Validators.required],
      VehicleModelIdOur: ['', Validators.required],
      VehicleModelIdOther: ['', Validators.required],

      RegistrationTypeId: ['', Validators.required],
      VehicleBodyId: ['', Validators.required],
      ManufactureYear: ['', Validators.required],
      ColorId: ['', Validators.required],
      OurPlateCode: ['', Validators.required],
      OurPlateNumber: ['', Validators.required],
      OurVehicleChassisNumber: ['', Validators.required],
      VehicleEngineNumber: ['', Validators.required],
    });
  }
  get f() {
    return this.claimForm.controls;
  }

  async onInitialFetchData() {
    this.claimTypeList = (await this.onGetClaimTypeList()) || [];
    this.filterclaimTypeList = this.f.ClaimTypeId.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, this.claimTypeList))
    );

    this.plateCodeList = (await this.onGetPlateCodeList()) || [];
    console.log(this.plateCodeList);
    this.filterPlateCodeListOur = this.f.OurPlateCode.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, this.plateCodeList))
    );
    this.filterPlateCodeListOther = this.f.OtherPlateCode.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, this.plateCodeList))
    );

    this.insurCompanyList = (await this.onGetInsuranceCompList()) || [];
    console.log(this.insurCompanyList);
    this.filterinsurCompanyLis = this.f.InsuranceId.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, this.insurCompanyList))
    );

    this.f.ClaimTypeId.setValue(this.claimTypeId);
    const ctrl = this.claimForm.get('ClaimTypeId')!;
    if (this.claimTypeId == '11') {
      ctrl.disable();
    }

    this.insuranceTypeList = (await this.onGetInsuranceTypList()) || [];
    console.log('InsuranceList', this.insuranceTypeList);
    this.filterinsuranceTypeList = this.f.InsuranceTypeId.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, this.insuranceTypeList))
    );

    this.makeList = await this.onGetVehicleMakeList();
    console.log('MakeList', this.insuranceTypeList);
    this.filterMakeListOur = this.f.VehicleMakeIdOur.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, this.makeList))
    );
    this.filterMakeListOther = this.f.VehicleMakeIdOther.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, this.makeList))
    );

    this.registrationTypeList = (await this.onGetRegistrationTypList()) || [];
    this.filterRegistrationTypeList =
      this.f.RegistrationTypeId.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value, this.registrationTypeList))
      );

    this.colorList = (await this.onGetColorList()) || [];
    this.filterColorCodeList = this.f.ColorId.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, this.colorList))
    );

    this.onGetYears();
    if (Object.keys(this.EditReq).length != 0) {
      await this.onPolicyEdit(this.EditReq);
      this.onGetClaimDetails(this.EditReq?.VehicleChassisNumber);
    }

    if (Object.keys(this.claimEditReq).length !== 0) {
      console.log(this.claimEditReq);
      this.searchValue = this.claimEditReq?.VehicleChassisNumber;
      await this.onClaimEdit(this.claimEditReq);
    }
  }

  async onGetClaimTypeList() {
    let UrlLink = `${this.ApiUrl1}dropdown/claimtypes`;
    let response = (await this.newClaimService.onGetMethodAsync(UrlLink))
      .toPromise()
      .then((res: any) => {
        return res?.Result;
      })
      .catch((err) => {});
    return response;
  }

  async onGetInsuranceCompList() {
    let UrlLink = `${this.ApiUrl1}basicauth/insurancecompanies`;
    let response = (
      await this.newClaimService.onGetMethodAsyncBasicToken(UrlLink)
    )
      .toPromise()
      .then((res: any) => {
        return res?.Result;
      })
      .catch((err) => {});
    return response;
  }

  claimTypeText = (option: any) => {
    if (!option) return '';
    let index = this.claimTypeList.findIndex(
      (make: any) => make.Code == option
    );
    return this.claimTypeList[index].CodeDescription;
  };
  onDisplayPlateCode = (code: any) => {
    if (!code) return '';
    let index = this.plateCodeList.findIndex((obj: any) => obj.Code == code);
    return this.plateCodeList[index].CodeDescription;
  };
  onDisplayInsurComp = (code: any) => {
    if (!code) return '';
    let index = this.insurCompanyList.findIndex((obj: any) => obj.Code == code);
    return this.insurCompanyList[index].CodeDescription;
  };

  async onGetInsuranceTypList() {
    let UrlLink = `${this.ApiUrl1}dropdown/insurancetypes`;
    let response = (await this.newClaimService.onGetMethodAsync(UrlLink))
      .toPromise()
      .then((res: any) => {
        return res?.Result;
      })
      .catch((err) => {});
    return response;
  }

  async onGetVehicleMakeList() {
    let UrlLink = `${this.ApiUrl1}dropdown/vehiclemake`;
    let response = (await this.newClaimService.onGetMethodAsync(UrlLink))
      .toPromise()
      .then((res: any) => {
        return res?.Result;
      })
      .catch((err) => {});
    return response;
  }

  async onChangeVehicleMake(Code: any) {
    this.modelList = await this.onGetVehicleModelList(Code);
    this.filterModelListOur = this.f.VehicleModelIdOur.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterModelList(value, this.modelList))
    );
    this.filterModelListOther = this.f.VehicleModelIdOther.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterModelList(value, this.modelList))
    );
  }
  async onChangeVehicleModel(Code: any) {
    let index = this.modelList.findIndex((obj: any) => obj.ModelId == Code);
    this.f.VehicleBodyId.setValue(this.modelList[index].BodyDescription);
    this.vehicleBodyId = this.modelList[index].BodyId;
  }

  async onGetVehicleModelList(makeId: any) {
    this.isVehicleModel = true;
    let UrlLink = `${this.ApiUrl1}dropdown/makemodelbodytypes/${makeId}`;
    let response = (await this.newClaimService.onGetMethodAsync(UrlLink))
      .toPromise()
      .then((res: any) => {
        this.isVehicleModel = false;

        return res?.Result;
      })
      .catch((err) => {});
    return response;
  }
  async onGetRegistrationTypList() {
    let UrlLink = `${this.ApiUrl1}dropdown/registrationtypes`;
    let response = (await this.newClaimService.onGetMethodAsync(UrlLink))
      .toPromise()
      .then((res: any) => {
        return res?.Result;
      })
      .catch((err) => {});
    return response;
  }

  async onGetColorList() {
    let UrlLink = `${this.ApiUrl1}dropdown/colors`;
    let response = (await this.newClaimService.onGetMethodAsync(UrlLink))
      .toPromise()
      .then((res: any) => {
        return res?.Result;
      })
      .catch((err) => {});
    return response;
  }
  async onGetPlateCodeList() {
    let UrlLink = `${this.ApiUrl1}dropdown/platecodes`;
    let response = (await this.newClaimService.onGetMethodAsync(UrlLink))
      .toPromise()
      .then((res: any) => {
        return res?.Result;
      })
      .catch((err) => {});
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
      map((value) => this._filterYear(value))
    );
  }

  onDisplayInsuranceComp = (option: any) => {
    if (!option) return '';
    let index = this.insuranceTypeList.findIndex(
      (obj: any) => obj.Code == option
    );
    return this.insuranceTypeList[index].CodeDescription;
  };

  onDisplayVehicleMake = (code: any) => {
    if (!code) return '';
    let index = this.makeList.findIndex((obj: any) => obj.Code == code);
    return this.makeList[index].CodeDescription;
  };

  onDisplayVehicleModel = (code: any) => {
    if (!code) return '';
    let index = this.modelList.findIndex((obj: any) => obj.ModelId == code);
    return this.modelList[index].ModelDescription;
  };
  onDisplayVehicleModelother = (code: any) => {
    if (!code) return '';
    let index = this.modelList.findIndex((obj: any) => obj.ModelId == code);
    return this.modelList[index].ModelDescription;
  };
  onDisplayRegistrationType = (code: any) => {
    if (!code) return '';
    let index = this.registrationTypeList.findIndex(
      (obj: any) => obj.Code == code
    );
    return this.registrationTypeList[index].CodeDescription;
  };
  onDisplayColorName = (code: any) => {
    if (!code) return '';
    let index = this.colorList.findIndex((obj: any) => obj.Code == code);
    return this.colorList[index].CodeDescription;
  };

  private _filterYear(value: any): any[] {
    if (value == null) {
      value = '';
    }
    const filterValue = value.toLowerCase();
    return this.yearList.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  private _filterModelList(value: any, data: any[]): any[] {
    console.log(value);
    if (value == null) {
      value = '';
    }
    const filterValue = value.toLowerCase();
    return data.filter((option) =>
      option?.ModelDescription?.toLowerCase().includes(filterValue)
    );
  }

  async onClaimEdit(claim: any) {
    let UrlLink = `${this.ApiUrl1}api/claiminfo/get`;

    let ReqObj = {
      InsuranceId: claim?.InsuranceId,
      BranchCode: claim?.BranchCode,
      RegionCode: claim?.RegionCode,
      ClaimNumber: claim?.ClaimNumber,
      AccidentNumber: claim?.AccidentNumber,
      ClaimReferenceNumber: claim?.ClaimReferenceNumber,
    };
    (await this.newClaimService.onPostMethodAsync(UrlLink, ReqObj)).subscribe(
      (data: any) => {
        console.log(data);
        if (data?.Message == 'Success') {
          let AccidentInformation = data?.Result?.AccidentInformation;
          let DriverInformation = data?.Result?.DriverInformation;
          let RecoveryInformation = data?.Result?.RecoveryInformation;
          this.f.AccidentDate.setValue(
            this.onDateFormatt(AccidentInformation?.AccidentDate)
          );
          this.f.AccidentLocation.setValue(
            AccidentInformation?.AccidentLocation
          );
          this.f.AccidentDescription.setValue(
            AccidentInformation?.AccidentDescription
          );
          this.f.ClaimTypeId.setValue(AccidentInformation?.ClaimTypeId);
          this.f.ClaimNumber.setValue(AccidentInformation?.ClaimNumber);

          this.f.LicenceNumber.setValue(DriverInformation?.LicenceNumber);
          // this.f.DriverDateOfBirth.setValue(this.onDateFormatt(DriverInformation?.DriverDateOfBirth));
          // this.f.LicenceValidUpto.setValue(this.onDateFormatt(DriverInformation?.LicenceValidUpto));
          // this.f.Gender.setValue(DriverInformation?.Gender);
          this.AccidentNumber = AccidentInformation?.AccidentNumber;
          this.ClaimReferenceNumber = claim?.ClaimReferenceNumber;
          this.PolicyReferenceNumber = claim?.PolicyReferenceNumber;

          this.f.CivilId.setValue(RecoveryInformation?.CivilId);
          this.f.PlateCode.setValue(RecoveryInformation?.PlateCode);
          this.f.PlateNumber.setValue(RecoveryInformation?.PlateNumber);
          this.f.VehicleChassisNumber.setValue(
            RecoveryInformation?.VehicleChassisNumber
          );
          this.f.InsuranceId.setValue(RecoveryInformation?.InsuranceId);
        }
      },
      (err) => {}
    );
  }

  async onPolicyEdit(edit: any) {
    console.log(edit);
    let UrlLink = `${this.ApiUrl1}api/policyinfo/get`;
    let userDetails = this.userDetails?.LoginResponse;
    let ReqObj = {
      InsuranceId: edit?.InsuranceId,
      BranchCode: userDetails?.BranchCode,
      RegionCode: userDetails?.RegionCode,
      PolicyNumber: edit?.PolicyNumber,
      VehicleChassisNumber: edit?.VehicleChassisNumber,
    };

    let response = (
      await this.newClaimService.onPostMethodAsync(UrlLink, ReqObj)
    )
      .toPromise()
      .then(async (res: any) => {
        console.log(res);
        if (res?.Message == 'Success') {
          let PolicyInformation = res?.Result?.PolicyInformation;
          let VehicleDetails = res?.Result?.VehicleDetails;
          this.f.PolicyNumber.setValue(PolicyInformation?.PolicyNumber);
          this.f.CivilId.setValue(PolicyInformation?.CivilId);
          this.f.InsuranceStartDate.setValue(
            this.onDateFormatt(PolicyInformation?.InsuranceStartDate)
          );
          this.f.InsuranceEndDate.setValue(
            this.onDateFormatt(PolicyInformation?.InsuranceEndDate)
          );

          this.f.InsuranceTypeId.setValue(PolicyInformation?.InsuranceTypeId);
          this.f.VehicleMakeId.setValue(VehicleDetails?.VehicleMakeId);
          this.modelList = await this.onGetVehicleModelList(
            VehicleDetails?.VehicleMakeId
          );
          if (this.modelList.length > 0) {
            this.f.VehicleModelId.setValue(VehicleDetails?.VehicleModelId);
            this.onChangeVehicleModel(VehicleDetails?.VehicleModelId);
          }
          this.f.RegistrationTypeId.setValue(VehicleDetails.RegistrationTypeId);
          this.f.ManufactureYear.setValue(VehicleDetails?.ManufactureYear);
          this.f.ColorId.setValue(VehicleDetails?.ColorId);
          this.f.PlateCode.setValue(VehicleDetails?.PlateCode);
          this.f.PlateNumber.setValue(VehicleDetails?.PlateNumber);

          this.f.VehicleChassisNumber.setValue(
            VehicleDetails?.VehicleChassisNumber
          );
          this.f.VehicleEngineNumber.setValue(
            VehicleDetails?.VehicleEngineNumber
          );
        }
      })
      .catch((err) => {});
    return response;
  }

  onGetPolicyInformation(obj: any) {
    let UrlLink = `${this.ApiUrl1}api/searchvehicleinfo`;
    let ReqObj = {
      VehicleChassisNumber: obj?.VehicleChassisNumber,
      PolicyNumber: obj?.PolicyNumber,
    };
    return this.newClaimService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        console.log('Search Data', data);
        if (data) {
          this.policyAndVehicle = data?.Result;
          this.claimTypeId = sessionStorage.getItem('claimTypeId');
          let VehicleDetails = data?.Result?.VehicleDetails;
          let PolicyInformation = data?.Result?.PolicyInformation;
          this.PolicyReferenceNumber = PolicyInformation?.PolicyReferenceNumber;
          this.VehicleChassisNumber = VehicleDetails?.VehicleChassisNumber;
          this.VehicleCode = VehicleDetails?.VehicleCode;
          this.f.LicenceNumber.setValue(PolicyInformation?.CivilId);
          var driverDOB = new Date();
          driverDOB.setFullYear(driverDOB.getFullYear() - 18);
          var licenValidDate = new Date();
          licenValidDate.setFullYear(licenValidDate.getFullYear() + 1);
          this.f.DriverDateOfBirth.setValue(driverDOB);
          this.f.LicenceValidUpto.setValue(licenValidDate);
          this.onSaveClaimInfo();
        }
      },
      (err) => {}
    );
  }

  onGetClaimDetails(chassis: any) {
    let UrlLink = `${this.ApiUrl1}api/vehicle/claims`;
    let ReqObj = {
      VehicleChassisNumber: chassis,
    };
    this.newClaimService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        console.log('claimDetails', data);
        if (data?.Message == 'Success') {
          this.claimDetails = data?.Result?.ClaimInformations;
          if (data?.Result?.ClaimInformations.length > 0) {
            this.isClaimDetails = true;
          }
        }
      },
      (err) => {}
    );
  }

  onSavePolicyInfo() {
    let userDetails = this.userDetails?.LoginResponse;
    let UrlLink = `${this.ApiUrl1}api/pushpolicyinfo`;

    if (
      this.PolicyReferenceNumber != '' &&
      this.PolicyReferenceNumber != undefined
    ) {
      UrlLink = `${this.ApiUrl1}api/update/policyinfo`;
    }

    let ReqObj = {
      CommonInformation: {
        BranchCode: userDetails?.BranchCode,
        CreatedBy: userDetails?.LoginId,
        InsuranceId: userDetails?.InsuranceId,
        RegionCode: userDetails?.RegionCode,
      },
      PolicyInformation: {
        PolicyNumber: this.f.PolicyNumber.value,
        CivilId: this.f.OurCivilId.value,
        InsuranceStartDate: moment(this.f.InsuranceStartDate.value).format(
          'DD/MM/YYYY'
        ),
        InsuranceEndDate: moment(this.f.InsuranceEndDate.value).format(
          'DD/MM/YYYY'
        ),
        InsuranceTypeId: this.f.InsuranceTypeId.value,
        PolicyReferenceNumber: this.PolicyReferenceNumber,
      },
      VehicleDetails: [
        {
          VehicleMakeId: this.f.VehicleMakeIdOur.value,
          VehicleModelId: this.f.VehicleModelIdOur.value,
          VehicleBodyId: this.vehicleBodyId,
          RegistrationTypeId: this.f.RegistrationTypeId.value,
          ManufactureYear: this.f.ManufactureYear.value,
          ColorId: this.f.ColorId.value,
          PlateCode: this.f.OurPlateCode.value,
          PlateNumber: this.f.OurPlateNumber.value,
          VehicleChassisNumber: this.f.OurVehicleChassisNumber.value,
          VehicleEngineNumber: this.f.VehicleEngineNumber.value,
          VehicleCode: this.VehicleCode,
        },
      ],
    };
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
          let obj = {
            VehicleChassisNumber: data?.Result?.VehicleChassisNumber,
            PolicyNumber: this.f.PolicyNumber.value,
          };
          this.onGetPolicyInformation(obj);
        }
      },
      (err) => {}
    );
  }

  onSaveClaimInfo() {
    let userDetails = this.userDetails?.LoginResponse;
    let UrlLink = '';
    if (
      this.claimEditReq?.AccidentNumber != '' &&
      this.claimEditReq?.AccidentNumber != null
    ) {
      UrlLink = `${this.ApiUrl1}api/update/claim`;
    } else {
      UrlLink = `${this.ApiUrl1}api/create/claim`;
    }
    let ReqObj = {
      AccidentInformation: {
        AccidentDate: moment(this.f.AccidentDate.value).format('DD/MM/YYYY'),
        AccidentDescription: this.f.AccidentDescription.value,
        AccidentLocation: this.f.AccidentLocation.value,
        ClaimNumber: this.f.ClaimNumber.value,
        ClaimTypeId: this.f.ClaimTypeId.value,
        PolicyReferenceNumber: this.PolicyReferenceNumber,
        PoliceReferenceNo: this.f.PoliceReferenceNo.value,
        VehicleValue: this.f.VehicleValue.value,
        RepairCost: this.f.RepairCost.value,
        NoOfDays: this.f.NoOfDays.value,
        PerDayCost: this.f.PerDayCost.value,
        TotalValue: this.f.TotalValue.value,
      },
      CommonInformation: {
        ClaimReferenceNumber: this.ClaimReferenceNumber,
        PolicyReferenceNumber: this.PolicyReferenceNumber,
        AccidentNumber: this.AccidentNumber,
        BranchCode: userDetails?.BranchCode,
        CreatedBy: userDetails?.LoginId,
        InsuranceId: userDetails?.InsuranceId,
        RegionCode: userDetails?.RegionCode,
        VehicleChassisNumber: this.VehicleChassisNumber,
        VehicleCode: this.VehicleCode,
      },
      DriverInformation: {
        DriverDateOfBirth: moment(this.f.DriverDateOfBirth.value).format(
          'DD/MM/YYYY'
        ),
        Gender: this.f.Gender.value,
        LicenceNumber: this.f.LicenceNumber.value,
        LicenceValidUpto: moment(this.f.LicenceValidUpto.value).format(
          'DD/MM/YYYY'
        ),
      },

      RecoveryInformation: {
        VehMakeId: this.f.VehicleMakeIdOther.value,
        VehMakeDesc: this.f.VehicleMakeIdOther.value,
        VehModelId: this.f.VehicleModelIdOther.value,
        VehModelDesc: this.f.VehicleModelIdOther.value,
        CivilId: this.f.OtherCivilId.value,
        PlateCode: this.f.OtherPlateCode.value,
        PlateNumber: this.f.OtherPlateNumber.value,
        VehicleChassisNumber: this.f.OtherVehicleChassisNumber.value,
        InsuranceId: this.f.InsuranceId.value,
      },
    };
    console.log(ReqObj);
    this.newClaimService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        if (data?.Message == 'Success') {
          console.log(data);
          sessionStorage.removeItem('claimEditReq');
          if (data?.Result?.Response == 'Saved Successfully') {
            console.log(data?.Result?.Response);
            this.toaster.open({
              text: 'Claim Intimated Successfully',
              caption: 'Submitted',
              type: 'success',
            });
          }
          if (data?.Result?.Response == 'Updated Succesfully') {
            console.log(data?.Result?.Response);
            this.toaster.open({
              text: 'Claim Updated Successfully',
              caption: 'Submitted',
              type: 'success',
            });
          }
        }
      },
      (err) => {}
    );
  }

  onDateFormatt(data: any) {
    var formattDate = data;
    var date: any = moment(formattDate, 'DD-MM-YYYY');
    return new Date(date.format('YYYY-MM-DD'));
  }
  private _filter(value: any, data: any[]): any[] {
    if (value == null) {
      value = '';
    }
    const filterValue = value.toLowerCase();
    return data.filter((option) =>
      option?.CodeDescription?.toLowerCase().includes(filterValue)
    );
  }
}

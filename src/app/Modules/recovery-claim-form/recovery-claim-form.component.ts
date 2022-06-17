import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Toaster } from 'ngx-toast-notifications';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AppComponent } from 'src/app/app.component';
import Swal from 'sweetalert2';
import * as Mydatas from '../../../assets/app-config.json';
import { NewClaimService } from '../new-claim/new-claim.service';

export const _filter = (opt: any[], value: any): any[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.CodeDescription.toLowerCase().includes(filterValue));
};

@Component({
  selector: 'app-recovery-claim-form',
  templateUrl: './recovery-claim-form.component.html',
  styleUrls: ['./recovery-claim-form.component.css'],
})
export class RecoveryClaimFormComponent implements OnInit {
  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;
  public ApiUrl2: any = this.AppConfig.ApiUrl2;
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
  public modelListOther: any[] = [];
  public filterModelListOther!: Observable<any[]>;

  public claimTypeList: any[] = [];
  public filterclaimTypeList!: Observable<any[]>;
  public insurCompanyList: any;
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
  public claimResponse:any;

  public bodyId: any = '';
  public EditReq: any = {};
  public isVehicleModel: boolean = true;
  public isPolicyForm: boolean = false;
  public claimDetails: any;
  public isClaimDetails: boolean = false;
  public claimType: any = '';
  public minDate!: Date;
  public InsuranceEndDate: any;
  uploadedDocList:any[]=[];uploadDocList:any[]=[];
  public showMenu: boolean = true;
  docTypeList: any[]=[];
  imageUrl: any;
  viewFileName: any;@ViewChild('content') content : any;
  @ViewChild('content1') content1 : any;
  @ViewChild('stepper') private myStepper!: MatStepper;

  veiwSelectedDocUrl: any;
  documentAIDetails: any;
  isLinear = false;

  constructor(
    private _formBuilder: FormBuilder,
    private newClaimService: NewClaimService,
    private toaster: Toaster,
    private router: Router,
    private modalService:NgbModal,
    public app:AppComponent
  ) {
    this.userDetails = JSON.parse(sessionStorage.getItem("Userdetails") || '{}');
    this.claimEditReq = JSON.parse(
      sessionStorage.getItem('claimEditReq') || '{}'
    );
    this.claimTypeId = sessionStorage.getItem('claimTypeId');

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
      console.log(dataList)
      let vehicleAndRepair = Number(dataList[0]) + Number(dataList[1]);
      let noDaysAndPerDay = Number(dataList[2]) * Number(dataList[3]);
      let totalValue = vehicleAndRepair + noDaysAndPerDay;
      this.f.TotalValue.setValue(totalValue);
    });
  }

  onCreateFormControl() {
    this.claimForm = this._formBuilder.group({
      AccidentDate: ['', Validators.required],
      ClaimTypeId: ['', Validators.required],
      PoliceReferenceNo: ['', Validators.required],
      AccidentLocation: [''],
      AccidentDescription: [''],
      SalvageAmount: [''],
      SalvagePortal: [true],



      PolicyNumber: ['', Validators.required],
      ClaimNumber: ['', Validators.required],
      InsuranceStartDate: ['', Validators.required],
      InsuranceEndDate: ['', Validators.required],
      OurVehicleChassisNumber: ['', Validators.required],
      VehicleEngineNumber: ['', Validators.required],
      OurPlateCode: ['', Validators.required],
      OurPlateNumber: ['', Validators.required],
      VehicleMakeIdOur: ['', Validators.required],
      VehicleModelIdOur: ['', Validators.required],
      VehicleBodyId: [''],
      RegistrationTypeId: [''],
      ManufactureYear: ['', Validators.required],
      ColorId: ['', Validators.required],
      OurCivilId: ['', Validators.required],
      InsuranceTypeId: ['', Validators.required],
      VehicleValue: [0, Validators.required],
      RecovTotalLossYn:[false],
      SalvageCost:[''],
      OtherVehicleChassisNumber: ['', Validators.required],
      OtherPlateCode: ['', Validators.required],
      OtherPlateNumber: ['', Validators.required],
      VehicleMakeIdOther: ['', Validators.required],
      VehicleModelIdOther: ['', Validators.required],
      OtherCivilId: ['', Validators.required],
      InsuranceId: ['', Validators.required],

      RepairCost: [0, Validators.required],
      NoOfDays: [0, Validators.required],
      PerDayCost: [0, Validators.required],
      TotalValue: [0, Validators.required],


      LicenceNumber: [''],
      DriverDateOfBirth: [''],
      LicenceValidUpto: [''],
      Gender: ['1'],




    });
  }
  get f() {
    return this.claimForm.controls;
  }

  async onInitialFetchData() {
    this.claimTypeList = (await this.onGetClaimTypeList()) || [];
    if(this.claimTypeId == '11'){
      this.claimTypeList = this.claimTypeList.filter((ele:any)=>ele.Code =='11' || ele.Code =='12')
    }
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

    this.insurCompanyList = (await this.onGetInsuranceCompList());
    console.log('insurance-company',this.insurCompanyList);
    let companyGroup = [
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


    this.f.ClaimTypeId.setValue(this.claimTypeId);
    const ctrl = this.claimForm.get('ClaimTypeId')!;
    if (this.claimTypeId == '11') {
      // ctrl.disable();
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
      this.onGetClaimDetails(this.EditReq?.VehicleChassisNumber);
    }

    if (Object.keys(this.claimEditReq).length !== 0) {
      console.log(this.claimEditReq);
      this.searchValue = this.claimEditReq?.VehicleChassisNumber;
      await this.onPolicyEdit(this.claimEditReq);
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
   let  insurCompanyList = [...this.insurCompanyList[0].names,...this.insurCompanyList[1].names]
    let index = insurCompanyList.findIndex((obj: any) => obj.Code == code);
    return insurCompanyList[index].CodeDescription;
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

  }
  async onChangeVehicleMakeOther(Code: any) {
    this.modelListOther = await this.onGetVehicleModelList(Code);

    this.filterModelListOther = this.f.VehicleModelIdOther.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterModelList(value, this.modelListOther))
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
    if(index) return this.modelList[index].ModelDescription;
    else return '';
  };
  onDisplayVehicleModelother = (code: any) => {
    if (!code) return '';
    let index = this.modelListOther.findIndex((obj: any) => obj.ModelId == code);
    if(index) return this.modelListOther[index].ModelDescription;
    else return '';
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
      async (data: any) => {
        console.log(data);
        if (data?.Message == 'Success') {
          let AccidentInformation = data?.Result?.AccidentInformation;
          let DriverInformation = data?.Result?.DriverInformation;
          let RecoveryInformation = data?.Result?.RecoveryInformation;
          let CommonInformation = data?.Result?.CommonInformation;
          this.VehicleCode = CommonInformation?.VehicleCode;

          this.f.AccidentDate.setValue(
            this.onDateFormatt(AccidentInformation?.AccidentDate)
          );
          this.f.ClaimTypeId.setValue(AccidentInformation?.ClaimTypeId);
          this.f.PoliceReferenceNo.setValue(AccidentInformation?.PoliceReferenceNo);
          this.f.AccidentLocation.setValue(
            AccidentInformation?.AccidentLocation
          );
          this.f.AccidentDescription.setValue(
            AccidentInformation?.AccidentDescription
          );
          this.f.ClaimNumber.setValue(AccidentInformation?.ClaimNumber);

          this.f.LicenceNumber.setValue(DriverInformation?.LicenceNumber);
          // this.f.DriverDateOfBirth.setValue(this.onDateFormatt(DriverInformation?.DriverDateOfBirth));
          // this.f.LicenceValidUpto.setValue(this.onDateFormatt(DriverInformation?.LicenceValidUpto));
          // this.f.Gender.setValue(DriverInformation?.Gender);
          this.AccidentNumber = AccidentInformation?.AccidentNumber;
          this.ClaimReferenceNumber = claim?.ClaimReferenceNumber;
          this.PolicyReferenceNumber = claim?.PolicyReferenceNumber;
          this.f.VehicleMakeIdOther.setValue(RecoveryInformation?.VehMakeId);
          this.modelList = await this.onGetVehicleModelList(
            RecoveryInformation?.VehMakeId
          );
          if (this.modelList.length > 0) {
            this.f.VehicleModelIdOther.setValue(RecoveryInformation?.VehModelId);
          }
          this.f.OtherCivilId.setValue(RecoveryInformation?.CivilId);
          this.f.OtherPlateCode.setValue(RecoveryInformation?.PlateCode);
          this.f.OtherPlateNumber.setValue(RecoveryInformation?.PlateNumber);
          this.f.OtherVehicleChassisNumber.setValue(
            RecoveryInformation?.VehicleChassisNumber
          );
          this.f.InsuranceId.setValue(RecoveryInformation?.InsuranceId);
          this.f.VehicleValue.setValue(AccidentInformation?.VehicleValue);
          this.f.RepairCost.setValue(AccidentInformation?.RepairCost)
          this.f.NoOfDays.setValue(AccidentInformation?.NoOfDays)
          this.f.PerDayCost.setValue(AccidentInformation?.PerDayCost);
          if(AccidentInformation.RecovTotalLossYn=='Y')
          this.f.RecovTotalLossYn.setValue(true);
          else this.f.RecovTotalLossYn.setValue(false);
          this.f.SalvageCost.setValue(AccidentInformation.SalvageCost)
          // this.f.TotalValue.setValue(AccidentInformation?.TotalValue)
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
          this.f.OurCivilId.setValue(PolicyInformation?.CivilId);
          console.log(PolicyInformation.InsuranceStartDate);
          this.f.InsuranceStartDate.setValue(
            this.onDateFormatt(PolicyInformation?.InsuranceStartDate)
          );
          this.f.InsuranceEndDate.setValue(
            this.onDateFormatt(PolicyInformation?.InsuranceEndDate)
          );
          this.f.OurVehicleChassisNumber.setValue(
            VehicleDetails?.VehicleChassisNumber
          );
          this.f.VehicleEngineNumber.setValue(
            VehicleDetails?.VehicleEngineNumber
          );
          this.f.OurPlateCode.setValue(VehicleDetails?.PlateCode);
          this.f.OurPlateNumber.setValue(VehicleDetails?.PlateNumber);
          this.f.VehicleMakeIdOur.setValue(VehicleDetails?.VehicleMakeId);
          this.modelList = await this.onGetVehicleModelList(
            VehicleDetails?.VehicleMakeId
          );
          if (this.modelList.length > 0) {
            this.f.VehicleModelIdOur.setValue(VehicleDetails?.VehicleModelId);
            this.onChangeVehicleModel(VehicleDetails?.VehicleModelId);
          }
          this.f.RegistrationTypeId.setValue(VehicleDetails.RegistrationTypeId);
          this.f.ManufactureYear.setValue(VehicleDetails?.ManufactureYear);
          this.f.ColorId.setValue(VehicleDetails?.ColorId);
          this.f.InsuranceTypeId.setValue(PolicyInformation?.InsuranceTypeId);

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
          RegistrationTypeId: "1",
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
          // if (data?.Result?.Response == 'Saved Successfully') {
          //   this.toaster.open({
          //     text: 'Policy Created Successfully',
          //     caption: 'Submitted',
          //     type: 'success',
          //   });
          // }
          // if (data?.Result?.Response == 'Updated Successfully') {
          //   this.toaster.open({
          //     text: 'Policy Updated Successfully',
          //     caption: 'Submitted',
          //     type: 'success',
          //   });
          // }
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
    let UrlLink = ``;
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
        RecovTotalLossYn:this.f.RecovTotalLossYn.value == true?'Y':'N',
        SalvageCost:this.f.SalvageCost.value,
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
        OpenStatusYn:""
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
        VehMakeDesc:this.onGetCodeDesc(this.makeList,this.f.VehicleMakeIdOther.value),
        VehModelId:this.f.VehicleModelIdOther.value,
        VehModelDesc: this.onGetModelCodeDesc(this.modelListOther,this.f.VehicleModelIdOther.value),
        CivilId: this.f.OtherCivilId.value,
        PlateCode: this.f.OtherPlateCode.value,
        PlateNumber: this.f.OtherPlateNumber.value,
        VehicleChassisNumber: this.f.OtherVehicleChassisNumber.value,
        InsuranceId: this.f.InsuranceId.value,
      },
    };
    console.log(ReqObj);
    Swal.fire({
      title: 'Are you sure?',
      text: "You Want to Move Claim to Open Status?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
         ReqObj.CommonInformation.OpenStatusYn='Y';
         this.SubmitClaimDetails(UrlLink,ReqObj);
      }
      else{
        ReqObj.CommonInformation.OpenStatusYn='N';
        this.SubmitClaimDetails(UrlLink,ReqObj);
      }
    })
  }
  SubmitClaimDetails(UrlLink:any,ReqObj:any){
    this.newClaimService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        if (data?.Message == 'Success') {
          console.log(data);
          this.claimResponse = data?.Result;
          this.ClaimReferenceNumber = this.claimResponse?.ClaimReferenceNumber;
          this.onGetUploadedDocuments(this.ClaimReferenceNumber);
          sessionStorage.removeItem('claimEditReq');
          // if (data?.Result?.Response == 'Saved Successfully') {
          //   console.log(data?.Result?.Response);
          //   this.toaster.open({
          //     text: 'Claim Intimated Successfully',
          //     caption: 'Submitted',
          //     type: 'success',
          //   });
          // }
          // if (data?.Result?.Response == 'Updated Succesfully') {
          //   console.log(data?.Result?.Response);
          //   this.toaster.open({
          //     text: 'Claim Updated Successfully',
          //     caption: 'Submitted',
          //     type: 'success',
          //   });
          // }
          this.myStepper.next();

        }
      },
      (err) => {}
    );
  }
  onGetCodeDesc(data:any[],code:any){

     let index = data.findIndex((ele:any)=>ele.Code == code);
     console.log(data,code,index)

     if(index == -1){
       return code
     }else{
      return data[index].CodeDescription;
     }
  }

  onGetModelCodeDesc(data:any[],code:any){
    let index = data.findIndex((ele:any)=>ele.ModelId == code);
     console.log(data,code,index)
     if(index == -1){
       return code
     }else{
      return data[index].ModelDescription;
     }
  }

  onDateFormatt(data: any) {
    console.log(data)
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

  private _filterGroup(value: any): any[] {
    if (value) {
      return this.insurCompanyList
        .map((group:any) => ({letter: group.letter, names: _filter(group.names, value)}))
        .filter((group:any) => group.names.length > 0);
    }

    return this.insurCompanyList;
  }



  /*Document Section */
  onUploadDocuments(target:any,fileType:any,type:any){
    let event:any = target.target.files;
    console.log("Event ",event);
    let fileList = event;
    for (let index = 0; index < fileList.length; index++) {
      const element = fileList[index];

      var reader:any = new FileReader();
      reader.readAsDataURL(element);
        var filename = element.name;

        let imageUrl: any;
        reader.onload = (res: { target: { result: any; }; }) => {
          imageUrl = res.target.result;
          this.imageUrl = imageUrl;
          this.uploadDocList.push({ 'url': this.imageUrl,'DocTypeId':'','filename':element.name, 'JsonString': {} });

        }

    }
    console.log("Final File List",this.uploadDocList)
  }
  onDragDocument(target:any,fileType:any,type:any){
    let fileList = target;
    for (let index = 0; index < fileList.length; index++) {
      const element = fileList[index];

      var reader:any = new FileReader();
      reader.readAsDataURL(element);
        var filename = element.name;

        let imageUrl: any;
        reader.onload = (res: { target: { result: any; }; }) => {
          imageUrl = res.target.result;
          this.imageUrl = imageUrl;
          this.uploadDocList.push({ 'url': this.imageUrl,'DocTypeId':'','filename':element.name, 'JsonString': {} });

        }
      }
  }
  onViewDocument(index:any) {
    this.viewFileName = this.uploadDocList[index].filename;
    this.veiwSelectedDocUrl = this.uploadDocList[index].url;
    this.modalService.open(this.content, { size: 'xl', backdrop: 'static' });
  }
  onViewUploadedDocument(index:any) {
    this.viewFileName = this.uploadedDocList[index].FileName;
    this.veiwSelectedDocUrl = this.uploadedDocList[index].ImgUrl;
    this.modalService.open(this.content);
  }
  generateApiDetails(index:any){
    let UrlLink = `${this.ApiUrl1}api/uploadimage`;
    let ReqObj = {
      "ClaimNo":  this.ClaimReferenceNumber,
      "ListOfPath": [this.uploadedDocList[index].FilePathName
      ]
    }
    this.newClaimService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        console.log(data);
        if(data.assessment_id){
          this.uploadedDocList = [];
          this.onGetUploadedDocuments(this.ClaimReferenceNumber);
        }
        else{
          this.toaster.open({
            text: 'File Size is Very Low',
            caption: 'AI Details Error',
            type: 'danger',
          });
        }
      },
      (err) => { }
    );
  }
  viewApiDetails(index:any){
    let UrlLink = `${this.ApiUrl2}api/imagereport`;
    let ReqObj = {
      "assessment_id": this.uploadedDocList[index].Assessmentid,
      "Filename": this.uploadedDocList[index].Param
    }
    this.newClaimService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        console.log(data);
        this.documentAIDetails = data;
        this.modalService.open(this.content1, { size: 'xl', backdrop: 'static' });
      },
      (err) => { }
    );
  }
  onGetOriginalImage(index:any){
    let UrlLink = `${this.ApiUrl1}getoriginalimage`;
    let userDetails = this.userDetails?.LoginResponse;
    let ReqObj = {
      "ClaimNumber": this.ClaimReferenceNumber,
      "DocumentReferenceNumber": this.uploadedDocList[index].DocumentReferenceNumber,
      "DocumentTypeId": this.uploadedDocList[index].DocTypeId,
      "InsuranceId": this.uploadedDocList[index]?.InsuranceId
    }
    this.newClaimService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        console.log(data);
        var a = document.createElement("a");
      a.href = data.Result.ImgUrl;
      a.download = data.Result.FileName;
      // start download
      a.click();
      },
      (err) => { }
    );
  }
  onDeleteUploadedDoc(index:any){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        let UrlLink = `${this.ApiUrl1}deletedoc`;
        let userDetails = this.userDetails?.LoginResponse;
        let ReqObj = {
          "ClaimNumber": this.ClaimReferenceNumber,
          "DocumentReferenceNumber": this.uploadedDocList[index].DocumentReferenceNumber,
          "DocumentTypeId": this.uploadedDocList[index].DocumentTypeId,
          "InsuranceId": this.uploadedDocList[index]?.InsuranceId
        }
        this.newClaimService.onPostMethodSync(UrlLink, ReqObj).subscribe(
          (data: any) => {
            console.log(data);
            this.onGetUploadedDocuments(this.ClaimReferenceNumber);
          },
          (err) => { }
        );
      }
    });
  }
  saveDocuments(){
    if(this.ClaimReferenceNumber != undefined && this.ClaimReferenceNumber != ""){
      let i=0;
      let userDetails = this.userDetails?.LoginResponse;
      let j = 0;let docDesc:any;
      console.log("Upload List",this.uploadDocList)
      for(let document of this.uploadDocList){
        let UrlLink = `${this.ApiUrl1}upload`;
        if(document.DocTypeId){
          let docList:any = this.docTypeList.filter((option) => option?.Code?.toLowerCase().includes(document.DocTypeId));
          docDesc = docList[0].CodeDescription;
          console.log("Filtered DocList",docList,docDesc);
          let ReqObj = {
            "ClaimNumber": this.ClaimReferenceNumber,
            "UpdatedBy": userDetails?.LoginId,
            "InsuranceId": userDetails?.InsuranceId,
            "file":document.url,
            "DocumentTypeId":document.DocTypeId,
            "DocDesc": docDesc,
            "FileName":document.filename,
            "Devicefrom": "WebApplication",
            "DocApplicable": "CLAIM_INFO"
          }
          this.newClaimService.onPostMethodSync(UrlLink, ReqObj).subscribe(
            (data: any) => {
              console.log(data);
              let res:any = data;
              if(res?.ErrorMessage.length!=0){
                j+=1;
              }
              i+=1;
              if(i==this.uploadDocList.length && j==0){
                this.toaster.open({
                  text: 'Documents Uploaded Successfully',
                  caption: 'Upload',
                  type: 'success',
                });
                this.uploadDocList = [];
                this.onGetUploadedDocuments(this.ClaimReferenceNumber);
              }
              else{
                this.uploadedDocList = [];
                this.onGetUploadedDocuments(this.ClaimReferenceNumber);
              }
            },
            (err) => { }
          );
        }

      }
    }
    else{
      this.toaster.open({
        text: 'Please Enter Valid Claim Number',
        caption: 'Claim Number',
        type: 'danger',
      });
    }
  }
  onGetUploadedDocuments(claimNo:any){
    let UrlLink = `${this.ApiUrl1}getdoclist`;
    let userDetails = this.userDetails?.LoginResponse;
    let ReqObj = {
      "ClaimNumber":  claimNo,
      "InsuranceId": userDetails?.InsuranceId,
      "DocApplicable": "CLAIM_INFO"
    }
    this.newClaimService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        this.uploadedDocList = data.Result.TotalClaimDocuments;
        this.getDocumentTypeList();
      },
      (err) => { }
    );
  }
  hide() {
    this.modalService.dismissAll();
  }
  onDeleteDocument(index:any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
          this.uploadDocList.splice(index,1);
      }
    })
  }
  onDownloadImage(documentData:any,fileData:any){
    var a = document.createElement("a");
      a.href = fileData;
      a.download = documentData.Filename;
      document.body.appendChild(a);
      a.click();
  }
  getDocumentTypeList(){
    let UrlLink = `${this.ApiUrl1}dropdown/doctypes`;
    let userDetails = this.userDetails?.LoginResponse;
    let ReqObj = {
      "InsuranceId": userDetails?.InsuranceId,
      "DocApplicable":"CLAIM_INFO"
    }
    this.newClaimService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        console.log("Document Types",data);
        this.docTypeList = data.Result;
      },
      (err) => { }
    );
  }

  okay(){
    if(this.claimTypeId == 12){
       this.router.navigate(['Home/Claim']);
    }else{
      this.router.navigate(['Home/Receivable']);

    }
   }
}

import { AppComponent } from './../../../../app.component';
import { NewClaimService } from './../../new-claim.service';
import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Toaster } from 'ngx-toast-notifications';
import { Observable, merge, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AddVehicleService } from 'src/app/Modules/add-vehicle/add-vehicle.service';
import * as Mydatas from '../../../../../assets/app-config.json';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-claim-form',
  templateUrl: './claim-form.component.html',
  styleUrls: ['./claim-form.component.css']
})
export class ClaimFormComponent implements OnInit {
  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;
  public ApiUrl2: any = this.AppConfig.ApiUrl2;
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
  public ClaimReferenceNumber = '';
  public PolicyReferenceNumber = '';
  public VehicleChassisNumber:any;
  public VehicleCode = '';
  public claimTypeId: any = '';
  public policyAndVehicle: any;
  @Input('VehicleChassisNumber') VehicleDetails: any = '';
  @Output('moveNext') moveNext = new EventEmitter();
  imageUrl: any;
  uploadDocList: any[]=[];
  viewFileName: any;
  veiwSelectedDocUrl: any;
  @ViewChild('content') content : any;
  @ViewChild('content1') content1 : any;
  docTypeList: any[]=[];uploadedDocList:any[]=[];
  documentAIDetails: any;
  constructor(
    private _formBuilder: FormBuilder,
    private addVehicleService: AddVehicleService,
    private newClaimService: NewClaimService,
    private datePipe: DatePipe,
    private toaster: Toaster,
    private modalService:NgbModal,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public app:AppComponent

  ) {
    this.userDetails = JSON.stringify(sessionStorage.getItem("Userdetails"));
    this.claimEditReq = JSON.parse(sessionStorage.getItem("claimEditReq") || '{}');
    console.log("VehicleDetails", this.VehicleDetails);
  }

  ngOnInit(): void {
    this.onCreateFormControl();
    this.onGetPolicyInformation();
    this.getDocumentTypeList();
    combineLatest([
      this.f.VehicleValue.valueChanges.pipe(startWith(0)),
      this.f.RepairCost.valueChanges.pipe(startWith(0)),
      this.f.NoOfDays.valueChanges.pipe(startWith(0)),
      this.f.PerDayCost.valueChanges.pipe(startWith(0)),
    ]
    ).subscribe(([
      VehicleValue,
      RepairCost,
      NoOfDays,
      PerDayCost
    ]) => {
      const dataList = [VehicleValue, RepairCost,NoOfDays,PerDayCost]
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

      PlateCode: ['', Validators.required],
      PlateNumber: ['', Validators.required],
      CivilId: ['', Validators.required],
      VehicleChassisNumber: ['', Validators.required],
      InsuranceId: ['', Validators.required]

    });
  }
  get f() { return this.claimForm.controls; };

  onGetPolicyInformation() {
    let UrlLink = `${this.ApiUrl1}api/searchvehicleinfo`;
    let ReqObj = {
      "VehicleChassisNumber": this.VehicleDetails?.VehicleChassisNumber,
      "PolicyNumber":this.VehicleDetails?.PolicyNumber
    }
    return this.newClaimService.onPostMethodSync(UrlLink, ReqObj).subscribe((data: any) => {
      console.log("Search Data", data);
      if (data) {
        this.policyAndVehicle = data?.Result
        this.claimTypeId = sessionStorage.getItem('claimTypeId');
        let VehicleDetails = data?.Result?.VehicleDetails;
        let PolicyInformation = data?.Result?.PolicyInformation;
        this.PolicyReferenceNumber = PolicyInformation?.PolicyReferenceNumber;
        this.VehicleChassisNumber = VehicleDetails.VehicleChassisNumber;
        this.VehicleCode = VehicleDetails?.VehicleCode;
        this.f.LicenceNumber.setValue(PolicyInformation.CivilId);
        var driverDOB = new Date();
        driverDOB.setFullYear(driverDOB.getFullYear() - 18);
        var licenValidDate = new Date();
        licenValidDate.setFullYear(licenValidDate.getFullYear() + 1);
        this.f.DriverDateOfBirth.setValue(driverDOB);
        this.f.LicenceValidUpto.setValue(licenValidDate);
        this.onInitialFetchData();

      }
    }, (err) => { })
  }

  async onInitialFetchData() {

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
      await this.onClaimEdit(this.claimEditReq);
    }

    this.f.ClaimTypeId.setValue(this.claimTypeId);
    const ctrl = this.claimForm.get('ClaimTypeId')!;
    if (this.claimTypeId == '11') {
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
          this.f.VehicleChassisNumber.setValue(RecoveryInformation?.VehicleChassisNumber);
          this.f.InsuranceId.setValue(RecoveryInformation?.InsuranceId);
          this.onGetUploadedDocuments(this.ClaimReferenceNumber);
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
        "ClaimTypeId": this.f.ClaimTypeId.value,
        "PolicyReferenceNumber": this.PolicyReferenceNumber,
        "PoliceReferenceNo": this.f.PoliceReferenceNo.value,
        "VehicleValue": this.f.VehicleValue.value,
        "RepairCost": this.f.RepairCost.value,
        "NoOfDays": this.f.NoOfDays.value,
        "PerDayCost": this.f.PerDayCost.value,
        "TotalValue": this.f.TotalValue.value,
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
  hide() {
    this.modalService.dismissAll();
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
    this.addVehicleService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        console.log(data);
        if(data.assessment_id){
          this.uploadedDocList = [];
          this.onGetUploadedDocuments(this.ClaimReferenceNumber);
        }
      },
      (err) => { }
    );
  }
  viewApiDetails(index:any){
    let UrlLink = `${this.ApiUrl1}api/imagereport`;
    let ReqObj = {
      "assessment_id": this.uploadedDocList[index].Assessmentid,
      "Filename": this.uploadedDocList[index].Param
    }
    this.addVehicleService.onPostMethodSync(UrlLink, ReqObj).subscribe(
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
    this.addVehicleService.onPostMethodSync(UrlLink, ReqObj).subscribe(
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
        this.addVehicleService.onPostMethodSync(UrlLink, ReqObj).subscribe(
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
          this.addVehicleService.onPostMethodSync(UrlLink, ReqObj).subscribe(
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
    this.addVehicleService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        console.log("Document Types",data);
        this.docTypeList = data.Result;
      },
      (err) => { }
    );
  }
  onGetUploadedDocuments(claimNo:any){
    let UrlLink = `${this.ApiUrl1}getdoclist`;
    let userDetails = this.userDetails?.LoginResponse;
    let ReqObj = {
      "ClaimNumber":  claimNo,
      "InsuranceId": userDetails?.InsuranceId,
      "DocApplicable": "CLAIM_INFO"
    }
    this.addVehicleService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        this.uploadedDocList = data.Result.OwnCompanyDocuments;
        this.uploadedDocList = this.uploadedDocList.concat(data.Result.RecoveryCompanyDocuments);
        this.getDocumentTypeList();
      },
      (err) => { }
    );
  }
}

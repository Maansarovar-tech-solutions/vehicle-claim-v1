import { RecoveryClaimViewComponent } from './../recovery-claim-view/recovery-claim-view.component';
import { AppComponent } from './../../app.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as Mydatas from '../../../assets/app-config.json';
import { AddVehicleService } from '../add-vehicle/add-vehicle.service';
import Swal from 'sweetalert2';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NewClaimService } from '../new-claim/new-claim.service';
import { Toaster } from 'ngx-toast-notifications';
import { PrimeIcons } from "primeng/api";
declare var $:any;

export const _filter2 = (opt: any[], value: any): any[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.CodeDescription.toLowerCase().includes(filterValue));
};
@Component({
  selector: 'app-claim-status',
  templateUrl: './claim-status.component.html',
  styleUrls: ['./claim-status.component.css']
})
export class ClaimStatusComponent implements OnInit {
  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;
  public claimStatusList: any[] = [];
  public filterclaimStatusList!: Observable<any[]>;
  public claimStatusForm!: FormGroup;
  public userDetails: any;
  public claimDetails: any;
  public claimInformation:any;
  public commonInformation:any;

  public accidentInformation:any;
  public driverInformation:any;
  public policyInformation:any;
  public recoveryInformation:any;
  public vehicleInformation:any;
  public statusName:any='';
  public recoveryType:any='';
  public recoveryPolicyInfo:any;
  public isNewPolicy:boolean=false;
  public isProcess:boolean=true;
  public isQuery:boolean=false;
  public isDisabledReqAmount:boolean=false;
  public showTotalValue='0'
  claimType: string | null;
  imageUrl: any;
  uploadDocList: any[]=[];
  ownerColumnHeader:any[]=[];
  ownerTrackList: any;
  recoveryColumnHeader: any[]=[];
  recoveryTrackList: any;
  uploadedDocList: any[]=[];docTypeList:any[]=[];
  viewFileName: any;
  veiwSelectedDocUrl: any;
  closeResult: any;
  @ViewChild('content') content : any;
  @ViewChild('content1') content1 : any;
  @ViewChild('content2') content2 : any;
  documentAIDetails: any[]=[];
  ownerDocList: any[]=[];
  recoveryDocList: any[]=[];
  events1: any[]=[];
  totalTrackList: any[]=[];recoveryPolicyNo:any="";
  recoveryClaimNo:any="";approvedVehicleValue:any="";
  approvedSalvageValue:any="";approvedRepairCost:any="";
  approvedReplacementCost:any="";approvedTotalClaimCost:any="";
  faultCompany: boolean = false;reasonList:any[]=[];
  currencyLabel:any='';
  filterReasonList!: Observable<any[]>; filterinsuranceTypeList!: Observable<any[]>;
  insuranceTypeList: any;
 
  constructor(
    private _formBuilder: FormBuilder,
    private addVehicleService: AddVehicleService,
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private modalService:NgbModal,
    private newClaimService:NewClaimService,
    private toaster: Toaster,
    public app:AppComponent,
  ) {
    this.userDetails = JSON.parse(sessionStorage.getItem("Userdetails") || '{}');
    this.recoveryType=sessionStorage.getItem("claimType");
    
    
    this.events1 = [
      {
        status: "Ordered",
        date: "15/10/2020 10:30",
        icon: PrimeIcons.SHOPPING_CART,
        color: "#9C27B0",
        image: "game-controller.jpg"
      },
      {
        status: "Processing",
        date: "15/10/2020 14:00",
        icon: PrimeIcons.COG,
        color: "#673AB7"
      },
      {
        status: "Shipped",
        date: "15/10/2020 16:15",
        icon: PrimeIcons.ENVELOPE,
        color: "#FF9800"
      },
      {
        status: "Delivered",
        date: "16/10/2020 10:00",
        icon: PrimeIcons.CHECK,
        color: "#607D8B"
      }
    ];

    this.claimDetails = JSON.parse(sessionStorage.getItem("selectedClaimDetails") || '{}');
    console.log(this.claimDetails)
    if(this.claimDetails.finalLabelName == 'Process'){
      this.isProcess = true;
    }else{
      this.isProcess = false;
    }



    console.log("Received Details",this.claimDetails);
    this.onGetClaimDetails(this.claimDetails)
    this.claimType = sessionStorage.getItem('claimType');
   
    
  }
  async onGetReasonList(){
    let UrlLink = `${this.ApiUrl1}dropdown/rejectreasons`;
    let response = (await this.newClaimService.onGetMethodAsync(UrlLink))
      .toPromise()
      .then((res: any) => {
        return res?.Result;
      })
      .catch((err) => { });
    return response;
  }
  async onGetInsuranceTypList() {
    let UrlLink = `${this.ApiUrl1}api/groupof/insurancecompanies`;
    let response = (await this.newClaimService.onGetMethodAsync(UrlLink))
      .toPromise()
      .then((res: any) => {
        return res?.Result;
      })
      .catch((err) => { });
    return response;
  }
  onDisplayReason = (code: any) => {
    if (!code) return '';
    let index = this.reasonList.findIndex((obj: any) => obj.Code == code);
    if (index != -1) return this.reasonList[index].CodeDescription;
    else return '';
  };
  onDisplayInsurComp = (code: any) => {
    if (!code) return '';
    let insurCompanyList = [...this.insuranceTypeList[0].names, ...this.insuranceTypeList[1].names]
    let index = insurCompanyList.findIndex((obj: any) => obj.Code == code);
    return insurCompanyList[index].CodeDescription;
  };
  onDisplayInsuranceComp = (option: any) => {
    if (!option) return '';
    let index = this.insuranceTypeList.findIndex(
      (obj: any) => obj.Code == option
    );
    return this.insuranceTypeList[index].CodeDescription;
  };
  async ngOnInit(): Promise<void> {
    this.onCreateFormControl();
    this.onFetchInitialData();
    this.onGetUploadedDocuments();
    this.onGetCurrencyLabeleName()

    combineLatest([
      this.f.claimStatus.valueChanges.pipe(startWith('')),
      this.f.VehicleValue.valueChanges.pipe(startWith(0)),
      this.f.SalvageCost.valueChanges.pipe(startWith(0)),
      this.f.BodilyInjury.valueChanges.pipe(startWith(0)),
      this.f.PropertyDamage.valueChanges.pipe(startWith(0)),
      this.f.RepairCost.valueChanges.pipe(startWith(0)),
      this.f.PerDayCost.valueChanges.pipe(startWith(0)),


    ]).subscribe(([claimStatus,VehicleValue, SalvageCost, BodilyInjury, PropertyDamage,RepairCost,PerDayCost]) => {
      const dataList = [claimStatus,VehicleValue, SalvageCost, BodilyInjury, PropertyDamage,RepairCost,PerDayCost];
      let repaireCostBodyInjuProperty = (Number(dataList[3]) + Number(dataList[4]) + Number(dataList[5]));
      let perdayCost = Number(dataList[6]);
      let subVehicleAndSalvage=0;

      if(this.accidentInformation?.recovTotalLossYn == 'Y'){
          subVehicleAndSalvage = (Number(dataList[1]) - Number(dataList[2]))
      }
      let total = repaireCostBodyInjuProperty + perdayCost + subVehicleAndSalvage;
      //this.f.TotalValue.setValue(total);
    });
    this.reasonList = await this.onGetReasonList();
    this.filterReasonList = this.f.RejectedReason.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterRejected(value, this.reasonList))
    );
    this.insuranceTypeList = (await this.onGetInsuranceTypList()) || [];
    let companyGroup = [
      {
        letter: 'Participants',
        names: this.insuranceTypeList.Participants,
      },
      {
        letter: 'Non Participants',
        names: this.insuranceTypeList.NonParticipants,
      },

    ];
    this.insuranceTypeList = companyGroup;
    console.log('InsuranceList', this.insuranceTypeList);
    this.filterinsuranceTypeList = this.f.InsuranceTypeId.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterGroup(value || ''))
    );
  }

  onCreateFormControl() {
    this.claimStatusForm = this._formBuilder.group({
      claimStatus: ['PED', Validators.required],
      claimStatusRemarks: ['', Validators.required],
      DebitNoteNo: ['', Validators.required],
      CreditNoteNo: ['', Validators.required],
      reqAmount: ['', Validators.required],
      acceAmount: ['', Validators.required],
      RejectedReason: [''],
      VehicleValue:[0, Validators.required],
      SalvageCost:[0, Validators.required],
      BodilyInjury:[0, Validators.required],
      PropertyDamage:[0, Validators.required],
      RepairCost: [0, Validators.required],
      PerDayCost: [0, Validators.required],
      TotalValue: [0],
      InsuranceTypeId: [''],

    });
    //this.claimStatusForm.controls['TotalValue'].disable();

    if(this.claimDetails?.Status=='PAC' || this.claimDetails?.Status=='ATP' || this.claimDetails?.Status=='DNT' || this.claimDetails?.Status=='CNT'){
       this.isDisabledReqAmount = true;
       this.f.VehicleValue.disable();
       this.f.SalvageCost.disable();
       this.f.BodilyInjury.disable();
       this.f.PropertyDamage.disable();
       this.f.RepairCost.disable();
       this.f.PerDayCost.disable();
    }
  }
  get f() { return this.claimStatusForm.controls; };

  async onFetchInitialData(){


  // let index = this.claimStatusList.findIndex((ele:any)=>ele.StatusCode == this.f.claimStatus.value);
  // console.log(index)
  // this.statusName = this.claimStatusList[index].StatusDesc;
  }
  onGetCurrencyLabeleName() {
    let UrlLink = `${this.ApiUrl1}dropdown/currencymaster`;
    this.newClaimService.onGetMethodSync(UrlLink).subscribe(
      (data: any) => {
       this.currencyLabel = data.Result.CodeDescription
      },
      (err) => { }
    );
  }
  onGetUploadedDocuments(){
    let UrlLink = `${this.ApiUrl1}getdoclist`;
    let userDetails = this.userDetails?.LoginResponse;
    let ReqObj = {
      "ClaimNumber":  this.claimDetails?.ClaimReferenceNumber,
      "InsuranceId": userDetails?.InsuranceId,
      "DocApplicable": "CLAIM_INFO"
    }
    this.addVehicleService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
          if(data.Result){
                let List = data.Result.TotalClaimDocuments;
                console.log("Insurance Id",userDetails?.InsuranceId);
                this.ownerDocList = List.filter((entry: any)=>entry.Fault == 'Not At Fault');
                console.log("Final Doc List",this.ownerDocList);
                this.recoveryDocList = List.filter((entry: any)=>entry.Fault != 'Not At Fault');
                console.log("Final Doc List",this.recoveryDocList);
          }

        //this.uploadedDocList = this.uploadedDocList.concat(data.Result.RecoveryCompanyDocuments);
        this.getDocumentTypeList();
      },
      (err) => { }
    );
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
  private _filterRejected(value: any, data: any[]): any[] {
    if (value == null) {
      value = '';
    }
    const filterValue = value.toLowerCase();
    return data.filter((option) => option?.CodeDescription?.toLowerCase().includes(filterValue));
  }
  private _filter(value: any, data: any[]): any[] {
    if (value == null) {
      value = '';
    }
    const filterValue = value.toLowerCase();
    return data.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));
  }
  private _filterGroup(value: any): any[] {
    if (value) {
      return this.insuranceTypeList
        .map((group: any) => ({ letter: group.letter, names: _filter2(group.names, value) }))
        .filter((group: any) => group.names.length > 0);
    }

    return this.insuranceTypeList;
  }
  onGetOriginalImage(index:any,type:any){
    let rowData:any;
    if(type == 'receiver'){
        rowData = this.recoveryDocList[index]
    }
    else{
      rowData = this.ownerDocList[index]
    }
    let UrlLink = `${this.ApiUrl1}getoriginalimage`;
    let userDetails = this.userDetails?.LoginResponse;
    console.log("Final RowData",rowData);
    let ReqObj = {
      "ClaimNumber": this.claimDetails?.ClaimReferenceNumber,
      "DocumentReferenceNumber": rowData.DocumentReferenceNumber,
      "DocumentTypeId": rowData.DocumentTypeId,
      "InsuranceId": rowData?.InsuranceId
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
  onDeleteUploadedDoc(index:any,type:any){
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
        let rowData:any;
        if(type == 'receiver'){
            rowData = this.recoveryDocList[index]
        }
        else{
          rowData = this.ownerDocList[index]
        }
        let ReqObj = {
          "ClaimNumber": this.claimDetails?.ClaimReferenceNumber,
          "DocumentReferenceNumber": rowData.DocumentReferenceNumber,
          "DocumentTypeId": rowData.DocumentTypeId,
          "InsuranceId": rowData?.InsuranceId
        }
        this.addVehicleService.onPostMethodSync(UrlLink, ReqObj).subscribe(
          (data: any) => {
            console.log(data);
            this.onGetUploadedDocuments();
          },
          (err) => { }
        );
      }
    });
  }
  claimStatusText = (option: any) => {
    if (!option) return '';
    let index = this.claimStatusList.findIndex((make: any) => make.Code == option);
    return this.claimStatusList[index].CodeDesc;
  }

  onGetStatusName(val: any) {
    this.statusName=val;
  }

  async onGetInsuranceStatusList(statusValue:any) {
    let UrlLink = `${this.ApiUrl1}api/dropdown/claimstatus/restricted`;
    let ReqObj = {
      "ClaimType": this.recoveryType,
      "StatusCode": statusValue
    }
    let response = (await this.addVehicleService.onPostMethodSync(UrlLink,ReqObj)).toPromise()
      .then((res: any) => {
        return res?.Result;
      })
      .catch((err) => { });
    return response;
  }
  generateApiDetails(index:any,type:any){
    let rowData:any;
    if(type == 'receiver'){
        rowData = this.recoveryDocList[index]
    }
    else{
      rowData = this.ownerDocList[index]
    }
    let UrlLink = `${this.ApiUrl1}api/uploadimage`;
    let ReqObj = {
      "ClaimNo":  this.claimDetails?.ClaimReferenceNumber,
      "ListOfPath": [rowData.FilePathName
      ]
    }
    this.addVehicleService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        console.log(data);
        if(data.assessment_id){
            this.recoveryDocList = [];
          this.ownerDocList = [];
          this.onGetUploadedDocuments();
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
  viewApiDetails(index:any,type:any){
    let rowData:any;
    if(type == 'receiver'){
        rowData = this.recoveryDocList[index]
    }
    else{
      rowData = this.ownerDocList[index]
    }
    let UrlLink = `${this.ApiUrl1}api/imagereport`;
    let ReqObj = {
      "assessment_id": rowData.Assessmentid,
      "Filename": rowData.Param
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
  onDownloadImage(documentData:any,fileData:any){
    var a = document.createElement("a");
      a.href = fileData;
      a.download = documentData.Filename;
      document.body.appendChild(a);
      a.click();
  }
  saveDocuments(){
    let i=0;
    let userDetails = this.userDetails?.LoginResponse;
    let j = 0;let docDesc:any;
    for(let document of this.uploadDocList){
      let UrlLink = `${this.ApiUrl1}upload`;
      if(document.DocTypeId){
        let docList:any = this.docTypeList.filter((option) => option?.Code?.toLowerCase().includes(document.DocTypeId));
        docDesc = docList[0].CodeDescription;
        console.log("Filtered DocList",docList,docDesc);
        let ReqObj = {
          "ClaimNumber": this.claimDetails?.ClaimReferenceNumber,
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
              this.uploadDocList = [];
              this.ownerDocList = [];
              this.onGetUploadedDocuments();
              this.toaster.open({
                text: 'Documents Uploaded Successfully',
                caption: 'Upload',
                type: 'success',
              });
            }
            else{
              this.ownerDocList = [];
              this.onGetUploadedDocuments();
            }
          },
          (err) => { }
        );
      }

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
  onViewDocument(index:any) {
    console.log("Recieved View",this.uploadDocList[index]);
    this.viewFileName = this.uploadDocList[index].filename;
    this.veiwSelectedDocUrl = this.uploadDocList[index].url;
    this.modalService.open(this.content, { size: 'md', backdrop: 'static' });
  }
  onViewUploadedDocument(index:any,type:any) {
    let rowData:any;
    if(type == 'receiver'){
        rowData = this.recoveryDocList[index]
    }
    else{
      rowData = this.ownerDocList[index]
    }
    console.log("Recieved View",rowData);
    this.viewFileName = rowData.FileName;
    this.veiwSelectedDocUrl = rowData.ImgUrl;
    this.modalService.open(this.content, { size: 'md', backdrop: 'static' });
  }
   hide() {
    this.modalService.dismissAll();
  }
  onFormSubmit(){

    let userDetails = this.userDetails?.LoginResponse;
    if(userDetails.InsuranceCompanyName == this.recoveryInformation?.InsuranceCompanyName){
      let StatusCode = this.f.claimStatus.value;
        if(StatusCode){
            if(StatusCode=='ATP' || StatusCode == 'PAC'){
              if(this.f.claimStatus.value == 'ATP'){
                this.showTotalValue = this.accidentInformation.TotalValue
              }
              if(this.f.claimStatus.value == 'PAC'){
                this.showTotalValue = this.f.TotalValue.value
              }
              //this.modalService.open(this.content2, { size: 'lg', backdrop: 'static' });
              this.onAltSubmit();
            }
            else{
                this.onAltSubmit();
            }
        }
        else{
          this.onAltSubmit();
        }
    }
    else{
      this.onAltSubmit();
    }
  }
  onAltSubmit(){
    if(this.f.claimStatus.value == 'ATP'){
      var PerDayCost:any = Number(this.accidentInformation.NoOfDays)*(this.accidentInformation.PerDayCost)
      var VehicleValue:any = this.accidentInformation.VehicleValue
      var SalvageCost:any = this.accidentInformation.SalvageCost
      var RepairCost:any = this.accidentInformation.RepairCost
      var BodilyInjury:any = this.accidentInformation.BodilyInjury
      var PropertyDamage:any = this.accidentInformation.PropertyDamage
      var TotalValue:any = this.accidentInformation.TotalValue
    }
    if(this.f.claimStatus.value == 'REJ'){
      var PerDayCost:any = 0;
      var VehicleValue:any = 0;
      var SalvageCost:any = 0;
      var RepairCost:any = 0;
      var BodilyInjury:any = 0;
      var PropertyDamage:any = 0;
      var TotalValue:any = 0;
    }

    if(this.f.claimStatus.value == 'PAC'){
      var PerDayCost:any = this.f.PerDayCost.value
      var VehicleValue:any = this.f.VehicleValue.value
      var SalvageCost:any = this.f.SalvageCost.value
      var RepairCost:any = this.f.RepairCost.value
      var BodilyInjury:any = this.f.BodilyInjury.value
      var PropertyDamage:any = this.f.PropertyDamage.value
      var TotalValue:any = this.f.TotalValue.value

      if(this.accidentInformation.TotalValue == this.f.TotalValue.value){
        this.f.claimStatus.setValue("ATP");
      }
    }

    let userDetails = this.userDetails?.LoginResponse;
    let docIdList:any = [];
    if(this.ownerDocList.length!=0 || this.recoveryDocList.length!=0){
      let List = [];
      List = this.ownerDocList.concat(this.recoveryDocList);
      for(let document of List){
        docIdList.push(document.DocumentTypeId);
      }
    }
    let UrlLink = `${this.ApiUrl1}api/update/status`;
    let ReqObj = {
      "ClaimReferenceNumber": this.claimDetails?.ClaimReferenceNumber,
      "UpdatedBy": userDetails?.LoginId,
      "InsuranceId": userDetails?.InsuranceId,
      "StatusCode": this.f.claimStatus.value,
      "DocRefId":docIdList,
      "Remarks":this.f.claimStatusRemarks.value,
      "DebitNote":this.f.DebitNoteNo.value,
      "CreditNote":this.f.CreditNoteNo.value,
      "AcceptedReserveAmount":this.f.acceAmount.value,
      "ReserveAmount":this.f.reqAmount.value,
      "RecovClaimNo":this.recoveryClaimNo,
      "RecovPolicyNo":this.recoveryPolicyNo,
      "RejectReason": this.f.RejectedReason.value,
      "RecovReplacementAmt": PerDayCost,
      "RecovVehicleValue": VehicleValue,
      "RecovSalvageCost": SalvageCost,
      "RecovRepairCost":RepairCost,
      "RecovBodilyInjury":BodilyInjury,
      "RecovPropertyDamage":PropertyDamage,
      "RecovTotalValue":this.f.TotalValue.value,
      "RecoveryInsId": this.f.InsuranceTypeId.value
    }
    this.addVehicleService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        console.log(data)
        let res:any = data;
        if(res?.ErrorMessage.length==0){
          this.toaster.open({
            text: 'Claim Status Updated Successfully',
            caption: 'Submitted',
            type: 'success',
          });
          this.router.navigate([`Home/${this.claimType}`]);
        }
      },
      (err) => { }
    );
  }
  onUploadDocuments(target:any,fileType:any,type:any){
    console.log("Event ",target);
    let event:any = target.target.files;

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
  onGetPolicyInf(VehicleChassisNumber:any){
    let UrlLink = `${this.ApiUrl1}api/chassissearch`;
    let ReqObj = {
      "VehicleChassisNumber":VehicleChassisNumber
    }
    return this.newClaimService.onPostMethodSync(UrlLink, ReqObj).subscribe((data: any) => {
      console.log("Search Data", data);
      if (data) {
       this.recoveryPolicyInfo = data?.Result;
      }
      if(data?.ErrorMessage?.length >0){
          this.isNewPolicy=true;
      }
    }, (err) => { })
  }

  onEnrichData(){
    this.router.navigate(['/Home/policy/new-policy'],{ queryParams: { isPolicyForm: true } });
  }

  async onGetClaimDetails(event:any) {
    let userDetails = this.userDetails?.LoginResponse;
    let UrlLink = `${this.ApiUrl1}api/view/claim`;
    let ReqObj = {
      "ClaimReferenceNumber": event?.ClaimReferenceNumber

    }
    this.addVehicleService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      async (data: any) => {
        console.log(data)
        if(data?.Message == 'Success'){
          this.claimInformation=data?.Result;
          this.commonInformation = this.claimInformation?.CommonInformation;
          this.accidentInformation=this.claimInformation?.AccidentInformation;
          this.driverInformation=this.claimInformation?.DriverInformation;
          this.policyInformation=this.claimInformation?.PolicyInformation;
          this.recoveryInformation=this.claimInformation?.RecoveryInformation;
          this.vehicleInformation=this.claimInformation?.VehicleInformation;
          this.recoveryClaimNo = this.recoveryInformation?.RecovClaimNo;
          this.recoveryPolicyNo = this.recoveryInformation?.RecovPolicyNo;

          // this.approvedRepairCost = this.recoveryInformation?.RecovRepairCost;
          // this.approvedReplacementCost = this.recoveryInformation?.RecovReplamentAmt;
          // this.approvedTotalClaimCost = this.recoveryInformation?.RecovTotalValue;
          // this.approvedSalvageValue = this.recoveryInformation?.RecovSalvageCost;
          // this.approvedVehicleValue = this.recoveryInformation?.RecovVehicleValue;

          this.f.VehicleValue.setValue(this.recoveryInformation?.RecovVehicleValue)
          this.f.SalvageCost.setValue(this.recoveryInformation?.RecovSalvageCost)
          this.f.BodilyInjury.setValue(this.recoveryInformation?.RecovBodilyInjury)
          this.f.PropertyDamage.setValue(this.recoveryInformation?.RecovPropertyDamage)
          this.f.RepairCost.setValue(this.recoveryInformation?.RecovRepairCost)
          this.f.PerDayCost.setValue(this.recoveryInformation?.RecovReplamentAmt)
          this.f.TotalValue.setValue(this.recoveryInformation?.RecovTotalValue)
          if(this.recoveryInformation?.InsuranceId){
            if(this.recoveryInformation?.InsuranceId == userDetails?.InsuranceId){
              this.faultCompany = true;
            }
            else{
              this.faultCompany = false;
            }
          }
          this.f.reqAmount.setValue(this.commonInformation.ReserveAmount);
          this.f.acceAmount.setValue(this.commonInformation.AcceptedReserveAmount);
          this.onGetPolicyInf(this.recoveryInformation?.VehicleChassisNumber)
          console.log(this.recoveryType);
          if(this.recoveryType == 'Payable'){
            this.f.reqAmount.disable();
          }
          if(this.recoveryType == 'Receivable'){
            this.f.acceAmount.disable();

          }

          this.claimStatusList = await this.onGetInsuranceStatusList(this.commonInformation.Status)||[];
          console.log(this.claimStatusList)
          
          this.f.claimStatus.setValue(this.claimStatusList[0].StatusCode)
          //this.getCurrentStatusList(event);
        }
      },
      (err) => { }
    );
  }
  getCurrentStatusList(event:any){
    let UrlLink = `${this.ApiUrl1}api/track/claim`;
    let ReqObj = {
      "ClaimReferenceNumber": event?.ClaimReferenceNumber,
      "TotalTrackingYn":"Y"
     }
     this.addVehicleService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        console.log(data)
         let res = data.Result;
         if(res?.OwnCompanyTrack){
           this.setOwnerTrackList(res.OwnCompanyTrack);
         }
         if(res?.RecoveryCompanyTrack){
          this.setRecoveryTrackList(res.RecoveryCompanyTrack);
         }
         if(res?.TotalCompaniesTrack){
          this.totalTrackList = res?.TotalCompaniesTrack;
         }
      },
      (err) => { }
    );
  }
  setOwnerTrackList(data:any){
    this.ownerColumnHeader = [
      { key: "StatusDesc", display: "Description" },
      { key: "EntryDate", display: "Date & Time" },
      {
        key: "Remarks", display: "Remarks",
      }
    ];
    this.ownerTrackList = data;
  }
  setRecoveryTrackList(data:any){
    this.recoveryColumnHeader = [
      { key: "StatusDesc", display: "Description" },
      { key: "EntryDate", display: "Date & Time" },
      {
        key: "Remarks", display: "Remarks",
      }
    ];
    this.recoveryTrackList = data;
  }
  open(content:any) {
    this.modalService.open(content,{size: 'lg',ariaLabelledBy: 'modal-basic-title',backdrop : 'static',
    keyboard : false}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
}
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
  onChangeClaimValue(){
    this.approvedTotalClaimCost = 0;
    if(this.approvedVehicleValue!="" && this.approvedVehicleValue!= null && this.approvedVehicleValue!= undefined && this.accidentInformation?.recovTotalLossYn == 'Y'){
      this.approvedTotalClaimCost = this.approvedTotalClaimCost + Number(this.approvedVehicleValue);
    }
    if(this.approvedSalvageValue!="" && this.approvedSalvageValue!= null && this.approvedSalvageValue!= undefined && this.accidentInformation?.recovTotalLossYn == 'Y'){
      this.approvedTotalClaimCost = this.approvedTotalClaimCost + Number(this.approvedSalvageValue);
    }
    if(this.approvedRepairCost!="" && this.approvedRepairCost!= null && this.approvedRepairCost!= undefined){
      this.approvedTotalClaimCost = this.approvedTotalClaimCost + Number(this.approvedRepairCost);
    }
    if(this.approvedReplacementCost!="" && this.approvedReplacementCost!= null && this.approvedReplacementCost!= undefined){
      this.approvedTotalClaimCost = this.approvedTotalClaimCost + Number(this.approvedReplacementCost);
    }
  }




}


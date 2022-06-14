import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as Mydatas from '../../../assets/app-config.json';
import { AddVehicleService } from '../add-vehicle/add-vehicle.service';
import Swal from 'sweetalert2';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NewClaimService } from '../new-claim/new-claim.service';
import { Toaster } from 'ngx-toast-notifications';
import { PrimeIcons } from "primeng/api";
declare var $:any;
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
  documentAIDetails: any[]=[];
  ownerDocList: any[]=[];
  recoveryDocList: any[]=[];
  events1: any[]=[];
  totalTrackList: any[]=[];recoveryPolicyNo:any="";
  recoveryClaimNo:any="";approvedVehicleValue:any="";
  approvedSalvageValue:any="";approvedRepairCost:any="";
  approvedReplacementCost:any="";approvedTotalClaimCost:any="";
  faultCompany: boolean = false;
  constructor(
    private _formBuilder: FormBuilder,
    private addVehicleService: AddVehicleService,
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private modalService:NgbModal,
    private newClaimService:NewClaimService,
    private toaster: Toaster,
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
    console.log("Received Details",this.claimDetails);
    this.onGetClaimDetails(this.claimDetails)
    this.claimType = sessionStorage.getItem('claimType');

  }

  ngOnInit(): void {
    this.onCreateFormControl();
    this.onFetchInitialData();
    this.onGetUploadedDocuments();
  }

  onCreateFormControl() {
    this.claimStatusForm = this._formBuilder.group({
      claimStatus: ['', Validators.required],
      claimStatusRemarks: ['', Validators.required],
      reqAmount: ['', Validators.required],
      acceAmount: ['', Validators.required],


    });
  }
  get f() { return this.claimStatusForm.controls; };

  async onFetchInitialData(){


  // let index = this.claimStatusList.findIndex((ele:any)=>ele.StatusCode == this.f.claimStatus.value);
  // console.log(index)
  // this.statusName = this.claimStatusList[index].StatusDesc;
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
  private _filter(value: any, data: any[]): any[] {
    if (value == null) {
      value = '';
    }
    const filterValue = value.toLowerCase();
    return data.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));
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
          "ClaimNumber": this.claimDetails?.ClaimReferenceNumber,
          "DocumentReferenceNumber": this.ownerDocList[index].DocumentReferenceNumber,
          "DocumentTypeId": this.ownerDocList[index].DocumentTypeId,
          "InsuranceId": this.ownerDocList[index]?.InsuranceId
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
    let docIdList:any = [];
    if(this.ownerDocList.length!=0){
      for(let document of this.ownerDocList){
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
      "AcceptedReserveAmount":this.f.acceAmount.value,
      "ReserveAmount":this.f.reqAmount.value,
      "RecovRepairCost":this.approvedRepairCost,
      "RecovTotalValue":this.approvedTotalClaimCost,
      "RecovReplacementAmt": this.approvedReplacementCost,
      "RecovClaimNo":this.recoveryClaimNo,
      "RecovPolicyNo":this.recoveryPolicyNo,
      "RecovVehicleValue": this.approvedVehicleValue,
      "RecovSalvageCost": this.approvedSalvageValue
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
          this.router.navigate(['Home']);
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
          this.approvedRepairCost = this.recoveryInformation?.RecovRepairCost;
          this.approvedReplacementCost = this.recoveryInformation?.RecovReplamentAmt;
          this.approvedTotalClaimCost = this.recoveryInformation?.RecovTotalValue;
          this.approvedSalvageValue = this.recoveryInformation?.RecovSalvageCost;
          this.approvedVehicleValue = this.recoveryInformation?.RecovVehicleValue;
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

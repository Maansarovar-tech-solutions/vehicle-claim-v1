import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as Mydatas from '../../app-config.json';
import { AddVehicleService } from '../add-vehicle/add-vehicle.service';
import { NewClaimService } from '../new-claim/new-claim.service';
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
  claimType: string | null;
  imageUrl: any;
  uploadDocList: any[]=[];
  ownerColumnHeader:any[]=[];
  ownerTrackList: any;
  recoveryColumnHeader: any[]=[];
  recoveryTrackList: any;
  constructor(
    private _formBuilder: FormBuilder,
    private addVehicleService: AddVehicleService,
    private newClaimService:NewClaimService,
    private activatedRoute: ActivatedRoute,
    private router:Router

  ) {
    this.userDetails = JSON.parse(sessionStorage.getItem("Userdetails") || '{}');
    this.recoveryType=sessionStorage.getItem("claimType");


    this.activatedRoute.queryParams.subscribe(
      (params: any) => {
        console.log(params)
        this.claimDetails=params;
        console.log("Received Details",this.claimDetails);
        this.onGetClaimDetails(params)
      }
    );
    this.claimType = sessionStorage.getItem('claimType');

  }

  ngOnInit(): void {
    this.onCreateFormControl();
    this.onFetchInitialData();
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
  this.claimStatusList = await this.onGetInsuranceStatusList()||[];
  // let index = this.claimStatusList.findIndex((ele:any)=>ele.StatusCode == this.f.claimStatus.value);
  // console.log(index)
  // this.statusName = this.claimStatusList[index].StatusDesc;
  }

  private _filter(value: any, data: any[]): any[] {
    if (value == null) {
      value = '';
    }
    const filterValue = value.toLowerCase();
    return data.filter((option) => option?.CodeDesc?.toLowerCase().includes(filterValue));
  }

  claimStatusText = (option: any) => {
    if (!option) return '';
    let index = this.claimStatusList.findIndex((make: any) => make.Code == option);
    return this.claimStatusList[index].CodeDesc;
  }

  onGetStatusName(val: any) {
    this.statusName=val;
  }

  async onGetInsuranceStatusList() {
    let UrlLink = `${this.ApiUrl1}api/dropdown/claimstatus/${this.recoveryType}`
    let response = (await this.addVehicleService.onGetMethodAsync(UrlLink)).toPromise()
      .then((res: any) => {
        return res?.Result;
      })
      .catch((err) => { });
    return response;
  }
  onUpdateClaimStatus() {
    let userDetails = this.userDetails?.LoginResponse;
    let UrlLink = `${this.ApiUrl1}api/update/status`;
    let ReqObj = {
      "ClaimReferenceNumber": this.claimDetails?.ClaimReferenceNumber,
      "UpdatedBy": userDetails?.LoginId,
      "InsuranceId": userDetails?.InsuranceId,
      "StatusCode": this.f.claimStatus.value,
      "Remarks":this.f.claimStatusRemarks.value,
      "AcceptedReserveAmount":this.f.acceAmount.value,
      "ReserveAmount":this.f.reqAmount.value
    }
    this.addVehicleService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        console.log(data)
        let res:any = data;
        if(res?.ErrorMessage.length==0){
          this.router.navigate(['Home']);
        }
      },
      (err) => { }
    );
  }

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
          console.log("Img Url",this.imageUrl);
          this.uploadDocList.push({ 'url': this.imageUrl, 'JsonString': {} });

        }

    }
  }


  onGetClaimDetails(event:any) {
    let userDetails = this.userDetails?.LoginResponse;
    let UrlLink = `${this.ApiUrl1}api/view/claim`;
    let ReqObj = {
      "ClaimReferenceNumber": event?.ClaimReferenceNumber

    }
    this.addVehicleService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        console.log(data)
        if(data?.Message == 'Success'){
          this.claimInformation=data?.Result;
          this.commonInformation = this.claimInformation?.CommonInformation;
          this.accidentInformation=this.claimInformation?.AccidentInformation;
          this.driverInformation=this.claimInformation?.DriverInformation;
          this.policyInformation=this.claimInformation?.PolicyInformation;
          this.recoveryInformation=this.claimInformation?.RecoveryInformation;
          this.vehicleInformation=this.claimInformation?.VehicleInformation;
          this.f.reqAmount.setValue(this.accidentInformation.TotalValue);
          this.f.acceAmount.setValue(this.commonInformation.AcceptedReserveAmount);
          console.log(this.recoveryType);
          if(this.recoveryType == 'Payable'){
            this.f.reqAmount.disable();
          }
          if(this.recoveryType == 'Receivable'){
            this.f.acceAmount.disable();

          }

          this.onGetPolicyInformation();
          this.getCurrentStatusList(event);
        }
      },
      (err) => { }
    );
  }
  getCurrentStatusList(event:any){
    let UrlLink = `${this.ApiUrl1}api/track/claim`;
    let ReqObj = {
      "ClaimReferenceNumber": event?.ClaimReferenceNumber
     }
     this.addVehicleService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        console.log(data)
         let res = data.Result;
         if(res.OwnCompanyTrack){
           this.setOwnerTrackList(res.OwnCompanyTrack);
         }
         if(res.RecoveryCompanyTrack){
          this.setRecoveryTrackList(res.RecoveryCompanyTrack);
         }
      },
      (err) => { }
    );
  }

  onGetPolicyInformation() {
    let UrlLink = `${this.ApiUrl1}api/searchvehicleinfo`;
    let ReqObj = {
      "VehicleChassisNumber": this.recoveryInformation?.VehicleChassisNumber
    }
    return this.newClaimService.onPostMethodSync(UrlLink, ReqObj).subscribe((data: any) => {
      console.log("Search Data", data);
      if (data) {
          this.recoveryPolicyInfo = data?.Result;
      }
    }, (err) => { })
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
}

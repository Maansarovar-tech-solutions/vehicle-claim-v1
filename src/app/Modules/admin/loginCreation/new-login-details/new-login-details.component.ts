import { AppComponent } from './../../../../app.component';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as Mydatas from '../../../../../assets/app-config.json';
import { AddVehicleService } from 'src/app/Modules/add-vehicle/add-vehicle.service';
import { Toaster } from 'ngx-toast-notifications';

@Component({
  selector: 'app-new-login-details',
  templateUrl: './new-login-details.component.html',
  styleUrls: ['./new-login-details.component.css']
})
export class NewLoginDetailsComponent implements OnInit {

  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;
  editSection:boolean = false;
  changePassword:boolean = false;
  userName:any="";emailId:any;mobileNo:any;
  statusValue:any="Y";remarks:any="";
  productList:any[]=[];
  productBasedList: any[]=[];
  depreciationList: any[]=[];
  productValue: any;
  officerList: any[]=[];
  approverList: any[]=[];
  adminList: any[]=[];
  managerList: any[]=[];addUserType:any="";
  addSumInsuredStart: any;
  addRegionCode: any;userTypeList:any[]=[];
  addSumInsuredEnd: any;regionList:any[]=[];
  productName: any;loginId:any="";password:any="";
  rePassword:any="";oldPassword:any="";newPassword:any="";
  reNewPassword:any="";
  companyId: any;
  pwdCount: any;
  createdBy: any;
  passDate: any;
  entryDate: any;
  userDetails: any;
  constructor(private router:Router,
    public app:AppComponent,
    private addVehicleService: AddVehicleService,private toaster: Toaster,) {
      this.userDetails = this.app.decryptData(sessionStorage.getItem("Userdetails"));
    let loginDetails = JSON.parse(sessionStorage.getItem('editLoginId') || '{}');
    this.companyId  = sessionStorage.getItem('loginCompanyId');
    if(loginDetails?.LoginId){
      this.loginId = loginDetails?.LoginId;
      this.editSection = true;
      this.getEditLoginDetails();
    }
    else{
      this.createdBy = this.userDetails?.LoginResponse?.LoginId;
    }
    this.productList = [
      {
        "Code": "TPL",
        "Description": "Recovery Claim",
        "ImageIcon": "data:image/jpg;base64,"
      },
      {
        "Code": "TL",
        "Description": "Total Loss",
        "ImageIcon": "data:image/jpg;base64,"
      }
    ];
    this.regionList = [
      {
        "Code": "East",
        "Description": "East"
      },
      {
        "Code": "West",
        "Description": "West"
      },
      {
        "Code": "North",
        "Description": "North"
      },
      {
        "Code": "South",
        "Description": "South"
      }
    ];
    this.getUserTypeList();
    this.depreciationList = [];
    this.adminList = [];
    this.managerList = [];
    this.approverList = [];
    this.officerList = [];
   }

  ngOnInit(): void {
  }
  getUserTypeList(){
    let UrlLink = `${this.ApiUrl1}dropdown/claimusertypemaster`;
       this.addVehicleService.onGetMethodSync(UrlLink).subscribe(
        (data: any) => {
          console.log("UserType List",data);
          this.userTypeList = data.Result;
      })
  }
  checkProductSection(rowData:any){
    if(this.productBasedList.length!=0){
      let Exist = this.productBasedList.some((ele:any)=>ele.claimType == rowData.Code);
      if(Exist){

        return true;
      }
      else{
        return false;
      }
    }
    else{
      return false;
    }
  }
  filterRowList(rowData:any,type:any){
    let claimType = "";
    if(type == 'submit') claimType = rowData;
    else  claimType = rowData.Code;
    let Exist = this.productBasedList.some((ele:any)=>ele.ProductId == claimType);
    this.depreciationList = [];
    if(!Exist){
        if(this.managerList.length!=0){
          this.depreciationList = this.depreciationList.concat(this.managerList);
        }
        if(this.adminList.length!=0){
          this.depreciationList = this.depreciationList.concat(this.adminList);
        }
        if(this.approverList.length!=0){
          this.depreciationList = this.depreciationList.concat(this.approverList);
        }
        if(this.officerList.length!=0){
          this.depreciationList = this.depreciationList.concat(this.officerList);
        }
        this.depreciationList = this.depreciationList.filter(entry=>entry.UserType!= undefined);
        let i=0;
        if(this.productBasedList.length!=0){
          for(let product of this.productBasedList){
            if(product.claimType == this.productValue){
              product.UserTypeBasedDetails = this.depreciationList;
            }
            i+=1;
            if(i==this.productBasedList.length){
               if(type =='direct') this.getProductDetails(rowData);
               else this.onFormSubmit();
            }
          }
        }
        else{
          this.depreciationList = [];
          this.getProductDetails(rowData);
        }

    }
    else{
      console.log("Selected Values are",rowData);
      this.depreciationList = [];
      this.getProductDetails(rowData);
    }
  }
  async onFormSubmit(){
    console.log("Final List",this.productBasedList);
    let claimList =this.productBasedList.filter(
      (              claim: { UserTypeBasedDetails: string | any[]; }) => claim.UserTypeBasedDetails.length!=0);
    let editYN ="";
    if(this.editSection) editYN = "Y";
    else editYN = "N";
    let ReqObj = {
      "LoginId": this.loginId,
      "CreatedBy":this.createdBy,
      "UserName": this.userName,
      "UserMail": this.emailId,
      "MobileNumber": this.mobileNo,
      "Status": this.statusValue,
      "Remarks": this.remarks,
      "ClaimTypeBasedDetails": claimList,
      "CompanyId":this.companyId,
      "Password": this.password,
      "RePassword": this.rePassword,
      "IsEditYN": editYN,
      "Passdate":this.passDate,
      "PwdCount":this.pwdCount,
      "EntryDate":this.entryDate
    }
    let UrlLink = `${this.ApiUrl1}authentication/save`;
    (await this.addVehicleService.onPostMethodSync(UrlLink,ReqObj)).toPromise().then(res=>{
          let data:any = res;
          console.log("On Final Submit",data);
          if(data.ErrorMessage.length == 0){
            this.toaster.open({
              text: 'Login Details Inserted/Updated Successfully',
              caption: 'Upload',
              type: 'success',
            });
            this.router.navigate(['Home/ExistingLoginDetails'])
            // this.toastr.showSuccess("Login Details Inserted/Updated Successfully", "Login Creation");
            //
          }
    }).catch((err) => {
      console.log("Error",err)
  });;
  }
  onChangeNewValue(type:any,event:any){
    if(type=='UserType'){
      this.addUserType = event.value;
      if(event=='manager' || event == 'admin'){
        this.addSumInsuredStart = "";this.addSumInsuredEnd ="";
      }
    }
    // else if(type=='RegionCode'){
    //   this.addRegionCode = event.value;
    // }
    else if(type=='SumInsuredStart'){
      console.log("Event",event);
      this.addSumInsuredStart = event.target.value;
    }
    else if(type=='SumInsuredEnd'){
      this.addSumInsuredEnd = event.target.value;
    }
  }
  onProductChange(rowData:any,event:any){
    if(event){
      console.log("Checked Event");
      let Exist = this.productBasedList.some(entry=>entry.claimType == rowData.Code);
      if(!Exist){

          let entry = {
            "claimType":rowData.Code,
            "UserTypeBasedDetails":[]
          }

          this.productBasedList.push(entry);
          if(this.productValue == rowData.Code){
            this.filterRowList(rowData,'direct');
          }
      }
      else{
        if(this.productValue == rowData.Code){
          this.filterRowList(rowData,'direct');
        }
      }
    }
    else{
      console.log("Not Checked Event");
      let Exist = this.productBasedList.some(entry=>entry.claimType == rowData.Code);
      if(Exist){
        let index = this.productBasedList.findIndex(entry=>entry.claimType == rowData.Code);
        this.productBasedList.splice(index,1);
      }
    }
  }
  addNewList(){
    let i = 0;
    let row = {
      "UserType":this.addUserType,
      "SumInsuredStart":this.addSumInsuredStart,
      "SumInsuredEnd":this.addSumInsuredEnd
    }
    if(this.addUserType){
      if(this.addUserType == 'manager'){
        if(this.managerList.length!=0){
          let Exist = this.managerList.some(entry=>entry.UserType == this.addUserType);
          console.log("Value",Exist);
          if(Exist){
            this.toaster.open({
              text: 'Manager Information Already Present',
              caption: 'UserType Error',
              type: 'danger',
            });
            //this.toastr.showError('Manager Information Already Present','UserType Error');
          }
          else{
            this.managerList.push(row);
            this.addRegionCode = "";this.addUserType="";this.addSumInsuredEnd = "";this.addSumInsuredStart = "";
          }
        }
        else{
          this.managerList.push(row);
          this.addRegionCode = "";this.addUserType="";this.addSumInsuredEnd = "";this.addSumInsuredStart = "";
        }
      }
      else if(this.addUserType == 'officer'){
        if(this.officerList.length!=0){
          let Exist = this.officerList.some(entry=>entry.UserType == this.addUserType);
          if(Exist){
            this.toaster.open({
              text: 'Officer Information Already Present',
              caption: 'UserType Error',
              type: 'danger',
            });
            //this.toastr.showError('Officer Information Already Present','UserType Error');
          }
          else{
            this.officerList.push(row);
            this.addRegionCode = "";this.addUserType="";this.addSumInsuredEnd = "";this.addSumInsuredStart = "";
          }
        }
        else{
          this.officerList.push(row);
          this.addRegionCode = "";this.addUserType="";this.addSumInsuredEnd = "";this.addSumInsuredStart = "";
        }
      }
      else if(this.addUserType == 'approver'){
        if(this.approverList.length!=0){
          let Exist = this.approverList.some(entry=>entry.UserType == this.addUserType);

          if(Exist){
            this.toaster.open({
              text: 'Approver Information Already Present',
              caption: 'UserType Error',
              type: 'danger',
            });
            //this.toastr.showError('Approver Information Already Present','Region Error');
          }
          else{
            this.approverList.push(row);
            this.addRegionCode = "";this.addUserType="";this.addSumInsuredEnd = "";this.addSumInsuredStart = "";
          }
        }
        else{
          this.approverList.push(row);
          this.addRegionCode = "";this.addUserType="";this.addSumInsuredEnd = "";this.addSumInsuredStart = "";
        }
      }
      else if(this.addUserType == 'admin'){
        if(this.adminList.length!=0){
          let Exist = this.adminList.some(entry=>entry.UserType == this.addUserType);

          if(Exist){
            this.toaster.open({
              text: 'Admin Information Already Present',
              caption: 'UserType Error',
              type: 'danger',
            });
            //this.toastr.showError('Admin Information Already Present','Region Error');
          }
          else{
            this.adminList.push(row);
            this.addRegionCode = "";this.addUserType="";this.addSumInsuredEnd = "";this.addSumInsuredStart = "";
          }
        }
        else{
          this.adminList.push(row);
          this.addRegionCode = "";this.addUserType="";this.addSumInsuredEnd = "";this.addSumInsuredStart = "";
        }
      }
    }
  }
  addDefaultRow() {
    console.log("addDepreciation ::");
    let validRow = true;
    for (let i = 0; i < this.depreciationList.length; i++) {
      console.log("addDepreciation ==> ", this.depreciationList[i]);
      if (this.depreciationList[i]['Product'] == '')
        validRow = false;
      else if (this.depreciationList[i]['UserType'] == '')
        validRow = false;
      else if (this.depreciationList[i]['SumInsuredStart'] == '')
        validRow = false;
      else if (this.depreciationList[i]['SumInsuredEnd'] == '')
        validRow = false;
    }
    if (validRow) {
      let depreciation:any = {
        "UserType": undefined,
        "SumInsuredStart": "",
        "SumInsuredEnd": "",
      }
      this.depreciationList.push(depreciation);
    }
  }
  onChangeValue(type:any,event:any,rowData:any){
    if(type=='UserType'){
      rowData.UserType = event.value;
    }
    // else if(type=='RegionCode'){
    //   rowData.RegionCode = event.value;
    // }
    else if(type=='SumInsuredStart'){
      console.log("Event",event);
      rowData.SumInsuredStart = event.target.value;
    }
    else if(type=='SumInsuredEnd'){
      rowData.SumInsuredEnd = event.target.value;
    }
  }
  getProductDetails(rowData:any){
    this.productValue = rowData.Code;
    this.productName = rowData.Description;
    this.addRegionCode = "";this.addUserType="";this.addSumInsuredEnd = "";this.addSumInsuredStart = "";
    console.log("Change Product",this.productBasedList,rowData);
    if(this.productBasedList.length!=0){
      let i=0,j=0;
      for(let product of this.productBasedList){
        if(product.claimType == this.productValue){
          i+=1;
          let userDetails = product.UserTypeBasedDetails;
          if(userDetails.length!=0){
              this.depreciationList = userDetails;
              console.log("Final Dep",this.depreciationList,this.productBasedList)
              this.splitExistingDetails(userDetails);
          }
          else{
            this.managerList = [];
            this.adminList = [];
            this.approverList = [];
            this.officerList = [];
          }
        }
        j+=1;
          if(j==this.productBasedList.length){
            console.log("Not Found Index",i,this.productBasedList);
            if(i==0){
              this.managerList = [];
              this.adminList = [];
              this.approverList = [];
              this.officerList = [];
            }
          }
      }
    }
    else{
            this.managerList = [];
            this.adminList = [];
            this.approverList = [];
            this.officerList = [];
    }
  }
  deleteRow(type:any,index:any){
    if(type == 'manager'){
      this.managerList.splice(index,1);
    }
    else if(type == 'admin'){
      this.adminList.splice(index,1);
    }
    else if(type == 'officer'){
      this.officerList.splice(index,1);
    }
    else if(type == 'approver'){
      this.approverList.splice(index,1);
    }
  }
  splitExistingDetails(userDetails:any[]) {
    if(userDetails.length!=0){
      this.approverList =  userDetails.filter(entry=>entry.UserType.toLocaleLowerCase() == 'approver');
      this.managerList =  userDetails.filter(entry=>entry.UserType.toLocaleLowerCase() == 'manager');
      this.officerList =  userDetails.filter(entry=>entry.UserType.toLocaleLowerCase() == 'officer');
      this.adminList =  userDetails.filter(entry=>entry.UserType.toLocaleLowerCase() == 'admin');
    }
  }
  showUserList(){
    return !(this.managerList.length!=0 || this.officerList.length!=0 || this.approverList.length!=0 || this.adminList.length!=0)
  }
  back(){
    sessionStorage.removeItem('editLoginId');
    this.router.navigate(['Home/ExistingLoginDetails'])
  }
  getEditLoginDetails(){
    let ReqObj = {
      "LoginId": this.loginId,
      "CompanyId": this.companyId
    }
    let UrlLink = `${this.ApiUrl1}authentication/getdetails`;
    this.addVehicleService.onPostMethodSync(UrlLink,ReqObj).subscribe(
      (data: any) => {
          console.log("Login Edit Details",data);
          this.createdBy = data.CreatedBy;
          this.userName = data.UserName;
          this.emailId = data.UserMail;
          this.mobileNo = data.MobileNumber;
          this.statusValue = data.Status;
          this.remarks = data.Remarks;
          this.password = data.Password;
          this.pwdCount = data.PwdCount;
          this.passDate = data.Passdate;
          this.entryDate = data.EntryDate;
          if(data.ClaimTypeBasedDetails){
            let claimList = data.ClaimTypeBasedDetails.filter(
              (              claim: { UserTypeBasedDetails: string | any[]; }) => claim.UserTypeBasedDetails.length!=0);
            this.productBasedList = claimList;
            if(this.productList){
              this.getProductDetails(this.productList[0]);
            }
          }
      },
      (err) => { }
    );
  }
  async onChangePassword(){
    if(this.newPassword == this.reNewPassword){
      let ReqObj = {
      "UserId" : this.loginId,
      "NewPassword" : this.newPassword,
      "OldPassword" : this.oldPassword
      }
    let UrlLink = `${this.ApiUrl1}authentication/changepassword`;
    (await this.addVehicleService.onPostMethodSync(UrlLink,ReqObj)).toPromise().then(res=>{
          let data:any = res;
          this.toaster.open({
            text: 'Password Updated Successfully',
            caption: 'Change Password',
            type: 'success',
          });
            //this.toastr.showSuccess("Password Updated Successfully", "Password");
            this.changePassword = false;this.newPassword = "";this.reNewPassword = "";this.oldPassword = "";

        }).catch((err) => {
          console.log("Error",err);
      });;
    }
    else{
      this.toaster.open({
        text: 'New Passwords Does Not Match',
        caption: 'New Password Error',
        type: 'danger',
      });
      //this.toastr.showError('New Passwords Does Not Match', 'New Password Error');
    }

  }
}


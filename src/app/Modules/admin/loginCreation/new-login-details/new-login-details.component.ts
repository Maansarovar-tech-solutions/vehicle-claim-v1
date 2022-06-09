import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as Mydatas from '../../../../app-config.json';
import { AddVehicleService } from 'src/app/Modules/add-vehicle/add-vehicle.service';

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
  checkerList: any[]=[];
  approverList: any[]=[];
  adminList: any[]=[];
  makerList: any[]=[];addUserType:any="";
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
  constructor(private router:Router,
    private addVehicleService: AddVehicleService,) {
    let loginDetails = JSON.parse(sessionStorage.getItem('editLoginId') || '{}');
    this.companyId  = sessionStorage.getItem('loginCompanyId');
    if(loginDetails?.LoginId){
      this.loginId = loginDetails?.LoginId;
      this.editSection = true;
      this.getEditLoginDetails();
    }
    
    this.productList = [
      {
        "Code": "10001",
        "Description": "Recovery Claim",
        "ImageIcon": "data:image/jpg;base64,"
      },
      {
        "Code": "10002",
        "Description": "Total Loss",
        "ImageIcon": "data:image/jpg;base64,"
      } 
    ];
    this.userTypeList = [
      {
        "Code": "maker",
        "Description": "Maker"
      },
      {
        "Code": "checker",
        "Description": "Checker"
      },
      {
        "Code": "approver",
        "Description": "Approver"
      },
      {
        "Code": "admin",
        "Description": "Admin"
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
    this.makerList = [];
    this.approverList = [];
    this.checkerList = [];
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
      let Exist = this.productBasedList.some((ele:any)=>ele.ProductCode == rowData.Code);
      if(!Exist){
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
    let productCode = "";
    if(type == 'submit') productCode = rowData;
    else  productCode = rowData.Code;
    let Exist = this.productBasedList.some((ele:any)=>ele.ProductId == productCode);
    this.depreciationList = [];
    if(!Exist){
        if(this.makerList.length!=0){
          this.depreciationList = this.depreciationList.concat(this.makerList); 
        }
        if(this.adminList.length!=0){
          this.depreciationList = this.depreciationList.concat(this.adminList); 
        }
        if(this.approverList.length!=0){
          this.depreciationList = this.depreciationList.concat(this.approverList); 
        }
        if(this.checkerList.length!=0){
          this.depreciationList = this.depreciationList.concat(this.checkerList); 
        }
        this.depreciationList = this.depreciationList.filter(entry=>entry.UserType!= undefined);
        let i=0;
        if(this.productBasedList.length!=0){
          for(let product of this.productBasedList){
            if(product.ProductCode == this.productValue){
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
      "ProductBasedDetails": this.productBasedList,
      "Password": this.password,
      "RePassword": this.rePassword,
      "IsEditYN": editYN,
      "Passdate":this.passDate,
      "PwdCount":this.pwdCount,
      "EntryDate":this.entryDate
    }
    let UrlLink = `/loginCreation/save`;
    (await this.addVehicleService.onPostMethodSync(UrlLink,ReqObj)).toPromise().then(res=>{
          let data:any = res;
          console.log("On Final Submit",data);
          if(data.ErrorList.length == 0){
            // this.toastr.showSuccess("Login Details Inserted/Updated Successfully", "Login Creation");
            // this.router.navigate(['/admin/existingLoginDetails'])
          }
    }).catch((err) => {
      console.log("Error",err)
  });;
  }
  onChangeNewValue(type:any,event:any){
    if(type=='UserType'){
      this.addUserType = event.value;
      if(event=='maker' || event == 'admin'){
        this.addSumInsuredStart = "";this.addSumInsuredEnd ="";
      }
    }
    else if(type=='RegionCode'){
      this.addRegionCode = event.value;
    }
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
      let Exist = this.productBasedList.some(entry=>entry.ProductCode == rowData.Code);
      if(!Exist){
        console.log("Not Exist Data");
          let entry = {
            "ProductCode":rowData.Code,
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
      let Exist = this.productBasedList.some(entry=>entry.ProductCode == rowData.Code);
      if(Exist){
        let index = this.productBasedList.findIndex(entry=>entry.ProductCode == rowData.Code);
        this.productBasedList.splice(index,1);
      }
    }
  }
  addNewList(){
    let i = 0;
    let row = {
      "UserType":this.addUserType,
      "RegionCode":this.addRegionCode,
      "SumInsuredStart":this.addSumInsuredStart,
      "SumInsuredEnd":this.addSumInsuredEnd
    }
    if(this.addUserType){
      if(this.addUserType == 'maker'){
        if(this.makerList.length!=0){
          let Exist = this.makerList.some(entry=>entry.RegionCode == this.addRegionCode);
          console.log("Value",Exist);
          if(Exist){
            //this.toastr.showError('Maker Information Already Present','Region Error');
          }
          else{
            this.makerList.push(row);
            this.addRegionCode = "";this.addUserType="";this.addSumInsuredEnd = "";this.addSumInsuredStart = "";
          }
        }
        else{
          this.makerList.push(row);
          this.addRegionCode = "";this.addUserType="";this.addSumInsuredEnd = "";this.addSumInsuredStart = "";
        }
      }
      else if(this.addUserType == 'checker'){
        if(this.checkerList.length!=0){
          let Exist = this.checkerList.some(entry=>entry.RegionCode == this.addRegionCode);
          if(Exist){
            //this.toastr.showError('Checker Information Already Present','Region Error');
          }
          else{
            this.checkerList.push(row);
            this.addRegionCode = "";this.addUserType="";this.addSumInsuredEnd = "";this.addSumInsuredStart = "";
          }
        }
        else{
          this.checkerList.push(row);
          this.addRegionCode = "";this.addUserType="";this.addSumInsuredEnd = "";this.addSumInsuredStart = "";
        }
      }
      else if(this.addUserType == 'approver'){
        if(this.approverList.length!=0){
          let Exist = this.approverList.some(entry=>entry.RegionCode == this.addRegionCode);
          
          if(Exist){
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
          let Exist = this.adminList.some(entry=>entry.RegionCode == this.addRegionCode);
          
          if(Exist){
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
        "RegionCode": "",
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
    else if(type=='RegionCode'){
      rowData.RegionCode = event.value;
    }
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
        if(product.ProductCode == this.productValue){
          i+=1;
          let userDetails = product.UserTypeBasedDetails;
          if(userDetails.length!=0){
              this.depreciationList = userDetails;
              console.log("Final Dep",this.depreciationList,this.productBasedList)
              this.splitExistingDetails(userDetails);
          }
          else{
            this.makerList = [];
            this.adminList = [];
            this.approverList = [];
            this.checkerList = [];
          }
        }
        j+=1;
          if(j==this.productBasedList.length){
            console.log("Not Found Index",i,this.productBasedList);
            if(i==0){
              this.makerList = [];
              this.adminList = [];
              this.approverList = [];
              this.checkerList = [];
            }
          }
      }
    }
    else{
            this.makerList = [];
            this.adminList = [];
            this.approverList = [];
            this.checkerList = [];
    }
  }
  deleteRow(type:any,index:any){
    if(type == 'maker'){
      this.makerList.splice(index,1);
    }
    else if(type == 'admin'){
      this.adminList.splice(index,1);
    }
    else if(type == 'checker'){
      this.checkerList.splice(index,1);
    }
    else if(type == 'approver'){
      this.approverList.splice(index,1);
    }
  }
  splitExistingDetails(userDetails:any[]) {
    if(userDetails.length!=0){
      this.approverList =  userDetails.filter(entry=>entry.UserType == 'approver');
      this.makerList =  userDetails.filter(entry=>entry.UserType == 'maker');
      this.checkerList =  userDetails.filter(entry=>entry.UserType == 'checker');
      this.adminList =  userDetails.filter(entry=>entry.UserType == 'admin');
    }
  }
  showUserList(){
    return !(this.makerList.length!=0 || this.checkerList.length!=0 || this.approverList.length!=0 || this.adminList.length!=0)
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
          this.userName = data.UserName;
          this.emailId = data.UserMail;
          this.mobileNo = data.MobileNumber;
          this.statusValue = data.Status;
          this.remarks = data.Remarks;
          this.password = data.Password;
          this.pwdCount = data.PwdCount;
          if(data.ClimTypeBasedDetails){
            this.productBasedList = data.ClimTypeBasedDetails;
          }
      },  
      (err) => { }
    );
  }
}


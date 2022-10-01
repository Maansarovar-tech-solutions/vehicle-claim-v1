import { SharedService } from './../../Shared/Services/shared.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as Mydatas from '../../../assets/app-config.json';

@Component({
  selector: 'app-statement-upload',
  templateUrl: './statement-upload.component.html',
  styleUrls: ['./statement-upload.component.css']
})
export class StatementUploadComponent implements OnInit {
  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;

  public userDetails: any;
  public documentList:any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public sharedService: SharedService
  ) {
    console.log(this.data)
    this.documentList = data?.TotalClaimDocuments
  }



  ngOnInit(): void {
    this.userDetails = JSON.parse(sessionStorage.getItem("Userdetails") || '{}');


  }

  onUploadDocument(event: any, eventType: string) {
    console.log(event)
    let fileList;
    if (eventType == 'click') {
      fileList = event.target.files[0]
    }
    if (eventType == 'drop') {
      fileList = event[0]
    }


    let UrlLink = `${this.ApiUrl1}upload`;
    var reader = new FileReader();
    reader.readAsDataURL(fileList);
    var filename = fileList.name;
    let imageUrl: any;
    reader.onload = (event: any) => {
      imageUrl = event.target.result;
      let userDetails = this.userDetails?.LoginResponse;
      let ReqObj = {
        "FilePathName": "",
        "Delete": "Y",
        "DocumentDesc": "Statement Documents",
        "FileName": filename,
        "DocApplicable": "STATEMENT_INFO",
        "Param": "CHASSISNO=JMYSREA2A4Z704034~MULIKIYA=93307935",
        "DocumentTypeId": "106",
        "InsuranceId": this.data.InsuranceId,
        "CreatedBy": userDetails?.LoginId,
        "Devicefrom": "WebApplication",
        "RecovInsuranceId":userDetails?.InsuranceId,
        "StartDate": this.data.startDate,
        "EndDate": this.data.endDate,
        "ClaimNumber": "",
        "file": imageUrl
      }
      return this.sharedService.onPostMethodSync(UrlLink, ReqObj).subscribe(
        async (data: any) => {
          if (data) {
            console.log(data);
            this.onReloadDocumentList(this.data.InsuranceId);
          }
        },
        (err) => { }
      );

    }
  }
  onDeleteDocument(item:any){
    let UrlLink = `${this.ApiUrl1}deletedoc`;
    let ReqObj = {
      "ClaimNumber": item?.ClaimNumber,
      "DocumentReferenceNumber": item.DocumentReferenceNumber,
      "DocumentTypeId": item.DocumentTypeId,
      "InsuranceId": item?.InsuranceId
    }
    return this.sharedService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      async (data: any) => {
        if (data) {
          console.log(data);
          if(data.Message =='Success'){
            // this.onDeleteLocalDoc(index)
            this.onReloadDocumentList(item?.InsuranceId)

          }
        }
      },
      (err) => { }
    );
  }

  onDeleteLocalDoc(index:any){
    this.documentList.splice(index,1)
  }

  onDownloadDoc(item:any){
    console.log(item)
    downloadBase64File(item.ImgUrl,item.FileName);
  }

  onReloadDocumentList(InsuranceId:any) {
    let userDetails = this.userDetails?.LoginResponse;
    let UrlLink = `${this.ApiUrl1}api/companies/statement/datewise`
    let ReqObj = {
      "InsuranceId": userDetails?.InsuranceId,
      "ClaimType": this.data.claimType,
      "StartDate": this.data.startDate,
      "EndDate": this.data.endDate
    }
    this.sharedService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        if (data?.Message == "Success") {
         let findObj = data.Result.CompanyStatementList.find((ele:any)=>ele.InsuranceId == InsuranceId)
          this.documentList = findObj.TotalClaimDocuments;
        }
      },
      (err) => { }
    );
  }
}
function downloadBase64File(base64Data: any, fileName: string) {
  const linkSource = `${base64Data}`;
  const downloadLink = document.createElement("a");
  downloadLink.href = linkSource;
  downloadLink.download = `${fileName}`;
  downloadLink.click();
}

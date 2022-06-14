import { Component, OnInit } from '@angular/core';
import { AddVehicleService } from 'src/app/Modules/add-vehicle/add-vehicle.service';
import { ExcelSaveService } from 'src/app/Shared/Services/excel-save.service';
import * as Mydatas from '../../../../../assets/app-config.json';
@Component({
  selector: 'app-insurance-master',
  templateUrl: './insurance-master.component.html',
  styleUrls: ['./insurance-master.component.css']
})
export class InsuranceMasterComponent implements OnInit {

  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;
  public columnHeader: any[] = [];
  makeMasterList:any[]=[];
  constructor(private addVehicleService: AddVehicleService,
    private excelService:ExcelSaveService) { }

  ngOnInit(): void {
    this.getInsuranceList();
  }
  getInsuranceList(){
    let UrlLink = `${this.ApiUrl1}basicauth/insurancecompanies`;
    this.addVehicleService.onGetMethodSyncBasicToken(UrlLink).subscribe(
      (data: any) => {
          console.log("Body Master List",data);
          if(data.Result){
            this.makeMasterList = data.Result;
            this.columnHeader = [
              { key: "Code", display: "Company ID" },
              { key: "CodeDescription", display: "Company Name" },
            ];
          }
      },
      (err) => { }
    );
  }
  exportAsXLSX():void {  
    this.excelService.exportAsExcelFile(this.makeMasterList, 'MakeMasterDetails');  
 }

}

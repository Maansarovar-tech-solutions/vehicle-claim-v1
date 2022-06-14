import { Component, OnInit } from '@angular/core';
import { ExcelSaveService } from 'src/app/Shared/Services/excel-save.service';
import { AddVehicleService } from 'src/app/Modules/add-vehicle/add-vehicle.service';
import * as Mydatas from '../../../../../assets/app-config.json';
@Component({
  selector: 'app-color-master',
  templateUrl: './color-master.component.html',
  styleUrls: ['./color-master.component.css']
})
export class ColorMasterComponent implements OnInit {

  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;
  public columnHeader: any[] = [];
  makeMasterList:any[]=[];
  constructor(private addVehicleService: AddVehicleService,
    private excelService:ExcelSaveService) { }

  ngOnInit(): void {
    this.getColorsList();
  }
  getColorsList(){
    let UrlLink = `${this.ApiUrl1}dropdown/colors`;
    this.addVehicleService.onGetMethodSync(UrlLink).subscribe(
      (data: any) => {
          console.log("Body Master List",data);
          if(data.Result){
            this.makeMasterList = data.Result;
            this.columnHeader = [
              { key: "Code", display: "Colour ID" },
              { key: "CodeDescription", display: "Colour Name" },
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

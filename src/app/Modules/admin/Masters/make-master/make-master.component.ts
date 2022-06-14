import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ExcelSaveService } from 'src/app/Shared/Services/excel-save.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AddVehicleService } from 'src/app/Modules/add-vehicle/add-vehicle.service';
import * as Mydatas from '../../../../../assets/app-config.json';
export interface UserData {
  BodyId: null,
  BranchCode: String,
  CoreCode: String,
  CountryId: String,
  EffectiveDate: String,
  ExpiryDate: String,
  MakeId: String,
  MakeName: String,
  MakeNameAr: String,
  ReferalStatus: String,
  Remarks: String,
  Status: String,
  ModelCount: String
}
@Component({
  selector: 'app-make-master',
  templateUrl: './make-master.component.html',
  styleUrls: ['./make-master.component.css']
})
export class MakeMasterComponent implements OnInit {

  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;
  public columnHeader: any[] = [];
  displayedColumns: string[] = ['position', 'MakeName','CoreCode','EffectiveDate', 'Status', 'ModelCount'];
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  dataSource!: MatTableDataSource<UserData>;
  public SearchExsitTable: any;
  public SearchExsitTable1: any;
  makeMasterList:any[]=[];
  constructor(
    private addVehicleService: AddVehicleService,
    private excelService:ExcelSaveService
  ) { 
    this.getMakeList();
    // this.makeMasterList = [
    //     {
    //       "MakeId": "158",
    //       "MakeName": "JINMA",
    //       "Status": "Active",
    //       "EffectiveDate": "01/00/2016",
    //       "ExpiryDate": "31/00/2025",
    //       "Remarks": "",
    //       "MakeNameAr": "",
    //       "BodyId": null,
    //       "BranchCode": "01",
    //       "ReferalStatus": "N",
    //       "CountryId": "",
    //       "CoreCode": "158",
    //       "ModelCount": "2"
    //   },
    //   {
    //     "MakeId": "159",
    //     "MakeName": "JINMAJINMA",
    //     "Status": "Active",
    //     "EffectiveDate": "01/00/2016",
    //     "ExpiryDate": "31/00/2025",
    //     "Remarks": "",
    //     "MakeNameAr": "",
    //     "BodyId": null,
    //     "BranchCode": "01",
    //     "ReferalStatus": "N",
    //     "CountryId": "",
    //     "CoreCode": "159",
    //     "ModelCount": "2"
    //   },
    //   {
    //     "MakeId": "160",
    //     "MakeName": "JMC",
    //     "Status": "Active",
    //     "EffectiveDate": "01/00/2016",
    //     "ExpiryDate": "31/00/2025",
    //     "Remarks": "",
    //     "MakeNameAr": "",
    //     "BodyId": null,
    //     "BranchCode": "01",
    //     "ReferalStatus": "N",
    //     "CountryId": "",
    //     "CoreCode": "160",
    //     "ModelCount": "2"
    //   },
    //   {
    //     "MakeId": "161",
    //     "MakeName": "JOHN",
    //     "Status": "Active",
    //     "EffectiveDate": "01/00/2016",
    //     "ExpiryDate": "31/00/2025",
    //     "Remarks": "",
    //     "MakeNameAr": "",
    //     "BodyId": null,
    //     "BranchCode": "01",
    //     "ReferalStatus": "N",
    //     "CountryId": "",
    //     "CoreCode": "161",
    //     "ModelCount": "2"
    //   },
    //   {
    //     "MakeId": "162",
    //     "MakeName": "JURGENS",
    //     "Status": "Active",
    //     "EffectiveDate": "01/00/2016",
    //     "ExpiryDate": "31/00/2025",
    //     "Remarks": "",
    //     "MakeNameAr": "",
    //     "BodyId": null,
    //     "BranchCode": "01",
    //     "ReferalStatus": "N",
    //     "CountryId": "",
    //     "CoreCode": "162",
    //     "ModelCount": "2"
    //   }
    // ]
  }
  
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.makeMasterList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  getMakeList(){
    let UrlLink = `${this.ApiUrl1}dropdown/vehiclemake`;
    this.addVehicleService.onGetMethodSync(UrlLink).subscribe(
      (data: any) => {
          console.log("Make Master List",data);
          if(data.Result){
            this.makeMasterList = data.Result;
            this.columnHeader = [
              { key: "Code", display: "Make ID" },
              { key: "CodeDescription", display: "Make Name" },
            ];
          }
      },
      (err) => { }
    );
  }
  applyFilter(event: Event) {
    console.log("eValue",event)
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }
  exportAsXLSX():void {  
    this.excelService.exportAsExcelFile(this.makeMasterList, 'MakeMasterDetails');  
 } 

}

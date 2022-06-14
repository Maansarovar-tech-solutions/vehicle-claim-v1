import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ExcelSaveService } from 'src/app/Shared/Services/excel-save.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import * as Mydatas from '../../../../../../assets/app-config.json';
import { AddVehicleService } from 'src/app/Modules/add-vehicle/add-vehicle.service';
export interface UserData {
  BodyName:String,
  CoreCode:String,
  SeatingCapacityStart:String,
  SeatingCapacityEnd:String,
  Status:String,
  EffectiveDate:String
}
@Component({
  selector: 'app-existing-body-type-master',
  templateUrl: './existing-body-type-master.component.html',
  styleUrls: ['./existing-body-type-master.component.css']
})
export class ExistingBodyTypeMasterComponent implements OnInit {

  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;
  public columnHeader: any[] = [];
  displayedColumns: string[] = ['position', 'BodyName','CoreCode','SeatingCapacityStart','SeatingCapacityEnd','EffectiveDate', 'Status'];
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
    // this.makeMasterList = [
    //     {
    //       "BodyName":"4 WHEEL DRIVE/SUV",
    //       "Status": "Active",
    //       "EffectiveDate": "01/00/2016",
    //       "SeatingCapacityStart":"2",
    //       "SeatingCapacityEnd":"8",
    //       "CoreCode": "2",
    //   },
    //   {
    //     "BodyName":"6 WHEEL DRIVE",
    //     "Status": "Active",
    //     "EffectiveDate": "30/04/2020",
    //     "SeatingCapacityStart":"2",
    //     "SeatingCapacityEnd":"8",
    //     "CoreCode": "91",
    //   },
    //   {
    //     "BodyName":"AIRCRAFT TRACTOR",
    //     "Status": "Active",
    //     "EffectiveDate": "30/04/2020",
    //     "SeatingCapacityStart":"2",
    //     "SeatingCapacityEnd":"3",
    //     "CoreCode": "39",
    //   },
    //   {
    //     "BodyName":"AMBULANCE",
    //     "Status": "Active",
    //     "EffectiveDate": "30/04/2020",
    //     "SeatingCapacityStart":"2",
    //     "SeatingCapacityEnd":"5",
    //     "CoreCode": "35",
    //   },
    //   {
    //     "BodyName":"AMPHIBIOUS BUS",
    //     "Status": "Active",
    //     "EffectiveDate": "30/04/2020",
    //     "SeatingCapacityStart":"2",
    //     "SeatingCapacityEnd":"3",
    //     "CoreCode": "89",
    //   },
    // ]
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.makeMasterList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getBodyTypeList();
  }
  applyFilter(event: Event) {
    console.log("eValue",event)
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }
  getBodyTypeList(){
    let UrlLink = `${this.ApiUrl1}dropdown/vehiclebodytypes`;
    this.addVehicleService.onGetMethodSync(UrlLink).subscribe(
      (data: any) => {
          console.log("Body Master List",data);
          if(data.Result){
            this.makeMasterList = data.Result;
            this.columnHeader = [
              { key: "Code", display: "Body ID" },
              { key: "CodeDescription", display: "Body Name" },
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

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AddVehicleService } from 'src/app/Modules/add-vehicle/add-vehicle.service';
import { MatPaginator } from '@angular/material/paginator';
import * as Mydatas from '../../../../app-config.json';
import { MatSort } from '@angular/material/sort';
import { ExcelSaveService } from 'src/app/Shared/Services/excel-save.service';
import { Router } from '@angular/router';
export interface UserData {
  BodyName:String,
  CoreCode:String,
  SeatingCapacityStart:String,
  SeatingCapacityEnd:String,
  Status:String,
  EffectiveDate:String
}
@Component({
  selector: 'app-existing-login-details',
  templateUrl: './existing-login-details.component.html',
  styleUrls: ['./existing-login-details.component.css']
})
export class ExistingLoginDetailsComponent implements OnInit {

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
    private excelService:ExcelSaveService,
    private router:Router
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
    this.getExistingLoginList();
  }
  applyFilter(event: Event) {
    console.log("eValue",event)
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }
  getExistingLoginList(){
    let UrlLink = `${this.ApiUrl1}loginCreation/getList`;
    this.addVehicleService.onGetMethodSync(UrlLink).subscribe(
      (data: any) => {
          console.log("Body Master List",data);
            this.makeMasterList = data;
            this.columnHeader = [
              { key: "LoginId", display: "Login Id" },
              { key: "UserName", display: "User Name" },
              { key: "MobileNo", display: "Mobile No" },
              { key: "EmailId", display: "Email Id" },
              {
                key: "actions", display: "Edit",
                config: {
                  isEditActions: true,
                },
              },
            ];
      },
      (err) => { }
    );
  }
  exportAsXLSX():void {  
    this.excelService.exportAsExcelFile(this.makeMasterList, 'MakeMasterDetails');  
 } 
 onEditLogin(event:any){
   console.log("Edit Event",event);
    sessionStorage.setItem('editLoginId',JSON.stringify(event));
    this.router.navigate(['Home/NewLoginDetails'])
 }
 
}

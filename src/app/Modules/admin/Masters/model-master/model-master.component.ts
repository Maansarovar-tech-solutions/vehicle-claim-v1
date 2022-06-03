import { Component, OnInit, ViewChild } from '@angular/core';
import { ExcelSaveService } from 'src/app/Shared/Services/excel-save.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import * as Mydatas from '../../../../app-config.json';
import { AddVehicleService } from 'src/app/Modules/add-vehicle/add-vehicle.service';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

export interface UserData {
  Amendid: String,
  Branchcode: String,
  Categoryid: String,
  Corecode: String,
  Effectivedate: String,
  Expirydate: String,
  Makeid: String,
  Modelid: String,
  Modelname: String,
  Modelnamearabic: String,
  Referralstatus: String,
  Remarks: String,
  Status: String
}
@Component({
  selector: 'app-model-master',
  templateUrl: './model-master.component.html',
  styleUrls: ['./model-master.component.css']
})
export class ModelMasterComponent implements OnInit {
  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;
  public columnHeader: any[] = [];
  displayedColumns: string[] = ['position', 'ModelName','CoreCode','EffectiveDate', 'Status'];
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  dataSource!: MatTableDataSource<UserData>;
  modelValue:any;
  public SearchExsitTable: any;
  public SearchExsitTable1: any;
  modelMasterList:any[]=[];
  makeMasterList: any;
  searchModelValue: boolean = true;
  companySearch = new FormControl('');
  public insuranceList: any[] = [];
  public filteredItems!: Observable<any[]>;
  constructor(
    private addVehicleService: AddVehicleService,
    private excelService:ExcelSaveService
  ) {
    this.setModelValue();
    // this.modelMasterList = [
    //   {
    //     "Modelid": "1010",
    //     "Makeid": "1",
    //     "Amendid": "0",
    //     "Modelname": "SEMI TRAILER",
    //     "Status": "Active",
    //     "Effectivedate": "10/04/2022",
    //     "Expirydate": "30/10/2022",
    //     "Remarks": "3AXLE TRAILE",
    //     "Branchcode": "01",
    //     "Corecode": "343",
    //     "Modelnamearabic": null,
    //     "Referralstatus": "N",
    //     "Categoryid": null
    //   },
    //   {
    //     "Modelid": "1011",
    //     "Makeid": "1",
    //     "Amendid": "0",
    //     "Modelname": "TRAILER",
    //     "Status": "Active",
    //     "Effectivedate": "22/22/2016",
    //     "Expirydate": "30/30/2025",
    //     "Remarks": "3AXLE TRAILE",
    //     "Branchcode": "01",
    //     "Corecode": null,
    //     "Modelnamearabic": null,
    //     "Referralstatus": "N",
    //     "Categoryid": null
    //   },
    //   {
    //     "Modelid": "1421",
    //     "Makeid": "1",
    //     "Amendid": "0",
    //     "Modelname": "TANK",
    //     "Status": "Active",
    //     "Effectivedate": "26/30/2016",
    //     "Expirydate": "30/30/2025",
    //     "Remarks": "testing1",
    //     "Branchcode": "01",
    //     "Corecode": "001",
    //     "Modelnamearabic": null,
    //     "Referralstatus": "Y",
    //     "Categoryid": null
    //   }
    // ]
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.modelMasterList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  setModelValue(){
    //this.modelValue = rowData.Code;
    this.searchModelValue = true;
    let UrlLink = `${this.ApiUrl1}dropdown/makemodelbodytypes`;
    this.addVehicleService.onGetMethodSync(UrlLink).subscribe(
      (data: any) => {
          console.log("Model Master List",data);
          if(data.Result){
            //this.makeMasterList = data.Result;
            this.modelMasterList = data.Result;
            this.searchModelValue = false;
            this.columnHeader = [
              { key: "MakeId", display: "Make ID" },
              { key: "MakeDescription", display: "Make Name" },
              { key: "ModelId", display: "Model ID" },
              { key: "ModelDescription", display: "Model Name" },
              { key: "BodyDescription", display: "Body Name" },
            ];
          }
        },
        (err) => { }
      );
  }
  getMakeList(){
    let UrlLink = `${this.ApiUrl1}dropdown/vehiclemake`;
    this.addVehicleService.onGetMethodSync(UrlLink).subscribe(
      (data: any) => {
          console.log("Make Master List",data);
          if(data.Result){
            this.makeMasterList = data.Result;
            if(this.makeMasterList.length!=0){
              this.setModelValue();
            }
            this.filteredItems = this.makeMasterList;
            this.filteredItems = this.companySearch.valueChanges.pipe(
              startWith(''),
              map(value => this._filter(value,this.makeMasterList)),
            );
          }
        },
        (err) => { }
      );
  }
  private _filter(value: any,data:any):any[] {
    const filterValue = value.toLowerCase();

    return data.filter((option: any) => option.CodeDescription.toLowerCase().includes(filterValue));
  }
  applyFilter(event: Event) {
    console.log("eValue",event)
    const filterValue = (event.target as HTMLInputElement).value;
    this.makeMasterList.filter = filterValue.trim().toLowerCase();


    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }

  }
  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.modelMasterList, 'ModelMasterDetails');
 }

}

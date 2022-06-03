import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ExcelSaveService } from 'src/app/Shared/Services/excel-save.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
export interface UserData {
  categoryDesc:any,
  categoryId:any,
  compYn:any,
  coreAppcode:any,
  entryDate:any,
  garageYn:any,
  mandatoryDocList:any,
  partOfLoss:any,
  remarks:any,
  status:any,
  typeDesc:any,
  typeId:any,
}
@Component({
  selector: 'app-existing-loss-type-master',
  templateUrl: './existing-loss-type-master.component.html',
  styleUrls: ['./existing-loss-type-master.component.css']
})
export class ExistingLossTypeMasterComponent implements OnInit {

  displayedColumns: string[] = ['position','LossDescription', 'LossType','CoreCode','EffectiveDate', 'Status'];
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  dataSource!: MatTableDataSource<UserData>;
  dataSource2!: MatTableDataSource<UserData>;
  public SearchExsitTable: any;
  public SearchExsitTable1: any;
  primaryList:any[]=[];secondaryList:any[]=[];
  constructor(
    private excelService:ExcelSaveService
  ) { 
    this.primaryList = [
      {
        "typeId": 1,
        "categoryId": 16,
        "insCompanyId": 100002,
        "effectiveDate": "2022-01-04",
        "amendid": 0,
        "categoryDesc": "Own Damage",
        "typeDesc": "Primary Loss",
        "coreAppcode": "NOL-1001",
        "Status": "Active",
        "entryDate": "2022-02-03",
        "remarks": null,
        "compYn": "Y",
        "garageYn": "Y",
        "partOfLoss": "102,103,113",
        "mandatoryDocList": "102,103,113",
        "surveyorYn": "Y"
      },
      {
        "typeId": 1,
        "categoryId": 18,
        "insCompanyId": 100002,
        "effectiveDate": "2021-09-03",
        "amendid": 0,
        "categoryDesc": "Repair with Recovery from Insurance Company",
        "typeDesc": "PrimaryLoss",
        "coreAppcode": "1234",
        "Status": "Active",
        "entryDate": "2021-12-17",
        "remarks": "Test",
        "compYn": "Y",
        "garageYn": null,
        "partOfLoss": "89,90,109,93,113,98,99",
        "mandatoryDocList": "89,90,109,98",
        "surveyorYn": null
      },
      {
        "typeId": 1,
        "categoryId": 3,
        "insCompanyId": 100002,
        "effectiveDate": "2021-09-03",
        "amendid": 0,
        "categoryDesc": "Third Party",
        "typeDesc": "Primary Loss",
        "coreAppcode": "NOL-1003",
        "Status": "Active",
        "entryDate": "2021-10-20",
        "remarks": null,
        "compYn": "N",
        "garageYn": "Y",
        "partOfLoss": "102,103,104,89,93,109,113",
        "mandatoryDocList": "102,89,93",
        "surveyorYn": "Y"
      },
      {
        "typeId": 1,
        "categoryId": 51,
        "insCompanyId": 100002,
        "effectiveDate": "2021-09-03",
        "amendid": 0,
        "categoryDesc": "Young & In Experience Driver",
        "typeDesc": "Primary Loss",
        "coreAppcode": "NOL-6043\r\n",
        "Status": "Active",
        "entryDate": "2021-10-20",
        "remarks": null,
        "compYn": "Y",
        "garageYn": "Y",
        "partOfLoss": "89,90,109,93,113",
        "mandatoryDocList": "89,90,109",
        "surveyorYn": "Y"
      },
      {
        "typeId": 1,
        "categoryId": 20,
        "insCompanyId": 100002,
        "effectiveDate": "2021-09-03",
        "amendid": 0,
        "categoryDesc": "Payment to Third Party Vehicle",
        "typeDesc": "Primary Loss",
        "coreAppcode": "NOL-2004",
        "Status": "Active",
        "entryDate": "2021-10-12",
        "remarks": null,
        "compYn": "B",
        "garageYn": "Y",
        "partOfLoss": "100,102,103,113",
        "mandatoryDocList": "100",
        "surveyorYn": "Y"
      }
    ];
    this.secondaryList = [
      {
        "typeId": 2,
        "categoryId": 5,
        "insCompanyId": 100002,
        "effectiveDate": "2021-09-03",
        "amendid": 0,
        "categoryDesc": "Total Loss",
        "typeDesc": "Sub Loss",
        "coreAppcode": "NOL-1005",
        "Status": "Active",
        "entryDate": "2021-10-13",
        "remarks": null,
        "compYn": "B",
        "garageYn": "N",
        "partOfLoss": "100,102,103,113",
        "mandatoryDocList": "100",
        "surveyorYn": "N"
    },
    {
      "typeId": 2,
      "categoryId": 50,
      "insCompanyId": 100002,
      "effectiveDate": "2021-09-03",
      "amendid": 0,
      "categoryDesc": "Total Loss - Fire",
      "typeDesc": "Sub Loss",
      "coreAppcode": "NOL-5050",
      "Status": "Active",
      "entryDate": "2021-10-13",
      "remarks": null,
      "compYn": "B",
      "garageYn": "N",
      "partOfLoss": "100,102,103,113",
      "mandatoryDocList": "100",
      "surveyorYn": "N"
    },
    {
      "typeId": 2,
      "categoryId": 49,
      "insCompanyId": 100002,
      "effectiveDate": "2021-09-03",
      "amendid": 0,
      "categoryDesc": "Total Loss - By Theft",
      "typeDesc": "Sub Loss",
      "coreAppcode": "NOL-6057",
      "Status": "Active",
      "entryDate": "2021-10-13",
      "remarks": null,
      "compYn": "B",
      "garageYn": "N",
      "partOfLoss": "100,102,103,113",
      "mandatoryDocList": "100",
      "surveyorYn": "N"
    },
    {
      "typeId": 2,
      "categoryId": 48,
      "insCompanyId": 100002,
      "effectiveDate": "2021-09-03",
      "amendid": 0,
      "categoryDesc": "Total Loss - By Accident",
      "typeDesc": "Sub Loss",
      "coreAppcode": "NOL-6058",
      "Status": "Active",
      "entryDate": "2021-10-13",
      "remarks": null,
      "compYn": "B",
      "garageYn": "N",
      "partOfLoss": "100,102,103,113",
      "mandatoryDocList": "100",
      "surveyorYn": "N"
    },
    {
      "typeId": 2,
      "categoryId": 47,
      "insCompanyId": 100002,
      "effectiveDate": "2021-09-03",
      "amendid": 0,
      "categoryDesc": "Payment to Third Party Vehicle (Insurance Company)",
      "typeDesc": "Sub Loss",
      "coreAppcode": "NOL-3010",
      "Status": "Active",
      "entryDate": "2021-10-12",
      "remarks": null,
      "compYn": "B",
      "garageYn": "N",
      "partOfLoss": "100,102,103,113",
      "mandatoryDocList": "100",
      "surveyorYn": "N"
    }
  ]
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.primaryList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource2 = new MatTableDataSource(this.secondaryList);
    this.dataSource2.paginator = this.paginator;
    this.dataSource2.sort = this.sort;
  }
  applyFilter(event: Event) {
    console.log("eValue",event)
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }
  applyFilter2(event: Event) {
    console.log("eValue",event)
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }

  }
  exportPrimaryAsXLSX():void {  
    this.excelService.exportAsExcelFile(this.primaryList, 'PrimaryLossDetails');  
  }
  exportSecondaryAsXLSX():void {  
    this.excelService.exportAsExcelFile(this.secondaryList, 'SecondaryLossDetails');  
  }

}

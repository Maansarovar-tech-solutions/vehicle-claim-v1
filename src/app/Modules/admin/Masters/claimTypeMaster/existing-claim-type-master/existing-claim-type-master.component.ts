import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ExcelSaveService } from 'src/app/Shared/Services/excel-save.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
export interface UserData {
  "ClaimTypeId":String,
  "ClaimTypeName":String,
  "Status": String,
  "EffectiveDate": String,
  "ClaimTypePrefix":String,
  "CoreCode": String
}
@Component({
  selector: 'app-existing-claim-type-master',
  templateUrl: './existing-claim-type-master.component.html',
  styleUrls: ['./existing-claim-type-master.component.css']
})
export class ExistingClaimTypeMasterComponent implements OnInit {

  displayedColumns: string[] = ['position','ClaimTypeId', 'ClaimTypeName','CoreCode','EffectiveDate', 'Status'];
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  dataSource!: MatTableDataSource<UserData>;
  public SearchExsitTable: any;
  public SearchExsitTable1: any;
  claimTypeList:any[]=[];
  constructor(
    private excelService:ExcelSaveService
  ) { 
    this.claimTypeList = [
        {
          "ClaimTypeId":"25",
          "ClaimTypeName":"Private Comprehensive",
          "Status": "Active",
          "EffectiveDate": "01/00/2016",
          "ClaimTypePrefix":"CBB",
          "CoreCode": "1006WB",
      },
      {
        "ClaimTypeId":"26",
        "ClaimTypeName":"Private Third Party Liability",
        "Status": "Active",
        "EffectiveDate": "01/00/2016",
        "ClaimTypePrefix":"TBB",
        "CoreCode": "1007WB",
    },
    ]
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.claimTypeList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
    this.excelService.exportAsExcelFile(this.claimTypeList, 'ClaimTypeDetails');  
  }
}

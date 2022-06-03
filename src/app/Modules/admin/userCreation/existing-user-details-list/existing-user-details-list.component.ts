import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ExcelSaveService } from 'src/app/Shared/Services/excel-save.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
export interface UserData {
  UserId:String,
  UserName:String,
  MobileNo:String,
  Position:String
}
@Component({
  selector: 'app-existing-user-details-list',
  templateUrl: './existing-user-details-list.component.html',
  styleUrls: ['./existing-user-details-list.component.css']
})
export class ExistingUserDetailsListComponent implements OnInit {

  displayedColumns: string[] = ['position', 'UserName','MobileNo','UserPosition','Status'];
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  dataSource!: MatTableDataSource<UserData>;
  public SearchExsitTable: any;
  public SearchExsitTable1: any;
  makeMasterList:any[]=[];
  constructor(
    private excelService:ExcelSaveService,
    private router:Router
  ) { 
    this.makeMasterList = [
      {
        UserId:"01",
        UserName:"Arjun Kumar",
        MobileNo:"8838704653",
        Position:"Manager",
        Status: "Active"
      },
      {
        UserId:"02",
        UserName:"Steve James",
        MobileNo:"9795325415",
        Position:"Assistant Manager",
        Status: "Active"
      },
      {
        UserId:"03",
        UserName:"Michael Hayden",
        MobileNo:"8751254456",
        Position:"Senior Accountant",
        Status: "Active"
      }
    ]
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.makeMasterList);
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
    this.excelService.exportAsExcelFile(this.makeMasterList, 'UserDetails');  
 } 
 addNewUser(){
  this.router.navigate(['/Admin/UserCreationDetails'])
}

}

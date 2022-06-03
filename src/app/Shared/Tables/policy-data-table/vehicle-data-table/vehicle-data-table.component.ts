import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicle-data-table',
  templateUrl: './vehicle-data-table.component.html',
  styleUrls: ['./vehicle-data-table.component.css']
})
export class VehicleDataTableComponent implements OnInit {

  @Input("data") tableData: any[] = [];
  @Input("cols") columnHeader: any[] = [];
  public dataSource:any;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) private paginator!: MatPaginator;
  @Output("onEdit") onEdit =new EventEmitter();

  public filterValue:any;
  constructor(
    private router:Router
  ) { }

  ngOnChanges() {
    console.log(this.tableData)
    this.dataSource = new MatTableDataSource(this.tableData);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  }


  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.tableData);
    this.dataSource.sort = this.sort;

  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }


  get keys() {
    return this.columnHeader.map(({ key }) => key);
  }

  applyFilter() {
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
  }

}

import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PeriodicElement } from 'src/app/Modules/existing-claim/existing-claim.component';

@Component({
  selector: 'app-policy-data-table',
  templateUrl: './policy-data-table.component.html',
  styleUrls: ['./policy-data-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PolicyDataTableComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) private paginator!: MatPaginator;
  @Input("data") tableData: any[] = [];
  @Input("cols") columnHeader: any[] = [];
  @Output("onEdit") onEdit =new EventEmitter();

  public innerColumnHeader: any[] = [];
  public innerTableData: any[] = [];
  public dataSource: any;
  public expandedElement!: PeriodicElement | null;

  public filterValue: any;
  constructor(
    private router: Router
  ) { }

  ngOnChanges() {
    console.log(this.tableData)
    this.dataSource = new MatTableDataSource(this.tableData);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  }


  ngOnInit() {
    console.log(this.tableData);
    this.dataSource = new MatTableDataSource(this.tableData);
    console.log(this.dataSource)
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


  onVeiwVehicleList(vehicle: any) {
    console.log(vehicle);
    console.log(this.expandedElement);
    this.innerColumnHeader = [
      { key: "VehicleChassisNumber", display: "Chassis Number" },
      { key: "VehicleEngineNumber", display: "Engine Number" },
      {
        key: "PlateCharacter", display: "Plate Char/Plate Code",
        config: {
          isCodeChar: true,
        }
      },
      { key: "VehicleMakeDesc", display: "Make" },
      { key: "VehicleModelDesc", display: "Model" },
      { key: "VehicleBodyDesc", display: "Body" },
      { key: "RegistrationTypeDesc", display: "Registration Type" },
      {
        key: "actions", display: "Action",
        config: {
          isEdit: true,
        },
      },

    ]
    this.innerTableData = vehicle?.VehicleDetails
  }


}

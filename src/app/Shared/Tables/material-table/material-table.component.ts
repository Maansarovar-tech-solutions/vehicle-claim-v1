import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AddVehicleService } from 'src/app/Modules/add-vehicle/add-vehicle.service';
import * as Mydatas from '../../../../assets/app-config.json';
@Component({
  selector: 'app-material-table',
  templateUrl: './material-table.component.html',
  styleUrls: ['./material-table.component.css']
})
export class MaterialTableComponent implements OnInit {
  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;

  @Input("data") tableData: any[] = [];
  @Input("cols") columnHeader: any[] = [];
  @Output("onViewVehicleInfo") onViewVehicleInfo = new EventEmitter();
  @Output("onTplEdit") onTplEdit = new EventEmitter();
  @Output("onProcced") onProcced = new EventEmitter();
  @Output("onTrack") onTrack = new EventEmitter();

  @Output("daysFilter") daysFilter = new EventEmitter();



  public dataSource: any;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) private paginator!: MatPaginator;
  sortProperty: any = 'AllotedYN';
  sortDirection: any = 'desc';
  public filterValue: any;
  public insuranceCompanyList: any = [];
  public filterinsuranceCompanyList!: Observable<any[]>;
  public serachForm!: FormGroup;

  constructor(
    private router: Router,
    private addVehicleService: AddVehicleService,
    private _formBuilder: FormBuilder,
  ) {
    this.onFetchInitialData();

  }

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
    this.onCreateFormControl();

  }

  ngAfterViewInit() {
    this.sortProperty = 'AllotedYN';
    this.sortDirection = 'desc';
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }


  get keys() {
    return this.columnHeader.map(({ key }) => key);
  }

  applyFilter() {
    this.dataSource.filter = this.f.searchValue.value.trim().toLowerCase();
  }




  onCreateFormControl() {
    this.serachForm = this._formBuilder.group({
      searchValue: [''],
      InsuranceId: ['0'],
      noOfDayes: ['0'],
    });
  }

  get f() { return this.serachForm.controls; };

  async onFetchInitialData() {
    this.insuranceCompanyList = await this.onGetInsuranceCompyList() ||[];
    console.log(this.insuranceCompanyList)
    this.filterinsuranceCompanyList = this.f.InsuranceId.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, this.insuranceCompanyList)),
    );

  }

  async onGetInsuranceCompyList() {
    let UrlLink = `${this.ApiUrl1}basicauth/insurancecompanies`
    let response = (await this.addVehicleService.onGetMethodAsyncBasicToken(UrlLink)).toPromise()
      .then((res: any) => {
        return res?.Result;
      })
      .catch((err) => { });
    return response;
  }

  onDisplayInsuranceComp = (option: any) => {
    if (!option) return '';
    let index = this.insuranceCompanyList.findIndex((obj: any) => obj.Code == option);
    return this.insuranceCompanyList[index].CodeDescription;
  }

  private _filter(value: any, data: any[]): any[] {
    if (value == null) {
      value = '';
    }
    const filterValue = value.toLowerCase();
    return data.filter((option) => option?.CodeDescription?.toLowerCase().includes(filterValue));
  }



}

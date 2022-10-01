import { Component, OnInit } from '@angular/core';
import * as Mydatas from '../../../assets/app-config.json';

@Component({
  selector: 'app-watch-list',
  templateUrl: './watch-list.component.html',
  styleUrls: ['./watch-list.component.css']
})
export class WatchListComponent implements OnInit {
  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;
  public tableData: any[] = [];
  public columnHeader: any[] = [];
  public FilterByInsuranceId = 'NIC';
  public insuranceList: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}

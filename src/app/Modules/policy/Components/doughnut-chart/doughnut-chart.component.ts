import { Component, OnInit } from '@angular/core';
import * as Mydatas from '../../../../app-config.json';
import { PolicyService } from '../../policy.service';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.css']
})
export class DoughnutChartComponent implements OnInit {
  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;
  public data:any;
  constructor(
    private policyService:PolicyService
  ) { }

  ngOnInit(): void {
    this.onGetVehicleRegTypeCount();
  }

  onGetVehicleRegTypeCount(){
    let UrlLink =`${this.ApiUrl1}api/vehicleregtype/count`;
    let ReqObj = {
      "StartDate":"01/01/2022",
      "EndDate":"28/12/2022"
    };
    this.policyService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
         console.log(data)
         console.log("Reg-Type",data);
        if (data?.Message == "Success") {
           let chartData = data?.Result;
           let labels: any[]=[]
           let series: any[] = [];
           for (let index = 0; index < chartData.length; index++) {
             const element = chartData[index];
             labels.push(element. VehicleRegTypeDesc);
             series.push(Number(element.VehicleRegTypeCount));

           }
           console.log(labels,series)
           this.data = {
            labels: labels,
            datasets: [
                {
                    data: series,
                    backgroundColor: [
                      "#247dc2",
                  "#1fe3a3",
                  "#F6EA41",
                  "#BB73E0",
                  "#0CCDA3",

                  ],
                  hoverBackgroundColor: [
                   "#247dc2",
                  "#1fe3a3",
                  "#F6EA41",
                  "#BB73E0",
                  "#0CCDA3",
                  ]
                }]
            };
        }
      },
      (err) => { }
    );
  }
}

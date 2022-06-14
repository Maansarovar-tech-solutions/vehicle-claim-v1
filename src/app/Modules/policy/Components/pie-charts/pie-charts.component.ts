import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ChartComponent
} from "ng-apexcharts";
import * as Mydatas from '../../../../../assets/app-config.json';
import { PolicyService } from '../../policy.service';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};
@Component({
  selector: 'app-pie-charts',
  templateUrl: './pie-charts.component.html',
  styleUrls: ['./pie-charts.component.css']
})
export class PieChartsComponent implements OnInit {
  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;
  public hideAndShow: boolean = true;
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: any;
  public data: any;
  options: any;
  constructor(
    private policyService: PolicyService
  ) {
    this.chartOptions = {
      series: [44, 55, 13, 43, 22],
      chart: {
        width: 380,
        height: '400px',
        type: "pie"
      },
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

  ngOnInit(): void {
    this.onGetPolicyTypeCount();

  }

  onGetPolicyTypeCount() {
    let UrlLink = `${this.ApiUrl1}api/policytype/count`;
    let ReqObj =
    {
      "StartDate": "01/01/2022",
      "EndDate": "28/12/2022"
    };
    this.policyService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        console.log("Policy-Type", data);
        if (data?.Message == "Success") {
          let chartData = data?.Result;
          let labels: any[] = []
          let series: any[] = [];
          for (let index = 0; index < chartData.length; index++) {
            const element = chartData[index];
            labels.push(element.PolicyTypeDesc);
            series.push(Number(element.PolicyTypeCount));

          }
          console.log(labels, series)
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
              }],
            options: {
              responsive: true,
              legend: {
                position: 'right',
              },
              title: {
                display: true,
                text: 'Chart.js Doughnut Chart'
              },
              animation: {
                animateScale: true,
                animateRotate: true
              }
            }
          };
          this.options = {
            plugins: {
              datalabels: {
                align: 'end',
                anchor: 'end',
                borderRadius: 4,
                backgroundColor: "teal",
                color: 'white',
                font: {
                  weight: 'bold'
                }
              }
            },
            title: {
              display: true,
              text: 'My Title',
              fontSize: 14
            },
            legend: {
              position: 'right'
            }
          }




        }
      },
      (err) => { }
    );
  }

}

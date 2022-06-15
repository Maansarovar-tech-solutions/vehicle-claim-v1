import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ChartComponent
} from "ng-apexcharts";
import * as Mydatas from '../../../../../assets/app-config.json';
import { ClaimService } from '../../claim.service';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {
  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;
  public hideAndShow: boolean = true;
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: any;
  public data: any;
  options: any;
  public userDetails:any;
  constructor(
    private claimService: ClaimService
  ) {
    this.userDetails = JSON.parse(sessionStorage.getItem("Userdetails") || '{}');

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
    this.onGetClaimTypeCount();

  }

  onGetClaimTypeCount() {
    let userDetails = this.userDetails?.LoginResponse;
    let UrlLink = `${this.ApiUrl1}api/claimtype/count`;
    let ReqObj =
    {
      "InsuranceId":userDetails?.InsuranceId
    };
    this.claimService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        console.log("Claim-Type", data);
        if (data?.Message == "Success") {
          let chartData = data?.Result;
          let labels: any[] = []
          let series: any[] = [];
          for (let index = 0; index < chartData.length; index++) {
            const element = chartData[index];
            labels.push(element.ClaimTypeDesc);
            series.push(Number(element.ClaimTypeCount));
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

                ],
                hoverBackgroundColor: [
                  "#247dc2",
                  "#1fe3a3",
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

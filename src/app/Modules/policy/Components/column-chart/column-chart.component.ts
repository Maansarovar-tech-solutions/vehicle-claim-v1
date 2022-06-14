import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip
} from "ng-apexcharts";
import * as Mydatas from '../../../../../assets/app-config.json';
import { PolicyService } from '../../policy.service';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

@Component({
  selector: 'app-column-chart',
  templateUrl: './column-chart.component.html',
  styleUrls: ['./column-chart.component.css']
})
export class ColumnChartComponent implements OnInit {
  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: any;

  constructor(
    private policyService: PolicyService

  ) {
    // this.chartOptions = {
    //   series: [
    //     {
    //       name: "Vehicle Type",
    //       data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
    //     },
    //   ],
    //   chart: {
    //     type: "bar",
    //     height: 350
    //   },
    //   plotOptions: {
    //     bar: {
    //       horizontal: false,
    //       columnWidth: "55%",
    //     }
    //   },
    //   dataLabels: {
    //     enabled: false
    //   },
    //   stroke: {
    //     show: true,
    //     width: 2,
    //     colors: ["transparent"]
    //   },
    //   xaxis: {
    //     categories: [

    //     ]
    //   },
    //   yaxis: {
    //     title: {
    //       text: "TYPE OF VEHICLES"
    //     }
    //   },
    //   fill: {
    //     opacity: 1
    //   },
    //   tooltip: {
    //     y: {
    //       formatter: function (val: any) {
    //         return "" + val + "";
    //       }
    //     }
    //   }
    // };
  }

  ngOnInit(): void {
    this.onGetVehiclebodyTypeCount();

  }


  onGetVehiclebodyTypeCount() {
    let UrlLink = `${this.ApiUrl1}api/vehiclebodytype/count`;
    let ReqObj =
    {
      "StartDate": "01/01/2022",
      "EndDate": "28/12/2022"
    };
    this.policyService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
        if (data?.Message == "Success") {
        console.log("vehiclebodytype",data)

          let chartData = data?.Result;
          let size = 10
          let items = chartData.slice(0, size);
          let categories: any[]=[]
          let seriesData: any[] = [];

          for (let index = 0; index < items.length; index++) {
            const element = items[index];
            categories.push(element.VehicleBodyTypeDesc);
            seriesData.push(Number(element.VehicleBodyTypeCount));

          }
          const series = [
            {
              name: "TOTAL",
              data: seriesData
            },
          ];
          console.log(series);
          console.log(categories)


          this.chartOptions = {
            series: series,
            chart: {
              type: "bar",
              height: 350
            },
            plotOptions: {
              bar: {
                horizontal: true,
                columnWidth: "30%",
              }
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              show: true,
              width: 2,
              colors: ["transparent"]
            },
            xaxis: {
              categories: categories
            },
            yaxis: {
              title: {
                text: "VEHICLES BODY TYPE"
              }
            },
            fill: {
              opacity: 1
            },
            tooltip: {
              y: {
                formatter: function (val: any) {
                  return "" + val + "";
                }
              }
            }
          };

        }
      },
      (err) => { }
    );
  }
}

import { Component, Input, OnInit, ViewChild } from '@angular/core';
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
import { ClaimService } from '../../claim.service';
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
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;
  @ViewChild("chart") chart!: ChartComponent;
  @Input("totalGraphClaimCounts") totalGraphClaimCounts:any;
  public chartOptions: any;

  constructor(
    private claimService: ClaimService

  ) {

  }

  ngOnInit(): void {
    this.onGetClaimCountCount();

  }


  onGetClaimCountCount() {
    let chartData = this.totalGraphClaimCounts;
    let size = 10
    let items = chartData.slice(0, size);
    let categories: any[]=[]
    let seriesData: any[] = [];

    for (let index = 0; index < items.length; index++) {
      const element = items[index];
      categories.push(element.InsuraceCompanyName);
      seriesData.push(Number(element.RecoveryCount));

    }
    const series = [
      {
        name: "TOTAL",
        data: seriesData
      },
    ];

    this.chartOptions = {
      series: series,
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: true,
          columnWidth: "40%",
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
          text: "TPL Claim"
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
}

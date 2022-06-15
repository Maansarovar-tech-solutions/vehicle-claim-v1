import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import * as Mydatas from '../../../../../assets/app-config.json';

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
  ApexTooltip,
  ApexNonAxisChartSeries,
} from 'ng-apexcharts';
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
export type VehicleChartOptions = {

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
export class BarChartComponent implements OnInit,OnChanges {
  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;
  public LoginDetails: any;
  public DashboardDetails: any;
  public DashboardDetailsCharts: any;
  public chartOptions:any;
  @Input("totalGraphClaimCounts") totalGraphClaimCounts:any;




  constructor(
    private claimService: ClaimService
  ) {
    this.onDefaultChartValue();
    console.log(this.totalGraphClaimCounts);
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {

    if(this.totalGraphClaimCounts){
    this.onUpdateColumns();

    }
  }


  onDefaultChartValue(){
    this.chartOptions = {
      series: [
        {
          name: "National Insurance Company",
          data: [10, 50,20, 10]
        },
        {
          name: "Oman United Insurance Company",
          data: [76, 85, 101, 98]
        },
        {
          name: "Gulf General",
          data: [35, 41, 36, 26]
        },
        {
          name: "Wala Insurance",
          data: [35, 41, 36, 26]
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded"
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
        categories: [
          "Claims Approved",
          "Claims Progress",
          "Claims Rejected",
          "Open Claims",
        ]
      },
      yaxis: {
        title: {
          text: "Claims"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val: string) {
            return "" + val + " Claims";
          }
        }
      }
    };
  }

  onUpdateColumns(){
    console.log(this.totalGraphClaimCounts);

    var series:any[]=[];
    for (let index = 0; index < this.totalGraphClaimCounts.length; index++) {
      const element = this.totalGraphClaimCounts[index];
      let obj={
        name: element?.InsuranceCompanyName,
        data: [
          Number(element?.ClaimApprovPercent),
          Number(element?.ClaimProgressPercent),
          Number(element?.ClaimRejectPercent),
          Number(element?.ClaimOpenPercent),
        ]
      };
      series.push(obj);
    }
    this.chartOptions.series = series;

  }

}

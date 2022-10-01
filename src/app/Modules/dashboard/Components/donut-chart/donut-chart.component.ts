import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexFill,
  ApexDataLabels,
  ApexLegend,
  ChartComponent
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  fill: ApexFill;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
};
@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.css']
})
export class DonutChartComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  @Input("donutChart") chartData:any;
  public chartOptions: any;

  constructor() {
    this.chartOptions = {
      series: [44, 55, 41, 17, 15],
      chart: {
        width: 380,
        type: "donut"
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        type: "gradient"
      },
      legend: {
        formatter: function(val:any, opts:any) {
          return val + " - " + opts.w.globals.series[opts.seriesIndex];
        }
      },
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
    this.onUpDateBarChart();
  }

  onUpDateBarChart(){
    let series=[];
    const recoveryTotal=[];
    const companyName=[];



    for (let index = 0; index < this.chartData.length; index++) {
      const element = this.chartData[index];
      recoveryTotal.push(Number(element.RecoveryCount));
      companyName.push(element.InsuranceId);
    }
    series = recoveryTotal;

    this.chartOptions.series = series;
    // this.chartOptions.xaxis.categories = companyName;
  }

}

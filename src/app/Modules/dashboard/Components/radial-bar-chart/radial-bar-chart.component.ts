import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexFill,
  ChartComponent
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
};
@Component({
  selector: 'app-radial-bar-chart',
  templateUrl: './radial-bar-chart.component.html',
  styleUrls: ['./radial-bar-chart.component.css']
})
export class RadialBarChartComponent implements OnInit, OnChanges {

  @Input("claimCounts") claimCounts: any;
  @ViewChild("chart")
  chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;

  constructor() {
    this.chartOptions = {
      series: [70],
      chart: {
        height: 200,
        type: "radialBar"
      },

      plotOptions: {
        radialBar: {
          track: {
            background: ['#f3f3f3']
          },
        },
        dataLabels: {
          name: {
            fontSize: "15px",
            color: 'white',
          },
          value: {
            fontSize: "15px",
            color: 'white',
            formatter: function(val: string) {
              return val + "%";
            }
          }
        },
        hollow: {
          size: "70%"
        }
      },
      labels: ["Total"],
      // colors : ['#fff', '#f1f1f1'],
    };

  }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.chartOptions.series = [((Number(this.claimCounts) / 10000) * 100).toFixed(2)];

  }

}

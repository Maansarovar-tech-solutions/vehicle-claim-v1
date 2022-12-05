import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexStroke
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
};
@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  @ViewChild("chart") chart!: ChartComponent;
  @Input("barChart") chartData:any;
  public chartOptions: any;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "serie1",
          data: [44, 55, 41, 64, 22, 43, 21]
        },
        {
          name: "serie2",

          data: [53, 32, 33, 52, 13, 44, 32]
        }
      ],
      chart: {
        type: "bar",
        height: 430,
        stacked: true
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            position: "top"
          }
        }
      },
      dataLabels: {
        enabled: true,
        offsetX: -6,
        style: {
          fontSize: "12px",
          colors: ["#fff"]
        }
      },
      fill: {
        opacity: 1,
        colors: ['#0000ff','#FF0000']
      },
      stroke: {
        show: true,
        width: 1,
        colors: ["#fff"]
      },
      xaxis: {
        categories: [2001, 2002, 2003, 2004, 2005, 2006, 2007]
      },

    };
  }

  ngOnInit(): void {
    this.onUpDateBarChart();
  }

  onUpDateBarChart(){
    let series=[];
    const statusTotal=[];
    const nonFollowTotal=[];
    const statusName=[];



    for (let index = 0; index < this.chartData.length; index++) {
      const element = this.chartData[index];
      statusTotal.push(Number(element.StatusCount));
      nonFollowTotal.push(Number(element.NonFollowCount));
      statusName.push(element.StatusDesc);
    }
    series = [{name:'Total Count',data:statusTotal},{name:'Not Follow Count',data:nonFollowTotal}];

    this.chartOptions.series = series;
    this.chartOptions.xaxis.categories = statusName
  }
}

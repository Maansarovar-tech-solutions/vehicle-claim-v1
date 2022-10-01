import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexFill
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
};
@Component({
  selector: 'app-column-chart',
  templateUrl: './column-chart.component.html',
  styleUrls: ['./column-chart.component.css']
})
export class ColumnChartComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  @Input("columnChart") chartData:any;
  public chartOptions: any;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "PRODUCT A",
          data: [44, 55, 41, 67, 22, 43, 21, 49]
        },
      ],
      chart: {
        type: "bar",
        height: 350,

      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      xaxis: {
        categories: [
          "2011 Q1",
          "2011 Q2",
          "2011 Q3",
          "2011 Q4",
          "2012 Q1",
          "2012 Q2",
          "2012 Q3",
          "2012 Q4"
        ]
      },

      fill: {
        opacity: 1,
        colors: ['#4169e1','#0080ff','#00ffff']
      },
      legend: {
        position: "top",
        offsetX: 0,
        offsetY: 0
      }
    };
  }

  ngOnInit(): void {
    this.onUpDateBarChart();
  }

  ngOnChanges(changes: SimpleChanges): void {

    if(this.chartData){
    this.onUpDateBarChart();

    }
  }
  onUpDateBarChart(){
    let series=[];
    const recoveryTotal=[];
    const companyName=[];



    for (let index = 0; index < this.chartData.length; index++) {
      const element = this.chartData[index];
      recoveryTotal.push(Number(element.RecoveryCount));
      companyName.push([element.InsuranceId ,`Settled Amount ${element.SettledAmount}`]);
    }
    series = [{name:'Total Recovery',data:recoveryTotal}];

    this.chartOptions.series = series;
    this.chartOptions.xaxis.categories = companyName;
  }

}

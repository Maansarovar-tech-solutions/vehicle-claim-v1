import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: any;

  constructor() {
    this.chartOptions = {
      series: [44, 55, 13, 43],
      chart: {
        width: 380,
        type: "pie"
      },

      labels: ["Team A", "Team B", "Team C", "Team D"],
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
        },

      ],
      fill: {
        colors: ['#ff0000', '#8000ff', '#80ff00','#00ffff']
      }
    };
  }
  ngOnInit(): void {

  }



}

import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid
} from "ng-apexcharts";
import * as Mydatas from '../../../../app-config.json';
import { PolicyService } from '../../policy.service';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {
  public AppConfig: any = (Mydatas as any).default;
  public ApiUrl1: any = this.AppConfig.ApiUrl1;
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: any;

  constructor(
    private policyService:PolicyService
  ) {

  }

  ngOnInit(): void {
    this.onGetManufactureyearCount();

  }
  onGetManufactureyearCount(){
    let UrlLink =`${this.ApiUrl1}api/manufactureyear/count`;
    let ReqObj = {
      "StartDate":"01/01/2022",
      "EndDate":"28/12/2022"
    };
    this.policyService.onPostMethodSync(UrlLink, ReqObj).subscribe(
      (data: any) => {
         console.log("Manufacture-Year",data)
         if (data?.Message == "Success") {
            let chartData = data?.Result.sort((a:any, b:any) => b.ManufactureYear - a.ManufactureYear);
            console.log(chartData)
            let size = 20
            let items = chartData.slice(0, size)
            let labels: any[]=[]
            let series: any[] = [];
            for (let index = 0; index < items.length; index++) {
              const element = items[index];
              labels.push(element.ManufactureYear);
              series.push(Number(element.ManufactureCount));

            }
            this.chartOptions = {
              series: [
                {
                  name: "Total",
                  data: series
                }
              ],
              chart: {
                height: 350,
                type: "line",
                zoom: {
                  enabled: false
                }
              },
              dataLabels: {
                enabled: false
              },
              stroke: {
                curve: "straight"
              },
              title: {
                text: "Vehicle Trends by Year",
                align: "left"
              },
              grid: {
                row: {
                  colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                  opacity: 0.5
                }
              },
              xaxis: {
                categories:labels
              }
            };
          }
      },
      (err) => { }
    );
  }
}

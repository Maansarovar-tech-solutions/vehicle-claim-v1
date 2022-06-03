import { PolicyComponent } from './policy.component';
import { TablesModule } from 'src/app/Shared/Tables/tables.module';
import { IconsModule } from './../../Shared/Icons/icons.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MaterialModule } from 'src/app/Shared/material/material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PolicyRoutingModule } from './policy-routing.module';
import { ColumnChartComponent } from './Components/column-chart/column-chart.component';
import { PieChartsComponent } from './Components/pie-charts/pie-charts.component';
import {ChartModule} from 'primeng/chart';
import { DoughnutChartComponent } from './Components/doughnut-chart/doughnut-chart.component';
import { LineChartComponent } from './Components/line-chart/line-chart.component';
import { ColumnChartsComponent } from './Components/column-charts/column-charts.component';

@NgModule({
  declarations: [
    PolicyComponent,
    ColumnChartComponent,
    PieChartsComponent,
    DoughnutChartComponent,
    LineChartComponent,
    ColumnChartsComponent,

    ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgSelectModule,
    NgApexchartsModule,
    IconsModule,
    TablesModule,
    PolicyRoutingModule,
    ChartModule
  ],

  providers: [DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  bootstrap: [PolicyComponent],
})
export class PolicyModule {}

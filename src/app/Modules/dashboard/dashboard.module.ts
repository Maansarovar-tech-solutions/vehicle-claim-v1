import { TablesModule } from 'src/app/Shared/Tables/tables.module';
import { RecoveryClaimViewComponent } from './../recovery-claim-view/recovery-claim-view.component';
import { IconsModule } from './../../Shared/Icons/icons.module';
import { DashboardComponent } from './dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MaterialModule } from 'src/app/Shared/material/material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { NgModule } from '@angular/core';
import { BarChartsComponent } from './Components/bar-charts/bar-charts.component';
import { RadialBarChartComponent } from './Components/radial-bar-chart/radial-bar-chart.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ClaimStatusComponent } from '../claim-status/claim-status.component';


@NgModule({
  declarations: [
    DashboardComponent,
    BarChartsComponent,
    RadialBarChartComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    DashboardRoutingModule,
    NgSelectModule,
    NgApexchartsModule,
    IconsModule,
    TablesModule
  ],

  providers: [DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  bootstrap: [DashboardComponent],
})
export class DashboardModule { }

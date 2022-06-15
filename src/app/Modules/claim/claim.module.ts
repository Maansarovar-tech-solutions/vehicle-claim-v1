import { TablesModule } from 'src/app/Shared/Tables/tables.module';
import { IconsModule } from './../../Shared/Icons/icons.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MaterialModule } from 'src/app/Shared/material/material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import {ChartModule} from 'primeng/chart';
import { ClaimComponent } from './claim.component';
import { ClaimRoutingModule } from './claim-routing.module';
import { PieChartComponent } from './Components/pie-chart/pie-chart.component';
import { BarChartComponent } from './Components/bar-chart/bar-chart.component';


@NgModule({
  declarations: [
    BarChartComponent,
    ClaimComponent,
    PieChartComponent,

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
    ClaimRoutingModule,
    ChartModule
  ],

  providers: [DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  bootstrap: [ClaimComponent],
})
export class ClaimModule {}

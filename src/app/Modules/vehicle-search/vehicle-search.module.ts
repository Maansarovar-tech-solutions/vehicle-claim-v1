import { PageHeaderModule } from './../../Shared/Header/page-header.module';
import { ButtonsModule } from './../../Shared/Buttons/buttons.module';
import { IconsModule } from './../../Shared/Icons/icons.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MaterialModule } from 'src/app/Shared/material/material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TablesModule } from 'src/app/Shared/Tables/tables.module';
import { VehicleSearchRoutingModule } from './vehicle-search-routing.module';
import { VehicleSearchComponent } from './vehicle-search.component';

@NgModule({
  declarations: [
    VehicleSearchComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgSelectModule,
    NgApexchartsModule,
    IconsModule,
    VehicleSearchRoutingModule,
    ButtonsModule,
    TablesModule,
    PageHeaderModule

  ],

  providers: [DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  bootstrap: [VehicleSearchComponent],
})
export class VehicleSearchModule { }

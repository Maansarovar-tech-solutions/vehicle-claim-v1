import { PageHeaderModule } from './../../Shared/Header/page-header.module';
import { ButtonsModule } from './../../Shared/Buttons/buttons.module';
import { AddVehicleRoutingModule } from './add-vehicle-routing.module';
import { AddVehicleComponent } from './add-vehicle.component';
import { IconsModule } from './../../Shared/Icons/icons.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MaterialModule } from 'src/app/Shared/material/material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TablesModule } from 'src/app/Shared/Tables/tables.module';

@NgModule({
  declarations: [
    AddVehicleComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgSelectModule,
    NgApexchartsModule,
    IconsModule,
    AddVehicleRoutingModule,
    ButtonsModule,
    TablesModule,
    PageHeaderModule

  ],

  providers: [DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  bootstrap: [AddVehicleComponent],
})
export class AddVehicleModule { }

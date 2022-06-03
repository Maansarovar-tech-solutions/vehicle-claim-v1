import { ExistingBodyTypeMasterRoutingModule } from './existing-body-type-master-routing.module';
import { ExistingBodyTypeMasterComponent } from './existing-body-type-master.component';
import { IconsModule } from './../../../../../Shared/Icons/icons.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MaterialModule } from 'src/app/Shared/material/material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TablesModule } from 'src/app/Shared/Tables/tables.module';

@NgModule({
  declarations: [ExistingBodyTypeMasterComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgSelectModule,
    NgApexchartsModule,
    IconsModule,
    TablesModule,
    ExistingBodyTypeMasterRoutingModule
  ],

  providers: [DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  bootstrap: [ExistingBodyTypeMasterComponent],
})
export class ExistingBodyTypeMasterModule {}

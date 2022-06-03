import { InsuranceMasterRoutingModule } from './insurance-master-routing.module';
import { InsuranceMasterComponent } from './insurance-master.component';
import { IconsModule } from '../../../../Shared/Icons/icons.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MaterialModule } from 'src/app/Shared/material/material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TablesModule } from 'src/app/Shared/Tables/tables.module';

@NgModule({
  declarations: [InsuranceMasterComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgSelectModule,
    NgApexchartsModule,
    IconsModule,
    TablesModule,
    InsuranceMasterRoutingModule
  ],

  providers: [DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  bootstrap: [InsuranceMasterComponent],
})
export class InsuranceMasterModule {}

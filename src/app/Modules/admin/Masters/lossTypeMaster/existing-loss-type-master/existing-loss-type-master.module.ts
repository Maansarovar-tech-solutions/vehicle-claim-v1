import { ExistingLossTypeMasterRoutingModule } from './existing-loss-type-master-routing.module';
import { ExistingLossTypeMasterComponent } from './existing-loss-type-master.component';
import { IconsModule } from '../../../../../Shared/Icons/icons.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MaterialModule } from 'src/app/Shared/material/material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  declarations: [ExistingLossTypeMasterComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgSelectModule,
    NgApexchartsModule,
    IconsModule,
    ExistingLossTypeMasterRoutingModule
  ],

  providers: [DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  bootstrap: [ExistingLossTypeMasterComponent],
})
export class ExistingLossTypeMasterModule {}

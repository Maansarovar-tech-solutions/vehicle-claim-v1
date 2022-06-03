import { ExistingClaimTypeMasterRoutingModule } from './existing-claim-type-master-routing.module';
import { ExistingClaimTypeMasterComponent } from './existing-claim-type-master.component';
import { IconsModule } from '../../../../../Shared/Icons/icons.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MaterialModule } from 'src/app/Shared/material/material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  declarations: [ExistingClaimTypeMasterComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgSelectModule,
    NgApexchartsModule,
    IconsModule,
    ExistingClaimTypeMasterRoutingModule
  ],

  providers: [DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  bootstrap: [ExistingClaimTypeMasterComponent],
})
export class ExistingClaimTypeMasterModule {}

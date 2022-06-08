
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MaterialModule } from 'src/app/Shared/material/material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TablesModule } from 'src/app/Shared/Tables/tables.module';
import { ExistingLoginDetailsRoutingModule } from './existing-login-details-routing.module';
import { IconsModule } from 'src/app/Shared/Icons/icons.module';
import { ExistingLoginDetailsComponent } from './existing-login-details.component';

@NgModule({
  declarations: [ExistingLoginDetailsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgSelectModule,
    NgApexchartsModule,
    IconsModule,
    TablesModule,
    ExistingLoginDetailsRoutingModule
  ],

  providers: [DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  bootstrap: [ExistingLoginDetailsComponent],
})
export class ExistingLoginDetailsModule {}

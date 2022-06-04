
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MaterialModule } from 'src/app/Shared/material/material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TablesModule } from 'src/app/Shared/Tables/tables.module';
import { NewLoginDetailsComponent } from './new-login-details.component';
import { NewLoginDetailsRoutingModule } from './new-login-details-routing.module';
import { IconsModule } from 'src/app/Shared/Icons/icons.module';

@NgModule({
  declarations: [NewLoginDetailsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgSelectModule,
    NgApexchartsModule,
    IconsModule,
    TablesModule,
    NewLoginDetailsRoutingModule
  ],

  providers: [DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  bootstrap: [NewLoginDetailsComponent],
})
export class NewLoginDetailsModule {}

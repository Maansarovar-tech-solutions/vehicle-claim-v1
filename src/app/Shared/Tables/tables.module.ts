import { MaterialTableComponent } from './material-table/material-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MaterialModule } from 'src/app/Shared/material/material.module';
import { NgModule } from '@angular/core';
import { DirectivesModule } from '../Directives/directives.module';
import { PolicyGridComponent } from './policy-grid/policy-grid.component';
import { PolicyDataTableComponent } from './policy-data-table/policy-data-table.component';
import { VehicleDataTableComponent } from './policy-data-table/vehicle-data-table/vehicle-data-table.component';
import { RecoveryGridComponent } from './recovery-grid/recovery-grid.component';
import { MastersGridComponent } from './masters-grid/masters-grid.component';

@NgModule({
  declarations: [
    MaterialTableComponent,
    PolicyGridComponent,
    PolicyDataTableComponent,
    VehicleDataTableComponent,
    MastersGridComponent,
    RecoveryGridComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    DirectivesModule
  ],
  exports: [
    MaterialTableComponent,
    PolicyGridComponent,
    PolicyDataTableComponent,
    VehicleDataTableComponent,
    MastersGridComponent,
    RecoveryGridComponent
  ],
  providers: [DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],

})
export class TablesModule { }

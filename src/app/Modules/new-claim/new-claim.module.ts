import { NewClaimComponent } from './new-claim.component';
import { TablesModule } from 'src/app/Shared/Tables/tables.module';
import { IconsModule } from './../../Shared/Icons/icons.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NewClaimRoutingModule } from './new-claim-routing.module';
import { MaterialModule } from 'src/app/Shared/material/material.module';
import { VehicleFormComponent } from './Components/vehicle-form/vehicle-form.component';
import { ClaimFormComponent } from './Components/claim-form/claim-form.component';
import { ConfirmationComponent } from './Components/confirmation/confirmation.component';
import { NgxMatStepLazyLoadModule } from 'ngx-mat-step-lazy-load';

@NgModule({
  declarations: [
    NewClaimComponent,
    VehicleFormComponent,
    ClaimFormComponent,
    ConfirmationComponent,
    ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NewClaimRoutingModule,
    NgSelectModule,
    NgApexchartsModule,
    IconsModule,
    TablesModule,
    NgxMatStepLazyLoadModule
  ],

  providers: [DatePipe],
  bootstrap: [NewClaimComponent],
})
export class NewClaimModule {}

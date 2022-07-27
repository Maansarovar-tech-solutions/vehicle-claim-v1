import { RecoveryClaimViewComponent } from './recovery-claim-view.component';
import { TablesModule } from 'src/app/Shared/Tables/tables.module';
import { IconsModule } from '../../Shared/Icons/icons.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MaterialModule } from 'src/app/Shared/material/material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { RecoveryClaimViewRoutingModule } from './recovery-claim-view-routing.module';
import { ClaimTrackingComponent } from '../claim-tracking/claim-tracking.component';
import {TimelineModule} from 'primeng/timeline';
import { CardModule } from "primeng/card";





@NgModule({
  declarations: [
    RecoveryClaimViewComponent,
    ClaimTrackingComponent
    ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RecoveryClaimViewRoutingModule,
    NgSelectModule,
    NgApexchartsModule,
    IconsModule,
    TablesModule,
    TimelineModule,
    CardModule,
  ],

  providers: [DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  bootstrap: [RecoveryClaimViewComponent],
})
export class RecoveryClaimViewModule {}

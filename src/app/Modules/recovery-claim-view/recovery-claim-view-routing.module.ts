import { ClaimTrackingComponent } from './../claim-tracking/claim-tracking.component';
import { ClaimStatusComponent } from './../claim-status/claim-status.component';
import { RecoveryClaimViewComponent } from './recovery-claim-view.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: RecoveryClaimViewComponent,

  },
  {
    path: 'Claim-Details',
    component: ClaimStatusComponent,
    data: {
      title: "Claim-Details",
      breadcrumb: 'Claim-Details',
    },
  },
  {
    path: 'Claim-Tracking',
    component: ClaimTrackingComponent,
    data: {
      title: "Claim Tracking",
      breadcrumb: 'Claim Tracking',
    },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecoveryClaimViewRoutingModule {}

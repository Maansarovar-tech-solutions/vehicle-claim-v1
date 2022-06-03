import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClaimStatusComponent } from '../claim-status/claim-status.component';
import { RecoveryClaimViewComponent } from '../recovery-claim-view/recovery-claim-view.component';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'recovery-claim-grid',
    loadChildren: () =>
          import('../recovery-claim-view/recovery-claim-view.module').then((n) => n.RecoveryClaimViewModule),
    data: {
      title: "Recovery Claim",
      breadcrumb: 'Recovery Claim',
    },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}

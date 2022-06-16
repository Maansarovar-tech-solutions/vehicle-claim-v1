import { ClaimComponent } from './claim.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecoveryClaimFormComponent } from '../recovery-claim-form/recovery-claim-form.component';

const routes: Routes = [
  {
    path:'',
    component:ClaimComponent
  },

  {
    path: 'loss-claim-form',
    component: RecoveryClaimFormComponent,
    data: {
      title: 'Total Loss Claim',
      breadcrumb: 'Total Loss Claim',
    },
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClaimRoutingModule { }

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
    path: 'claim-form',
    component: RecoveryClaimFormComponent,
    data: {
      title: 'Claim Form',
      breadcrumb: 'Claim Form',
    },
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClaimRoutingModule { }

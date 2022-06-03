
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExistingClaimTypeMasterComponent } from './existing-claim-type-master.component';

const routes: Routes = [
  {
    path: '',
    component: ExistingClaimTypeMasterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExistingClaimTypeMasterRoutingModule {}

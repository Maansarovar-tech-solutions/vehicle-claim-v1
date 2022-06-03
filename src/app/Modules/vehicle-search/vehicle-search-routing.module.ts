import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClaimStatusComponent } from '../claim-status/claim-status.component';
import { VehicleSearchComponent } from './vehicle-search.component';

const routes: Routes = [
  {
    path: '',
    component: VehicleSearchComponent,
  },
  {
    path: 'Claim-Details',
    component: ClaimStatusComponent,
    data: {
      title: "Claim-Details",
      breadcrumb: 'Claim-Details',
    },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehicleSearchRoutingModule {}

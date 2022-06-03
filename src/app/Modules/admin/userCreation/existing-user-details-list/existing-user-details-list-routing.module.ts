
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExistingUserDetailsListComponent } from './existing-user-details-list.component';

const routes: Routes = [
  {
    path: '',
    component: ExistingUserDetailsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExistingUserDetailsListRoutingModule {}

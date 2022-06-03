
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExistingLossTypeMasterComponent } from './existing-loss-type-master.component';

const routes: Routes = [
  {
    path: '',
    component: ExistingLossTypeMasterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExistingLossTypeMasterRoutingModule {}

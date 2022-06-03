
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExistingBodyTypeMasterComponent } from './existing-body-type-master.component';

const routes: Routes = [
  {
    path: '',
    component: ExistingBodyTypeMasterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExistingBodyTypeMasterRoutingModule {}

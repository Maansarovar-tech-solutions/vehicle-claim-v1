import { PolicyComponent } from './policy.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    component:PolicyComponent
  },
  {
    path: 'new-policy',
    loadChildren: () =>
      import('./../new-claim/new-claim.module').then((n) => n.NewClaimModule),
      data: {
        title: "New Policy",
        breadcrumb: 'New Policy',
      },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PolicyRoutingModule { }

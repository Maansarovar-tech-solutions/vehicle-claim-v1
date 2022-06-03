
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddNewUserDetailsComponent } from './add-new-user-details.component';

const routes: Routes = [
  {
    path: '',
    component: AddNewUserDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddNewUserDetailsRoutingModule {}

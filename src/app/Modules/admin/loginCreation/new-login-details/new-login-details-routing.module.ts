
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewLoginDetailsComponent } from './new-login-details.component';

const routes: Routes = [
  {
    path: '',
    component: NewLoginDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewLoginDetailsRoutingModule {}

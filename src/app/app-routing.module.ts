import { ExistingClaimComponent } from './Modules/existing-claim/existing-claim.component';
import { AccountStatementComponent } from './Modules/account-statement/account-statement.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './Auth/auth.guard';
import { HomeLayoutComponent } from './Core/Layout/home-layout/home-layout.component';
import { LoginLayoutComponent } from './Core/Layout/login-layout/login-layout.component';
import { AdminLayoutComponent } from './Core/Layout/admin-layout/admin-layout.component';
const routes: Routes = [
  { path: '', redirectTo: 'Login', pathMatch: 'full' },
  {
    path: '',
    component: HomeLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'Home',
        pathMatch: 'full',
      },
      {
        path: 'Home',
        loadChildren: () =>
          import('./Modules/home/home.module').then((n) => n.HomeModule),
        data: {
          title: "Home",
          breadcrumb: 'Home',
        },

      },




      // {
      //   path: 'statement',
      //   component: AccountStatementComponent,
      //   data: {
      //     title: "Account Statement",
      //   }
      // },

    ],
  },

  {
    path: 'Admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'ClaimTypeMaster',
        loadChildren: () =>
          import('./Modules/admin/Masters/claimTypeMaster/existing-claim-type-master/existing-claim-type-master.module').then((n) => n.ExistingClaimTypeMasterModule),
      },
      {
        path: 'LossTypeMaster',
        loadChildren: () =>
          import('./Modules/admin/Masters/lossTypeMaster/existing-loss-type-master/existing-loss-type-master.module').then((n) => n.ExistingLossTypeMasterModule),
      },
      {
        path: 'UserCreationDetails',
        loadChildren: () =>
          import('./Modules/admin/userCreation/add-new-user-details/add-new-user-details.module').then((n) => n.AddNewUserDetailsModule),
      },
      {
        path: 'ExistingUserDetails',
        loadChildren: () =>
          import('./Modules/admin/userCreation/existing-user-details-list/existing-user-details-list.module').then((n) => n.ExistingUserDetailsListModule),
      },
    ]
  },
  {
    path: 'Login',
    component: LoginLayoutComponent,
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule { }

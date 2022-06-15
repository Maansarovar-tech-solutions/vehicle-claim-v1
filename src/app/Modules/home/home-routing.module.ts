import { RecoveryClaimFormComponent } from './../recovery-claim-form/recovery-claim-form.component';
import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountStatementComponent } from '../account-statement/account-statement.component';
import { ExistingClaimComponent } from '../existing-claim/existing-claim.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'Receivable',
  },
  {
    path: 'New-vehicle',
    loadChildren: () =>
      import('./../add-vehicle/add-vehicle.module').then(
        (n) => n.AddVehicleModule
      ),
    data: {
      title: 'New Claim',
      breadcrumb: 'New Claim',
    },
  },
  {
    path: 'New-Claim',
    loadChildren: () =>
      import('./../new-claim/new-claim.module').then((n) => n.NewClaimModule),
    data: {
      title: 'New Claim',
      breadcrumb: 'New Claim',
    },
  },
  {
    path: 'recovery-claim-form',
    component: RecoveryClaimFormComponent,
    data: {
      title: 'Recovery Claim Form',
      breadcrumb: 'Recovery Claim Form',
    },
  },
  {
    path: 'policy',
    loadChildren: () =>
      import('./../policy/policy.module').then((n) => n.PolicyModule),
    data: {
      title: 'Policy',
      breadcrumb: 'Policy',
    },
  },
  {
    path: 'Existing-Claim',
    component: ExistingClaimComponent,
    data: {
      title: 'Claim',
      breadcrumb: 'Claim',
    },
  },
  {
    path: 'receivable-AccountStatement',
    component: AccountStatementComponent,
    data: {
      title: 'Statement Of Account',
      breadcrumb: 'Statement Of Account',
    },
  },
  {
    path: 'payable-AccountStatement',
    component: AccountStatementComponent,
    data: {
      title: 'Payable Account Statement',
      breadcrumb: 'Payable Account Statement',
    },
  },
  {
    path: 'Receivable',
    loadChildren: () =>
      import('./../dashboard/dashboard.module').then((n) => n.DashboardModule),
    data: {
      title: 'Receivable',
      breadcrumb: 'Receivable',
    },
  },
  {
    path: 'Payable',
    loadChildren: () =>
      import('./../dashboard/dashboard.module').then((n) => n.DashboardModule),
    data: {
      title: 'Payable',
      breadcrumb: 'Payable',
    },
  },
  {
    path: 'Vehicle-Search',
    loadChildren: () =>
      import('./../vehicle-search/vehicle-search.module').then(
        (n) => n.VehicleSearchModule
      ),
    data: {
      title: 'Vehicle Search',
      breadcrumb: 'Vehicle Search',
    },
  },
  {
    path: 'MakeMaster',
    loadChildren: () =>
      import('../admin/Masters/make-master/make-master.module').then(
        (n) => n.MakeMasterModule
      ),
    data: {
      title: 'Make Master',
      breadcrumb: 'Make Master',
    },
  },
  {
    path: 'ModelMaster',
    loadChildren: () =>
      import('../admin/Masters/model-master/model-master.module').then(
        (n) => n.ModelMasterModule
      ),
    data: {
      title: 'Model Master',
      breadcrumb: 'Model Master',
    },
  },
  {
    path: 'BodyTypeMaster',
    loadChildren: () =>
      import(
        '../admin/Masters/bodyTypeMaster/existing-body-type-master/existing-body-type-master.module'
      ).then((n) => n.ExistingBodyTypeMasterModule),
    data: {
      title: 'Body Type Master',
      breadcrumb: 'Body Type Master',
    },
  },
  {
    path: 'ColorMaster',
    loadChildren: () =>
      import('../admin/Masters/color-master/color-master.module').then(
        (n) => n.ColorMasterModule
      ),
    data: {
      title: 'Color Master',
      breadcrumb: 'Color Master',
    },
  },
  {
    path: 'InsuranceMaster',
    loadChildren: () =>
      import('../admin/Masters/insurance-master/insurance-master.module').then(
        (n) => n.InsuranceMasterModule
      ),
    data: {
      title: 'Insurance Master',
      breadcrumb: 'Insurance Master',
    },
  },
  {
    path: 'NewLoginDetails',
    loadChildren: () =>
      import(
        '../admin/loginCreation/new-login-details/new-login-details.module'
      ).then((n) => n.NewLoginDetailsModule),
    data: {
      title: 'New Login Details',
      breadcrumb: 'New Login Details',
    },
  },
  {
    path: 'ExistingLoginDetails',
    loadChildren: () =>
      import(
        '../admin/loginCreation/existing-login-details/existing-login-details.module'
      ).then((n) => n.ExistingLoginDetailsModule),
    data: {
      title: 'Existing Login Details',
      breadcrumb: 'Existing Login Details',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}

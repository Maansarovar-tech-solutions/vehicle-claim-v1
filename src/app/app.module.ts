import { ExistingClaimComponent } from './Modules/existing-claim/existing-claim.component';
import { ClaimStatusComponent } from './Modules/claim-status/claim-status.component';
import { TablesModule } from './Shared/Tables/tables.module';
import { MaterialModule } from './Shared/material/material.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginLayoutComponent } from './Core/Layout/login-layout/login-layout.component';
import { HomeLayoutComponent } from './Core/Layout/home-layout/home-layout.component';
import { NavbarComponent } from './Core/Components/navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpInterceptorService } from './HttpInterceptors/http-interceptor.service';
import { FooterComponent } from './Core/Components/footer/footer.component';
import { LoginComponent } from './Core/Components/login/login.component';
import { AuthGuard } from './Auth/auth.guard';
import { AuthService } from './Auth/auth.service';
import {
  MultilevelMenuService,
  NgMaterialMultilevelMenuModule,
  ɵb,
} from "ng-material-multilevel-menu";
import { IconsModule } from './Shared/Icons/icons.module';
import { ButtonsModule } from './Shared/Buttons/buttons.module';
import { AdminLayoutComponent } from './Core/Layout/admin-layout/admin-layout.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastNotificationsModule } from 'ngx-toast-notifications';
import { ErrorPopupModule } from './Shared/Modal/error-popup.module';
import { PageHeaderModule } from './Shared/Header/page-header.module';
import { NgDynamicBreadcrumbModule } from 'ng-dynamic-breadcrumb';
import { AccountStatementComponent } from './Modules/account-statement/account-statement.component';
import { BreadcrumbComponent } from './Modules/breadcrumb/breadcrumb.component';
import { PolicyComponent } from './Modules/policy/policy.component';
import { AddNewLoginDetailsComponent } from './Modules/admin/loginCreation/add-new-login-details/add-new-login-details.component';
import { NewLoginDetailsComponent } from './Modules/admin/loginCreation/new-login-details/new-login-details.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginLayoutComponent,
    HomeLayoutComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    AdminLayoutComponent,
    BreadcrumbComponent,
    ClaimStatusComponent,
    ExistingClaimComponent,
    AddNewLoginDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    NgMaterialMultilevelMenuModule,
    IconsModule,
    ButtonsModule,
    TablesModule,
    NgSelectModule,
    ErrorPopupModule,
    PageHeaderModule,
    ToastNotificationsModule.forRoot({duration: 6000, type: 'primary',position:'top-right'}),
    NgDynamicBreadcrumbModule,
    ButtonsModule
  ],
  providers: [
    ɵb,
    MultilevelMenuService,
    HttpClientModule,
    AuthService,
    AuthGuard,
    {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpInterceptorService,
    multi: true
  }]
  ,


  bootstrap: [AppComponent],
})
export class AppModule {}

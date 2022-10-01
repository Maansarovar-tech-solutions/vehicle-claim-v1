import { HomeComponent } from './home.component';
import { TablesModule } from 'src/app/Shared/Tables/tables.module';
import { IconsModule } from './../../Shared/Icons/icons.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MaterialModule } from 'src/app/Shared/material/material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { HomeRoutingModule } from './home-routing.module';
import { AccountStatementComponent } from '../account-statement/account-statement.component';
import { PageHeaderModule } from 'src/app/Shared/Header/page-header.module';
import { WatchListComponent } from '../watch-list/watch-list.component';


@NgModule({
  declarations: [
    HomeComponent,
    AccountStatementComponent,
    WatchListComponent,

    ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HomeRoutingModule,
    NgSelectModule,
    NgApexchartsModule,
    IconsModule,
    PageHeaderModule,
    TablesModule
  ],

  providers: [DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  bootstrap: [HomeComponent],
})
export class HomeModule {}

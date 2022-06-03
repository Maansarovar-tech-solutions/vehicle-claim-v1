import { ButtonsModule } from './../Buttons/buttons.module';
import { IconsModule } from './../Icons/icons.module';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { PageHeaderComponent } from './page-header/page-header.component';

@NgModule({
  declarations: [
    PageHeaderComponent,

  ],
  imports: [
    CommonModule,
    IconsModule,
    MaterialModule,
    ButtonsModule
  ],
  exports: [
    PageHeaderComponent
  ],
  providers: [DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],

})
export class PageHeaderModule {}

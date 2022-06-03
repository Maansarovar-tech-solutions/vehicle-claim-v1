import { ErrorPopupComponent } from './error-popup/error-popup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MaterialModule } from 'src/app/Shared/material/material.module';
import { NgModule } from '@angular/core';
import { DirectivesModule } from '../Directives/directives.module';

@NgModule({
  declarations: [
    ErrorPopupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    DirectivesModule
  ],
  exports: [
    ErrorPopupComponent
  ],
  providers: [DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],

})
export class ErrorPopupModule { }

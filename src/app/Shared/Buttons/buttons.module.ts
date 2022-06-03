import { IconsModule } from './../Icons/icons.module';
import { ButtonsComponent } from './buttons/buttons.component';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [ButtonsComponent],
  imports: [
    CommonModule,
    IconsModule,
    MaterialModule
  ],
  exports: [
    ButtonsComponent
  ],
  providers: [DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],

})
export class ButtonsModule {}

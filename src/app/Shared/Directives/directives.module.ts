import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableResponsiveDirective } from './mat-table-responsive/mat-table-responsive.directive';



@NgModule({
  declarations: [
    MatTableResponsiveDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MatTableResponsiveDirective

  ],
})
export class DirectivesModule { }

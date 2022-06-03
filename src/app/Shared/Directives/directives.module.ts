import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropDirective } from './drag-drop.directive';
import { MatTableResponsiveDirective } from './mat-table-responsive/mat-table-responsive.directive';



@NgModule({
  declarations: [
    DragDropDirective,
    MatTableResponsiveDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DragDropDirective,
    MatTableResponsiveDirective

  ],
})
export class DirectivesModule { }

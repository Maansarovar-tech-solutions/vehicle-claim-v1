import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.css']
})
export class ButtonsComponent implements OnInit {

  constructor(
        private location: Location,
  ) { }

  ngOnInit(): void {
  }

  onMoveBack(){
    this.location.back()
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-new-user-details',
  templateUrl: './add-new-user-details.component.html',
  styleUrls: ['./add-new-user-details.component.css']
})
export class AddNewUserDetailsComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }
  
  getBack(){
    this.router.navigate(['/Admin/ExistingUserDetails'])
  }
}

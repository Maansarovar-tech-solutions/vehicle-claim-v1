import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-claim',
  templateUrl: './new-claim.component.html',
  styleUrls: ['./new-claim.component.css']
})
export class NewClaimComponent implements OnInit {
  isLinear = false;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  public isPolicyForm:boolean=false;
  public isClaimForm:boolean=false;
  public vehicleResponseData:any;
  public searchData:any;
  @ViewChild('stepper') private myStepper!: MatStepper;

  constructor(
    private _formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    ) {
    this.activatedRoute.queryParams.subscribe(
      (params: any) => {
        console.log(params);
        this.isPolicyForm = params?.isPolicyForm;

        this.isClaimForm =params?.isPolicyForm;
        this.searchData =params;
      }
    );
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

    if(this.isClaimForm){
      this.moveNext(this.searchData);
    }
  }


  goBack() {
    this.myStepper.previous();
  }



  moveNext(event:any){
    console.log(event)
    if(event.screen === 1){
      this.vehicleResponseData = event.data;
      if(this.vehicleResponseData != undefined){
        console.log(this.vehicleResponseData)
        this.myStepper.next();

      }

    }
  }
  moveNext2(){
    this.myStepper.next();

  }
}


/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */


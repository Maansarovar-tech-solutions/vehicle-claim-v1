import { AfterViewChecked,ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-claim',
  templateUrl: './new-claim.component.html',
  styleUrls: ['./new-claim.component.css']
})
export class NewClaimComponent implements OnInit,AfterViewChecked {
  isLinear = false;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  public isPolicyForm: boolean = false;
  public isClaimForm: any = false;
  public vehicleResponseData: any;
  public VehicleChassisNumber: any;
  @ViewChild('stepper') private myStepper!: MatStepper;

  constructor(
    private _formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private cdref: ChangeDetectorRef
  ) {
    this.activatedRoute.queryParams.subscribe(
      (params: any) => {
        console.log(params);
        if (params?.isPolicyForm) {
          this.isPolicyForm = params?.isPolicyForm;
        }
        if (params?.isClaimForm) {
          this.isClaimForm = params?.isClaimForm;
          this.moveNext(params);

        }
      }
    );
  }

  ngOnInit() {
  }


  goBack() {
    this.myStepper.previous();
  }

  moveNext(event: any) {
    console.log(event)
    if (event?.VehicleChassisNumber) {
      this.VehicleChassisNumber = event.VehicleChassisNumber;
      if(this.isClaimForm != 'true'){
        this.myStepper.next();
      }
    }
  }
  moveNext2() {
    this.myStepper.next();

  }
  ngAfterViewChecked(): void {
      if(this.isClaimForm){
        this.myStepper.selectedIndex = 1;
        this.isClaimForm = false;
        this.cdref.detectChanges();
      }
  }
}


/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */


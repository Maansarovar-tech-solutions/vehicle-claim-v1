import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.css']
})
export class AddVehicleComponent implements OnInit {

  isLinear = false;
  vehicleForm!: FormGroup;
  insuranceForm!: FormGroup;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {

  }
}

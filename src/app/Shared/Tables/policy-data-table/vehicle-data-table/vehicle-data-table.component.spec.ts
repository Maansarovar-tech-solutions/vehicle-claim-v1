import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDataTableComponent } from './vehicle-data-table.component';

describe('VehicleDataTableComponent', () => {
  let component: VehicleDataTableComponent;
  let fixture: ComponentFixture<VehicleDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleDataTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

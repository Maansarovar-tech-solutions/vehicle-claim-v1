import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingLossTypeMasterComponent } from './existing-loss-type-master.component';

describe('ExistingLossTypeMasterComponent', () => {
  let component: ExistingLossTypeMasterComponent;
  let fixture: ComponentFixture<ExistingLossTypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExistingLossTypeMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingLossTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

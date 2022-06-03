import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingBodyTypeMasterComponent } from './existing-body-type-master.component';

describe('ExistingBodyTypeMasterComponent', () => {
  let component: ExistingBodyTypeMasterComponent;
  let fixture: ComponentFixture<ExistingBodyTypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExistingBodyTypeMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingBodyTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingClaimTypeMasterComponent } from './existing-claim-type-master.component';

describe('ExistingClaimTypeMasterComponent', () => {
  let component: ExistingClaimTypeMasterComponent;
  let fixture: ComponentFixture<ExistingClaimTypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExistingClaimTypeMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingClaimTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

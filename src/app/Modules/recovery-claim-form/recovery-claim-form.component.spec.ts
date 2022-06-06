import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryClaimFormComponent } from './recovery-claim-form.component';

describe('RecoveryClaimFormComponent', () => {
  let component: RecoveryClaimFormComponent;
  let fixture: ComponentFixture<RecoveryClaimFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecoveryClaimFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoveryClaimFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

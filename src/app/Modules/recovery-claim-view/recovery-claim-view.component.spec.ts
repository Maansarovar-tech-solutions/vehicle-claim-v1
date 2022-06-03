import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryClaimViewComponent } from './recovery-claim-view.component';

describe('RecoveryClaimViewComponent', () => {
  let component: RecoveryClaimViewComponent;
  let fixture: ComponentFixture<RecoveryClaimViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecoveryClaimViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoveryClaimViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

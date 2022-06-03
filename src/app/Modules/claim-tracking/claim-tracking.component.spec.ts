import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimTrackingComponent } from './claim-tracking.component';

describe('ClaimTrackingComponent', () => {
  let component: ClaimTrackingComponent;
  let fixture: ComponentFixture<ClaimTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimTrackingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

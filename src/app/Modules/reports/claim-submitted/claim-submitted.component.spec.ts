import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimSubmittedComponent } from './claim-submitted.component';

describe('ClaimSubmittedComponent', () => {
  let component: ClaimSubmittedComponent;
  let fixture: ComponentFixture<ClaimSubmittedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimSubmittedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingClaimComponent } from './existing-claim.component';

describe('ExistingClaimComponent', () => {
  let component: ExistingClaimComponent;
  let fixture: ComponentFixture<ExistingClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExistingClaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

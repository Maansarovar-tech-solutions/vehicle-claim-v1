import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimReceivedComponent } from './claim-received.component';

describe('ClaimReceivedComponent', () => {
  let component: ClaimReceivedComponent;
  let fixture: ComponentFixture<ClaimReceivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimReceivedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

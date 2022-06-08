import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingLoginDetailsComponent } from './existing-login-details.component';

describe('ExistingLoginDetailsComponent', () => {
  let component: ExistingLoginDetailsComponent;
  let fixture: ComponentFixture<ExistingLoginDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExistingLoginDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingLoginDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLoginDetailsComponent } from './new-login-details.component';

describe('NewLoginDetailsComponent', () => {
  let component: NewLoginDetailsComponent;
  let fixture: ComponentFixture<NewLoginDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewLoginDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLoginDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

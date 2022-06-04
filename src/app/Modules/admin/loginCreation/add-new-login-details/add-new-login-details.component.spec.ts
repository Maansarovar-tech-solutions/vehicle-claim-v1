import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewLoginDetailsComponent } from './add-new-login-details.component';

describe('AddNewLoginDetailsComponent', () => {
  let component: AddNewLoginDetailsComponent;
  let fixture: ComponentFixture<AddNewLoginDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewLoginDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewLoginDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewUserDetailsComponent } from './add-new-user-details.component';

describe('AddNewUserDetailsComponent', () => {
  let component: AddNewUserDetailsComponent;
  let fixture: ComponentFixture<AddNewUserDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewUserDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

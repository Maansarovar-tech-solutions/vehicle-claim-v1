import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingUserDetailsListComponent } from './existing-user-details-list.component';

describe('ExistingUserDetailsListComponent', () => {
  let component: ExistingUserDetailsListComponent;
  let fixture: ComponentFixture<ExistingUserDetailsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExistingUserDetailsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingUserDetailsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

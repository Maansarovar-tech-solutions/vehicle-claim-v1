import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyDataTableComponent } from './policy-data-table.component';

describe('PolicyDataTableComponent', () => {
  let component: PolicyDataTableComponent;
  let fixture: ComponentFixture<PolicyDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicyDataTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

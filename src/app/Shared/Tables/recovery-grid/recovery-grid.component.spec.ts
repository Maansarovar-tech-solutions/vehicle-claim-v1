import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryGridComponent } from './recovery-grid.component';

describe('RecoveryGridComponent', () => {
  let component: RecoveryGridComponent;
  let fixture: ComponentFixture<RecoveryGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecoveryGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoveryGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
